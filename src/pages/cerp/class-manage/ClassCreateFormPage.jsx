import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm, message, Popover } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ClassCreateFormComponent from '../../../components/cerp/class-manage/class-create-form/ClassCreateForm';

function ClassCreateFormPage({ dispatch, classCreateFormModel }) {

	let {
		createVisible,
		orgId,
		userList,
		courseList,
		classInfo,
		btnLoading

    } = classCreateFormModel;

	/*取消新增班级*/
	function classCreateCancel(){
		dispatch({
			type : 'classCreateFormModel/updateState',
			payload : {
				createVisible : false,
				orgId         : undefined,
				classInfo     : {}
			}
		})
	}

	/*确认新增班级*/
	function classCreateConfirm( values ){
		dispatch({
			type : 'classCreateFormModel/classCreateConfirm',
			payload : {
				values
			}
		})
	}

	let classCreateFormComponentProps = {
		createVisible,
		orgId,
		userList,
		courseList,
		classInfo,             //班级信息
		btnLoading,

		/*action操作*/
		classCreateCancel,
		classCreateConfirm

	}
    return (
        <div>
            <ClassCreateFormComponent { ...classCreateFormComponentProps } />
        </div>
    );

}

function mapStateToProps({ classCreateFormModel }) {
  	return { classCreateFormModel };
}

export default connect(mapStateToProps)(ClassCreateFormPage);
