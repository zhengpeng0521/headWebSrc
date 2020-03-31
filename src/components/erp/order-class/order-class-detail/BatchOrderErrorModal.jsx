import React from 'react';
import { Form, Modal, Button, Select, message, Radio, Popover, Icon } from 'antd';
import styles from './BatchOrderErrorModal.less';
import moment from 'moment';

function BatchOrderErrorModal({
	onceOrderErrorModalVisible,
	onceOrderErrorArrs,
	onceOrderLabel,

	closeBatchOrderErrorModal
}){
	let keys = Object.keys( onceOrderErrorArrs );
	return(
       <Modal
		    className = 'batch_order_error_modal'
            visible = { onceOrderErrorModalVisible }
            title = '预约异常提示'
            maskClosable = { false }
            width = '550px'
            onCancel = { closeBatchOrderErrorModal }
            footer = {[
				<Button style = {{ marginLeft : '10px' }} key = "confirm_batch_order_error_action" type = "primary" onClick = { closeBatchOrderErrorModal } >我知道了</Button>
			]}
        >
        	<p className = { styles.batch_order_error_label } >{ onceOrderLabel }</p>
       		{ keys.map( function( item, index ){
				let arrs = onceOrderErrorArrs[item];
				return (
					<div key = { 'batch_order_class_error_' + index } >
						<p style = {{ fontSize : '14px' }} >{ item }</p>
						{
							arrs && arrs.map(function( item, index ){
								return <p key = { 'batch_order_error_' + index } className = { styles.batch_order_error_value } >{ item }</p>
							})
						}
					</div>

				)
			})}
        </Modal>
	)
};

export default Form.create({})(BatchOrderErrorModal);
