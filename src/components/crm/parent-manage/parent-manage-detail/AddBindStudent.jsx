import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, Radio } from 'antd';
import styles from './AddBindStudent.less';
let Option     = Select.Option;
let FormItem   = Form.Item;
let RadioGroup = Radio.Group;

function ClassPackageCreateForm({
    addBindStudentVisible,
    addBindButtonLoading,

    stuIdList,
    parentRelationList,


    cancelAddBindStudent,
    confirmAddBindStudent,

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
        labelCol   : { span : 4 },
		wrapperCol : { span : 20 }
    };

	function afterClose(){
		resetFields();
	}

	/*确认添加关联学员*/
	function confirmAddBindStudentAction(){
		validateFieldsAndScroll( (err, values) => {
            if( !!err ){
                return;
            };
            confirmAddBindStudent( values );
        })
	}

	return(
       <Modal
            className = "zj_parent_add_bind_student"
            visible = { addBindStudentVisible }
            title = '添加关联学员'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelAddBindStudent }
            afterClose = { afterClose }
            footer = {[
				<Button key = "cancelAddParent" onClick = { cancelAddBindStudent } >取消</Button>,
				<Button key = "confirmAddParent" type = "primary" onClick = { confirmAddBindStudentAction } loading = { addBindButtonLoading } disabled = { addBindButtonLoading } style = {{ marginLeft : 20 }}>确认</Button>
			]}
        >
            <Form>
				<FormItem
					label = '关联学员'
					{ ...formItemLayout }
				>
					{ getFieldDecorator('stuId', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请选择学员' }
						]
					})(
						<Select
							showSearch
							allowClear
							size = 'default'
							placeholder = '请选择学员'
                            optionFilterProp = "children"
                            notFoundContent = "未找到"
						>
							{ stuIdList && stuIdList.map(function( item, index ){
                                return ( <Option key = { 'add_bind_stu_id_' + item.stuId } value = { item.stuId } >{ item.stuName }</Option> )
                            })}
						</Select>
					)}
				</FormItem>
                <FormItem
                    label = "家长关系"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('relation',{
                        initialValue : undefined,
                        rules : [
                            { required : true, message : '请选择家长关系' }
                        ]
                    })(
                        <Select
                            showSearch
                            allowClear
                            size = 'default'
                            placeholder = "请选择家长关系"
                            optionFilterProp = "children"
                            notFoundContent = "未找到"
                        >
                            { parentRelationList && parentRelationList.map(function( item, index ){
                                return ( <Option key = { 'parent_relation_' + item.index } value = { item.key } >{ item.value }</Option> )
                            })}
                        </Select>
                    )}
                </FormItem>
            </Form>
        </Modal>
	)
};

export default Form.create({})(ClassPackageCreateForm);
