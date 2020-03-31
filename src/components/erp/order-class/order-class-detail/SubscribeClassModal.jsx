import React from 'react';
import { Form, Modal, Button, Select, message, Radio, Spin } from 'antd';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import styles from './SubscribeClassModal.less';

function SubscribeClassModal({
	subscribeClassVisible,
    subscribeClassLoading,
	subscribeStuList,

	confirmSubscribeClass,
	cancelSubscribeClass,
	currentItem,

	changeType, //改变类型

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
	function confirmSubscribeClassAction(){
		validateFieldsAndScroll(( err, values ) =>{
			if( !!err ){
				return;
			}
			confirmSubscribeClass( values )
		})
	}

	/*改变类型*/
	function changeTypeAction( e ){
		let value = e.target.value;
		setFieldsValue({ 'stuId' : undefined });
		if( !!value ){
			changeType( value )
		}
	}

	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 20 }
	}
	return(
       <Modal
		    className = 'subscribe_order_modal'
            visible = { subscribeClassVisible }
            title = '预约试听'
            maskClosable = { false }
            width = '400px'
            onCancel = { cancelSubscribeClass }
		   	afterClose = { afterClose }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { cancelSubscribeClass } >取消</Button>,
				<Button style = {{ marginLeft : '10px' }} key = "confirmAddFollowUpRecordAction" type = "primary" onClick = { confirmSubscribeClassAction } loading = { subscribeClassLoading } disabled = { subscribeClassLoading }>确定</Button>
			]}
        >
            <Spin spinning = { subscribeClassLoading }>
                <Form>
                    <FormItem
                        label = '类型'
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('type', {
                            initialValue : undefined,
                            rules : [
                                { required : true, message : '请选择类型' }
                            ]
                        })(
                            <RadioGroup style = {{ marginTop : '6px' }} onChange = { changeTypeAction }>
                                <Radio value = '1'>学员</Radio>
                                <Radio value = '2'>名单</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        label = '姓名'
                        { ...formItemLayout }
                    >
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
                                style = {{ width : '298px' }}>
                                { !!subscribeStuList && subscribeStuList.map(function( item, index ){
                                    return ( <Option key = { 'once_order_class_stu_' + index } value = { item.stuId }>{ (item.stuName || '') + ( courseAgeType == '1' ? ( ' ( ' + item.month + '月)') : ( ' ( ' + Math.floor(item.month / 12) + '岁)' ) ) }</Option>)
                                })}
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Spin>
        </Modal>
	)
};

export default Form.create()(SubscribeClassModal);
