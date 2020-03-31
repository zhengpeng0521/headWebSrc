
/*
 *  游戏列表
 */
import React from 'react';
import { connect } from 'dva';
import {Form, Input, Col, Row, Select, Button, Popconfirm, Table, message, Modal, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import QueueAnim from 'rc-queue-anim';
import QRCode from 'qrcode.react';
import TenantOrgSelect from '../../common/tenant-org-filter/TenantOrgFilter';
import styles from './changeModalsRightX.less';
import TenantSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import GameInstPreviewModal from "./GameInstPreviewModal";
import DataViewPage from './dataViewPage';
import PageModal from '../../../components/scrm/micro-module/page-modal/PageModal';

const WxGamePageList = React.createClass({

	getInitialState() {
	    return {
	    	orgList						: [], 	//存储机构列表
	    	gameTypeList                : [],   //游戏名称类型列表
	    	isShowSearch				: false,//是否显示搜索组件
			gameModifyUrl               : '',   //修改URL
			gameModifyUrlEdit: '',   //修改URL
	    	addressUrl                  : '',   //游戏二位码
	    	modifyGameModalVisible      : false,//是否显示修改模态框
	    	dataDetailModalVisible      : false,//是否显示统计模态框
	    	addressUrlModalVisible      : false,//是否显示游戏二维码模态框

			gameInstPreviewVisible: false,//游戏实例预览窗口
			gameInstId: '',//预览的实例编号
			instH5Url: '',//实例的h5页面地址
			instH5PreviewUrl: '',//实例的h5预览页面地址
			gameInstData: {},//预览实例对象的参数

	    	pageIndex                   : 0,
			selectedRows                : [],
			selectedRowKeys             : [],

			filter: {						//过滤条件
				status: '1',				//过滤条件-状态 ''-全部状态  '1'-已上架   '2'-已下架
			},
			filterVisible: {
				status: false,
			},

			showCreateCampus			: false, //显示创建的校区
			createCampusOrgIds			: [],	// 创建的校区ids
            
            dataPageVisible             : false,

	    };
	},
    
    closeIframe() {
		this.setState({
			dataPageVisible : false
		});
	},

	onSubmitModal(){
		let ifr = document.getElementById("ifr");
		ifr.contentWindow.postMessage({
			type : 'game'
		}, '*')
	},

    componentDidMount() {
    	let self = this;

		//获取机构列表接口
    	serviceRequest( BASE_URL + '/microGame/getOrgNameList', { type : 1 },
			function(res) {
				self.setState({
					orgList : res.results,
				});
			},

			function(fai) {
				message.error( fai.errorMessage );
			}
    	);

		//获取游戏类型列表
		serviceRequest( BASE_URL + '/pmgame/query/infos/list' , { pageIndex : 0 , pageSize : 10000, status: '1' } ,
			function (res){
				self.setState({
					gameTypeList : res.results
				})
			}
		)

		self.searchButton('1');

		window.addEventListener('message', function(e){
			if( e.data == 'close' ){
				self.modifyGameCancel();
			} else if ( e.data == 'closeAndLink' ){
				self.modifyGameOk();
			} else {
				//复杂数据通信
				let message_data = e.data;
				if (message_data && message_data.messageType && message_data.messageType == 'preview') {
					//实例创建完成 显示预览窗口
					self.modifyGameCancel();
					self.showGameInstPreview(message_data);
				}
			}
        }, false );

    },

    //筛选框是否可见
	screening() {
		this.setState({
			isShowSearch : !this.state.isShowSearch
		});
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
			if(values.search_game_id != undefined
					|| values.search_game_name != undefined
					|| values.search_game_type_name != undefined
					|| values.search_game_campus != undefined
					|| status != undefined
					) {
						this.props.search({
							pageIndex : 0,
						    pageSize : 10,
						    orgId    : values.search_game_campus,
						    gameCode : values.search_game_type_name,
						    status   : status,
						    dataId   : values.search_game_id,
						    dataTitle : values.search_game_name,
						})
			} else {
				this.props.refreList(this.state.pageIndex);
			}
		});
	},

	//删除操作
	popConfirm( selectedRows ) {
		let self = this;
		let provider = selectedRows[0].provider;
		let tenantId = selectedRows[0].tenantId;
		let orgId = selectedRows[0].orgId;
		let gameId = selectedRows[0].gameId;
		let gameCode = selectedRows[0].gameCode;
		let dataId = selectedRows[0].dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'delete', tenantId : tenantId, orgId : orgId, gameId : gameId, gameCode: gameCode, dataId : dataId } ,
			 function(res){
				self.searchButton();
				self.setState({
					selectedRows    : [],
					selectedRowKeys : [],
				})
			}
		);
	},

	//上下架操作
	gameShelvesUp( selectedRows ) {
		let self = this;
		/* let provider = selectedRows[0].provider;
		let tenantId = selectedRows[0].tenantId;
		let orgId = selectedRows[0].orgId;
		let gameCode = selectedRows[0].gameCode;
		let dataId = selectedRows[0].dataId; */
		let provider = selectedRows.provider;
		let tenantId = selectedRows.tenantId;
		let orgId = selectedRows.orgId;
		let gameCode = selectedRows.gameCode;
		let dataId = selectedRows.dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'update_status', tenantId : tenantId, orgId : orgId, gameCode: gameCode, dataId : dataId ,status : '1' } ,
			function(res){
				self.searchButton();
				message.success('上架成功');
				self.setState({
					selectedRows    : [],
					selectedRowKeys : [],
				})
			}
		)
	},

	gameShelvesDown( selectedRows ) {
		let self = this;
		/* let provider = selectedRows[0].provider;
		let tenantId = selectedRows[0].tenantId;
		let orgId = selectedRows[0].orgId;
		let gameCode = selectedRows[0].gameCode;
		let dataId = selectedRows[0].dataId; */
		let provider = selectedRows.provider;
		let tenantId = selectedRows.tenantId;
		let orgId = selectedRows.orgId;
		let gameCode = selectedRows.gameCode;
		let dataId = selectedRows.dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'update_status', tenantId : tenantId, orgId : orgId, gameCode: gameCode, dataId : dataId ,status : '2' } ,
			function(res){
				self.searchButton();
				message.success('下架成功');
				self.setState({
					selectedRows    : [],
					selectedRowKeys : [],
				})
			}
		)
	},

	//点击查看游戏地址
	gameAddress( record ) {
		let self = this;

		let provider = record.provider;
		let tenantId = record.tenantId;
		let gameCode = record.gameCode;
		let gameId = record.gameId;
		let orgId = record.orgId;
		let dataId = record.dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'h5', tenantId : tenantId, orgId : 0, gameId : gameId, gameCode: gameCode, dataId : dataId } ,
			function(res){
				self.setState({
					addressUrlModalVisible : !self.state.addressUrlModalVisible,
					addressUrl : res.data.url
				})
			}
		)
	},

	//关闭查看地址
	addressUrlClose(){
		this.setState({
			addressUrlModalVisible : !this.state.addressUrlModalVisible
		})
	},

	
	//修改操作,打开新增框
	gameModify(record) {
		let self = this;
		console.info('self---',self)
		self.setState({
			gameModifyUrlEdit: '',
		});
		let provider = record.provider;
		let dataId = record.dataId;
		let tenantId = record.tenantId;
		let orgId = record.orgId;
		let orgName = this.mapOrgTypeList(orgId);
		let gameId = record.gameId;
		let expireTime = record.expireTime;
		let gameCode = record.gameCode;
		let isGameEdit = record.isGameEdit;
		let uid = window.uid||'';
        let runAs = window.runAs||'';
				
		// provider = 'http://10.0.0.223:8360/thinknode/game/transpond';

		let gameModifyUrl = provider + '/page?m=create&tenantId=' + tenantId + '&orgId=' + 0 + '&gameCode=' + gameCode + '&gameId=' + gameId + '&dataId=' + dataId+ '&uid=' + uid+ '&runAs=' + runAs;

		if (isGameEdit == 'true') {
		// 	if (gameCode == 'bargainEd' 
		// 	|| gameCode == 'pintEd' 
		// 	|| gameCode == 'groupEd' 
		// 	|| gameCode == 'publicGroupEd'
		// 	|| gameCode == 'fqtBargainEd' 
		// 	|| gameCode == 'collectCardEd' 
		// 	|| gameCode == 'buyLimitEd' 
		// 	|| gameCode == 'fqtGroupEd' 
		// 	|| gameCode == 'halloweenBargainEd'
		// 	|| gameCode == 'ballonEd'
			
		// ) {
		// 		self.props.dispatch({
		// 			type: 'gameTemplateCreate/showCreateGamePage',
		// 			payload: {
		// 				attrShowPageModal: true,
		// 				attrGameFrameUrl: gameModifyUrl,
		// 				isHq: 1,
		// 			}
		// 		});
		// 	}
			self.props.dispatch({
				type: 'gameTemplateCreate/showCreateGamePage',
				payload: {
					attrShowPageModal: true,
					attrGameFrameUrl: gameModifyUrl,
					isHq: 1,
				}
			});
			self.setState({
				gameModifyUrlEdit: gameModifyUrl,
			});

		} else {
			self.setState({
				gameModifyUrl: gameModifyUrl,
				modifyGameModalVisible: !this.state.modifyGameModalVisible
			});
		}

		window.wActivityTimer = setInterval(function(){
			serviceRequest(
				BASE_URL + '/organController/getTenant', {}
			)
		}, 600000)
	},

	//确认修改游戏
	modifyGameOk(){
		this.setState({
			modifyGameModalVisible : !this.state.modifyGameModalVisible,
			gameModifyUrl  : ''
		});
		clearInterval( window.wActivityTimer );
		this.searchButton();
	},

	//取消修改游戏
	modifyGameCancel(){
		this.setState({
			modifyGameModalVisible : false,
			gameModifyUrl  : ''
		});
		this.props.dispatch({
			type: 'gameTemplateCreate/showCreateGamePage',
			payload: {
				attrShowPageModal: false,
				attrGameFrameUrl: '',
				isHq: 1,
			}
		});
		clearInterval( window.wActivityTimer );
	},


	//查看统计详情
	gameReviewDetail( record ){

		let provider = record.provider;
		let dataId = record.dataId;
		let gameId = record.gameId;
		let tenantId = record.tenantId;
		let orgId = record.orgId;
		let gameCode = record.gameCode;
        let uid            = window.uid||'';
        let runAs          = window.runAs||'';
//         provider = 'http://10.0.0.235:8360/thinknode/game/transpond';
		let dataDetailUrl = provider + '/page?m=data&dataId=' + dataId + '&tenantId=' + tenantId + '&orgId=' + 0 + '&gameCode=' + gameCode + '&gameId=' + gameId+ '&uid=' + uid+ '&runAs=' + runAs;
		let edArr = ["bargainEd", "pintEd", "fqtBargainEd", "groupEd", "publicGroupEd", "collectCardEd", "buyLimitEd", "fqtGroupEd", "halloweenBargainEd","ballonEd"];
        if(edArr.indexOf(gameCode)>-1){
            this.setState({
                dataDetailUrl          : dataDetailUrl,
                dataPageVisible        : true,
            })
        }else{
            this.setState({
                // dataDetailModalVisible : !this.state.dataDetailModalVisible,
				// dataDetailUrl          : dataDetailUrl,
				dataDetailUrl          : dataDetailUrl,
				dataPageVisible        : true,

            })
        }
	},

	//关闭统计详情
	dataDetailClose(){
		this.setState({
			dataDetailModalVisible : !this.state.dataDetailModalVisible
		})
	},

	//主页分页改变
	pageChange( pagination, filters, sorter ) {

		let status = this.state.filter.status;

		this.props.form.validateFields((err, values) => {
			if(values.search_game_id != undefined
					|| values.search_game_name != undefined
					|| values.search_game_type_name != undefined
					|| values.search_game_campus != undefined
			) {
			let searchConditions = {
										pageIndex : pagination.current - 1,
									    pageSize : 10,
									    orgId    : values.search_game_campus,
									    gameCode : values.search_game_type_name,
									    status,
									    dataId   : values.search_game_id,
									    dataTitle : values.search_game_name
								    }
				this.props.pageSizeChangeCallBack( pagination.current - 1, searchConditions );
				this.setState({
					pageIndex : pagination.current-1
				})
			} else {
				this.props.pageSizeChangeCallBack( pagination.current - 1, {status, pageIndex: pagination.current - 1});
				this.setState({
					pageIndex : pagination.current-1
				})
			}
		});

	},

	//遍历游戏类型列表
	mapGameTypeList( gameCode ){
		if( this.state.gameTypeList && this.state.gameTypeList.length > 0 ){
			for ( let i = 0 ; i < this.state.gameTypeList.length; i++){
				if(  gameCode === this.state.gameTypeList[i].gameCode ){
					return this.state.gameTypeList[i].gameTitle;
				}
			}
		}
	},
	//遍历机构列表
	mapOrgTypeList ( orgId ){
		if( this.state.orgList && this.state.orgList.length > 0 ){
			for ( let i = 0 ; i < this.state.orgList.length; i++){
				if(  orgId === this.state.orgList[i].id ){
					return this.state.orgList[i].name;
				}
			}
		}
	},

	//选中多条数据
	onSelectChange( selectedRowKeys, selectedRows ) {
		this.setState({
			selectedRowKeys,
			selectedRows
		});
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

	reviewCampus(ids) {
		this.setState({
			showCreateCampus: !this.state.showCreateCampus,
			createCampusOrgIds: ids.split(',') || [],
		});
	},
	
	functionSelectOrgModalClose() {
		this.setState({
			showCreateCampus: !this.state.showCreateCampus,
			createCampusOrgIds: [],
		});
	},

	showGameInstPreview(instData) {
		this.setState({
			gameInstPreviewVisible: true,
			gameInstId: instData.instId,
			instH5Url: instData.instH5Url,
			instH5PreviewUrl: instData.instH5PreviewUrl,
			gameInstData: {
				...instData
			}
		});
	},

	handleOnCloseInstPreviewModal() {
		this.setState({
			gameInstPreviewVisible: false,
		});
		window.parent.postMessage('close', '*');
	},

	handleOnEditAgain() {
		this.props.dispatch({
			type: 'gameTemplateCreate/showCreateGamePage',
			payload: {
				attrShowPageModal: true,
				attrGameFrameUrl: this.state.gameModifyUrlEdit,
				isHq: 1,
			}
		});
		this.handleOnCloseInstPreviewModal();
	},

    render() {

		const { getFieldValue, getFieldProps, isFieldValidating, getFieldError, getFieldDecorator, } = this.props.form;
		const formItemLayout = {labelCol: { span: 4 }, wrapperCol: { span: 18 },};
		const { loading, selectedRowKeys, selectedRows, filter, showCreateCampus, createCampusOrgIds, gameInstPreviewVisible } = this.state;

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
			getCheckboxProps: record => ({
				disabled: (record.isHq === 0 || record.isHq === false)
			})
		};

		let statusTitleCont = (
			<span style={{cursor: 'pointer'}} onClick={()=>this.filterVIsibleChange('status')}>
				{filter.status == '' ? '全部状态' : filter.status == '1' ? '已上架' : filter.status == '2' ? '已下架' : '其他状态'}
			</span>
		);
		
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
	           	    title: '游戏名称' ,
	           	    dataIndex: 'dataTitle',
	           	    width: 200,
	           	    render: (text, record) => (
	           		    <div>
							{/* <div style = {{ width : '80%', display : 'inline-block', verticalAlign : 'middle' }}>
								<a onClick = { this.gameModify.bind(this,record) } >{ record.dataTitle }</a> */}
							<div style = {{ width : '20%', display : 'inline-block', verticalAlign : 'middle', position:'relative' }}>
								<img src = {record.icon} style={{marginRight:'10px',width:'40px',height:'40px'}} />
							</div>
							<div style = {{ width : '60%', display : 'inline-block', verticalAlign : 'middle', position:'relative',textAlign:'left' }}>
								<a onClick = { this.gameModify.bind(this,record) } >
									{ record.dataTitle }
								</a>

							</div>
							<div style = {{ width : '20%', display : 'inline-block', textAlign : 'right', verticalAlign : 'middle' }}>
								<Icon style = {{ cursor : 'pointer' }} onClick = { this.gameAddress.bind(this,record) }  type = 'erweima' />
							</div>
						</div>
	           	    )
	           	},{
	           	    title: '游戏名称类型',
	           	    dataIndex: 'gameCode',
					width    : 120,
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{ this.mapGameTypeList(record.gameCode) || "" }</p>
	           		    </span>
	           	    )
	           	},{
	           	    title: statusTitleCont,
	           	    width : 90,
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
	           	    title: '数据详情',
	           	    dataIndex: 'validUser',
	           	    width: 120,
	           	    render: (text, record) => (
	           		    <div>
	           		    	 <p>有效用户:{ record.amount }</p>
	           		    	 <p>浏览数:{ record.views }</p>
								{/* <a className="game_address_a" onClick={this.gameReviewDetail.bind(this,record)}>查看详情</a> */}
								<a onClick={this.gameReviewDetail.bind(this,record)}>查看</a>
	           		    </div>
	           	    )
	           	},{
	           	    title: '校区',
	           	    dataIndex: 'orgId',
					width    : 180,
	           	    render: (text, record) => (
	           		    <span>
						  	<a onClick={() => this.reviewCampus(record.orgId)}>{record.orgId && record.orgId.split(',').length || 0}</a>
	           		    </span>
	           	    )
	           	},{
	           	    title: '游戏时间',
	           	    dataIndex: 'startTime',
					width     : 160,
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{record.startTime + ' ~ ' + record.endTime}</p>
	           		    </span>
	           	    )
	           	},{
	           	    title: '创建时间',
					width : 180,
	           	    dataIndex: 'createTime',
				},{
					title     : '操作',
					key : 'operation',
					fixed: 'right',
					width     : 200,
					render: (text, record) => (
						<span >
							<a onClick = { this.gameModify.bind(this,record)}>编辑</a>
							{
								record.status == '1'
								?	<Popconfirm style={{display:'inline-block'}} title = "确认要下架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.gameShelvesDown.bind( this, record ) } >
										<a style={{padding:'0 15px',boxSizing:'border-box'}}>下架</a>
									</Popconfirm>
								: record.status == '2'
								?	<Popconfirm style={{display:'inline-block'}} title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.gameShelvesUp.bind( this, record ) } >
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
		    	return <Option key={'opt_org_'+index} value={item.id + ''} id={item.id}>{name}</Option>
		    });
		};

		//游戏类型列表
		let gameTypeListOptions = [];
		if( this.state.gameTypeList && this.state.gameTypeList.length>0 ){
			gameTypeListOptions = this.state.gameTypeList.map(function( item , index ){
				let name = item.gameTitle;
				return <Option key={'opt_game_type_'+index} value = { item.gameCode + '' }>{ name }</Option>
			})
		};
		
		let gameInstPreviewProps = {
			visible: gameInstPreviewVisible,
			instId: this.state.gameInstId,
			inst_h5_url: this.state.instH5Url,
			inst_h5_preview_url: this.state.instH5PreviewUrl,
			gameInstData: this.state.gameInstData,
			handleOnClose: this.handleOnCloseInstPreviewModal,
			handleOnEditAgain: this.handleOnEditAgain,
		};

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
								<Form className="ant-advanced-search-form">
									<FormItem style={{ float : 'left', marginRight : '30px' }} >
										{getFieldDecorator('search_game_campus') (
											<TenantOrgSelect
												style = {{ width : '100%' }}  />
										)}
									</FormItem>
                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_game_id') (
                                        <Input 	placeholder='编号'
                                                id='search_game_id'
                                                type="number"
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_game_name') (
                                        <Input 	placeholder={'游戏名称'}
                                                id='search_game_name'
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_game_type_name') (
                                        <Select placeholder={ '游戏类型名称' }
                                                size="default"
                                                id="search_game_type_name"
                                                style={{width:120}} >
                                                    { gameTypeListOptions }
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
								{/* <span>操作 : </span> */}
								{/* <span>已选<span style={{color:'#5D9CEC',margin:'0 5px'}}>{ selectedRowKeys && selectedRowKeys.length }</span>条数据</span>
									{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '23px', border: '1px solid #ddd', borderRadius:'4px', padding:'2px 8px',boxSizing:'border-box',fontSize:'12px' }}  >上架</a> }
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.gameShelvesUp.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '23px', border: '1px solid #5D9CEC', borderRadius:'4px', padding:'2px 8px',boxSizing:'border-box',fontSize:'12px' }} >上架</a> }
								</Popconfirm>
									{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px', border: '1px solid #ddd', borderRadius:'4px', padding:'2px 8px',boxSizing:'border-box',fontSize:'12px' }} >下架</a> }
								<Popconfirm title = "确认要下架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.gameShelvesDown.bind( this, selectedRows ) } >
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
				    		columns={ columns }
							// rowSelection={ rowSelection }
							rowSelection = { null }
				    		dataSource={ this.props.dataSource.length > 0 ? this.props.dataSource : [] }
							locale={{ emptyText:'暂无数据' }}
							scroll={{ x : 1330 }}
				    		pagination={{
								size : 'default',
				    			pageSize: 10,
				    			total: this.props.dataPage && this.props.dataPage.resultCount,
				    			current:this.props.dataPage && this.props.dataPage.pageIndex + 1,
                                showTotal:total => `共 ${total} 条` ,
                            }}
			 					onChange={this.pageChange} />
	    	        </div>
    				<PageModal
    					visible = { this.state.modifyGameModalVisible }
    					title = "修改微游戏"
    					width="calc(100vw - 150px)"
						style={{top: '20px'}}
    					onCancel = { this.modifyGameCancel }
    					maskClosable = { false }
                        className='micro_game_form_modal'
        				footer = {[
							<Popconfirm title="确定要保存吗?" placement="bottom"   okText="确定" cancelText="取消" onConfirm={this.onSubmitModal} >
								<Button type="primary" >保存</Button>
							</Popconfirm>,
							<Popconfirm title="确定要关闭吗?" placement="bottomRight"  okText="确定" cancelText="取消" onConfirm={this.modifyGameCancel} >
								<Button type="ghost">关闭</Button>
							</Popconfirm>
					]} >
						<iframe src = { this.state.gameModifyUrl } id="ifr" frameBorder="0" width="100%" height="100%" marginHeight="0" marginWidth="0" scrolling="auto"></iframe>
    				</PageModal>
    				<Modal
    					visible = { this.state.addressUrlModalVisible }
    					width = "335"
    					maskClosable = { false }
    					onCancel = { this.addressUrlClose }
    					footer = { null }
							className = 'zj_changeModalsRightX'>
								<div style = {{ marginTop : '24px'}} className="game_search_base_create_ui_div_po_qr_code_div">
										<QRCode value = { this.state.addressUrl } size = { 300 } />
										<p style = {{ marginBottom : '5px' }} className="game_search_base_create_ui_div_po_qr_code_div_wx_title">请用微信扫一扫</p>
										<Input  style = {{ width : '72%' }} type = 'text' id = 'copy-content' value = { this.state.addressUrl } />
										<Button type = 'primary' style = {{ width : '26%' ,marginLeft : '2%' }} id = "copyLink" onClick = { this.copyLink }>复制地址</Button>
								</div>
    				</Modal>
    				<Modal
    					visible = { this.state.dataDetailModalVisible }
    					title = "数据统计"
    					width = "940"
    					maskClosable = { false }
    					onCancel = { this.dataDetailClose }
    					footer = {[
    						<Button key = "dataDetailClose" type = "ghost" size = "large" onClick = { this.dataDetailClose }>关闭</Button>
    					]} >
    						<iframe src = { this.state.dataDetailUrl } frameBorder="0" width="917" height="600" marginHeight="0" marginWidth="0" scrolling="auto" ></iframe>
    				</Modal>
					<TenantSelect { ...tenantOrgSelectProps } />
					<GameInstPreviewModal {...gameInstPreviewProps} />
						<DataViewPage visible={this.state.dataPageVisible}
							tableType = "game"
							onClose={this.closeIframe}
							dataDetailUrl={this.state.dataDetailUrl}/>
    			</div>
    		);
		}
})

function mapStateToProps({ gameTemplateCreate }) {
	return { gameTemplateCreate };
}

export default connect(mapStateToProps)(Form.create()(WxGamePageList));
