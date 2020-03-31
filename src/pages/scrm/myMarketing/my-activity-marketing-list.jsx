/*
 * 活动列表
 */
import React from 'react';
import qs from 'qs';
import {Form, Input, Col, Row, Select, Button, Popconfirm, Table, message, Modal, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import MicroActivityTemplate from '../microActivity-template/template-instance-form';  //修改微活动界面
import CodeModalActivity from '../microActivity-template/codeModal';
import TenantOrgSelect from '../../common/tenant-org-filter/TenantOrgFilter';
import QueueAnim from 'rc-queue-anim';
import QRCode from 'qrcode.react';

import { connect } from 'dva';
import MicroModuleForm from '../micro-module/MicroModuleForm';//自定义的微模板 机构配置界面

import MicroLeafletTemplate from '../microLeaflet-template/template-microLeaflet-instance-form';
import CodeModalLeaflet from '../microLeaflet-template/codeModal';

import styles from './changeModalsRightX.less';

import TenantSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import DataViewPage from './dataViewPage';

const WxActivityList = React.createClass({

	getInitialState() {
	    return {
	    	value						: '', 	  //设置输入框的值
	    	showReviewActivityAdd		: false,  //查看游戏二维码
	    	showReviewStatistical		: false,  //查看统计
	    	gameQrUrl					: '', 	  //记录当前点击的游戏url
	    	statisticalDataSource 		: [], 	  //存放统计数据
	    	statisticalData				: {},	  //存放统计分页
	    	statisticalId				: '', 	  //记录当前点击的统计id
	    	isShowSearch				: false,  //是否显示搜索组件
	    	orgList						: [], 	  //存储机构列表
	    	activityFormVisible         : false,  //创建微活动实例
			leafletFormVisible          : false,  //创建微传单实例
	    	activityId                  : "",     //获取当前点击的微活动ID
	    	activityTypeId              : "",     //获得模板id
	    	activityCode                : "",     //微活动实例编码
	    	codeModalVisible            : false,  //二维码模态框
	    	currentSelectCampus         : '',     //校区
			categoryId					:'',      //模板类型
	    	validnum					: '',     //记录上一界面传入的有效用户
	    	pageIndex                   : 0,

			selectedRowKeys             : [],
			selectedRows                : [],
			loading                     : false,
			showPromptModal				: false,

			filter: {						//过滤条件
				status: '1',				//过滤条件-状态 ''-全部状态  '1'-已上架   '2'-已下架
			},
			filterVisible: {
				status: false,
			},
			
			dataViewOrgId: '',//数据详情的orgid

			showCreateCampus: false, //显示创建的校区
			createCampusOrgIds: [],	// 创建的校区ids
            
            headValues:[], //表头的数据 数组
	    };
	},

	componentDidMount() {
		this.searchButton();
	},

	//数据请求(status= 1:（包含首页列表数据和搜索列表数据） 2:上下架 3:删除 4:统计  5: 退款)
    requestData( parameter, url, status ) {
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
						self.setState({
							loading : false,
							selectedRows    : [],
							selectedRowKeys : [],
						})
						break;
					case 3:
						self.searchButton();
						self.setState({
							loading : false,
							selectedRows    : [],
							selectedRowKeys : [],
						})
						break;
					case 4:
						self.changeStatus({
							statisticalData 		: res.data,
							statisticalDataSource	: res.results,
							loading                 : false
						});
						break;
					case 5:
						Modal.success({
							title: '退款成功'
						});
						//重新查询数据详情
						self.requestOperation(self.state.statisticalId, self.state.pageIndex);
						break;
					default:
				}
			},

    		function(fai) {
				message.error(fai.errorMessage);
    		});
    },

    //封装统计详情请求
    requestOperation(record, pageIndex,params) {
        console.log(params,"params")
		let orgId = this.props.form.getFieldValue('search_campus_data') || '';

		this.requestData(
			{
				id 			: record || '',
				pageIndex  	: pageIndex || 0,
				pageSize 	: 10,
				orgId		: orgId,
                ...params,
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
	//搜索游戏
	searchButton(status) {

		status = status == undefined ? this.state.filter.status : status;

		this.props.form.validateFields((err, values) => {
			if(values.search_activity_id != undefined
					|| values.search_activity_name != undefined
					|| values.search_activity_type_name != undefined
					|| values.search_activity_campus != undefined
					|| status != undefined
					) {
						this.props.search({
							type 		: '1',
							id 			: values.search_activity_id,
							name		: values.search_activity_name,
							title		: values.search_activity_type_name,
							status,
							pageSize	: 10,
							pageIndex	: 0,
							organId		: values.search_activity_campus}
						);
			} else {
				this.props.refreList(this.state.pageIndex);
			}
		});
	},

	//删除数据警告提示
	popConfirm( selectedRows ) {
		this.setState({
			loading : true
		})
		this.requestData(
			{
				type 		: '1',
				status 		: '0',
				// ids 		: selectedRows[0].id,
				ids 		: selectedRows.id,
			},
			BASE_URL + '/microActivity/updateStatus',
			3
		);
	},
	//取消数据警告
	popCancel(record) {

	},
	//上下架操作
	activityShelvesUp( selectedRows ) {
		this.setState({
			loading : true
		});
		this.requestData(
			{
				type 	: '1',
				status	: '1',
				// ids 	: selectedRows[0].id,
				ids 		: selectedRows.id,
			},
			BASE_URL + '/microActivity/updateStatus',
			2
		);
	},
	activityShelvesDown( selectedRows ) {
		this.setState({
			loading : true,
		});
		this.requestData(
			{
				type 	: '1',
				status	: '2',
				// ids 	: selectedRows[0].id,
				ids 		: selectedRows.id,
			},
			BASE_URL + '/microActivity/updateStatus',
			2
		);
	},

	//修改操作
	activityModify(record) {

		if (record.type == '' || record.type == undefined) {
			this.setState({
				showPromptModal: !this.state.showPromptModal,
			});
		} else {

			let {id, type, orgId, orgName, activityId, isHq } = record;
			window.wActivityTimer = setInterval(function(){
				serviceRequest(
					BASE_URL + '/organController/getTenant', {}
				)
			}, 600000 );
			
			//打开 高级模板的创建窗口
			if(record.categoryId == '1'){
				if(type == undefined || type == '') {
					let me = this;
					this.changeStatus({activityFormVisible : true, activityId : record.id , currentSelectCampus : record.orgName });
	
					if( this.state.activityId ){
						serviceRequest( BASE_URL+"/microActivity/getActivity", { id : record.id }, function(res) {
							let activityTypeId = res.data.activityData.activityId;
							me.setState({
								activityTypeId : activityTypeId,
								activityFormVisible :true,
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
							orgName: isHq !== 1 ? orgName : '',
							afterFormSubmit: ()=> {
								clearInterval( window.wActivityTimer );
								window.wActivityTimer = null;
							}
						}
					});
				}
			}
			if(record.categoryId == '2'){
				 if(type == undefined || type == '') {
					let me = this;
					this.changeStatus({leafletsFormVisible   : true,   leafletsId : record.id , currentSelectCampus : record.orgName});
					if( this.state.leafletsId){
						serviceRequest( BASE_URL + "/microActivity/getActivity", { id : record.id }, function(res) {
							let leafletsTypeId = res.data.activityData.activityId;
							me.setState({
								activityId: record.id,
								leafletsTypeId : leafletsTypeId,
								leafletFormVisible :true,
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
							orgName: isHq !== 1 ? orgName : '',
							afterFormSubmit: ()=> {
								clearInterval( window.wActivityTimer );
								window.wActivityTimer = null;
							}
						}
					});
				}
			} 
			
			this.setState({
				 categoryId : record.categoryId,
			});
		}
	},

	//主页分页改变
	pageChange(pagination, filters, sorter) {
		let status = this.state.filter.status;
		this.props.form.validateFields((err, values) => {
			if(values.search_activity_id != undefined
					|| values.search_activity_name != undefined
					|| values.search_activity_status != undefined
					|| values.search_activity_type_name != undefined
					|| values.search_activity_campus != undefined
			) {
				let searchConditions =	{
											type 		: '1',
											id 			: values.search_activity_id,
											name		: values.search_activity_name,
											title		: values.search_activity_type_name,
											status,
											pageSize	: 10,
											pageIndex	: pagination.current - 1,
											organId		: values.search_activity_campus
										}
				this.props.pageSizeChangeCallBack(pagination.current - 1, searchConditions);
				this.setState({
					pageIndex : pagination.current-1
				})
			} else {
				this.props.pageSizeChangeCallBack(pagination.current - 1, {status, pageIndex: pagination.current - 1});
				this.setState({
					pageIndex : pagination.current-1
				})
			}
		});
	},
	//搜索输入操作
	inputgameIdChange(e) {
		this.changeStatus({ value : e.target.value });
	},
	//点击统计详情
	gameReviewDetail(record) {
		this.changeStatus({
			showReviewStatistical : !this.state.showReviewStatistical, 
			statisticalId : record.id, 
			validnum : record.validnum,
			dataViewOrgId: record.orgId,
		});
		this.requestOperation(record.id, this.state.pageIndexDefault);
	},
	//点击统计详情取消
	changeGameStatisticalCancel() {
		this.props.form.resetFields();
		this.changeStatus({showReviewStatistical : !this.state.showReviewStatistical, dataViewOrgId: ''});
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
	//点击活动地址
	activityAddress(record) {
		this.changeStatus({showReviewActivityAdd : !this.state.showReviewActivityAdd,gameQrUrl : record.activityUrl});
	},
	//查看活动二维码地址取消
	activityAddQrCodeCancel() {
		this.changeStatus({showReviewActivityAdd : !this.state.showReviewActivityAdd});
	},
	//关闭提示框
	functionShowPromptModal() {
		this.changeStatus({ showPromptModal: !this.state.showPromptModal });
	},
	//查看活动二维码地址确定
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
        let {headValues} = this.state
        let hv = headValues && headValues.length>0 && headValues.filter((item)=>{
            return item!= "handle" && item!= "sortNo" 
        })
		let orgId = this.props.form.getFieldValue('search_campus_data') || '';
		window.excelExport('/microActivity/export', { id: record, orgId : orgId,headValues:hv.join(",")})
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
	//关闭创建微活动
	changeTempletInstanceFormVisible(){
		this.setState({
			activityFormVisible : false,
			leafletFormVisible : false
		});
		clearInterval( window.wActivityTimer );
		window.wActivityTimer = null;
	},

	//二维码模态框
	changeCodeModalVisible(){
		this.setState({
			codeModalVisible : !this.state.codeModalVisible
		});
	},

	//确认二维码,关闭窗口
	onConfirmCodeModal(){
		this.setState({
			codeModalVisible : !this.state.codeModalVisible,
			activityFormVisible : false,
			leafletFormVisible : false
		})
		this.props.getActivityListRefresh(this.state.pageIndex)
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
	
	//退款操作
	giveBackMoney(record) {
		this.requestData(
			{
				dataId 			: record.id || '',
				orgId: this.state.dataViewOrgId,
			},
			BASE_URL + '/microActivity/refund',
			5);
	},

	clearFunction() {
		this.props.form.resetFields();
		this.requestOperation(this.state.statisticalId, this.state.pageIndexDefault);
	},

	searchFunction() {
		this.requestOperation(this.state.statisticalId, this.state.pageIndexDefault);
	},

	reviewCampus(campus) {

		let idsArr = [];
		
		if (typeof (campus) === 'string') {
			campus = campus && campus.length > 0 ? JSON.parse(campus) : [];
			campus && campus.map((item, index) => {
				idsArr.push(item.orgId);
			})
		} else {
			idsArr = [campus];
		}	

		this.setState({
			showCreateCampus: !this.state.showCreateCampus,
			createCampusOrgIds: idsArr || [],
		});
	},
	

	functionSelectOrgModalClose() {
		this.setState({
			showCreateCampus: !this.state.showCreateCampus,
			createCampusOrgIds: [],
		});
	},
    
    //table内部分页查找
    tableChangePage({pageIndex},params) {
        this.setState({
            pageIndex,
        })
        this.requestOperation(this.state.statisticalId,pageIndex,params);
    },

	getCampus(campus) {

		let idsArr = [];

		if (typeof (campus) === 'string') {
			campus = campus && campus.length > 0 ? JSON.parse(campus) : [];
			campus && campus.map((item, index) => {
				idsArr.push(item.orgId);
			})
		} else {
			idsArr = [campus];
		}	

		return idsArr && idsArr.length;
	},


	//渲染
	render() {
		const {getFieldValue, getFieldProps, isFieldValidating, getFieldError, getFieldDecorator} = this.props.form;
		const formItemLayout = {labelCol: { span: 5 }, wrapperCol: { span: 19 },};
		const { loading, selectedRowKeys, selectedRows, filter, showCreateCampus, createCampusOrgIds, showPromptModal } = this.state;
		const rowSelection = {
			selectedRowKeys, 
			onChange: this.onSelectChange,
			getCheckboxProps: record => ({
				disabled: (record.isHq === 0 || record.isHq === false)
			}),
		 };

		let statusTitleCont = (
			<span style={{cursor: 'pointer'}} onClick={()=>this.filterVIsibleChange('status')}>
				{filter.status == '' ? '全部状态' : filter.status == '1' ? '已上架' : filter.status == '2' ? '已下架' : '其他状态'}
			</span>
		);
		
		let me = this;

		const statisticalColumns = [{
			title  : '编号',
            dataIndex:"sortNo",
            width:50,
			render : (text, record, index) => (
				<p>{ index + 1 + 10 * this.state.statisticalData.pageIndex }</p>
			)
			},{
				title     : '提交时间',
				dataIndex : 'createTime',
                width:150,
			},{
				title     : '学员姓名',
				dataIndex : 'nickname',
                width:100,
			},{
				title     : '学员生日',
				dataIndex : 'birthday',
                width:150,
			},{
				title     : '手机号',
				dataIndex : 'mobile',
                width:100,
			},{
				title	  : '校区',
				dataIndex : 'orgName',
                width:150,
			},{
				title     : '备注',
				dataIndex : 'note',
                width:150,
                render:(text,record)=>{
                    return <p title={record.note}>{record.note}</p>
                }
			},{
				title	  : '支付金额',
				dataIndex : 'payAmount',
                width:100,
			},{
				title     : '支付状态',
				dataIndex : 'payStatus',
                width:100,
				render: function(text, record) {
					
					let payStatus = record.payStatus;
					return (
						<div key={'handle_' + record.id} className={styles.table_handle_cont}>
							{!!(payStatus == '1') && 
								<span key="tuikuan"><span style={{color:"#7ED321",fontSize:"8px",marginRight:"2px"}}>●</span>已支付</span> }
							{!!(payStatus == '2') && 
                                <span key="yituikuan" ><span style={{color:"#D0021B",fontSize:"8px",marginRight:"2px"}}>●</span>已退款</span> }
                            {!!('0' == payStatus ) && 
                                <span key="wzf" ><span style={{color:"#F5A623",fontSize:"8px",marginRight:"2px"}}>●</span>未支付</span> }
						</div>
					)
				}
			},{
				title     : '操作',
				dataIndex : 'handle',
                width  : 50,
				render: function(text, record) {
					
					let payStatus = record.payStatus;
					return (
						<div key={'handle_' + record.id} className={styles.table_handle_cont}>
							{!!(payStatus == '1') && 
							<Popconfirm key="tuikuan" title="确定要退款吗?" onConfirm={()=>me.giveBackMoney(record)}>
								<a key="tuikuan" className={styles.table_handle_a} >退款</a>
							</Popconfirm>}
						</div>
					)
				}
			}];

		//校区选择框属性
		let tenantOrgSelectProps = {
			visible: showCreateCampus,
			onClose: this.functionSelectOrgModalClose,
			afterSubmit: this.functionSelectOrgModalClose,
			init_org_select: createCampusOrgIds || [],
			disabled: showCreateCampus,
			no_select_campus: createCampusOrgIds || [],
		};
		const columns = [
				{
	           	    title     : '活动名称',
	           	    dataIndex : 'gamename',
	           	    width     : 180,
	           	    render    : (text, record) => (
						<div>
							<div style = {{ width : '80%', display : 'inline-block', verticalAlign : 'middle' }}>
								<a onClick = { this.activityModify.bind(this,record) } >{ record.name }</a>
							</div>
							<div style = {{ width : '20%', display : 'inline-block', textAlign : 'right', verticalAlign : 'middle' }}>
								<Icon style = {{ cursor : 'pointer' }} onClick={ this.activityAddress.bind(this,record) }  type = 'erweima' />
							</div>

							{/* <div style = {{ width : '20%', display : 'inline-block', textAlign : 'right', verticalAlign : 'middle' }}>
								<Icon style = {{ cursor : 'pointer' }} onClick={ this.activityAddress.bind(this,record) }  type = 'erweima' />
							</div> */}
						</div>
	           	    )
	           	},{
					title: statusTitleCont,
	           	    dataIndex : 'status',
	           	    width     : 100,
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
	           	    render    : (text, record) => (
	           		    <div>
							   {/* <p>{record.status == 1 ? '已上架' : record.status == 2 ? '已下架' : '已删除'}</p> */}
							   {
									record.status == 1 
									? <p><span className={styles.upColorIcon}></span>已上架</p>
									: record.status == 2
									? <p><span className={styles.upColorIcon} style={{background:'#D0021B'}}></span>已下架</p>
									: <p>已删除</p>
								}

	           		    </div>
	           	    )
	           	},{
	           	    title     : '数据详情',
	           	    dataIndex : 'validUser',
	           	    width     : 120,
	           	    render    : (text, record) => (
	           		    <div>
	           		    	<p>有效用户:{record.validnum}</p>
							   {/* <a className="game_address_a" onClick={this.gameReviewDetail.bind(this,record)}>查看详情</a> */}
							   <a onClick={this.gameReviewDetail.bind(this,record)}>查看</a>
	           		    </div>
	           	    )
	           	},{
	           	    title     :'活动名称类型',
	           	    dataIndex : 'gameTitle',
                    width     : 150,
	           	    render    : (text, record) => (
	           		    <span>
	           		      	<p>{record.title}</p>
	           		    </span>
	           	    )
	           	},{
	           	    title     : '校区',
	           	    dataIndex : 'orgName',
					width     : 180,
					render: (text, record) => (
						<span>
							<a onClick={() => this.reviewCampus(record.campusForm || record.orgId)}>{this.getCampus(record.campusForm || record.orgId)}</a >
	           		    </span >
					)
	           	},{
	           	    title     : '创建时间',
	           	    dataIndex : 'createTime',
                    width     : 180,
				},{
					title     : '操作',
					dataIndex : 'operation',
					width     : 180,
					render: (text, record) => (
						<span>
							<a onClick = { this.activityModify.bind(this,record) } >编辑</a>
							{/* <a>上架</a> */}
							{
								record.status == '1'
								?	<Popconfirm style={{display:'inline-block'}} title = "确认要下架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.activityShelvesDown.bind( this, record ) } >
										<a style={{padding:'0 15px',boxSizing:'border-box'}}>下架</a> 
									</Popconfirm>
								: record.status == '2'
								?	<Popconfirm style={{display:'inline-block'}} title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.activityShelvesUp.bind( this, record ) } >
										<a style={{padding:'0 15px',boxSizing:'border-box'}}>上架</a> 
									</Popconfirm>
								: 	<a style={{padding:'0 15px'}}>删除</a>
							}
							<a onClick={this.gameReviewDetail.bind(this,record)}>数据详情</a>
						</span>
					)
				}];

		let selectOptions = [];
		if(this.state.orgList&&this.state.orgList.length>0) {
			selectOptions = this.state.orgList.map(function (item, index) {
		    	let name = item.name;
		    	return <Option value={ item.id } id={item.id}>{name}</Option>
		    });
		};

		let modalActOpts = {
            title : '修改微活动',
            formVisible : this.state.activityFormVisible ,
            changeTempletInstanceFormVisible : this.changeTempletInstanceFormVisible,
			activityId : this.state.activityId,
            activityTypeId : this.state.activityTypeId,
            activityCode : this.state.activityCode ,
            callbackRefresh : this.tableListRefresh,
            changeCodeModalVisible : this.changeCodeModalVisible,
            diliverCode : this.diliverCode,
            currentSelectCampus : this.state.currentSelectCampus
        }

        let modalLeaOpts = {
            title : '修改微传单',
            formVisible : this.state.leafletFormVisible ,
            changeTempletInstanceFormVisible : this.changeTempletInstanceFormVisible,
			activityId : this.state.activityId,
            activityTypeId : this.state.activityTypeId,
            activityCode : this.state.activityCode ,
            callbackRefresh : this.tableListRefresh ,
            changeCodeModalVisible : this.changeCodeModalVisible,
            diliverCode : this.diliverCode,
            currentSelectCampus : this.state.currentSelectCampus
        }
          let tableProps = {
            userData:this.state.statisticalDataSource, //展示数据
            pageSize: 10,
            pageIndex:this.state.pageIndex,
            dataTotal:this.state.statisticalData.resultCount, //数据总数
            handleUserdataExport:this.exportData.bind(this,this.state.statisticalId),  //导出用户数据
            handleQueryUserdata:(params)=>{
                this.tableChangePage({pageIndex:params && params.pageIndex || 0},params)
            },
            userDataColumns:statisticalColumns, //表头
            getHeaderVal:(v)=>{
                this.setState({
                    headValues:v,
                })
            }, //设置筛选条件
        }
    	return (
    			<div className="game_base_list_div">
    				<div className="game_base_list_search_div">
    				<QueueAnim
						type={['top', 'top']}
    					ease={['easeOutQuart', 'easeInOutQuart']}
						className="common-search-queue" >
	    				{
							this.state.isShowSearch ? [
							<div className="game_base_list_search_ani_div" key="common-search-queue-key-search">
								<Form horizontal>
									<FormItem style={{ float:'left', marginRight:'30px' }} >
										{getFieldDecorator('search_activity_campus') (
										<TenantOrgSelect
											style = {{ width : '100%' }} />
										)}
									</FormItem>
                                    <FormItem style={{ float:'left',marginRight:'30px' }}>
										{getFieldDecorator('search_activity_id') (
                                        <Input 	placeholder='编号'
                                                onChange={this.inputgameIdChange}
                                                id='search_activity_id'
                                                type="number"
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_activity_name') (
                                        <Input 	placeholder='活动名称'
                                                onChange={this.inputgameNameChange}
                                                id='search_activity_name'
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_activity_type_name') (
                                        <Input 	placeholder='活动类型名称'
                                                onChange={this.inputgameTypeNameChange}
                                                id="search_activity_type_name"
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                <Button type="ghost" onClick={this.resetButton} style={{float:'right',backgroundColor:'#fff',marginTop:'10px',marginLeft:'10px'}}>清除条件</Button>
                                <Button type="primary" onClick={()=>this.searchButton()} style={{float:'right',marginTop:'10px'}}>搜索</Button>
								</Form>
							</div>]:null}
    					</QueueAnim>
		    	        <div className="game_base_list_search_div_button_creategame">
							{/* <div className = 'yhwu_operation_left'>
								<span>操作 : </span>
								{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >上架</a> }
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.activityShelvesUp.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >上架</a> }
								</Popconfirm>
								{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >下架</a> }
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.activityShelvesDown.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >下架</a> }
								</Popconfirm>
							</div> */}
							<div className = 'yhwu_operation_left'>
								{/* <span>操作 : </span> */}
								{/* <span>已选<span style={{color:'#5D9CEC',margin:'0 5px'}}>{ selectedRowKeys && selectedRowKeys.length }</span>条数据</span>
									{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '23px', border: '1px solid #ddd', borderRadius:'4px', padding:'2px 8px',boxSizing:'border-box',fontSize:'12px' }}  >上架</a> }
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.activityShelvesUp.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '23px', border: '1px solid #5D9CEC', borderRadius:'4px', padding:'2px 8px',boxSizing:'border-box',fontSize:'12px' }} >上架</a> }
								</Popconfirm>
									{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px', border: '1px solid #ddd', borderRadius:'4px', padding:'2px 8px',boxSizing:'border-box',fontSize:'12px' }} >下架</a> }
								<Popconfirm title = "确认要下架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.activityShelvesDown.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px', border: '1px solid #5D9CEC', borderRadius:'4px', padding:'2px 8px',boxSizing:'border-box',fontSize:'12px' }} >下架</a> }
								</Popconfirm> */}
							</div>
							<div className = 'yhwu_operation_right' >
		    					<Button type = "primary" onClick = { this.screening } style = {{ marginTop : '20px' }}><Icon type = "filter" />筛选</Button>
							</div>
		    			</div>
	    	        </div>

	    	        <div className="game_base_list_search_div_table">
		    	        <Table bordered
							size = 'small'
				    		columns = { columns }
							// rowSelection = { rowSelection }
							rowSelection = { null }
							rowKey="id"
				    		dataSource = { this.props.dataSource.length > 0 ? this.props.dataSource : [] }
							locale = {{ emptyText:'暂无数据' }}
							scroll = {{ x : 910 }}
				    		pagination = {{
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
                                    <QRCode value = { this.state.gameQrUrl } size = { 300 } />
                                    <p style = {{ marginBottom : '5px' }} className="game_search_base_create_ui_div_po_qr_code_div_wx_title">请用微信扫一扫</p>
                                    <Input  style = {{ width : '72%' }} type = 'text' id = 'copy-content' value = { this.state.gameQrUrl } />
                                    <Button type = 'primary' style = {{ width : '26%' ,marginLeft : '2%' }} id = "copyLink" onClick = { this.copyLink }>复制地址</Button>
			                    </div>
	    				</Modal>
    				</div>

                {/*<Modal
	    				visible={this.state.showReviewStatistical}
						key='showReviewStatistical'
	        			title="数据统计"
	        			width='800'
	        			onCancel={this.changeGameStatisticalCancel}
	        			footer={[<Button size = 'default' key="save" type="primary" onClick={this.changeStatisticalOK}>确定</Button>]}>
	    					<div className="game_search_base_create_ui_div_statistical">
								<Form horizontal className="ant-advanced-search-form">
									<FormItem style={{ float: 'left', marginRight: '30px' }} >
										{getFieldDecorator('search_campus_data', {
											//initialValue: (window._init_data && window._init_data.firstOrg).key
										})(
											<TenantOrgSelect style={{ width: '100%' }} />
										)}
									</FormItem>
									<Button style={{ float: 'left' }} type="primary" onClick={() => this.searchFunction()}>搜索</Button>
									<Button style={{ float: 'left', marginLeft: '15px' }} onClick={() => this.clearFunction()}>清除</Button>
								</Form>
								<Button type="primary" style={{ marginTop: '-44px'}} disabled={this.state.statisticalDataSource.length > 0 ? false : true} onClick={this.exportData.bind(this,this.state.statisticalId)}>导出数据</Button>
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
                                        showTotal:total => `共 ${total} 条`
                                    }}
		    				 	    onChange={this.statisticalChangePage}
		    				 	/>
	    				 	</div>
    				 </Modal>*/}
    				<MicroActivityTemplate {...modalActOpts}/>
					<MicroLeafletTemplate {...modalLeaOpts}/>
					{this.state.categoryId == '1' ? <CodeModalActivity url = { this.state.codeUrl } codeModalVisible = { this.state.codeModalVisible }
                                    onConfirmCodeModal = { this.onConfirmCodeModal } /> : ''}

					{this.state.categoryId == '2' ? <CodeModalLeaflet url = { this.state.codeUrl } codeModalVisible = { this.state.codeModalVisible }
                                    onConfirmCodeModal = { this.onConfirmCodeModal } /> : ''}
                    <MicroModuleForm />
					<TenantSelect { ...tenantOrgSelectProps } />
                    <DataViewPage 
                        tableProps={tableProps}
                        tableType ="acti"
                        visible = {this.state.showReviewStatistical}
                        onClose = {()=>{this.setState({showReviewStatistical:false})}}
                        />
					<Modal
						visible={this.state.showPromptModal}
						width="335"
						maskClosable={false}
						onCancel={this.functionShowPromptModal}
						footer={null}
						className='zj_changeModalsRightX'>
						<div style={{ marginTop: '24px' }} className="game_search_base_create_ui_div_po_qr_code_div">
							<div className={styles.prompText}>该活动模板已经被下架</div>
						</div>
					</Modal>
    			</div>
    		);
		}
});

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Form.create()(WxActivityList));
