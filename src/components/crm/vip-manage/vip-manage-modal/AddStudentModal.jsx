import React from 'react';
import { Modal, Button, Form, Select, Input } from 'antd';
import styles from './AddStudentModal.less';

const FormItem = Form.Item;
const Option = Select.Option;

function AddStudentModal({
	addStudentModalVisible,
	studentList,

	addStudentBtnLoading,

	/*方法*/
	cancelAddStudent,
	confirmAddStudent,

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

	/*确认添加赠送课时*/
	function confirmAddStudentAction(){
		validateFieldsAndScroll(( err, values ) => {
			if( !!err ){
				return;
			}
			confirmAddStudent( values )
		})
	}

	function afterClose(){
		resetFields();
	}

	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 20 }
	}
	return (
		<Modal
			className = 'vip_manage_add_send_class_modal'
			visible = { addStudentModalVisible }
			title = '添加适用学员'
			onCancel = { cancelAddStudent }
			width = '550px'
			maskClosable = { false }
			afterClose = { afterClose }
          	footer = {[
				<Button key = 'send_class_cancel' onClick={ cancelAddStudent }>取消</Button>,
				<Button
					style = {{ marginLeft : '20px' }}
					key = 'send_class_confirm'
					type = 'primary'
					onClick = { confirmAddStudentAction }
					loading = { addStudentBtnLoading }
					disabled = { addStudentBtnLoading }
					>
                    确定
                </Button>
			]}
		>
			<Form>
				<div style = {{ fontSize : '14px' , marginBottom : 10 }}>
				    请选择想添加的适用学员
				</div>
				<FormItem>
					{ getFieldDecorator('stuId', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请选择适用学员' }
						]
					})(
						<Select
                            allowClear
                            showSearch
                            optionFilterProp = "children"
                            notFoundContent = "未找到"
							size = 'default'
							placeholder = '适用学员'
						>
							{ !!studentList && studentList.map(function( item, index ){
								return ( <Option key = { 'add_student_' + item.stuId } value = { item.stuId } >{ item.stuName }</Option> )
							})}
						</Select>
					)}
				</FormItem>
			</Form>
		</Modal>
	)
}

export default Form.create({})(AddStudentModal);
