/*
 * 	微游戏
 */
import React from 'react'
import { Modal, Button, Pagination, Select, message, Input , InputNumber } from 'antd';
const Search = Input.Search;
import QRCode from 'qrcode.react';
import moment from 'moment';
import './MicroGame.css';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import TenantOrgSelect from '../../common/tenant-org-filter/TenantOrgFilter';

const MicroGame = React.createClass({

	//初始化
	getInitialState() {
	    return {
			clientWidth             : '',          //获取当前屏宽
	    	orgListDataSource 	    : [], 		   //保存获取的机构列表数据
	    	organId 			    : '', 		   //记录当前选中的机构ID
	    	isShowOpenGameModal	    : false, 	   //是否显示开通游戏模态框
	    	isShowCreateGameModal   : false ,      //是否显示创建游戏模态框
	    	ishowReviewOrtryModal   : false,  	   //是否显示试玩或者预览
	    	ishowCustomModal        : false, 	   //个性化定制是否可见
	    	createGameUrl           : '',          //新增游戏URL
	    	currentItemDetail       : '',          //当前游戏详情
	    	addressUrl              : '',          //游戏试玩URL
	    	pageSize			    : 10,  		   //记录分页数量
	    	pageIndex			    : 0,  	       //记录分页码数
	    	currentSelectCampus	    : '', 		   //记录当前选中的校区id
	    	currentSelectCampusName : '',          //记录当前选中的校区名称
	    	acitvityList	        : [], 		   //获取游戏或者活动列表
	    	acitvityData	        : {}, 		   //获取游戏或者活动分页
	    	getSearchContent	    : '', 		   //获取搜索内容
	    }
	},
	//第一次进入调用
	componentWillMount() {
      let orgId = window._init_data.firstOrg&&window._init_data.firstOrg.key;
      let orgName = window._init_data.firstOrg&&window._init_data.firstOrg.label;
      this.setState({
          currentSelectCampus     : orgId,
          currentSelectCampusName : orgName,
          organId                 : orgId,
		  pageSize                : 4 * Math.floor( ( document.body.clientWidth - 290 ) / 250 ) || this.state.pageSize,
      });
      this.getGameList( this.state.pageIndex, orgId )
	},

	componentDidMount() {
		let self = this;

		window.addEventListener('message', function(e){
			if( e.data == 'close' ){
				self.createGameCancel();
			}else if( e.data == 'closeAndLink' ){
				self.createGameCancelAndRouter();
			}
        }, false );

	},

	//获取游戏列表
	getGameList( pageIndex, organId ) {
		this.requestData(
				{
				    pageSize 	: 4 * Math.floor( ( document.body.clientWidth - 290 ) / 250 ) || this.state.pageSize,
				    pageIndex 	: pageIndex || 0,
					orgId 	    : organId   || '',
				},
				BASE_URL + '/pmgame/query/tenantGame/list',
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
	selectChange(value, name) {
    this.setState({
			currentSelectCampus     : value,
			currentSelectCampusName : name,
			organId                 : value,
		});
		this.getGameList(this.state.pageIndex, value);
	},

	//游戏传创建或开通
	openGameCreate( item ) {
		let tenantId       = item.tenantId;
		let orgId          = item.orgId;
		let orgName        = this.state.currentSelectCampusName;
		let gameCode       = item.gameCode;
		let gameExpireTime = item.expireTime;
		let gameId         = item.gameId;
		let provider       = item.provider;

        let {btnType, expireTime} = item;
        let flg = btnType != 'OFF';
        if(flg) {
            flg = moment(expireTime, 'YYYY-MM-DD HH:mm:ss') > moment();
        }

		let createGameUrl = provider+'/page?m=create&tenantId='+tenantId+'&orgId=0&gameCode='+gameCode+'&gameId='+gameId;           //游戏创建URL

		if( this.state.currentSelectCampus ) { //判断是否选择校区
			if( item.orgId && item.tenantId && flg ) {  //判断是否开通状态
				//创建微游戏
				this.setState({
					isShowCreateGameModal : !this.state.isShowCreateGameModal,
					createGameUrl         : createGameUrl
				})
				window.wActivityTimer = setInterval(function(){
					serviceRequest(
						BASE_URL + '/organController/getTenant', {}
					)
				}, 600000 )
			} else {
				//开通微游戏
				this.setState({
					isShowOpenGameModal : !this.state.isShowOpenGameModal,
				})
			}
		} else {
			message.error('请选择校区');
			return false;
		};
	},

	//确认开通游戏
	gameConfirmOpen(){
		this.setState({
			isShowOpenGameModal : !this.state.isShowOpenGameModal,
		});
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
			createGameUrl         : ''
		})
	},
	//取消新增游戏
	createGameCancel(){
		this.setState({
			isShowCreateGameModal : ! this.state.isShowCreateGameModal,
			createGameUrl         : ''
		});
		clearInterval( window.wActivityTimer );
	},
	//关闭游戏和路由跳转
	createGameCancelAndRouter(){
		this.setState({
			isShowCreateGameModal : ! this.state.isShowCreateGameModal,
			createGameUrl         : ''
		});
		clearInterval( window.wActivityTimer );
		this.props.dispatch && this.props.dispatch(
			routerRedux.push('/scrm_wx_myscrm_list')
		)
	},

	//查看试玩二维码
	tryOrReview(item) {
		this.setState({
			ishowReviewOrtryModal : !this.state.ishowReviewOrtryModal,
			addressUrl            : item.demoUrl
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
			pageIndex : 0,
			pageSize  : this.state.pageSize,
			orgId     : this.state.currentSelectCampus
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
		    	let name = item.name;
		    	return <Option key = { 'gameOrgList_' + index } value = { item.id + '' } id={ item.id }>{ name }</Option>
		    });
		};

		if( self.state.acitvityList && self.state.acitvityList.length>0 ) {
			gameList = self.state.acitvityList.map(function (item, index) {
	        	let imageurl = 'url(' + item.icon +')';
				let delay = index * .1;
                let {btnType, expireTime} = item;
                let flg = btnType != 'OFF';
                if(flg) {
                    flg = moment(expireTime, 'YYYY-MM-DD HH:mm:ss') > moment();
                }
	        	return <div style = {{ animationDelay : delay + 's' }} key = { 'gameTemplate_' + index } className="gameOractivity_div">
							<div className="gameOractivity_div_img" style={{backgroundImage : imageurl, backgroundSize: 'contain', backgroundPosition: 'center'}}>
								<div className="game_general_use_number"></div>
								<p className="game_general_use_number_p_left">家机构已经创建<span className="game_general_use_number_p_right">{item.allUsers} </span></p>
							</div>
							<div className="gameOractivity_div_botton_div">
								<p className="gameOractivity_div_title">{item.gameTitle}</p>
								<p className="gameOractivity_div_sub_title">{item.gameIntro}</p>
								<Button className="gameOractivity_div_select_button"  type="primary"
								    	onClick={self.openGameCreate.bind(self,item)}>{ ( item.orgId && item.tenantId && flg ) ? '创建' : '开通' }</Button>
								<p className="gameOractivity_div_open_status">{ (item.orgId && item.tenantId && flg) ? '可使用' : '未开通' }</p>
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
						<TenantOrgSelect style={{marginLeft: '10px', width : '100%'}} value = { this.state.currentSelectCampus } onSelect = { this.selectChange } />
					</div>
					<div className="game_clearance"></div>
					<div className="game_general_game_acitity_list">
						{ gameList }
					</div>
					<p className="game_general_custom">没有找到合适的模板？试试<a onClick={self.touchCustom}>个性化定制</a>吧~</p>
					<div className="gameOractivity_div_pagesize_div">
	        			<Pagination
	        				current = { self.state.acitvityData.pageIndex + 1 }
	        				selectComponentClass = { Select }
	        				total = { self.state.acitvityData.resultCount }
	        				showTotal = { total => `共${total}条` }
	        				pageSize = { this.state.pageSize }
	        				onChange = { self.activityItemPageChange } />
        			</div>

        			<Modal
        				visible = { this.state.isShowCreateGameModal }
        				title = "新增微游戏"
        				width = "940"
        				onOk = { this.createGameOk }
        				onCancel = { this.createGameCancel }
        				maskClosable = { false }
        				className='micro_game_form_modal'
        				footer = { null } >
	        	         	<iframe src = { this.state.createGameUrl } frameBorder="0" width="917" height="100%" marginHeight="0" marginWidth="0" scrolling="auto" ></iframe>
        			</Modal>

	        		<Modal
	        			visible={self.state.ishowCustomModal}
			            title="个性定制"
			            width='600'
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
		                width = '335'
		                closable = { false }
		                onCancel = { self.tryOrReviewPoQrCodeCancel }
		                maskClosable = { false }
		                footer = {[<Button key="save" type="ghost" size="large" onClick={self.tryOrReviewPoQrCodeOk}>关闭</Button>]} >
                            <QRCode size = { 300 } value = { this.state.addressUrl } />
		            </Modal>

	        		<Modal
	        			visible={ self.state.isShowOpenGameModal }
		        		title = '游戏开通'
						width = "600"
						maskClosable = { false }
			            onCancel={ this.gameCancel }
			            onConfirm = { this.gameConfirmOpen }
			            maskClosable = { false }
	        		 	footer={[
	        	            <Button key = "back" type = "ghost" size = "large" onClick = { self.gameCancel }>取消</Button>,
	        	            <Button key = "confirmOpenGame" type = "primary" size = "large" onClick = { this.gameConfirmOpen } >确认</Button>
	        	         ]} >
	        				<p className="game_general_open_create_qr_code_title">您可以拨打400-660-5733进行游戏开通。</p>
			        </Modal>
    			</div>
    	);
    }
});

/*
 *	试玩二维码
 */
const ReviewGameAddressQr = React.createClass({

    getInitialState() {
		return {
		    qrcodeIsInit: false
		};
    },

    getQr(url) {
    	let element = document.getElementById('gameQrCode');
    	element.innerHTML = "";
    	if(!this.state.qrcodeIsInit) {
			var qrcode_modal = new QRCode(document.getElementById('gameQrCode'), {
			    width 	: 300,
			    height 	: 300
			});
			qrcode_modal.makeCode(url);
			this.setState({
				qrcodeIsInit : false
			});
		}
    },

    componentDidMount() {
		this.getQr(this.props.url);
    },

    componentWillReceiveProps(nextProps) {
		this.getQr(nextProps.url);
    },

    render() {
		return (
			 <div className="game_search_base_create_ui_div_po_qr_code_div">
			        <div className="qrcode-image" id = "gameQrCode" ></div>
			  	<p className="game_search_base_create_ui_div_po_qr_code_div_wx_title">请用微信扫一扫</p>
			 </div>
		 )
    }
});

function mapStateToProps({ microGameModel }) {
  return { microGameModel };
}

export default connect(mapStateToProps)(MicroGame);
