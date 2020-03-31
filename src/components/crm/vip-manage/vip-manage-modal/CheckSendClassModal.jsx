import React from 'react';
import { Modal, Button } from 'antd';
import styles from './CheckSendClassModal.less';

function CheckSendClassModal({
	chechClassVisible,
	selectedRowKeys,

	checkClassBtnLoading,
	checkClassBtnFailLoading,

	/*方法*/
	confirmSendClass,
	cancelSendClass,
	closeSendClass

}){
	return (
		<Modal
			className = 'operation_modal'
			visible = { chechClassVisible }
			title = '审核赠课'
			onOk = { confirmSendClass }
			onCancel = { closeSendClass }
			width = '400px'
			maskClosable = { false }
          	footer = {[
				<Button key = 'send_class_cancel' onClick={ cancelSendClass } disabled = { checkClassBtnFailLoading } loading = { checkClassBtnFailLoading } >不通过</Button>,
				<Button
					style = {{ marginLeft : '20px' }}
					key = 'send_class_confirm'
					type = 'primary'
					onClick = { confirmSendClass }
					disabled = { checkClassBtnLoading }
					loading  = { checkClassBtnLoading }
					>通过</Button>
			]}
		>
			请审核已选中的{ !!selectedRowKeys && selectedRowKeys.length }条信息
		</Modal>
	)
}

export default CheckSendClassModal;
