/*
 * 	口碑微游戏
 */
import React from 'react'
import { Modal, Button, Pagination, Select, message, Input , InputNumber } from 'antd';
import KoubeiAuthValidateModal from '../koubei/common/KoubeiAuthValidateModal';
const Search = Input.Search;
import QRCode from 'qrcode.react';

const MicroGame = React.createClass({

	//初始化
	getInitialState() {
	    return {
	    	orgListDataSource 	: [], 			//保存获取的机构列表数据
	    	organId 			: '', 			//记录当前选中的机构ID
	    	isShowOpenGameModal	: false, 	    //是否显示开通游戏模态框
	    	isShowCreateGameModal : false ,     //是否显示创建游戏模态框
	    	ishowReviewOrtryModal : false,  	//是否显示试玩或者预览
	    	ishowCustomModal    : false, 		//个性化定制是否可见
	    	createGameUrl       : '',           //新增游戏URL
	    	currentItemDetail   : '',           //当前游戏详情
	    	addressUrl          : '',           //游戏试玩URL
	    	pageSize			: 12,  			//记录分页数量
	    	pageIndex			: 0,  			//记录分页码数
	    	currentSelectCampus	: '', 			//记录当前选中的校区id
	    	currentSelectCampusName : '',       //记录当前选中的校区名称
	    	acitvityList	    : [],    		//获取游戏或者活动列表
	    	acitvityData	    : {}, 			//获取游戏或者活动分页
	    	getSearchContent	: '', 			//获取搜索内容
	    	period              : '',           //时间
	    	unit                : '',           //单位 1 天 2 月 3 年 4 永远
	    	price               : '',           //价格
	    	gameTitle           : '',           //游戏名称
	    	getOpenTimeContent  : '',           //用户输入的时长

	    }
	},

	//第一次进入调用
	componentWillMount() {
		let self = this;
		//请求机构列表
		serviceRequest( BASE_URL + '/orderOrgController/shopOrgList', { commodityId : '201702200294330111'  },
			function(res) {
				if(res.results[0]){
					self.setState({
						orgListDataSource       : res.results,
						currentSelectCampus     : res.results[0].orgid + '',
						currentSelectCampusName : res.results[0].org_name,
					});
					//默认第一个校区,请求游戏列表
					let orgId = res.results[0].orgid;
					self.setState({
						organId : orgId
					})
					self.getGameList ( self.state.pageIndex , orgId )
				}
			},
    	);
	},

	componentDidMount() {

		let self = this;
		//关闭按钮,关闭模态框不进行数据提交与列表刷新
		window.gameIframeCloseAction = function(){
			self.createGameCancel();
		};

		//关闭iframe并执行刷新
		window.gameIframeCloseAndRefreshAction = function(){
			self.createGameCancel();
		};
	},
	//获取游戏列表
	getGameList( pageIndex, organId ) {
		this.requestData(
				{
				    pageSize 	: this.state.pageSize || 12,
				    pageIndex 	: pageIndex || 0,
					orgId 	    : organId   || '',
				},
				BASE_URL + '/pmgame/query/tenantKBGame/list',
		)
	},

	//数据请求
	requestData( paramter, url, type ) {
		let self = this;
		serviceRequest(
				url,
				paramter,
				function(res) {
					if(type) {
						self.setState({
							orgListDataSource 	: res.results,
						});
					} else {
						self.setState({
							acitvityList 	: res.results,
							acitvityData	: res.data,
						});
					}
				},

	    		function(fai) {
					message.error(fai.errorMessage);
	    		});
	},

	//选择校区
	selectChange(value, option) {
		this.setState({
			currentSelectCampus : value,
			currentSelectCampusName : option.props.children,
			organId : option.props.id,
		});
		this.getGameList( this.state.pageIndex, option.props.id );
	},

	//游戏传创建或开通
	openGameCreate( item ) {
		let currentTime = new Date();                 //获取当前时间
		let expireTime = new Date( item.expireTime ); //获取到期时间
		let tenantId = item.tenantId;
		let orgId = item.orgId;
		let orgName = this.state.currentSelectCampusName;
		let gameCode = item.gameCode;
		let gameExpireTime = item.expireTime;
		let gameId = item.gameId;
		let provider = item.provider;

		let createGameUrl = provider+'/page?m=create&tenantId='+tenantId+'&orgId='+orgId+'&gameCode='+gameCode+'&gameId='+gameId;           //游戏创建URL

		if( this.state.currentSelectCampus ) { //判断是否选择校区
			if( item.orgId && item.tenantId && expireTime > currentTime ) {  //判断是否开通状态
				//创建微游戏
				this.setState({
					isShowCreateGameModal : !this.state.isShowCreateGameModal,
					createGameUrl         : createGameUrl
				})
			} else {
				//开通微游戏

				this.setState({
					price               : item.price,
					unit                : item.unit,
					period              : item.period,
					gameTitle           : item.gameTitle,
					isShowOpenGameModal : !this.state.isShowOpenGameModal,
					currentGameId       : item.gameId,
				})
			}
		} else {
			message.error('请选择校区');
			return false;
		};
	},
	//得到用户输入的开通时长
	openTimeOnBlur( input ){
		this.setState({ getOpenTimeContent : input.target.value });
	},
	//确认开通游戏
	gameConfirmOpen(){
		let self = this;
		this.setState({
			isShowOpenGameModal : !this.state.isShowOpenGameModal,
		});
		let gameId = this.state.currentGameId;
		let orgId = this.state.currentSelectCampus;
		let unit = this.state.unit;
		let num;
		if( unit = '4' ){
			num = '1';
		} else{
			num = '12';
		}
		serviceRequest( BASE_URL + '/pmgame/purchase/create', { gameId : gameId, orgId : orgId, num : num },
				function(res) {
					let purchaseId = res.purchaseId;
					serviceRequest( BASE_URL + '/pmgame/purchase/pay', { purchaseId : purchaseId },
						function(res) {
							message.success('开通游戏成功')
							self.getGameList( self.state.pageIndex , self.state.organId );
						},
					);
				},
	    	);
	},

	//取消开通游戏
	gameCancel() {
		this.setState({
			isShowOpenGameModal : !this.state.isShowOpenGameModal,
		});
	},

	//确定新增游戏
	createGameOk(){
		this.setState({
			isShowCreateGameModal : ! this.state.isShowCreateGameModal,
			createGameUrl       : ''
		})
	},
	//取消新增游戏
	createGameCancel(){
		this.setState({
			isShowCreateGameModal : ! this.state.isShowCreateGameModal,
			createGameUrl       : ''
		})
	},

	//查看试玩二维码
	tryOrReview(item) {
		this.setState({
			ishowReviewOrtryModal : !this.state.ishowReviewOrtryModal,
			addressUrl : item.demoUrl
		})
	},

	//试玩取消
	tryOrReviewPoQrCodeCancel() {
		this.setState({ ishowReviewOrtryModal : !this.state.ishowReviewOrtryModal });
	},

	//试玩确定
	tryOrReviewPoQrCodeOk() {
		this.setState({ ishowReviewOrtryModal : !this.state.ishowReviewOrtryModal });
	},

	//搜索输入失去焦点
	onBlur( input ) {
		this.setState({ getSearchContent : input.target.value });
	},


	//进行搜索
	touchSearch() {
		let searchObj = {
			gameTitle : this.state.getSearchContent ,
			pageIndex : 0 ,
			pageSize : 12 ,
			orgId  : this.state.currentSelectCampus
		};
		if ( searchObj.gameTitle == undefined || searchObj.gameTitle == "" || searchObj.gameTitle == null ){
			delete searchObj.gameTitle
		}
		this.requestData( { ...searchObj }, BASE_URL + '/pmgame/query/tenantGame/list');
	},

	//分页改变
	activityItemPageChange(pagination, filters, sorter) {
		this.getGameList( pagination - 1 , this.state.organId );
	},

	//点击个性化定制
	touchCustom() {
		this.setState({
			ishowCustomModal : !this.state.ishowCustomModal
		});
	},

	//取消个性化定制框
    customCodeCancel() {
		this.setState({ ishowCustomModal : !this.state.ishowCustomModal });
	},


    render() {

		let self = this;


		let selectOptions = [];

		let gameList = [];      //游戏模板列表

		if( self.state.orgListDataSource && self.state.orgListDataSource.length>0 ) {
			selectOptions = self.state.orgListDataSource.map(function (item, index) {
		    	let name = item.org_name;
		    	return <Option key = { 'koubeiGameOrg_' + item.orgid } value = { item.orgid + '' } id={ item.orgid }>{ name }</Option>
		    });
		};

		if( self.state.acitvityList && self.state.acitvityList.length>0 ) {
			gameList = self.state.acitvityList.map(function (item, index) {
	        	let imageurl = 'url(' + item.icon +')';
	        	let expireTime = new Date(item.expireTime);     //获取游戏截止时间
				let currentTime = new Date();                   //获取当前时间
	        	return <div key = { 'koubeiGameTemplate_' + index } className="gameOractivity_div">
							<div className="gameOractivity_div_img" style={{backgroundImage : imageurl, backgroundSize: 'contain', backgroundPosition: 'center'}}>
								<div className="game_general_use_number"></div>
								<p className="game_general_use_number_p_left">个家长正在使用<p className="game_general_use_number_p_right">{item.allUsers} </p></p>
							</div>
							<div className="gameOractivity_div_botton_div">
								<p className="gameOractivity_div_title">{item.gameTitle}</p>
								<p className="gameOractivity_div_sub_title">{item.gameIntro}</p>
								<Button className="gameOractivity_div_select_button"  type="primary"
								    	onClick={self.openGameCreate.bind(self,item)}>{ ( item.orgId && item.tenantId && expireTime > currentTime ) ? '创建' : '开通' }</Button>
								<p className="gameOractivity_div_open_status">{ (item.orgId && item.tenantId && expireTime > currentTime) ? '可使用' : '未开通' }</p>
							</div>
							<div className = 'codeModal' >
								<div className = 'codeUrl' >
									{ item.demoUrl == '' || item.demoUrl == null || item.demoUrl == undefined ?
										<p style={{ height : '200px', width : '200px', lineHeight : '200px', textAlign : 'center', fontSize:'16px' }}>无二维码</p>
										:
										<div>
											<QRCode size = { 190 } value = { item.demoUrl } />
											<p style = {{ fontWeight : 'bold' }} >微信扫码预览</p>
										</div>
									}
								</div>
							</div>
						</div>
		    	});
		};

    	return (
    			<div className="game_general_base">
					<p className="game_general_select_org_title"><span className="must-input">请选择校区：</span></p>
    				<Button type="ghost" shape="circle" icon="search" onClick={ this.touchSearch }/>
    				<Input onBlur={ this.onBlur }></Input>
	    			<div className="game_general_select_org">
						<Select
							style={{marginLeft: '10px', width : '100%'}}
							placeholder="选择校区"
							value={ self.state.currentSelectCampus }
							onSelect={ self.selectChange } >
								{ selectOptions }
						</Select>
					</div>
					<div className="game_clearance"></div>
					<div className="game_general_game_acitity_list">
						{ gameList }
					</div>
					<p className="game_general_custom">没有找到合适的模板？试试<a onClick={self.touchCustom}>个性化定制</a>吧~</p>
					<div className="gameOractivity_div_pagesize_div">
	        			<Pagination
	        				current={self.state.acitvityData.pageIndex + 1}
	        				selectComponentClass={Select}
	        				total={self.state.acitvityData.resultCount}
	        				showTotal={total => `共${total}条`}
	        				pageSize={ 12 } defaultCurrent={1}
	        				onChange={self.activityItemPageChange} />
        			</div>

        			<Modal
        				visible = { this.state.isShowCreateGameModal }
        				title = "新增微游戏"
        				width = "940px"
        				onOk = { this.createGameOk }
        				closable = { false }
        				onCancel = { this.createGameCancel }
        				maskClosable = { false }
        				footer = { null } >
	        	         	<iframe src = { this.state.createGameUrl } frameBorder="0" width="917" height="700" marginHeight="0" marginWidth="0" scrolling="auto"></iframe>
        			</Modal>

	        		<Modal
	        			visible={self.state.ishowCustomModal}
			            title="个性定制"
			            width='600px'
			            onOk={self.customCodeOk}
			            onCancel={self.customCodeCancel}
			            maskClosable = { false }
	        		 	footer={[
	        	            <Button key="back" type="ghost" size="large" onClick={self.customCodeCancel}>确定</Button>
	        	         ]}>
					  		<p className="game_general_open_create_qr_code_title">您可以拨打400-660-5733进行个性化定制。</p>
			        </Modal>

			        <Modal
		            	visible = {self.state.ishowReviewOrtryModal}
		                width = '335px'
		                closable = { false }
		                onCancel = { self.tryOrReviewPoQrCodeCancel }
		                maskClosable = { false }
		                footer = {[<Button key="save" type="ghost" size="large" onClick={self.tryOrReviewPoQrCodeOk}>关闭</Button>]} >
		                	<QRCode size = { 300 } value = { self.state.addressUrl } />
		            </Modal>

	        		<Modal
	        			visible={ self.state.isShowOpenGameModal }
		        		title = '游戏开通'
						width = "400px"
						maskClosable = { false }
			            onCancel={ this.gameCancel }
			            onConfirm = { this.gameConfirmOpen }
			            maskClosable = { false }
	        		 	footer={[
	        	            <Button key = "back" type = "ghost" size = "large" onClick = { self.gameCancel }>取消</Button>,
	        	            <Button key = "confirmOpenGame" type = "primary" size = "large" onClick = { this.gameConfirmOpen } >确认</Button>
	        	         ]} >
	        				<p style = {{ textAlign : 'center', marginBottom : '10px' , fontSize : '16px' }}>
	        					您即将为<span style = {{ color : '#009DD9'}}>{ this.state.currentSelectCampusName }</span>开通<span style = {{ color : '#009DD9'}}> { this.state.gameTitle }</span>
	        				</p>
	        				<p style = {{ textAlign : 'center' , marginBottom : '5px' }}><span>价格 : </span>{ this.state.price }元 / { this.state.unit == '1' ? '天'
	        																									   : this.state.unit == '2' ? '月'
	        																									   : this.state.unit == '3' ? '年'
	        																											   : '永久' } </p>
	        				{ this.state.unit == '4' ? null : <p style = {{ textAlign : 'center' }}> 开通时长 : <Input disabled onBlur = { this.openTimeOnBlur } style = {{ width : '50px' }} value = '12' /> {  this.state.unit == '1' ? '天'
		   																														: this.state.unit == '2' ? '月'
		   																														: this.state.unit == '3' ? '年'
		   																														: '永久' }</p> }

			        </Modal>
                    <KoubeiAuthValidateModal signType="3" />
    			</div>
    	);
    }
});

export default MicroGame;
