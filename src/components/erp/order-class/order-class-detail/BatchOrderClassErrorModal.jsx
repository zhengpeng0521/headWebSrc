import React from 'react';
import { Form, Modal, Button, Select, message, Radio, Popover, Icon } from 'antd';
import styles from './BatchOrderErrorModal.less';
import moment from 'moment';

function BatchOrderErrorModal({
	batchOrderErrorModalVisible,
	batchOrderErrorArrs,
	batchOrderLabel,

	closeBatchOrderClassErrorModal
}){
	let keys = Object.keys( batchOrderErrorArrs );
	return(
       <Modal
		    className = 'batch_order_error_modal'
            visible = { batchOrderErrorModalVisible }
            title = '预约异常提示'
            maskClosable = { false }
            width = '550px'
            onCancel = { closeBatchOrderClassErrorModal }
            footer = {[
				<Button style = {{ marginLeft : '10px' }} key = "confirm_batch_order_error_action" type = "primary" onClick = { closeBatchOrderClassErrorModal } >我知道了</Button>
			]}
        >
			<p className = { styles.batch_order_error_label } >{ batchOrderLabel }</p>
       		{ keys.map( function( item, index ){
				let arrs = batchOrderErrorArrs[item];
				return (
					<div key = { 'batch_order_class_error_' + index } >
						<p style = {{ fontSize : '14px' }} >{ item }</p>
						{
							arrs && arrs.map(function( item, index ){
								return <p key = { 'batch_order_class_item_error_' + index } className = { styles.batch_order_error_value } >{ item }</p>
							})
						}
					</div>

				)
			})}
        </Modal>
	)
};

export default Form.create({})(BatchOrderErrorModal);
