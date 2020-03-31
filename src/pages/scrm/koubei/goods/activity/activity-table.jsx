/**
 * 口碑活动售卖列表界面
 * @author yujq
 */
import React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Popconfirm from 'antd/lib/popconfirm';
import Table from 'antd/lib/table';
import Icon from 'antd/lib/icon';
import QueueAnim from 'antd/node_modules/rc-queue-anim';
import message from 'antd/lib/message';
import moment from 'moment';
import Radio from 'antd/lib/radio';

let RadioButton = Radio.Button;
let RadioGroup = Radio.Group;

let KoubeiActivityFormModal = require('./activity-form');

let SelectOrgModal = require('../common/select-org');

let GoodsShareQrcodeModal = require('../common/GoodsShareQrcodeModal');

let KoubeiActivityTable = React.createClass({
	getInitialState() {
		return {
			selectedRowKeys: [],  // 这里配置默认勾选列
			loading: false,
			data: [],
			dataTotal: 0,
			query: {},
			pageIndex: 0,
			pageSize: 10,
			sortColName : '', //排序 自动名
			sortColType : '', //排序方向   ascend / descend
			initFlag : true,
			currentTableTabIndex : '1',
			formVisible : false,//表单窗口是否展示

			state_effective_count : 0,
			state_pause_count : 0,
			state_invalid_count : 0,

			goodsShareQrcodeData : {}, //商品分享二维码窗口的数据
			goodsShareQrcodeVisible : false,  //商品分享二维码窗口的显示状态
		}
	},

	componentDidMount() {
		this.initData({'searchStatus' : this.state.currentTableTabIndex});
	},

	initData(query, page) {
		  if(query) {
			  this.setState({
				  query: query
			  });
		  } else {
			  if(this.state.initFlag){
			  query = this.state.query;
				  if(this.state.courseId && !query.courseId){
					  query.courseId = this.state.courseId
					this.setState({
						initFlag : false
					});
				  }
			  }
		  }
		  let p = {
			  pageIndex: page?page.pageIndex:this.state.pageIndex,
			  pageSize: page&&page.pageSize?page.pageSize:this.state.pageSize
		  };
		  this.setState({
			  pageIndex: p.pageIndex,
			  pageSize: p.pageSize
		  });
		  this.queryData(query, p);
	  },

	queryData(query, page) {
		  let me = this;
		  query.searchStatus = query.searchStatus || this.state.currentTableTabIndex;
		  query.sortField = query.sortField || this.state.sortColName;
		  query.sortType = query.sortType || this.state.sortColType;
		  query.sortType = query.sortType == 'ascend' ? 'asc' : 'desc';
		  serviceRequest(BASE_URL+'orderGoodController/activityList', {...query,pageIndex: page.pageIndex, pageSize: page.pageSize, funcKey: 'koubeimarket-activity-list'},
			function(result) {
				me.setState({
					selectedRowKeys: [],
					data: result.results,
					dataTotal: result.data.resultCount
				});
		  });

		  //查询各个状态下数量
		  serviceRequest(BASE_URL+'orderGoodController/countOfStatus', {'goodsType' : '2', funcKey: 'koubeimarket-activity-list'},
			function(result) {
				me.setState({
					state_effective_count : result.data.ysjCount || 0,
					state_pause_count : result.data.wsjCount || 0,
					state_invalid_count : result.data.elseCount || 0,
				});
		  });
	  },

	  handleChange(selectedRowKeys, selectRows) {
		  	let selectRecordIds = [];
		  	selectRows.map(function(item){
		  		selectRecordIds.push(item.id);
		  	});
			this.setState({
				selectedRowKeys: selectedRowKeys,
				selectRecordIds: selectRecordIds,
				formVisible : false
			});
		},
		changeSearchVisible(e) {
			e.preventDefault();
			this.props.changeSearchVisible();
		},

		//列表数据标签改变
		changeTableTab(tabIndex) {
			this.setState({
				currentTableTabIndex : tabIndex
			});
			this.initData({'searchStatus' : tabIndex});
		},

		//选择适用门店
		showSelectedOrgModal(goodsId) {
			let me = this;
			serviceRequest(BASE_URL+"orderGoodController/getCourseById",{'goodsId' : goodsId, funcKey: 'koubeimarket-course-list'},
				function(ret) {
					let orgIds = ret.data.orgIds || [];
					me.refs.koubei_org_select_modal.changeVisible( {koubeiOrgTreeChecked : orgIds} );
				},
				function(ret) {
					message.error(ret.errorMessage);
					return;
				}
			);
		},

		//表单窗口打开
		handleOpenFormModal(activityId) {

			this.setState({
				formVisible : !this.state.formVisible,
				formDataId : activityId
			});
		},

		//更改状态
		updateStatus(record) {
			let me = this;
			let status = record.status;
			let new_status = status == 'EFFECTIVE' ? 'PAUSE' : 'EFFECTIVE';
			serviceRequest(BASE_URL+'orderGoodController/updateActivityStatus', {'goodsId' : record.id, 'status' : new_status, funcKey: 'koubeimarket-activity-down'},
					function(result) {
						message.success(new_status == 'EFFECTIVE' ? '上架成功' : '下架成功');
						me.initData();
				  },function(ret) {
					  message.error(ret.errorMessage);
				  }
			  );
		},

		//批量 更改状态
		batchUpdateStatus(status) {
			let me = this;
			let goodIds = this.state.selectRecordIds.join(',');
			serviceRequest(BASE_URL+'orderGoodController/batchUpdateActivityStatus', {'goodsIds' : goodIds, 'status' : status, funcKey: 'koubeimarket-activity-down'},
					function(ret) {
						let type = status == 'EFFECTIVE' ? '上架' : '下架';
						let successObj = ret.data.success || [];
						let errorObj   = ret.data.failed || [];
						let successCount = successObj.length;
						let errorCount = errorObj.length;
						message.success((successCount > 0 ? type + '成功' + successCount + '条数据,' : '') + (errorCount > 0 ? type + '失败' + errorCount + '条数据 ' : ''));
						me.initData();
				  },function(ret) {
					  message.error(ret.errorMessage);
				  }
			  );
		},

		//删除单条记录
		deleteRecord(record) {
			let me = this;
			let new_status = 'INVALID';
			serviceRequest(BASE_URL+'orderGoodController/updateActivityStatus', {'goodsId' : record.id, 'status' : new_status, funcKey: 'koubeimarket-course-delete'},
					function(result) {
						message.success('删除成功');
						me.initData();
				  },function(ret) {
					  message.error(ret.errorMessage);
				  }
			  );
		},

		//批量删除
		batchDeleteRecord() {
			let me = this;
			let new_status = 'INVALID';
			let goodIds = this.state.selectRecordIds.join(',');
			serviceRequest(BASE_URL+'orderGoodController/batchUpdateActivityStatus', {'goodsIds' : goodIds, 'status' : new_status, funcKey: 'koubeimarket-course-delete'},
					function(ret) {
						let successObj = ret.data.success || [];
						let errorObj   = ret.data.failed || [];
						let successCount = successObj.length;
						let errorCount = errorObj.length;
						message.success((successCount > 0 ? '成功删除' + successCount + '条数据,' : '') + (errorCount > 0 ? '删除失败' + errorCount + '条数据 ' : ''));
						me.initData();
				  },function(ret) {
					  message.error(ret.errorMessage);
				  }
			  );
		},

		//表格分页、排序、筛选变化时触发
		tableOnChange(pagination, filters, sorter) {
			sorter = sorter || {};
			if((sorter.columnKey||'') != this.state.sortColName || (sorter.order||'') != this.state.sortColType) {
				this.setState({
					sortColName : sorter.columnKey,
					sortColType : sorter.order
				});
				this.initData({'sortField' : sorter.columnKey, 'sortType' : sorter.order});
			}
		},

		//表格列标题点击事件
		tableColumnHeadClick(columnKey) {
			let sortColName = columnKey;
			let sortColType = this.state.sortColType == 'ascend' ? 'descend' : 'ascend';
			this.setState({
				sortColName,
				sortColType
			});
			this.initData({'sortField' : sortColName, 'sortType' : sortColType});
		},

		//打开口碑商品分享的二维码窗口
		changeGoodsShareQrcodeModal(goodsData) {
			this.setState({
				goodsShareQrcodeData : goodsData || {},
				goodsShareQrcodeVisible : !this.state.goodsShareQrcodeVisible,
			});
		},

	render() {
			let me = this;
			let { loading, selectedRowKeys,selectRecordIds,pageIndex,pageSize, } = this.state;
			let hasSelected = selectedRowKeys.length > 0;

			let rowSelection = {
				selectedRowKeys,
				onChange: this.handleChange
			};

			let paginationProps = {
					total: me.state.dataTotal,
					pageIndex: pageIndex + 1,
					pageSize,
					showSizeChanger: true,
					showQuickJumper :true,
					onShowSizeChange(current, pageSize) {
						me.initData(me.state.query,{
							pageIndex: current-1,
							pageSize: pageSize
						});
					},
					onChange(current) {
						me.initData(me.state.query,{
							pageIndex: current-1
						});
					},
					showTotal(){
						return '总共'+this.total+'条数据';
					}
				};

			let columns = [
	               {
						title: '操作',
						key: 'operation',
						width: 150,
						render: (text, record) => (
							<div className="common-row">
								{(record.status == 'ORIGINAL' || record.status == 'INIT' || record.status == 'EFFECTIVE' || record.status == 'PAUSE' ) ?
								<div className="common-col text-center" style={{width : '25%'}}>
									<a href="javascript:void(0);" onClick={this.handleOpenFormModal.bind(this, record.id)}>编辑</a>
								</div>
								: null }
								{(record.status == 'ORIGINAL' || record.status == 'EFFECTIVE' || record.status == 'PAUSE') ?
								<div className="common-col text-center" style={{width : '25%'}}>
									<Popconfirm placement="left" title={record.status == 'EFFECTIVE'?"确认要下架吗?":record.status == 'PAUSE'?"确认要上架吗?":"确认要上架吗?"} onConfirm={this.updateStatus.bind(this, record)}>
										<a href="javascript:void(0);" >{record.status == 'EFFECTIVE'?"下架":record.status == 'PAUSE'?"上架":"上架"}</a>
								    </Popconfirm>
								</div>
							  : null}
								{(record.status == 'ORIGINAL' || record.status == 'INIT' ||  record.status == 'EFFECTIVE' || record.status == 'PAUSE' || record.status == 'FREEZE') && false ?
							   <div className="common-col text-center" style={{width : '25%'}}>
									<Popconfirm placement="left" title={"确认要删除吗?"} onConfirm={this.deleteRecord.bind(this, record)}>
										<a href="javascript:void(0);" >删除</a>
								    </Popconfirm>
								</div>
							    : null }

								{this.state.currentTableTabIndex == '1' ?
									<div className="common-col text-center" style={{width : '25%'}}>
										<a href="javascript:void(0);" onClick={me.changeGoodsShareQrcodeModal.bind(this, record)} >分享</a>
									</div>
								: null
								}
							</div>
						)
					},  {
			       		title: '口碑商品编号',
			        	dataIndex: 'outItemId',
			         	key: 'outItemId',
			         	width: 200,
	         		},
	         		{
	         			title: '活动信息',
	         			dataIndex: 'subject',
	         			key: 'subject',
	         			width: 200,
	         			render : function(text, record) {
	         				  return (
	         					<div className="table-item-info" title={'名称:' + record.subject + '\n' + '年龄:' + record.courseAge}>
	         						<p className="table-item-info-item">名称: {record.subject}</p>
	         						<p className="table-item-info-item">年龄: {record.courseAge}</p>
	         					</div>
     						  );
	         			  }
	         		},{
	         			title: '活动时间',
	         			dataIndex: 'descriptions',
	         			key: 'descriptions',
	         			width: 180,
	         			render : function(text, record) {

	         				let activity_time = record.activityTime || '';
	         				let arr = activity_time.split("~");
	         				let activity_time_begin = arr[0] || '';
	         				let activity_time_end = arr[1] || '';
	         				let guoqi = activity_time_end != '' ? moment(activity_time_end, 'YYYY-MM-DD HH:mm:ss') < moment() : false;

	         				  return (
	         					<div className="table-item-info">
	         						<p className="table-item-info-item">{activity_time_begin}</p>
	         						<p className="table-item-info-item">~</p>
	         						<p className="table-item-info-item">{activity_time_end}</p>
	         						{guoqi ?
         								<span className='status-disable-span'>已过期</span>
     								:null
	         						}
	         					</div>
     						  );
	         			  }
	         		},{
	         			title: '现价',
	         			dataIndex: 'price',
	         			key: 'price',
	         			width: 80,
	         			render(text, record){
			         		return '￥' + record.price || 0;
	         			}
	         		},{
	         			title: '原价',
	         			dataIndex: 'originalPrice',
	         			key: 'originalPrice',
	         			width: 80,
	         			render(text, record){
			         		return record.originalPrice == undefined ? '-' : '￥' + record.originalPrice || 0;
	         			}
	         		},{
	         			title: '适用门店',
	         			dataIndex: 'shopnums',
	         			key: 'shopnums',
	         			width: 150,
	         			render(text, record){
		         			return (<a herf="javascript:void(0);" onClick={me.showSelectedOrgModal.bind(this, record.id)}>口碑&nbsp;{text||0}家门店</a>);
	         			}
	         		},{
	         			title: '库存',
         				dataIndex: 'inventory',
         				key: 'inventory',
         				width: 80
	         		}, {
	         			title: '销量',
	         			dataIndex: 'sellNum',
	         			key: 'sellNum',
	         			width: 80,
	         			render : function(text, record) {
	         				return (text||0);
         			  	}
	         		}, {
	         			title: '口碑活动信息',
	         			dataIndex: 'activityInfo',
	         			key: 'activityInfo',
	         			width: 150,
	         			render : function(text, record) {
	         			let activityInfo = record.activityInfo;
	         				if(activityInfo) {
	         					return (
     							<div>
     								<p className="table-item-info-item">{activityInfo.name}</p>
     								<p className="table-item-info-item">活动价: ￥{activityInfo.activity_price||0}</p>
     								<p className="table-item-info-item">活动库存: {activityInfo.activity_stock}</p>
	         					</div>);
	         				} else {
	         					return '无';
	         				}
         			  	}
	         		}, {
	         			title: (<span className="table-column-head-sort" onClick={this.tableColumnHeadClick.bind(this, 'create_time')}>发布时间</span>),
	         			dataIndex: 'createTime',
	         			key: 'create_time',
	         			width: 200,
	         			sorter: true,
	         			sortOrder : this.state.sortColName == 'create_time' ? this.state.sortColType : false
	         		},{
	         			title: (<span className="table-column-head-sort" onClick={this.tableColumnHeadClick.bind(this, 'weight')}>排序值</span>),
	         			dataIndex: 'weight',
	         			key: 'weight',
	         			width: 80,
	         			sorter: true,
	         			sortOrder : this.state.sortColName == 'weight' ? this.state.sortColType : false
	         		},{
	         			title: '状态',
	         			dataIndex: 'status',
	         			key: 'status',
	         			width: 200,
	         			render: (text, record, index) => (<div>
	         					<span className={record.status=='ORIGINAL' || record.status=='INIT' || record.status=='EFFECTIVE'  ?'status-enable-span':'status-disable-span'}>
	         						{record.status=='ORIGINAL' ? '待上架' :
         							record.status=='INIT' ? '待上架' :
     								record.status=='EFFECTIVE' ? '已上架' :
 									record.status=='PAUSE' ? '已下架' :
									record.status=='FREEZE' ? '已冻结' :
									record.status=='INVALID' ? '失效' :
	         						'无效的状态'}
	         					</span>
         							<p className="table-item-info-item">上架时间: {record.gmtStart}</p>
	         					</div>
         					)
	         		}];


		return (
			<div className="table-bg">

				<div className="common-over">
					<div className="common-left" style={{width : '60%'}}>

							<div className="table-handle" key="table-handle">
								<div className="common-table-tab-radio-btn">
									<RadioGroup defaultValue={this.state.currentTableTabIndex} size="large">
								    	<RadioButton value="1" onClick={this.changeTableTab.bind(this, '1')} >已上架 ({this.state.state_effective_count})</RadioButton>
								    	<RadioButton value="2" onClick={this.changeTableTab.bind(this, '2')} >未上架 ({this.state.state_pause_count})</RadioButton>
								    	<RadioButton value="3" onClick={this.changeTableTab.bind(this, '3')} >失效/冻结 ({this.state.state_invalid_count})</RadioButton>
								    </RadioGroup>
								</div>
							</div>

					</div>
					<div className="common-right" style={{width : '40%'}}>
						<div className="table-operations" >
							<Button type="primary" onClick={this.handleOpenFormModal.bind(this, undefined)}><Icon type="plus" />新增</Button>
							<Button type="primary" onClick={this.changeSearchVisible}><Icon type="filter" />筛选</Button>
						</div>
					</div>
				</div>

				<Table columns={columns} dataSource={this.state.data} pagination={paginationProps} onChange={this.tableOnChange} bordered scroll={{ x : 1330 }} />
				<KoubeiActivityFormModal ref="component_form_modal" visible={this.state.formVisible} changeVisible={this.handleOpenFormModal} formDataId={this.state.formDataId} afterSubmit={this.initData} />
				<SelectOrgModal ref="koubei_org_select_modal" afterSubmit={null} edit_able="no" />
				<GoodsShareQrcodeModal goodsData={this.state.goodsShareQrcodeData} visible={this.state.goodsShareQrcodeVisible} closeMoodal={this.changeGoodsShareQrcodeModal} />
			</div>
		);
	}

});

export default KoubeiActivityTable;
