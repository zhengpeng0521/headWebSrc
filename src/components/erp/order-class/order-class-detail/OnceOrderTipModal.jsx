import React from 'react';
import { Form, Modal, Button, Select, message, Radio } from 'antd';
const RadioGroup = Radio.Group;
import styles from './OnceOrderTipModal.less';
import moment from 'moment';

function OnceOrderTipModal({
	OnceOrderTipModalVisible,
	clsName,
	clsId,
	currentItem,

	confirmOrderTipModal,
	closeOrderTipModal,

}){
	let maxNum = !!currentItem && currentItem.maxNum;
	return(
       <Modal
		    className = 'once_order_tip_modal'
            visible = { OnceOrderTipModalVisible }
            title = '预约提示'
            maskClosable = { false }
            width = '400px'
            onCancel = { closeOrderTipModal }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { closeOrderTipModal } >取消</Button>,
				<Button style = {{ marginLeft : '10px' }} key = "confirmAddFollowUpRecordAction" type = "primary" onClick = { () => confirmOrderTipModal( clsId ) } >继续约课</Button>
			]}
        >
			<div className = { styles.cls_name }>{ clsName }</div>
			<div className = { styles.cls_tips_content }>{ '班级预约将超出排课最大人数' + maxNum + '人' }</div>
        </Modal>
	)
};

export default Form.create({})(OnceOrderTipModal);
