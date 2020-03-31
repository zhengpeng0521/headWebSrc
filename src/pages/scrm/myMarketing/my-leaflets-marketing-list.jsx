/*
 * 传单列表
 */
import React from 'react';
import { Form, Input, Col, Row, Select, Button, Popconfirm, Table, message, Modal, Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import QueueAnim from 'rc-queue-anim';
import QRCode from 'qrcode.react';
import TenantOrgSelect from '../../common/tenant-org-filter/TenantOrgFilter';
import styles from './changeModalsRightX.less';

let TemplateInstanceForm = require('../microLeaflet-template/template-microLeaflet-instance-form');
let CodeModal = require('../microLeaflet-template/codeModal');

import { connect } from 'dva';
import MicroModuleForm from '../micro-module/MicroModuleForm';//自定义的微模板 机构配置界面

const WxLeafletsList = React.createClass({

	getInitialState() {
	    return {
	    	value						: '', 	//设置输入框的值
	    	showReviewActivityAdd		: false,//查看传单二维码
	    	showReviewStatistical		: false,//查看统计
	    	leafletQrUrl				: '', 	//记录当前点击的传单url
	    	statisticalDataSource 		: [], 	//存放统计数据
	    	statisticalData				: {},	//存放统计分页
	    	statisticalId				: '', 	//记录当前点击的统计id
	    	isShowSearch				: false,//是否显示搜索组件
	    	orgList						: [], 	//存储机构列表
	    	leafletsFormVisible         : false,//创建微传单实例
	    	leafletsId                  : "",   //获取当前点击的微传单ID
	    	leafletsTypeId              : "",   //获得模板id
	    	leafletsCode                : "",   //微实例编码
	    	codeModalVisible            : false,//二维码模态框
	    	currentSelectCampus         : '',   //校区
	    	validnum					: '',   //记录上一界面传入的有效用户

	    	pageIndex                   : 0,

			selectedRows                : [],
			selectedRowKeys             : [],

			filter: {						//过滤条件
				status: '1',				//过滤条件-状态 ''-全部状态  '1'-已上架   '2'-已下架
			},
			filterVisible: {
				status: false,
			}
	    };
	},

	componentDidMount() {
		this.searchButton();
	},

	//数据请求(status= 1:（包含首页列表数据和搜索列表数据） 2:上下架 3:删除 4:统计)
    requestData(parameter, url, status) {
		let self = this;
		serviceRequest(
			url,
			parameter,
			function(res) {
				switch(status){
					case 1:
						break;
					case 2:
						self.searchButton();
						if(parameter.status == '1'){
							message.success('上架成功')
						}else if ( parameter.status == '2'){
							message.success('下架成功')
						}
						break;
					case 3:
						self.searchButton();
						break;
					case 4:
						self.changeStatus({
							statisticalData 		: res.data,
							statisticalDataSource	: res.results
						});
						break;
					case 5:
						break;
					default:
				}
			},

    		function(fai) {
				message.error(fai.errorMessage);
    		});
    },


    //封装统计详情请求
    requestOperation(record, pageIndex) {
		this.requestData(
				{
					id 			: record || '',
					pageIndex  	: pageIndex,
					pageSize 	: 6,
				},
				BASE_URL + '/microActivity/findDetail',
				4)
    },

    changeStatus(changeObj) {
    	this.setState(
    		changeObj
    	);
    },

    //重置搜索条件
	resetButton() {
		this.props.form.resetFields();
		this.props.refreList();
	},
	//搜索传单
	searchButton(status) {
		status = status == undefined ? this.state.filter.status : status;
		this.props.form.validateFields((err, values) => {
			if(values.search_leaflets_id != undefined
					|| values.search_leaflets_name != undefined
					|| values.search_leaflets_type_name != undefined
					|| values.search_leaflets_campus != undefined
					|| status != undefined
					) {
						this.props.search({
							type 		: '1',
							id 			: values.search_leaflets_id,
							name		: values.search_leaflets_name,
							title		: values.search_leaflets_type_name,
							status,
							pageSize	: 10,
							pageIndex	: 0,
							organId		: values.search_leaflets_campus}
						);
			} else {
				this.props.refreList(this.state.pageIndex);
			}
		});
	},

	//删除数据警告提示
	popConfirm( selectedRows ) {
		this.requestData(
			{
				type 		: '1',
				status 		: '0',
				ids 		: selectedRows[0].id,
			},
			BASE_URL + '/microActivity/updateStatus',
			3
		);
		this.setState({
			selectedRows    : [],
			selectedRowKeys : [],
		})
	},
	//取消数据警告
	popCancel(record) {

	},
	//上架操作
	leafletsShelvesUp( selectedRows ) {
		this.requestData(
			{
				type 	: '1',
				status	: '1',
				ids 	: selectedRows[0].id,
			},
			BASE_URL + '/microActivity/updateStatus',
			2
		);
		this.setState({
			selectedRows    : [],
			selectedRowKeys : [],
		})
	},

	//下架操作
	leafletsShelvesDown( selectedRows ){
		this.requestData(
			{
				type 	: '1',
				status	: '2',
				ids 	: selectedRows[0].id,
			},
			BASE_URL + '/microActivity/updateStatus',
			2
		);
		this.setState({
			selectedRows    : [],
			selectedRowKeys : [],
		})
	},

	//修改操作
	leafletsModify(record) {

        let {id, type, orgId, orgName, activityId, } = record;

        window.wActivityTimer = setInterval(function(){
			serviceRequest(
				BASE_URL + '/organController/getTenant', {}
			)
		}, 600000 );

        //打开 高级模板的创建窗口
        if(type == undefined || type == '') {
            let me = this;
            this.changeStatus({leafletsFormVisible   : !this.state.leafletsFormVisible,   leafletsId : record.id , currentSelectCampus : record.orgName});
            if( this.state.leafletsId){
                serviceRequest( BASE_URL + "/microActivity/getActivity", { id : record.id }, function(res) {
                    let leafletsTypeId = res.data.activityData.activityId;
                    me.setState({
                        leafletsTypeId : leafletsTypeId
                    });
                });
            }
        } else {
            this.props.dispatch && this.props.dispatch({
                type: 'microModuleFormModel/handleShow',
                payload: {
                    moduleId: activityId,
                    moduleInstId: id,
                    orgId: orgId,
                    orgName: orgName,
                    afterFormSubmit: ()=> {
                        clearInterval( window.wActivityTimer );
                        window.wActivityTimer = null;
                    }
                }
            });
        }

	},

	//主页分页改变
	pageChange(pagination, filters, sorter) {
		let status = this.state.filter.status;
		this.props.form.validateFields((err, values) => {
			if(values.search_leaflets_id != undefined
					|| values.search_leaflets_name != undefined
					|| values.search_leaflets_status != undefined
					|| values.search_leaflets_type_name != undefined
					|| values.search_leaflets_campus != undefined
			) {
			let searchConditions =	{
										type 		: '1',
										id 			: values.search_leaflets_id,
										name		: values.search_leaflets_name,
										title		: values.search_leaflets_type_name,
										status,
										pageSize	: 10,
										pageIndex	: pagination.current - 1,
										organId		: values.search_leaflets_campus
									}
				this.props.pageSizeChangeCallBack(pagination.current - 1, searchConditions);
				this.setState({
					pageIndex : pagination.current - 1
				})
			} else {
				this.props.pageSizeChangeCallBack(pagination.current - 1, {status, pageIndex: pagination.current - 1});
				this.setState({
					pageIndex : pagination.current - 1
				})
			}
		});

	},
	//搜索输入操作
	inputgameIdChange(e) {
		this.changeStatus({value : e.target.value});
	},
	//点击统计详情
	gameReviewDetail(record) {
		this.changeStatus({showReviewStatistical : !this.state.showReviewStatistical, statisticalId : record.id, validnum : record.validnum});
		this.requestOperation(record.id, this.state.pageIndexDefault);
	},
	//点击统计详情取消
	changeGameStatisticalCancel() {
		this.changeStatus({showReviewStatistical : !this.state.showReviewStatistical});
	},
	//点击统计详情确定
	changeStatisticalOK() {
		this.changeStatus({showReviewStatistical : !this.state.showReviewStatistical});
	},
	//选中多条数据
	onSelectChange( selectedRowKeys, selectedRows ) {
		this.setState({
			selectedRowKeys,
			selectedRows
		});
	},
	//点击传单地址
	leafletsAddress(record) {
		this.changeStatus({showReviewActivityAdd : !this.state.showReviewActivityAdd,leafletQrUrl : record.activityUrl});
	},
	//查看传单二维码地址取消
	activityAddQrCodeCancel() {
		this.changeStatus({showReviewActivityAdd : !this.state.showReviewActivityAdd});
	},
	//查看传单二维码地址确定
	activityAddQrCodeOk() {
		this.changeStatus({showReviewActivityAdd : !this.state.showReviewActivityAdd});
	},
	//统计页面分页改变
	statisticalChangePage(pagination, filters, sorter) {
		this.requestOperation(this.state.statisticalId, pagination.current - 1);
	},
	//进行刷新数据
	tableListRefresh() {

	},
	//筛选
	screening() {
		this.changeStatus({isShowSearch : !this.state.isShowSearch});
	},

	//导出表格
	exportData(record) {
		window.open(BASE_URL+'/microActivity/export?id='+record);
	},

	inputgameNameChange(e) {
		this.changeStatus({value: e.target.value});
	},

	inputgameTypeNameChange(e) {
		this.changeStatus({value: e.target.value});
	},

	inputgameIdChange(e) {
		this.changeStatus({value: e.target.value});
	},

	//关闭创建微传单
	changeTempletInstanceFormVisible(){
		this.setState({
			leafletsFormVisible : !this.state.leafletsFormVisible,
		});
		clearInterval( window.wActivityTimer );
		window.wActivityTimer = null;
	},

	//二维码模态框
	changeCodeModalVisible(){
		this.setState({
			codeModalVisible : !this.state.codeModalVisible
		})
	},
	//确认二维码,关闭窗口
	onConfirmCodeModal(){
		this.setState({
			codeModalVisible : !this.state.codeModalVisible,
			leafletsFormVisible : !this.state.leafletsFormVisible,
		});
		this.props.getLeafletListRefresh(this.state.pageIndex)
	},
	//传递二维码地址
	diliverCode( url ){
		this.setState({
			codeUrl : url
		})
	},

    //复制地址
    copyLink(){
        var copyobject=document.getElementById("copy-content");
        copyobject.select();
        document.execCommand("Copy");
        message.success('复制成功');
    },

	filterVIsibleChange(type) {
		let filterVisible = this.state.filterVisible;
		filterVisible[type] = true;
		this.setState({
			filterVisible,
		});
	},

	filterListByStatus(status) {

		let filter = this.state.filter;
		let filterVisible = this.state.filterVisible;
		filter.status = status;
		filterVisible.status = false;
		this.setState({
			filter,filterVisible,
		});

		this.searchButton(status)
	},

	//渲染
	render() {
		const {getFieldValue, getFieldProps, isFieldValidating, getFieldError,getFieldDecorator,} = this.props.form;
		const formItemLayout = {labelCol: { span: 5 }, wrapperCol: { span: 19 },};
		const { loading, selectedRowKeys, selectedRows,filter, } = this.state;
		const rowSelection = { selectedRowKeys, onChange : this.onSelectChange,};

		let statusTitleCont = (
			<span style={{cursor: 'pointer'}} onClick={()=>this.filterVIsibleChange('status')}>
				{filter.status == '' ? '全部状态' : filter.status == '1' ? '已上架' : filter.status == '2' ? '已下架' : '其他状态'}
			</span>
		);

		const statisticalColumns =
					[{
			    	title: '编号',
			    	width: 50,
			    	render: (text, record, index) => (
			    			<p>{index + 1 + 6 * this.state.statisticalData.pageIndex}</p>
			    	)
					},{
						title     : '学员姓名',
						dataIndex : 'nickname',
					},{
						title     : '学员生日',
						dataIndex : 'birthday'
					},{
						title     : '手机号',
						dataIndex : 'mobile',
					},{
						title     : '备注',
						dataIndex : 'note',
					}]

		const columns = [
				{
	           	    title: '传单名称',
	           	    width: 180,
	           	    dataIndex: 'gamename',
	           	    render: (text, record) => (
						<div>
							<div style = {{ width : '80%', display : 'inline-block', verticalAlign : 'middle' }}>
								<a onClick = { this.leafletsModify.bind( this, record ) } >{ record.name }</a>
							</div>
							<div style = {{ width : '20%', display : 'inline-block', textAlign : 'right', verticalAlign : 'middle' }}>
								<Icon style = {{ cursor : 'pointer' }} onClick = { this.leafletsAddress.bind( this,record ) }  type = 'erweima' />
							</div>
						</div>

	           	    )
	           	},{
	           	    title:'传单名称类型',
					width : 120,
	           	    dataIndex: 'gameTitle',
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{record.title}</p>
	           		    </span>
	           	    )
	           	},{
					title: statusTitleCont,
	           	    width : 100,
	           	    dataIndex: 'status',
					filterIcon: (
						<Icon type="caret-down" />
					),
					filterDropdownVisible: this.state.filterVisible.status,
					onFilterDropdownVisibleChange: ()=>{this.filterVIsibleChange('status')},
					filterDropdown: (
						<div className={styles.list_filter_cont}>
							<div className={styles.list_filter_item} onClick={()=>this.filterListByStatus('')}>全部状态</div>
							<div className={styles.list_filter_item} onClick={()=>this.filterListByStatus('1')}>已上架</div>
							<div className={styles.list_filter_item} onClick={()=>this.filterListByStatus('2')}>已下架</div>
						</div>
					),
	           	    render: (text, record) => (
	           		    <div>
	           		    	<p>{record.status == 1 ? '已上架' : record.status == 2 ? '已下架' : '已删除'}</p>
	           		    </div>
	           	    )
	           	},{
	           	    title: '数据统计',
	           	    width: 120,
	           	    dataIndex: 'validUser',
	           	    render: (text, record) => (
	           		    <div>
	           		    	<p>有效用户:{record.validnum}</p>
	           		    	<a className="game_address_a" onClick={this.gameReviewDetail.bind(this,record)}>查看详情</a>
	           		    </div>
	           	    )
	           	},{
	           	    title: '校区',
					width : 180,
	           	    dataIndex: 'orgName',
	           	},{
	           	    title: '创建时间',
	           	    dataIndex: 'createTime',
					width : 180,
	           	}];

		let selectOptions = [];
		if(this.state.orgList&&this.state.orgList.length>0) {
			selectOptions = this.state.orgList.map(function (item, index) {
		    	let name = item.name;
		    	return <Option value={item.id} id={item.id}>{name}</Option>
		    });
		};


    	return (
    			<div className="game_base_list_div">
    				<div className="game_base_list_search_div">
    				<QueueAnim
						type={['top', 'top']}
    					ease={['easeOutQuart', 'easeInOutQuart']}
						className="common-search-queue" >
	    				{
							this.state.isShowSearch?[
							<div className="game_base_list_search_ani_div" key="common-search-queue-key-search">
								<Form className="ant-advanced-search-form">
									<FormItem style={{ float : 'left', marginRight : '30px' }} >
										{getFieldDecorator('search_leaflets_campus') (
										<TenantOrgSelect
											style = {{ width : '100%' }} />
										)}
									</FormItem>
                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_leaflets_id') (
                                        <Input 	placeholder='编号'
                                                onChange={this.inputgameIdChange}
                                                id='search_leaflets_id'
                                                type="number"
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_leaflets_name') (
                                        <Input 	placeholder='传单名称'
                                                onChange={this.inputgameNameChange}
                                                id='search_leaflets_name'
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_leaflets_type_name') (
                                        <Input 	placeholder='传单类型名称'
                                                onChange={this.inputgameTypeNameChange}
                                                id="search_leaflets_type_name"
                                                style={{width:120}} />
										)}
                                    </FormItem>

									<FormItem style={{ float:'left' }}>
										{getFieldDecorator('search_leaflets_status') (
										<Select placeholder='状态'
												size="default"
												id="search_leaflets_status"
												style={{width:120}} >
											<Option value="1">已上架</Option>
											<Option value="2">已下架</Option>
										</Select>
										)}
									</FormItem>

                                    <Button type="ghost" onClick={this.resetButton} style={{float:'right',backgroundColor:'#fff',marginTop:'10px',marginLeft:'10px'}}>清除条件</Button>
                                    <Button type="primary" onClick={()=>this.searchButton()} style={{float:'right',marginTop:'10px'}}>搜索</Button>
								</Form>
							</div>]:null}
    					</QueueAnim>
		    	        <div className="game_base_list_search_div_button_creategame">
							<div className = 'yhwu_operation_left'>
								<span>操作 : </span>
								{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >上架</a> }
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.leafletsShelvesUp.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >上架</a> }
								</Popconfirm>
								{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >下架</a> }
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.leafletsShelvesDown.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >下架</a> }
								</Popconfirm>
							</div>
							<div className = 'yhwu_operation_right' >
		    					<Button type = "primary" onClick = { this.screening } style = {{ marginTop : '20px' }}><Icon type = "filter" />筛选</Button>
							</div>
		    			</div>
	    	        </div>

	    	        <div className="game_base_list_search_div_table">
		    	        <Table bordered
							size = 'small'
				    		columns={columns}
				    		rowSelection={rowSelection}
						    rowKey="id"
				    		dataSource={this.props.dataSource.length > 0 ? this.props.dataSource : []}
							locale={{emptyText:'暂无数据'}}
							scroll={{ x : 910 }}
				    		pagination={{
								size : 'default',
				    			pageSize: 10,
				    			total: this.props.dataPage&&this.props.dataPage.resultCount,
				    			current:this.props.dataPage&&this.props.dataPage.pageIndex + 1,
                                showTotal:total => `共 ${total} 条` ,
                            }}
			 				onChange={this.pageChange}
		    	        />
	    	        </div>
		    	    <div>
	    				<Modal
	    					visible = { this.state.showReviewActivityAdd }
	    					width = "335"
	    					maskClosable = { false }
	    					onCancel = { this.activityAddQrCodeCancel }
	    					footer = { null }
                            className = 'zj_changeModalsRightX'>
                            <div style = {{ marginTop : '24px'}} className="game_search_base_create_ui_div_po_qr_code_div">
                                <QRCode value = { this.state.leafletQrUrl } size = { 300 } />
                                <p style = {{ marginBottom : '5px' }} className="game_search_base_create_ui_div_po_qr_code_div_wx_title">请用微信扫一扫</p>
                                <Input  style = {{ width : '72%' }} type = 'text' id = 'copy-content' value = { this.state.leafletQrUrl } />
                                <Button type = 'primary' style = {{ width : '26%' ,marginLeft : '2%' }} id = "copyLink" onClick = { this.copyLink }>复制地址</Button>
                             </div>
	    				</Modal>
    				</div>

    				<Modal
	    				visible={this.state.showReviewStatistical }
	        			title="数据统计"
	        			width='500'
	        			onCancel={this.changeGameStatisticalCancel}
	        			footer={[<Button size = 'default' key="save" type="primary" onClick={this.changeStatisticalOK}>确定</Button>]}>
	    					<div className="game_search_base_create_ui_div_statistical">
	    						<Button type="primary" disabled={this.state.statisticalDataSource.length > 0 ? false : true} onClick={this.exportData.bind(this,this.state.statisticalId)}>导出数据</Button>
		    					<div className="game_search_base_create_ui_div_statistical_p_div">
		    				 		<p className="game_search_base_create_ui_div_statistical_p_div_left_p_activity" >
		    				 			有效用户：{this.state.validnum}
		    				 		</p>
		    				 	</div>
		    				 	<Table
									className = 'dataModal'
		    				 		size="small"
		    				 		columns={statisticalColumns}
		    				 		dataSource={this.state.statisticalDataSource}
		    						locale={{emptyText:'暂无数据'}}
		    				 		pagination={{
		    				 			pageSize: 6,
		    				 			total: this.state.statisticalData.resultCount,
		    				 			current:this.state.statisticalData&&this.state.statisticalData.pageIndex + 1,
                                        showTotal:total => `共 ${total} 条` ,
                                    }}
		    				 	    onChange={this.statisticalChangePage}
		    				 	/>
	    				 	</div>
    				 </Modal>
    				 <TemplateInstanceForm title = {'修改微传单'}
    				 					   formVisible = { this.state.leafletsFormVisible }
    				 					   changeTempletInstanceFormVisible={this.changeTempletInstanceFormVisible}
					                       activityId = { this.state.leafletsId }
					                       activityTypeId = { this.state.leafletsTypeId }
					                       callbackRefresh = {this.tableListRefresh}
					                       activityCode = { this.state.leafletsCode }
					                       changeCodeModalVisible = { this.changeCodeModalVisible }
					                       diliverCode = { this.diliverCode }
					                       currentSelectCampus = { this.state.currentSelectCampus } />
    				 <CodeModal url = { this.state.codeUrl } codeModalVisible = { this.state.codeModalVisible }
					            onConfirmCodeModal = { this.onConfirmCodeModal } />
    			</div>
    		);
		}
});

function mapStateToProps() {
  return {};
}
//{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >删除</a> }
//<Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.popConfirm.bind( this, selectedRows ) } >
//	{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >删除</a> }
//</Popconfirm>
export default connect(mapStateToProps)(Form.create()(WxLeafletsList));
