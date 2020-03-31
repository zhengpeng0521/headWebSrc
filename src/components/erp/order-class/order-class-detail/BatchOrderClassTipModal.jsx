import React from 'react';
import { Form, Modal, Button, Select, message, Radio, Popover, Icon } from 'antd';
import BatchOrderClassTipComponent from '../../../common/new-component/manager-list/ManagerList';
const RadioGroup = Radio.Group;
import styles from './BatchOrderClassTipModal.less';
import moment from 'moment';

function BatchOrderClassTipModal({
	batchOrderClassTipModalVisible,
	currentItem,
	selectedRows,              //所选的课程列表
	batchClsName,

	closeBatchOrderTipModal,
	batchOrderClassArrs,
}){
	let totalNum = selectedRows.length;
	let failNum = batchOrderClassArrs.length;
	let successNum = totalNum - failNum;
	let batchOrderClassTipComponentProps = {
		table : {
			height         : document.body.clientHeight - 250,
            loading        : false,
            dataSource     : batchOrderClassArrs,
			NullDataHeight : 200,
            columns : [
                {
					dataIndex : 'studyDate',
					key       : 'studyDate',
					title     : '日期',
					width     : 132,
					render    : ( text, record ) => (
						<span>{ record.studyDate + '(' + record.weekDay + ')' }</span>
					)
				},{
					dataIndex : 'time',
					key       : 'time',
					title     : '时间段',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { record.startTime + '~' + record.endTime } trigger = 'hover' >
							{ record.startTime + '~' + record.endTime }
						</Popover>
					)
				},{
					dataIndex : 'courseName',
					key       : 'courseName',
					title     : '课程名称',
					width     : 91,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'mtNames',
					key       : 'mtNames',
					title     : '主教',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'atNames',
					key       : 'atNames',
					title     : '助教',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'roomName',
					key       : 'roomName',
					title     : '教室',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'errorTips',
					key       : 'errorTips',
					title     : '错误提示',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							<span style = {{ color : 'red' }}>{ text || '' }</span>
						</Popover>
					)
				}
            ],
         }
	}

	return(
       <Modal
		    className = 'batch_order_tip_modal'
            visible = { batchOrderClassTipModalVisible }
            title = '约课冲突'
            maskClosable = { false }
            width = '1000px'
            onCancel = { closeBatchOrderTipModal }
            footer = {[
				<Button style = {{ marginLeft : '10px' }} key = "confirmAddFollowUpRecordAction" type = "primary" onClick = { closeBatchOrderTipModal } >我知道了</Button>
			]}
        >
			<div className = { styles.batch_order_class_tip_text }>{ '[' + batchClsName + ']' + '预约成功' + successNum + '次课程, ' + failNum + '次失败' }</div>
			<div className = { styles.batch_order_class_tip_text } style = {{ marginBottom : '10px' }} >失败情况如下 : </div>
			<div className = { styles.batch_order_class_tip_list }>
				<BatchOrderClassTipComponent { ...batchOrderClassTipComponentProps } />
			</div>
        </Modal>
	)
};

export default Form.create({})(BatchOrderClassTipModal);
