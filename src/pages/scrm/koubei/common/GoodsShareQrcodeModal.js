/**
 * 口碑
 * 商品分享的二维码窗口
 * @author yujq
 */
import React from 'react';
import {Modal,Button,message,Select,} from 'antd';

let Option = Select.Option;

import './css/koubei-goods-share-qrcode.css';

let GoodsShareQrcodeModal = React.createClass({

	getInitialState() {
		return {
			koubei_org_list : [], //门店列表
			goods_org_list : [],//商品的机构列表
			currentOrgShopId : undefined,
		}
	},

	componentDidMount() {
		let me = this;
		serviceRequest(BASE_URL+'/orderOrgController/shopList', {funcKey: 'free-func' , commodityId : this.props.commodityId || '201610200194070711' },
			function(ret) {
				me.setState({
					koubei_org_list : ret.results
				});
			}
		);
    },

	componentWillReceiveProps(nextProps) {
    	if(this.props.visible != nextProps.visible && nextProps.visible) {
    		let me = this;
    		let goodsDetailUrl = '';
    		let goodsData = nextProps.goodsData || {};
    		if('1' == goodsData.goodsType) {
    			goodsDetailUrl = BASE_URL+"/orderGoodController/getCourseById";
    		} else if('2' == goodsData.goodsType) {
    			goodsDetailUrl = BASE_URL+"/orderGoodController/getActivityById";
    		} else {
    			message.error('商品类型不正确');
    			return;
    		}
			serviceRequest(goodsDetailUrl,{'goodsId' : goodsData.id, funcKey: 'free-func'},
				function(ret) {
					let goodsOrgList = ret.data.orgIds || [];
					let goods_org_list = [];

					me.state.koubei_org_list && me.state.koubei_org_list.length > 0 && me.state.koubei_org_list.map(function(item) {
						if(item.mark == 'shop') {
							goodsOrgList && goodsOrgList.length > 0 && goodsOrgList.map(function(item_one) {
								if(item_one == item.key) {
									goods_org_list.push({
										shop_id : item.shop_id,
										org_id : item.key,
										org_name : item.label,
									});
								}
							});
						}

						if(item.children && item.children.length > 0) {
							item.children.map(function(item_two) {
								if(item_two.mark == 'shop') {
									goodsOrgList && goodsOrgList.length > 0 && goodsOrgList.map(function(item_three) {
										if(item_three == item_two.key) {
											goods_org_list.push({
												shop_id : item_two.shop_id,
												org_id : item_two.key,
												org_name : item_two.label,
											});
										}
									});
								}
							});
						}
					});
					me.setState({
						goods_org_list,
						currentOrgShopId : undefined,
					});
					let qrcode_modal_dom = document.getElementById("koubei_goods_share_qrcode_img");
					if(qrcode_modal_dom) {
						$('#koubei_goods_share_qrcode_cont #koubei_goods_share_qrcode_img').remove();
			    		$('#koubei_goods_share_qrcode_cont').append('<div id="koubei_goods_share_qrcode_img"></div>');
					}
				}, function(ret) {
					message.error(ret.errorMessage || '操作出错啦');
				}
			);
    	}
    },

	//门店切换时
	orgSelectChange(shopId) {
    	if(shopId) {
    		this.setState({
        		currentOrgShopId : shopId
        	});

        	let me = this;

    		$('#koubei_goods_share_qrcode_cont #koubei_goods_share_qrcode_img').remove();
    		$('#koubei_goods_share_qrcode_cont').append('<div id="koubei_goods_share_qrcode_img"></div>');

    		let qrcode_modal_dom = document.getElementById("koubei_goods_share_qrcode_img");

    		if(qrcode_modal_dom) {
    			let qrcode_modal = new QRCode(qrcode_modal_dom, {
    	            width : 300,//设置宽高
    	            height : 300
    	        });

    			let goodsData = this.props.goodsData || {};
    			let goods_share_url = OMP_ORG + '/koubei/h5/goodsShare?merchantPid=' + goodsData.merchantPid + '&shopId=' + shopId + '&goodsId=' + goodsData.id;

    			qrcode_modal.makeCode(goods_share_url);
    		}
    	}
    },

	render() {

    	let loopGoodsOrgOptions = data => data.map((item) => {
    		return (<Option key={item.shop_id} value={item.shop_id}>{item.org_name}</Option>);
    	});

    	return (
			<Modal
				title="口碑商品分享"
				visible={this.props.visible}
        		maskClosable={false}
				closable={true}
				width={432}
				onCancel={this.props.closeMoodal}
				className="form-modal koubei-goods-share-qrcode-modal"
				footer={[<Button key="cancle" type="ghost" size="large" onClick={this.props.closeMoodal}> 取 消 </Button>]}>

			<div className="koubei-goods-share-qrcode-cont">
				<div className="org-select-cont">
					<p style={{float:'left',fontSize:'14px',color:'#999', marginBottom : '8px'}}>分享门店选择(分享出去产生的订单会属于此门店)</p>
					<Select
					    showSearch
					    style={{ width: '100%' }}
					    placeholder="请选择一个门店"
					    optionFilterProp="children"
					    onChange={this.orgSelectChange}
						value={this.state.currentOrgShopId}
					  >
					    {loopGoodsOrgOptions(this.state.goods_org_list)}
				    </Select>
				</div>
		    		<div className="share-qrcode-cont" style={{margin : '0 auto', 'marginTop' : '16px', textAlign : 'center' }}>
			    		<div style={{width : '300px', margin : '0 auto'}} id="koubei_goods_share_qrcode_cont"><div id="koubei_goods_share_qrcode_img"></div></div>
			    	</div>
			    	{this.state.currentOrgShopId ?
			    	<p style={{float:'left',fontSize:'14px',color:'#999', width : '100%', textAlign : 'center', marginTop : '8px', marginBottom : '8px'}}>请使用微信扫描</p>
			    	: null}
			</div>

			</Modal>
		);
    },

});

export default GoodsShareQrcodeModal;
