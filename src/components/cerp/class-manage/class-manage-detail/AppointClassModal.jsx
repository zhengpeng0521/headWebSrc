import React from 'react';
import styles from './AppointClassModal.less';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm } from 'antd';
import QueueAnim from 'rc-queue-anim';

function AppointClassModal({
	appointClassModalVisible,
	appointClassObj,             //此排课信息 详情
	hasAppointList,
	studentDataSource,

	closeAppointClassFunc,

}){
	let studyDate = !!appointClassObj && appointClassObj.studyDate;
	let startTime = !!appointClassObj && appointClassObj.startTime
	let endTime = !!appointClassObj && appointClassObj.endTime;
	return(
		<Modal
			className = 'cerp_appoint_class_modal'
			title = '班级成员约课情况'
			visible = { appointClassModalVisible }
			width = '550px'
			onCancel = { closeAppointClassFunc }
			maskClosable = { false }
			footer = { null }
		>
			<div className = { styles.start_time }>{ '上课时间 : ' + studyDate + '  ' + startTime + '~' + endTime }</div>
			<div className = { styles.tips }>如果有未预约的学员，在这个时间点的课程把当前班级再预约一次就行</div>
			<div className = { styles.line } ></div>
			<div className = { styles.appoint_list_wrap } >
				<div>
					{ studentDataSource && studentDataSource.map(function( item, index ){
						if( hasAppointList.indexOf(item.stuId) == -1 ){
							return(
								<div key = { 'student_no_appoint_' + item.stuId } className = { styles.appoint_list_wrap_item }>
									<span className = { styles.item_name }>{ item.name }</span>
									<span className = { styles.item_status_no }>未预约</span>
								</div>
							)
						}else{
							return(
								<div key = { 'student_has_appoint_' + item.stuId } className = { styles.appoint_list_wrap_item }>
									<span className = { styles.item_name }>{ item.name }</span>
									<span className = { styles.item_status_yes }>已预约</span>
								</div>
							)
						}
					})}
				</div>
			</div>
		</Modal>
    )
}

export default AppointClassModal;
