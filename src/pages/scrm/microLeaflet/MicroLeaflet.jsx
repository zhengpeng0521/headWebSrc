/*
 * 	1.微传单 (未修改完成文件)
 */
import React from 'react'
import { connect } from 'dva';
import { Modal, Button, Pagination, Select, message, Input } from 'antd';
const Search = Input.Search;
import TemplateInstanceForm from '../microLeaflet-template/template-microLeaflet-instance-form';
import TenantOrgSelect from '../../common/tenant-org-filter/TenantOrgFilter';
import CodeModal from '../microLeaflet-template/codeModal';
import QRCode from 'qrcode.react';
import './MicroLeaflet.css';

import Template from '../wx-template/WxTemplatePage';


const MicroLeaflet = React.createClass({

	//初始化
	getInitialState() {
	    return {
	    	orgListDataSource 	       : [], 		//保存获取的机构列表数据
	    	organId 			       : '', 		//记录当前选中的机构ID
	    	pageSize			       : 10,  		//记录分页数量
	    	pageIndex			       : 0,  		//记录分页码数
	    	currentSelectCampus	       : '', 		//记录当前选中的校区
	    	currentSelectCampusName    : '',        //记录当前选中校区名称
	    	ishowOpenActivityModal	   : false, 	//是否显示开通活动
	    	acitvityList	           : [], 		//获取传单列表
	    	acitvityData	           : {}, 		//获取传单分页
	    	getInuputPhone		       : '',		//获取输入电话
	    	currentInterfaceQr         : '', 		//当前点击的二维码
	    	ishowReviewOrtryModal      : false,     //是否显示试玩或者预览
	    	ishowCustomModal           : false, 	//是否显示试玩或者预览
	    	getSearchContent	       : '', 		//获取搜索内容
	    	activityFormVisible        : false, 	//创建微活动实例
	    	activityTypeId             : "",        //微传单实例id
	    	activityCode               : "",		//微传单实例编码
	    	codeModalVisible           : false,     //二维码模态框
            codeUrl                    : '',        //实例二维码
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
      this.getActivityList( this.state.pageIndex, orgId )
	},

	//获取活动列表
	getActivityList(pageIndex, organId) {
		this.requestData(
				{
				    pageSize 	: 4 * Math.floor( ( document.body.clientWidth - 290 ) / 250 ) || this.state.pageSize,
				    pageIndex 	: pageIndex || 0,
					organId 	: organId || 0,
				},
				BASE_URL + '/microActivity/getLeafletList',
		)
	},

	//数据请求
	requestData(paramter, url, type) {

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
		this.getActivityList(this.state.pageIndex, value);
	},

	//查看预览二维码
	tryOrReview(item) {
		this.setState({currentInterfaceQr : item.previewurl, ishowReviewOrtryModal : !this.state.ishowReviewOrtryModal});
	},

	//分页改变
	activityItemPageChange(pagination, filters, sorter) {
		this.getActivityList(pagination - 1, this.state.organId);
	},

	//获取用户输入的手机号码
	inputPhone(p) {
		this.setState({getInuputPhone : p.target.value});
	},

	//预览取消
	tryOrReviewPoQrCodeCancel() {
		this.setState({ishowReviewOrtryModal : !this.state.ishowReviewOrtryModal});
	},

	//预览确定
	tryOrReviewPoQrCodeOk() {
		this.setState({ishowReviewOrtryModal : !this.state.ishowReviewOrtryModal});
	},

	//传单创建
	openActivityOrCreate( item ) {
		if(this.state.currentSelectCampusName.length > 0) { //判断是否选择校区
			if(item.isopen == 0) {  					//判断是否开通状态
				this.setState({ishowOpenActivityModal : !this.state.ishowOpenActivityModal});
			} else {
//				//传单创建页面跳转
//				this.setState({
//					activityFormVisible : true,
//					activityTypeId : item.id,
//					activityCode : item.code,
//				});
//				serviceRequest(
//					BASE_URL+"/microActivity/getActivity",
//					{ id : item.id }
//				);
//				window.wActivityTimer = setInterval(function(){
//					serviceRequest(
//						BASE_URL + '/organController/getTenant', {}
//					)
//				}, 600000 )


				this.props.dispatch({
					type : 'wx_template/updateState',
					payload : {
						activityFormVisible : true,
						title : '',
					}
				})
			}
		} else {
			message.error('请选择校区');
			return false;
		};
	},

	//取消开通
	activityCancel() {
		this.setState({getInuputPhone : '', ishowOpenActivityModal : !this.state.ishowOpenActivityModal});
	},

	//点击个性化定制
	touchCustom() {
		this.setState({ishowCustomModal : !this.state.ishowCustomModal});
	},
    customCodeCancel() {
		this.setState({getInuputPhone : '', ishowCustomModal : !this.state.ishowCustomModal});
	},
	customCodeOk() {
		if(this.state.getInuputPhone != '') {let reg = /^0?1[3|4|5|8][0-9]\d{8}$/;if (reg.test(this.state.getInuputPhone)) {this.setState({ishowCustomModal : !this.state.ishowCustomModal});} else {message.error("请输入正确的手机号码");return;}} else {message.error('请输入手机号码');}
		this.setState({getInuputPhone : ''});
	},

	//搜索输入失去焦点
	onBlur(input) {
		this.setState({getSearchContent : input.target.value});
	},
	//进行搜索
	touchSearch() {
		this.requestData({activityName : this.state.getSearchContent}, BASE_URL + '/microActivity/getActivityList');
	},

	//关闭创建微活动
	changeTempletInstanceFormVisible(){
		this.setState({
			activityFormVisible : !this.state.activityFormVisible,
		})
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
			activityFormVisible : !this.state.activityFormVisible,
		})
	},

	//传递二维码地址
	diliverCode( url ){
        this.setState({
            codeUrl : url
        })
	},

    render() {
		let self = this;
		let selectOptions = [];
		let acitityList = [];
		if(self.state.orgListDataSource&&self.state.orgListDataSource.length>0) {
			selectOptions = self.state.orgListDataSource.map(function (item, index) {
		    	return <Option key = { 'leafletList_' + index } value = { item.id  + '' } id = { item.id }>{ item.name }</Option>
		    });
		};

		if(self.state.acitvityList&&self.state.acitvityList.length>0) {
			acitityList = self.state.acitvityList.map(function (item, index) {
	        	let imageurl = 'url(' + item.icon +')';
				let delay = index * .1;
	        	return <div style = {{ animationDelay : delay + 's' }} key = { 'leafletTemplate_' + index } className = 'gameOractivity_div' >
							<div className="gameOractivity_div_img" style={{backgroundImage : imageurl, backgroundSize: 'contain', backgroundPosition: 'center'}}>
								<div className="game_general_use_number"></div>
								<p className="game_general_use_number_p_left">家机构已经创建<span className="game_general_use_number_p_right">{item.views} </span></p>
							</div>
							<div className="gameOractivity_div_botton_div">
								<p className="gameOractivity_div_title">{item.title}</p>
								<p className="gameOractivity_div_sub_title">{item.intro}</p>
								<Button className="gameOractivity_div_select_button"  type="primary"
								    	onClick={self.openActivityOrCreate.bind(self,item)}>{item.isopen == 1 ? '创建' : '开通'}</Button>
								<p className="gameOractivity_div_open_status">{item.isopen == '1' ? '可使用' : '未开通'}</p>
							</div>
							<div className = 'codeModal' >
								<div className = 'codeUrl' >
									{ item.previewurl == '' || item.previewurl == null || item.previewurl == undefined ?
										<p style={{ height : '200px', width : '200px', lineHeight : '200px', textAlign : 'center', fontSize:'16px' }}>无二维码</p>
										:
										<div>
											<QRCode size = { 190 } value = { item.previewurl } />
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
	    			<div className="game_general_select_org">
						<TenantOrgSelect style={{marginLeft: '10px', width : '100%'}} value = { this.state.currentSelectCampus } onSelect = { this.selectChange } />
					</div>
					<div className="game_clearance"></div>
					<div className="game_general_game_acitity_list">
						{acitityList}
					</div>
					<p className="game_general_custom">没有找到合适的模板？试试<a onClick={self.touchCustom}>个性化定制</a>吧~</p>
					<div className="gameOractivity_div_pagesize_div">
	        			<Pagination
	        				current = { self.state.acitvityData.pageIndex + 1 }
	        				selectComponentClass = { Select }
	        				total = { self.state.acitvityData.resultCount }
	        				showTotal = { total => `共${total}条` }
	        				pageSize = { this.state.pageSize }
	        				onChange = { self.activityItemPageChange }
	        			/>
        			</div>
	        		<Modal
	        			visible={self.state.ishowOpenActivityModal}
			            title="传单开通"
			            width='600'
			            onCancel={self.activityCancel}
	        		 	footer={[
	        	            <Button key="back" type="ghost" size="large" onClick={self.activityCancel}>取消</Button>
	        	         ]}>

						 	<div>
						  		<p className="game_general_open_create_qr_code_title">只需开通高级SCRM功能(1499元/年),即可免费使用全部模板。</p>
						  		<p className="game_general_open_create_qr_code_title">您可以拨打400-660-5733在线升级</p>
						  	</div>
			        </Modal>
	        		<Modal
	        			visible={self.state.ishowCustomModal}
			            title="个性定制"
			            width='600'
			            maskClosable = { false }
			            onOk={self.customCodeOk}
			            onCancel={self.customCodeCancel}
	        		 	footer={[
	        	            <Button key="back" type="ghost" size="large" onClick={self.customCodeCancel}>取消</Button>
	        	         ]}>

						 	<div>
						  		<p className="game_general_open_create_qr_code_title">您可以拨打400-660-5733进行个性化定制。</p>
						  	</div>
			        </Modal>
			        <Modal
		            	visible={self.state.ishowReviewOrtryModal}
				        closable = { false }
						width = "335"
						maskClosable = { false }
		                onCancel={self.tryOrReviewPoQrCodeCancel}
		                footer={[<Button key="save" type="ghost" size="large" onClick={self.tryOrReviewPoQrCodeOk}>关闭</Button>]}>
		                  <QRCode size = { 300 } value = { self.state.currentInterfaceQr } />
		            </Modal>

					<TemplateInstanceForm title={'新建微传单'}
										  formVisible = {this.state.activityFormVisible}
					                      changeTempletInstanceFormVisible={this.changeTempletInstanceFormVisible}
					                      activityTypeId= {this.state.activityTypeId}
					                      activityCode = { this.state.activityCode }
					                      organId = { this.state.organId }
					                      changeCodeModalVisible = { this.changeCodeModalVisible }
					                      diliverCode = { this.diliverCode }
					                      currentSelectCampus = { this.state.currentSelectCampusName } />

					<Template title="新建微传单" />
					<CodeModal url = { this.state.codeUrl } codeModalVisible = { this.state.codeModalVisible }
					            onConfirmCodeModal = { this.onConfirmCodeModal } />
    			</div>
    	);
    }
});

function mapStateToProps ({ wx_template }){
	return { wx_template };
};

export default connect( mapStateToProps )( MicroLeaflet );
