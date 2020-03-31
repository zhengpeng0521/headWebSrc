import React, { PropTypes } from 'react';
import { Modal, Button } from 'antd';

//富文本编辑器组件
const UeditorComponent = React.createClass({
	getInitialState() {
		return {

		}
	},

	previewOnOk(){

		let params = ueditorIframe.window.getUeditorHtml();
		this.props.onSubmit && this.props.onSubmit({
			...this.props.params,
			...params
		});

		this.props.changePreviewModalVisible && this.props.changePreviewModalVisible();

	},
	previewCancel(){
		this.props.changePreviewModalVisible && this.props.changePreviewModalVisible();
	},

	render(){
		let modalOpts = {
		    maskClosable : false,
		    visible : this.props.previewModalVisible,
		    closable : false,
		    width : 820,
		    onOk: this.previewOnOk,
		    onCancel : this.previewCancel,
		    footer : [
		    	<Button key="cancel" size="large" onClick={this.previewCancel}>取消</Button>,
	        	<Button key="submit" type="primary" size="large" onClick={ this.previewOnOk }>保存</Button>,
	    	],
  		};
		return (
			<Modal {...modalOpts}>
		    	<div>
		    		<iframe name="ueditorIframe" src = { this.props.previewUrl } frameBorder="0" width="780px" height="600px" marginHeight="0" marginWidth="0" scrolling="auto"></iframe>
		        </div>
		    </Modal>
		)
	}
});

export default UeditorComponent;
