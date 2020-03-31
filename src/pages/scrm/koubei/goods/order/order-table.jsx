/**
 * 口碑课程售卖列表界面
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
import Radio from 'antd/lib/radio';
import qs from 'qs';

let RadioButton = Radio.Button;
let RadioGroup = Radio.Group;

let KoubeiOrderTable = React.createClass({
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
			currentTableTabIndex : '',
			formVisible : false,//表单窗口是否展示
		}
	},

	componentDidMount() {
		this.initData({'status' : this.state.currentTableTabIndex});
	},

	//按查询结构导出订单列表
	exportKoubeiOrder() {
		let me = this;
		let query = this.state.query;
		window.open(BASE_URL+'purchaseController/exportPurchaseExcel?' + qs.stringify(query), '_blank');
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
		  query.status = query.status == undefined ?  this.state.currentTableTabIndex : query.status;
		  query.sortField = query.sortField || this.state.sortColName;
		  query.sortType = query.sortType || this.state.sortColType;
		  query.sortType = query.sortType == 'ascend' ? 'asc' : 'desc';
		  serviceRequest(BASE_URL+'purchaseController/list', {...query,pageIndex: page.pageIndex, pageSize: page.pageSize, funcKey: 'koubeimarket-order-list'},
			function(result) {
				me.setState({
					selectedRowKeys: [],
					data: result.results,
					dataTotal: result.data.resultCount
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
			this.initData({'status' : tabIndex});
		},

		//表单窗口打开
		handleOpenFormModal(courseId) {
			this.setState({
				formVisible : !this.state.formVisible,
				formDataId : courseId
			});
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

	render() {
			let me = this;
			let { loading, selectedRowKeys,selectRecordIds,pageIndex,pageSize } = this.state;
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
			       		title: '支付宝交易号',
			        	dataIndex: 'transNo',
			         	key: 'transNo',
			         	width: 280,
	         		},
					{
			       		title: '口碑订单编号',
			        	dataIndex: 'outBizNo',
			         	key: 'outBizNo',
			         	width: 280,
	         		},
	         		{
	         			title: '商品信息',
	         			dataIndex: 'itemList',
	         			key: 'itemList',
	         			width: 200,
	         			render : function(text, record) {
	         				let itemListCont = [];
	         				record.itemList && record.itemList.length>0 && record.itemList.map(function(item) {
	         					itemListCont.push(<p className="table-item-info-item">{item||''}</p>);
     						});
	         				  return (
	         					<div className="table-item-info">
	         						{itemListCont}
	         					</div>
     						  );
	         			  }
	         		},{
	         			title: '数量',
	         			dataIndex: 'price',
	         			key: 'price',
	         			width: 100,
	         			render(text, record){
			         		return record.itemList ? record.itemList.length : 0;
	         			}
	         		},{
	         			title: '金额',
	         			dataIndex: 'realAmount',
	         			key: 'realAmount',
	         			width: 100,
	         		},{
	         			title: '订单状态',
	         			dataIndex: 'status',
	         			key: 'status',
	         			width: 100,
	         			render: (text, record, index) => (
	         					<span className={record.status=='PAY' || record.status=='FINISH' ?'status-enable-span':'status-disable-span'}>
	         						{record.status=='UNPAY' ? '待支付' :
         							record.status=='PAY' ? '已支付' :
     								record.status=='FINISH' ? '已完成 ' :
 									record.status=='CLOSE' ? '已关闭' :
									record.status=='SETTLE' ? '已核销' :
									record.status=='REFUND' ? '已退款' :
	         						'无效的状态'}
	         					</span>
         					)
	         		},{
	         			title: (<span className="table-column-head-sort" onClick={this.tableColumnHeadClick.bind(this, 'gmt_create')}>下单时间</span>),
	         			dataIndex: 'gmtCreate',
	         			key: 'gmt_create',
	         			width: 150,
	         			sorter: true,
	         			sortOrder : this.state.sortColName == 'gmt_create' ? this.state.sortColType : false
	         		},{
	         			title: (<span className="table-column-head-sort" onClick={this.tableColumnHeadClick.bind(this, 'create_time')}>创建时间</span>),
	         			dataIndex: 'createTime',
	         			key: 'create_time',
	         			width: 150,
	         			sorter: true,
	         			sortOrder : this.state.sortColName == 'create_time' ? this.state.sortColType : false
	         		}, {
	         			title: '订单来源',
	         			dataIndex: 'orderSrc',
	         			key: 'orderSrc',
	         			width: 200,
	         			render(text, record){
	         				let orderSrcText = record.orderSrc == '0' ? '闪闪早教' :
		         				record.orderSrc == '1' ? '支付宝口碑' :
		         				'未知的来源';
	         				let orderSrcDetail = '';
	         				if(record.orderSrc == '1') {
	         					if(record.shop && record.shop.length > 0) {
	         						let shop = JSON.parse(record.shop) || {};
	         						orderSrcDetail = shop.shop_name || ''
	         					}
	         				}
			         		return (
	         					<div className="table-item-info">
	         						<p className="table-item-info-item">{orderSrcText}</p>
	         						<p className="table-item-info-item">{orderSrcDetail}</p>
	         					</div>
     						  );
	         			}
	         		},{
	         			title: '商品状态',
	         			dataIndex: 'PAY',
	         			key: 'PAY',
	         			width: 100,
	         			render(text, record){
	         				let pay = record.PAY || 0;//已支付
	         				let refund = record.REFUND || 0;//已退款
	         				let settle = record.SETTLE || 0;//已核销
	         				let unpay = record.UNPAY || 0; //待付款

		         			return (<div className="table-item-info">
					         			{unpay > 0 ? <p className="table-item-info-item">待付款 x{unpay}</p> : null}
					         			{pay > 0 ? <p className="table-item-info-item">已支付 x{pay}</p> : null}
					         			{settle > 0 ? <p className="table-item-info-item">已核销 x{settle}</p> : null}
					         			{refund > 0 ? <p className="table-item-info-item">已退款x{refund}</p> : null}
			     					</div>);
	         			}
	         		}];
		return (
			<div className="table-bg">

				<div className="common-row">
					<div className="common-table-tab-radio-btn">
						<RadioGroup defaultValue={this.state.currentTableTabIndex} size="large">
					    	<RadioButton value=""  onClick={this.changeTableTab.bind(this, '')} >全部</RadioButton>
					    	<RadioButton value="PAY" onClick={this.changeTableTab.bind(this, 'PAY')} >已付款</RadioButton>
					    	<RadioButton value="UNPAY" onClick={this.changeTableTab.bind(this, 'UNPAY')} >待付款</RadioButton>
					    	<RadioButton value="FINISH" onClick={this.changeTableTab.bind(this, 'FINISH')} >已完结</RadioButton>
					    	<RadioButton value="CLOSE" onClick={this.changeTableTab.bind(this, 'CLOSE')} >已关闭</RadioButton>
					    </RadioGroup>
					</div>
				</div>

				<div className="common-over">

					<div className="common-right" style={{width : '40%'}}>
						<div className="table-operations" >
							<Button type="primary" onClick={this.exportKoubeiOrder}><Icon type="download" />按查询结果导出</Button>
							<Button type="primary" onClick={this.changeSearchVisible}><Icon type="filter" />筛选</Button>
						</div>
					</div>
				</div>

				<Table columns={columns} dataSource={this.state.data}  pagination={paginationProps} onChange={this.tableOnChange} bordered scroll={{ x : 2140 }} />
	      </div>
		);
	}

});

export default KoubeiOrderTable;
