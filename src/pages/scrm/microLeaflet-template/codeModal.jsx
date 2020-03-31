import React from 'react';
import { Modal , Button , Card } from 'antd';
import QRCode from 'qrcode.react';

let CodeModal = React.createClass({

	onConfirmCodeModal(){
		this.props.onConfirmCodeModal();
	},
	render(){
		return (
			<Modal 	visible = { this.props.codeModalVisible }
			       	onOk = { this.props.onConfirmCodeModal }
					key='code_modal_qrcode_activite'
			       	closable = { false }
				   	maskClosable = { false }
			       	width={ 335 }
					footer = {[ <Button key='btn_1' type="ghost" size="large" onClick={ this.onConfirmCodeModal }>关闭</Button>]}>
				<Card style={{ width: '100%' }} bodyStyle={{ padding: 0 }} key='modal_content_card'>
					<div className="modal-content">
						{ !!this.props.url && <QRCode size = { 300 } value = { this.props.url } /> }
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
