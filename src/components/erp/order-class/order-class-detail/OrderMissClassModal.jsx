import React from 'react';
import { Form, Modal, Button, Select, message, Radio } from 'antd';
const RadioGroup = Radio.Group;
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;

function OrderMissClassModal({
	orderMissClassVisible,
	studentList,
	currentItem,

	confirmOrderMissClass,
	cancelOrderMissClass,
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

	let courseAgeType = !!currentItem && currentItem.courseAgeType;

	function afterClose(){
		resetFields();
	}

	/*确认约课*/
	function confirmOrderMissClassAction(){
		validateFieldsAndScroll(( err, values ) =>{
			if( !!err ){
				return;
			}
			confirmOrderMissClass( values )
		})
	}

	return(
       <Modal
		    className = 'subscribe_order_modal'
            visible = { orderMissClassVisible }
            title = '预约补课'
            maskClosable = { false }
            width = '400px'
            onCancel = { cancelOrderMissClass }
		   	afterClose = { afterClose }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { cancelOrderMissClass } >取消</Button>,
				<Button style = {{ marginLeft : '10px' }} key = "confirmAddFollowUpRecordAction" type = "primary" onClick = { confirmOrderMissClassAction } >确定</Button>
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
						>
							{ !!studentList && studentList.map(function( item, index ){
								return ( <Option key = { 'once_order_class_stu_' + index } value = { item.stuId }>{ (item.stuName || '') + ( courseAgeType == '1' ? ( ' ( ' + item.month + '月)') : ( ' ( ' + Math.floor(item.month / 12) + '岁)' ) ) }</Option>)
							})}
						</Select>
					)}
				</FormItem>
			</Form>
        </Modal>
	)
};

export default Form.create({})(OrderMissClassModal);
