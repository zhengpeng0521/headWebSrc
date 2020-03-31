import React from 'react';
import { Form, Modal, Button, Select, message, Radio, Spin } from 'antd';
const RadioGroup = Radio.Group;
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;

function OnceOrderClassModal({
	currentItem,
	onceOrderClassVisible,
    onceOrderClassLoading,              //单次约课加载状态
	studentList,
	classList,

	confirmOrderClass,
	cancelOrderClass,
	selectClass,          //选择班级得到班级人数
	changeOnceOrderType,  //改变约课类型

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
	function confirmOrderClassAction(){
		validateFieldsAndScroll(( err, values ) =>{
			if( !!err ){
				return;
			}
			confirmOrderClass( values )
		})
	}

	/*改变类型*/
	function changeTypeAction( e ){
		let value = e.target.value;
		setFieldsValue({ 'stuId' : undefined });
		setFieldsValue({ 'clsId' : undefined });
		if( !!value ){
			changeOnceOrderType()
		}
	}

	return(
       <Modal
		    className = 'subscribe_order_modal'
            visible = { onceOrderClassVisible }
            title = '单次约课'
            maskClosable = { false }
            width = '400px'
            onCancel = { cancelOrderClass }
		   	afterClose = { afterClose }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { cancelOrderClass } >取消</Button>,
				<Button style = {{ marginLeft : '10px' }} key = "confirmAddFollowUpRecordAction" type = "primary" onClick = { confirmOrderClassAction } loading = { onceOrderClassLoading } disabled = { onceOrderClassLoading } >确定</Button>
			]}
        >
            <Spin spinning = { onceOrderClassLoading }>
                <Form>
                    <FormItem>
                        { getFieldDecorator('type', {
                            initialValue : '1' || undefined,
                            rules : [
                                { required : true, message : '请选择类型' }
                            ]
                        })(
                            <RadioGroup style = {{ marginTop : '6px' }} onChange = { changeTypeAction }>
                                <Radio value = '1'>预约学员</Radio>
                                <Radio value = '2'>预约班级</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    { getFieldValue('type') == '1' ?
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
                        </FormItem> :
                        <FormItem>
                            { getFieldDecorator('clsId', {
                                initialValue : undefined,
                                rules : [
                                    { required : true, message : '请选择班级' }
                                ]
                            })(
                                <Select
                                    placeholder = '选择班级'
                                    size = 'default'
                                    showSearch = { true }
                                    optionFilterProp = 'children'
                                    notFoundContent = '没有班级'
                                    onSelect = { selectClass }
                                >
                                    { !!classList && classList.map(function( item, index ){
                                        return ( <Option key = { 'once_order_class_' + index } value = { item.clsId } num = { item.classStuNum } >{ item.clsName }</Option>)
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    }
                </Form>
            </Spin>
        </Modal>
	)
};

export default Form.create({})(OnceOrderClassModal);
