import React from 'react';
import { Form, Modal, Button, Select, message, Radio } from 'antd';
import styles from './AddStudentModal.less';
const RadioGroup = Radio.Group;
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;

function AddStudentModal({
	studentDataSource,   //已报班学员
	stuList,
	addStudentVisible,
	currentItem,         //当前选中的班级

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
        resetFields
	}

}){

    let courseAgeType = currentItem.courseAgeType;

	for(let i in stuList){
		stuList[i].display = true;
	}

	let stuListComponents = [];
	for(let i in studentDataSource){
		for(let j in stuList){
			if(studentDataSource[i].stuId == stuList[j].stuId){
				stuList[j].display = false;
				break;
			}
		}
	}
	for(let i in stuList){
		if(stuList[i].display == false){
			stuListComponents.push( <Option disabled key = { 'add_student_modal_' + i } value = { stuList[i].stuId }>{ (stuList[i].stuName || '') + ( courseAgeType == '1' ? ( ' ( ' + stuList[i].month + '月)') : ( ' ( ' + Math.floor(stuList[i].month / 12) + '岁)' ) ) }</Option>);
		}else{
			stuListComponents.push( <Option key = { 'add_student_modal_' + i } value = { stuList[i].stuId }>{ (stuList[i].stuName || '') + ( courseAgeType == '1' ? ( ' ( ' + stuList[i].month + '月)') : ( ' ( ' + Math.floor(stuList[i].month / 12) + '岁)' ) ) }</Option>);
		}
	}

	function afterClose(){
		resetFields();
	}

	/*确认约课*/
	function confirmAddStudentAction(){
		validateFieldsAndScroll(( err, values ) =>{
			if( !!err ){
				return;
			}
			confirmAddStudent( values )
		})
	}

	return(
       <Modal
		    className = 'add_student_modal'
            visible = { addStudentVisible }
            title = '添加学员'
            maskClosable = { false }
            width = '400px'
            onCancel = { cancelAddStudent }
		   	afterClose = { afterClose }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { cancelAddStudent } >取消</Button>,
				<Button style = {{ marginLeft : '20px' }} key = "confirmAddFollowUpRecordAction" type = "primary" onClick = { confirmAddStudentAction } >确定</Button>
			]}
        >
            <Form>
				<FormItem>
					{ getFieldDecorator('stuId', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请选择学员' }
						]
					})(
						<Select
							placeholder = '选择学员'
							size = 'default'
							showSearch = { true }
							optionFilterProp = 'children'
							notFoundContent = '没有学员'
							mode = 'multiple'
						>
							{ stuListComponents }
						</Select>
					)}
				</FormItem>
			</Form>
        </Modal>
	)
};

export default Form.create({})(AddStudentModal);
