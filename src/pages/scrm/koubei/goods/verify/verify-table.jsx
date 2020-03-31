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
import Modal from 'antd/lib/modal';
import Radio from 'antd/lib/radio';
import qs from 'qs';

let RadioButton = Radio.Button;
let RadioGroup = Radio.Group;

let SelectOrgModal = require('../common/select-org');

let KoubeiVerifyTable = React.createClass({
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
	exportKoubeiSettle() {
		let me = this;
		let query = this.state.query;
		window.open(BASE_URL+'purchaseController/exportSettleExcel?' + qs.stringify(query), '_blank');
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
		  serviceRequest(BASE_URL+'purchaseController/settleList', {...query,pageIndex: page.pageIndex, pageSize: page.pageSize, funcKey: 'koubeimarket-verify-list'},
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

		showMessage(content) {
			Modal.warning({
			    title : '退款原因',
			    content
			  });
		},

		//选择适用门店
		showSelectedOrgModal(goodsId) {
			if(goodsId) {
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
			} else {
				message.error('商品不存在');
			}
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
	         			dataIndex: 'subject',
	         			key: 'subject',
	         			width: 200,
	         		},
	         		{
	         			title: '验证状态',
	         			dataIndex: 'status',
	         			key: 'status',
	         			width: 100,
	         			render: (text, record, index) => (
	         					<div className="table-item-info">
	         						<p className="table-item-info-item">
		         						<span className={record.status=='PAY' || record.status=='SETTLE' ?'status-enable-span':'status-disable-span'}>
			         						{record.status=='UNPAY' ? '待支付' :
		         							record.status=='PAY' ? '待核销' :
		     								record.status=='SETTLE' ? '已核销 ' :
		 									record.status=='REFUND' ? '已退款' :
			         						'无效的状态'}
			         					</span>
	         						</p>
	         						{record.status=='REFUND' ?
         								<p className="table-item-info-item">
	         								<a href="javascript:void(0)" onClick={this.showMessage.bind(this, record.memo||'无')}>查看原因</a>
	         							</p>
	         						: null}
	         					</div>
         					)
	         		},
	         		{
	         			title: '变更时间',
	         			dataIndex: 'createTime',
	         			key: 'createTime',
	         			width: 200,
	         			render(text, record){

			         		return (
	         					<div className="table-item-info">
	         						<p className="table-item-info-item">创建时间:{record.createTime}</p>
	         						{record.status != 'UNPAY' ?
         								<p className="table-item-info-item">
	         							{record.status == 'PAY' ? '付款时间:' :
	         								record.status == 'SETTLE' ? '核销时间:' :
	     									record.status == 'REFUND' ? '退款时间:' : '修改时间'}
	         							{record.modifyTime}</p>
	         						:null}
	         					</div>
     						  );
	         			}
	         		},{
	         			title: '购买门店',
	         			dataIndex: 'buyOrgName',
	         			key: 'buyOrgName',
	         			width: 150
	         		},{
	         			title: '核销门店',
	         			dataIndex: 'settleOrgName',
	         			key: 'settleOrgName',
	         			width: 150
	         		},{
	         			title: '适用门店',
	         			dataIndex: 'shopnum',
	         			key: 'shopnum',
	         			width: 150,
	         			render(text, record){
		         			return (<a herf="javascript:void(0);" onClick={me.showSelectedOrgModal.bind(this, record.goodsid)} >口碑&nbsp;{text||0}家门店</a>);
	         			}
	         		},{
	         			title: '来源',
	         			dataIndex: 'orderSrc',
	         			key: 'orderSrc',
	         			width: 100,
	         			render(text, record){
	         				return text == '0' ? '闪闪早教' : text == '1' ? '支付宝口碑' : '未知的来源';
	         			}
	         		}];
		return (
			<div className="table-bg">

				<div className="common-row">
					<div className="common-table-tab-radio-btn">
						<RadioGroup defaultValue={this.state.currentTableTabIndex} size="large">
					    	<RadioButton value=""       onClick={this.changeTableTab.bind(this, '')} >全部</RadioButton>
					    	<RadioButton value="SETTLE" onClick={this.changeTableTab.bind(this, 'SETTLE')} >已核销</RadioButton>
					    	<RadioButton value="PAY"    onClick={this.changeTableTab.bind(this, 'PAY')} >待核销</RadioButton>
					    	<RadioButton value="REFUND" onClick={this.changeTableTab.bind(this, 'REFUND')} >已退款</RadioButton>
					    </RadioGroup>
					</div>

				</div>

				<div className="common-over">

					<div className="common-right" style={{width : '40%'}}>
						<div className="table-operations" >
							<Button type="primary" onClick={this.exportKoubeiSettle}><Icon type="download" />按查询结果导出</Button>
							<Button type="primary" onClick={this.changeSearchVisible}><Icon type="filter" />筛选</Button>
						</div>
					</div>
				</div>

				<Table columns={columns} dataSource={this.state.data}  pagination={paginationProps} onChange={this.tableOnChange} bordered scroll={{ x : 1810 }} />
				<SelectOrgModal ref="koubei_org_select_modal" afterSubmit={null} edit_able="no" />
	      </div>
		);
	}

});

export default KoubeiVerifyTable;
