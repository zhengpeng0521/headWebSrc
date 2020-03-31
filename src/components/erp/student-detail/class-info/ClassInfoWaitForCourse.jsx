import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Row, Col, Select, Upload, Input, Table  } from 'antd';
import style from './ClassInfoWaitForCourse.less';
let Option = Select.Option;
let FormItem = Form.Item;

function ClassInfoWaitForCourse({

    classInfoCourseList,
    classInfoWaitForClassModal,
    chooseCourseTo,
    waitForCourseSelectedRowKeys,

    closeWaitForCourseModal,
    confirmWaitForClass,

	form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	},
}){
    classInfoCourseList && classInfoCourseList.map(function( item, index ){
        item.key = index;
    })
    let columns = [
        {
            title     : '班级名称',
            dataIndex : 'name',
            key       : 'name',
            width     : '250px'
        },{
            title     : '人数',
            dataIndex : 'number',
            key       : 'number',
            width     : '100px',
            render    : ( text, record ) => (
                <span>
                    { record.stuNum + '/'  + record.maxStuNum }
                </span>
            )
        },{
            title     : '老师',
            dataIndex : 'teachers',
            key       : 'teachers',
            width     : '200px',
            render    : ( text, record ) => (
                <div style = {{ marginLeft : '-10px'}} >
                    { record && record.teacherList && record.teacherList.map(function(item, index){
                        return ( <span key = { 'classInfoWaitForCourseTeach_1' + index } style = {{ marginLeft : item.prime == '1' ? '10px' : '0' }}>{ item.prime == '1' && item.uname }</span> )
                    })}
                </div>
            )
    }];
    let rowSelection = {
        type            : 'radio',
        onChange        : chooseCourseTo,
        selectedRowKeys : waitForCourseSelectedRowKeys,
    };

	return(
       <Modal
            className = "yhwu_wait_for_class"
            visible = { classInfoWaitForClassModal }
            title = '分班'
            maskClosable = { false }
            width = '550px'
            onCancel = { closeWaitForCourseModal }
            footer = {[
                <Button key = "cancel" onClick = { closeWaitForCourseModal } >取消</Button>,
                <Button key = "confirm" type = "primary" onClick = { confirmWaitForClass } >确认</Button>,
            ]}
        >
           <Table style = {{ marginRight : '10px' }} size = { 'middle' } columns = { columns } rowSelection = { rowSelection } dataSource = { classInfoCourseList } pagination = { false }  bordered />
        </Modal>

	)
};

export default Form.create({})(ClassInfoWaitForCourse);
