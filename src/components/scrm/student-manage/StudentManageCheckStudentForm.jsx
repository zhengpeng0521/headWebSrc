import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Table, Button, Modal, Form, Input, Select, Icon, Row, Col, message } from 'antd';
import style from './StudentManageCheckStudentForm.less';
import moment from 'moment';
let FormItem = Form.Item;

function StudentManageCheckStudentForm({
	checkStudentVisible,
    checkStudentList,
    checkName,

    cancelCheckStudent,
    confirmCheckStudent,
	form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	}
}){


    checkStudentList && checkStudentList.map(function(item, index){
        item.key = index;
    })
    //关闭学员查重
    function cancelCheckStudentAction(){
        resetFields();
        cancelCheckStudent();
    };

    //搜索学员
    function confirmCheckStudentAction(){
        let values = getFieldsValue();


        if (values == "undefined" || values == ''){
            confirmCheckStudent( checkName );
        }else  {
            confirmCheckStudent( values );
        }

    };

    let columns = [
        {
            dataIndex : 'name',
            key       : 'name',
            title     : '学员名称',
        },{
            dataIndex : 'createTime',
            key       : 'createTime',
            title     : '创建时间',
        },{
            dataIndex : 'sellerName',
            key       : 'sellerName',
            title     : '所有人',
        }
    ]
	return (
		<Modal
            className = "yhwu_check_student_modal"
			title = "学员查重"
			visible = { checkStudentVisible }
			width = '550px'
			onCancel = { cancelCheckStudentAction }
			maskClosable = { false }
			footer = { null }
		>
			<Form>
                <FormItem>
                   { getFieldDecorator('name', {
                        initialValue : checkName || '',
                        rules : [
                            { required : true , message : '请输入学员姓名' }
                        ]
                    })(
                        <Input size = 'default' placeholder = "请输入学员姓名" style = {{ width : '400px'}} />
                    )}
                    <Button style = {{ marginLeft : '10px' }} onClick = { confirmCheckStudentAction } type = 'primary' size = 'default' >搜索</Button>
                </FormItem>
			</Form>
            <Table columns = { columns } dataSource = { checkStudentList } pagination = { false } />
		</Modal>
	)
}

export default Form.create({})(StudentManageCheckStudentForm);
