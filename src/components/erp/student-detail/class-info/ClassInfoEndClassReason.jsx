import React from 'react';
import { Button, Modal, Input, Form, DatePicker  } from 'antd';
let FormItem = Form.Item;

function ClassInfoEndClassReason({
    classEndReasonModalVisible,
    confirmSuspendCourse,
    cancelSuspendCourse,

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
    let formItemLayout = {
        labelCol : { span : 4 },
        wrapperCol : { span : 18 }
    };

    function confirmSuspendCourseAction(){
        validateFieldsAndScroll( ( err, values ) => {
            if( !!err ){
                return;
            };
            confirmSuspendCourse(values);
        })
    };

    function cancelSuspendCourseAction(){
        cancelSuspendCourse();
    };

    function afterClose(){
        resetFields();
    };

    return (
        <Modal
            visible = { classEndReasonModalVisible }
            title = '停课'
            onCancel = { cancelSuspendCourseAction }
            footer = {[
				<Button key = "cancelStudent" size = 'default' onClick = { cancelSuspendCourseAction } >取消</Button>,
				<Button key = "confirmStudent" size = 'default' type = "primary" onClick = { confirmSuspendCourseAction } >确定</Button>,
			]}
            afterClose = { afterClose }
        >
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label = '停课原因'
                >
                    { getFieldDecorator('endClassReason',{
                        rules : [
                            { required : true , message : '请输入停课原因' }
                        ]
                    })(
                        <Input placeholder = '请输入停课原因' />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '停课时间'
                >
                    { getFieldDecorator('endClassTime',{
						rules : [
						 	{ type : 'object', required : true , message : '请选择日期' }
						]
					})(
						<DatePicker format="YYYY-MM-DD" />
					)}
                </FormItem>
            </Form>
        </Modal>
    )
};

export default Form.create({})(ClassInfoEndClassReason);
