/**
 * 口碑
 * 选择门店窗口
 * @author yujq
 */
import React from 'react';
import Modal from 'antd/lib/modal';
import Card from 'antd/lib/card';

import './koubei-auth-validate-modal.less';

let KoubeiAuthValidateModal = React.createClass({
	getInitialState() {
		return {
			visible : false,
			qrcodeUrl : '', //二维码的url
			hrefUrl : '',//点击超链接的url
			qrcodeType : '',//二维码类型
			qrcodeInit : false,//二维码是否显示
		}
	},

	componentDidMount() {
		let me = this;
		serviceRequest(BASE_URL+'/systemController/queryAlipayBuyRecord', {signType : this.props.signType || '', funcKey: 'free-func'},
			function(ret) {

			}, function(ret) {
				let authStatus = ret.data.authStatus || '';
				let alipayAuthUrl = ret.data.alipayAuthUrl || '';
				me.changeVisible();
				me.makeCode(alipayAuthUrl);
				me.beginScanAuth();
				me.setState({
					qrcodeType : authStatus
				});
			}
		);
    },

	beginScanAuth() {
    	let me = this;
    	this.state.authTimer = setInterval(function(){
			me.scanAuth();
		},5000);
    },

    scanAuth() {
    	let me = this;
		serviceRequest(BASE_URL+'/systemController/queryAlipaySignState', {signType : this.props.signType || '', funcKey: 'free-func'},
			function(ret) {
				if(ret.data.signStatus == 'VALID') {
					clearInterval(me.state.authTimer);
					me.changeVisible();
				}
			}
		);
    },

	changeVisible() {
		this.setState({
			visible : !this.state.visible
		});
	},

	//制作二维码
	makeCode(url) {
		let me = this;
		let qrcode_modal_dom = document.getElementById("koubei_auth_validate_qrcode");
		qrcode_modal_dom.innerHTML;
		if(qrcode_modal_dom) {
			if(!me.state.qrcodeInit) {
				var qrcode_modal = new QRCode(qrcode_modal_dom, {
		            width : 400,//设置宽高
		            height : 400
		        });
				qrcode_modal.makeCode(url);
				me.setState({
					qrcodeUrl : url,
					hrefUrl   : url,
					qrcodeInit : true
				});
			}
		} else {
			setTimeout(function(){
				me.makeCode(url);
			}, 100);
		}

	},

	render() {

		return (
			<Modal
				visible={this.state.visible}
        		maskClosable={false}
				closable={false}
				width={435}
				onCancel={this.changeVisible.bind(this, undefined)}
				className="form-modal koubei-auth-validate-modal"
				footer={null}>

				<Card style={{ width: '100%' }} bodyStyle={{ padding: 0 }}>
					<div className="modal-content">
						<div className="qrcode-content">
							<div className="qrcode-image" id="koubei_auth_validate_qrcode"></div>
						</div>

						<div className="href-content">
							<a href={this.state.hrefUrl} target="_blank">{this.state.hrefUrl}</a>
						</div>
						<div className="qrcode-image-desc">
						{this.state.qrcodeType == '' || this.state.qrcodeType == 'UNBUY' ? '请用支付宝扫描上方二维码或者点击链接订阅口碑插件'
							: this.state.qrcodeType == 'AUTHED' ? '授权信息失效或者未签约,请用支付宝扫描上方二维码或者点击链接完成授权'
							: ''
						}
						</div>
					</div>
		        </Card>

		      </Modal>
		);
	}

});

export default KoubeiAuthValidateModal;
