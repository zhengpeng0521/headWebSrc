import React from 'react';
import { Modal , Button , Card } from 'antd';
import QRCode from 'qrcode.react';

let CodeModal = React.createClass({

	onConfirmCodeModal(){
		this.props.onConfirmCodeModal();
		let qrcode_modal_dom = document.getElementById("koubei_auth_validate_qrcode");
		qrcode_modal_dom.innerHTML = "";
	},
	render(){
		return (
			<Modal visible = { this.props.codeModalVisible }
			       onOk = { this.props.onConfirmCodeModal }
			       closable = { false }
				   maskClosable = { false }
			       width={ 335 }
			       footer = {[ <Button type="ghost" key='code_modal_btn_key' size="large" onClick={ this.onConfirmCodeModal }>关闭</Button>]}>
			       		<Card style={{ width: '100%' }} bodyStyle={{ padding: 0 }}>
							<div className="modal-content">

								{!!this.props.url && <QRCode size = { 300 } value = { this.props.url } />}
								<div className="qrcode-image-desc" style={{ marginTop : '20px' , textAlign : 'center' }}>
									请用微信扫一扫
								</div>
							</div>
				        </Card>
			</Modal>
		)
	}
});

export default CodeModal;
