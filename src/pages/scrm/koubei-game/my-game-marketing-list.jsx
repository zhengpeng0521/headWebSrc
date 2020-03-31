/*
 *  游戏列表
 */
import React from 'react';
import {Form, Input, Col, Row, Select, Button, Popconfirm, Table, message, Modal, Icon } from 'antd';
const FormItem = Form.Item;
import QueueAnim from 'rc-queue-anim';
let Option = Select.Option;
import QRCode from 'qrcode.react';

const WxGamePageList = React.createClass({

	getInitialState() {
	    return {
	    	orgList						: [], 	//存储机构列表
	    	gameTypeList                : [],   //游戏名称类型列表
	    	isShowSearch				: false,//是否显示搜索组件
	    	gameModifyUrl               : '',   //修改URL
	    	addressUrl                  : '',   //游戏二位码
	    	modifyGameModalVisible      : false,//是否显示修改模态框
	    	dataDetailModalVisible      : false,//是否显示统计模态框
	    	addressUrlModalVisible      : false,//是否显示游戏二维码模态框
	    	gameShelvesModalVisible     : false,//上下架模态框
	    	dataId                      : '',
			tenantId                    : '',
			orgId                       : '',
			status                      : '',
			gameId                      : '',
			gameCode                    : '',
	    	pageIndex                   : 0,
	    };
	},

    componentDidMount() {
    	let self = this;
    	//获取机构列表接口
    	serviceRequest( BASE_URL + '/microGame/getOrgNameList', { type:1 },
			function(res) {
				self.setState({
					orgList 	: res.results,
				});
			},

			function(fai) {
				message.error(fai.errorMessage);
			}
    	);

    	//获取游戏类型列表
    	serviceRequest( BASE_URL + '/pmgame/query/koubeiinfos/list' , { pageIndex : 0 , pageSize : 10000 } ,
			function (res){
				self.setState({
					gameTypeList : res.results
				})
			}
    	)

    	//直接点击关闭按钮
    	gameIframeCloseAction = function(){
    		self.modifyGameCancel();
    	}
		//关闭iframe并执行刷新
		gameIframeCloseAndRefreshAction = function(){
			self.modifyGameOk();
		};
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
	searchButton(e) {
		this.props.form.validateFields((err, values) => {
			if(values.search_game_id != undefined
					|| values.search_game_name != undefined
					|| values.search_game_status != undefined
					|| values.search_game_type_name != undefined
					|| values.search_game_campus != undefined
					) {
						this.props.search({
							pageIndex : this.state.pageIndex,
						    pageSize : 20,
						    orgId    : values.search_game_campus,
						    gameCode : values.search_game_type_name,
						    status   : values.search_game_status,
						    dataId   : values.search_game_id,
						    dataTitle : values.search_game_name
						})
			} else {
				this.props.refreList(this.state.pageIndex);
			}
		});
	},

	//删除操作
	popConfirm(record) {
		let self = this;
		let provider = record.provider;
		let tenantId = record.tenantId;
		let orgId = record.orgId;
		let gameId = record.gameId;
		let gameCode = record.gameCode;
		let dataId = record.dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'delete', tenantId : tenantId, orgId : orgId, gameId : gameId, gameCode: gameCode, dataId : dataId } ,
			 function(res){
				self.searchButton();
			}
		);
		serviceRequest ( BASE_URL+'/pmgame/koubei/updateStatus' , { tenantId : tenantId, orgId : orgId, dataId : dataId ,status : '0' } ,
				function(res){
				}
			)
	},

	//上下架操作
	gameShelves( record ) {
		let self = this;
		let status;
		if(record.status == '1'){
			status = '2'
		}else if ( record.status == '2'){
			status = '1'
		};
		let dataId = record.dataId;
		let tenantId = record.tenantId;
		let orgId = record.orgId;
		let gameId = record.gameId;
		let gameCode = record.gameCode;
		let provider = record.provider;

		this.setState({
			gameShelvesModalVisible : !this.state.gameShelvesModalVisible,
			dataId                 : dataId,
			tenantId               : tenantId,
			orgId                  : orgId,
			status                 : status,
			gameId                 : gameId,
			gameCode               : gameCode,
		});
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'h5', tenantId : tenantId, orgId : orgId, gameId : gameId, gameCode: gameCode, dataId : dataId } ,
				function(res){
					self.setState({
						addressUrl : res.data.url,
					})
				}
			)
	},
	onConfirmGameShelves(){
		let self = this;
		serviceRequest ( BASE_URL+'/pmgame/koubei/updateStatus' , { tenantId : this.state.tenantId, orgId : this.state.orgId, dataId : this.state.dataId ,status : this.state.status , gameAddre : this.state.addressUrl } ,
				function(res){
				self.searchButton();
					self.setState({
						gameShelvesModalVisible : !self.state.gameShelvesModalVisible
					})
				}
			)
	},
	onCancelGameShelves(){
		this.setState({
			gameShelvesModalVisible : !this.state.gameShelvesModalVisible
		});
	},

	//点击查看游戏地址
	gameAddress(record) {
		let self = this;

		let provider = record.provider;
		let tenantId = record.tenantId;
		let gameCode = record.gameCode;
		let gameId = record.gameId;
		let orgId = record.orgId;
		let dataId = record.dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'h5', tenantId : tenantId, orgId : orgId, gameId : gameId, gameCode: gameCode, dataId : dataId } ,
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

		let provider = record.provider;
		let dataId = record.dataId;
		let tenantId = record.tenantId;
		let orgId = record.orgId;
		let orgName = this.mapOrgTypeList(orgId);
		let gameId = record.gameId;
		let expireTime = record.expireTime;
		let gameCode = record.gameCode;

		let gameModifyUrl = provider+'/page?m=create&tenantId='+tenantId+'&orgId=0&gameCode='+gameCode+'&gameId='+gameId+'&dataId='+dataId;
		this.setState({
			gameModifyUrl : gameModifyUrl,
			modifyGameModalVisible : !this.state.modifyGameModalVisible
		})
	},

	//确认修改游戏
	modifyGameOk(){
		this.setState({
			modifyGameModalVisible : !this.state.modifyGameModalVisible,
			gameModifyUrl  : ''
		})
		self.searchButton();
	},

	//取消修改游戏
	modifyGameCancel(){
		this.setState({
			modifyGameModalVisible : !this.state.modifyGameModalVisible,
			gameModifyUrl  : ''
		})
	},


	//查看统计详情
	gameReviewDetail( record ){

		let provider = record.provider;
		let dataId = record.dataId;
		let gameId = record.gameId;
		let tenantId = record.tenantId;
		let orgId = record.orgId;
		let gameCode = record.gameCode;
		let dataDetailUrl = provider+'/page?m=data&dataId='+dataId+'&tenantId='+tenantId+'&orgId=0&gameCode='+gameCode+'&gameId='+gameId;
		this.setState({
			dataDetailModalVisible : !this.state.dataDetailModalVisible,
			dataDetailUrl          : dataDetailUrl
		})
	},

	//关闭统计详情
	dataDetailClose(){
		this.setState({
			dataDetailModalVisible : !this.state.dataDetailModalVisible
		})
	},

	//主页分页改变
	pageChange( pagination, filters, sorter ) {
		this.props.form.validateFields((err, values) => {
			if(values.search_game_id != undefined
					|| values.search_game_name != undefined
					|| values.search_game_status != undefined
					|| values.search_game_type_name != undefined
					|| values.search_game_campus != undefined
			) {
			let searchConditions = {
										pageIndex : pagination.current - 1,
									    pageSize : 20,
									    orgId    : values.search_game_campus,
									    gameCode : values.search_game_type_name,
									    status   : values.search_game_status,
									    dataId   : values.search_game_id,
									    dataTitle : values.search_game_name
								    }
				this.props.pageSizeChangeCallBack( pagination.current - 1, searchConditions );
				this.setState({
					pageIndex : pagination.current-1
				})
			} else {
				this.props.pageSizeChangeCallBack( pagination.current - 1 );
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
	onSelectChange( selectedRowKeys ) {
		this.setState({
			selectedRowKeys
		});
	},

    copyLink(){
    	var copyobject=document.getElementById("copy-content");
	    copyobject.select();
	    document.execCommand("Copy");
	    message.success('复制成功');
    },

    render() {
		const { getFieldValue, getFieldProps, isFieldValidating, getFieldError } = this.props.form;
		const formItemLayout = {labelCol: { span: 5 }, wrapperCol: { span: 19 },};
		const { loading, selectedRowKeys } = this.state;
		const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };

		const columns = [{
				title: '操作',
				width: 220,
           	    dataIndex: 'id_1',
           	    render: (text, record) => (
           	    		<span>
	           		    	<Popconfirm title="您确定删除这条游戏数据吗?"
	           		    		onConfirm={ this.popConfirm.bind(this,record) }
	           		    		okText="确定"
	           		    		cancelText="取消">
	           		    		<a href="#">删除</a>
	           		    	</Popconfirm>
	           		    	<span className="ant-divider" />
	           		    	<a onClick = { this.gameShelves.bind(this,record) }>{ record.status == 1 ? '下架' : record.status == 2 ? '上架' : ''}</a>
	           		    	<span className="ant-divider" />
	           		    	<a onClick = { this.gameModify.bind(this,record) } className="ant-dropdown-link">修改</a>
	           		    	<span className="ant-divider" />
	           		    	<a onClick = { this.gameAddress.bind(this,record) } className="ant-dropdown-link">查看地址</a>
           		    	</span>
           	    )
	           	},{
	           	    title: '编号',
	           	    width: 100,
	           	    dataIndex: 'dataId',
	           	},{
	           	    title: '游戏名称' ,
	           	    dataIndex: 'dataTitle',
	           	    width: 200,
	           	    render: (text, record) => (
	           		    <span>{ record.dataTitle }</span>
	           	    )
	           	},{
	           	    title: '游戏名称类型',
	           	    dataIndex: 'gameCode',
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{ this.mapGameTypeList(record.gameCode) || "" }</p>
	           		    </span>
	           	    )
	           	},{
	           	    title: '校区',
	           	    dataIndex: 'orgId',
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{ this.mapOrgTypeList( record.orgId ) || "" }</p>
	           		    </span>
	           	    )
	           	},{
	           	    title: '游戏时间',
	           	    dataIndex: 'startTime',
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{record.startTime + ' ~ ' + record.endTime}</p>
	           		    </span>
	           	    )
	           	},{
	           	    title: '游戏状态',
	           	    width : 90,
	           	    dataIndex: 'status',
	           	    render: (text, record) => (
	           		    <div>
	           		    	<p>{record.status == 1 ? '已上架' : record.status == 2 ? '已下架' : '已删除'}</p>
	           		    </div>
	           	    )
	           	},{
	           	    title: '数据统计',
	           	    dataIndex: 'validUser',
	           	    width: 100,
	           	    render: (text, record) => (
	           		    <div>
	           		    	 <p>有效用户:{ record.amount }</p>
	           		    	 <p>参与人数:{ record.views }</p>
	           		    	 <a className="game_address_a" onClick={this.gameReviewDetail.bind(this,record)}>查看详情</a>
	           		    </div>
	           	    )
	           	},{
	           	    title: '创建时间',
	           	    dataIndex: 'createTime',
	           	}];

		let setSearchGameId 		= getFieldProps('search_game_id', {});
		let setSearchGameName 		= getFieldProps('search_game_name', {});
		let setSearchGameTypeName 	= getFieldProps('search_game_type_name', {});
		let setSearchGameStatus		= getFieldProps('search_game_status', {});
		let setSearchGameCampus		= getFieldProps('search_game_campus', {});

		let selectOptions = [];
		if(this.state.orgList&&this.state.orgList.length>0) {
			selectOptions = this.state.orgList.map(function (item, index) {
		    	return <Option key = { 'gameListOrg_' + index } value={ item.id + '' } id={ item.id }>{ item.name }</Option>
		    });
		};

		//游戏类型列表
		let gameTypeListOptions = [];
		if( this.state.gameTypeList && this.state.gameTypeList.length>0 ){
			gameTypeListOptions = this.state.gameTypeList.map(function( item , index ){
				return <Option key = { 'gameTypeListOpt_' + item.gameId } value = { item.gameCode + '' } id = { item.gameId }>{ item.gameTitle }</Option>
			})
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
                                    <FormItem style={{float:'left',marginRight:'30px'}}>
                                        <Input 	placeholder='编号'
                                                value={this.state.value}
                                                id='search_game_id'
                                                type="number"
                                                style={{width:120}}
                                                {...setSearchGameId}/>
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
                                        <Input 	placeholder={'游戏名称'}
                                                value={this.state.value}
                                                id='search_game_name'
                                                style={{width:120}}
                                                {...setSearchGameName}/>
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
                                        <Select placeholder={ '游戏类型名称' }
                                                size="default"
                                                id="search_game_type_name"
                                                style={{width:120}}
                                                {...setSearchGameTypeName}>
                                                { gameTypeListOptions }
                                        </Select>
                                    </FormItem>

                                    <FormItem style={{float:'left'}}>
                                        <Select placeholder='校区'
                                                size="default"
                                                id="search_game_campus"
                                                style={{width:120}}
                                                {...setSearchGameCampus}>
                                                {selectOptions}
                                        </Select>
                                    </FormItem>
                                    <Button type="ghost" onClick={this.resetButton} style={{float:'right',backgroundColor:'#fff',marginTop:'10px',marginLeft:'10px'}}>清除条件</Button>
                                    <Button type="primary" onClick={this.searchButton} style={{float:'right',marginTop:'10px'}}>搜索</Button>
								</Form>
							</div>]:null}
    					</QueueAnim>
		    	        <div className="game_base_list_search_div_button_creategame">
		    				<Button type="primary" onClick={ this.screening } style={{marginTop:'20px'}}><Icon type="filter" />筛选</Button>
		    			</div>
	    	        </div>

	    	        <div className="game_base_list_search_div_table">
		    	        <Table bordered
				    		columns={ columns }
				    		rowSelection={ rowSelection }
				    		dataSource={ this.props.dataSource.length > 0 ? this.props.dataSource : [] }
							locale={{ emptyText:'暂无数据' }}
							scroll={{ x : 600 }}
				    		pagination={{
				    			pageSize: 20,
				    			total: this.props.dataPage && this.props.dataPage.resultCount,
				    			current:this.props.dataPage && this.props.dataPage.pageIndex + 1}}
			 					onChange={this.pageChange} />
	    	        </div>
    				<Modal
    					visible = { this.state.modifyGameModalVisible }
    					title = "修改微游戏"
    					width = "940"
    					onCancel = { this.modifyGameCancel }
    					closable = { false }
    					maskClosable = { false }
        				footer = { null } >
    						<iframe src = { this.state.gameModifyUrl } frameBorder="0" width="917" height="700" marginHeight="0" marginWidth="0" scrolling="auto"></iframe>
    				</Modal>
					<Modal
						visible = { this.state.addressUrlModalVisible }
						width = "335"
						maskClosable = { false }
						onCancel = { this.addressUrlClose }
						footer = { null } >
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
    				<Modal
    					visible = { this.state.gameShelvesModalVisible }
    					maskClosable = { false }
    					width = "335"
    					onCancel = { this.onCancelGameShelves }
    					footer = {[
    					    <Button key = "gameShelvesCancel" size = "large" onClick = { this.onCancelGameShelves }>取消</Button>,
       						<Button key = "gameShelvesConfirm" type = "primary" size = "large" onClick = { this.onConfirmGameShelves }>继续</Button>
       					]}
    				>
    					<p style = {{ marginTop : '40px', padding : '0 15px' }}>一个校区只能上架一个游戏，该校区其他游戏将自动下架，是否继续?</p>
    				</Modal>
    			</div>
    		);
		}
})

export default Form.create()(WxGamePageList);
