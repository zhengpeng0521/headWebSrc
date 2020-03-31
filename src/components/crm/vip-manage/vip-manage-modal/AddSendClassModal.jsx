import React from 'react';
import { Modal, Button, Form, Select, Input } from 'antd';
import styles from './AddSendClassModal.less';

const FormItem = Form.Item;
const Option = Select.Option;

function AddSendClassModal({
	addSendClassModalVisible,
	contractSelectList,

	id,       //会员卡号

	addSendClassModalBtnLoading,

	/*方法*/
	cancelAddSendClass,
	confirmAddSendClass,

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
	function confirmAddSendClassAction(){
		validateFieldsAndScroll(( err, values ) => {
			if( !!err ){
				return;
			}
			confirmAddSendClass( values )
		})
	}

	function afterClose(){
		resetFields();
	}

	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 20 }
	}

    function checkCourseNum(rule, value, callback) {
        if(value == '' || value == undefined || value == null){
            callback();
        }else if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
            callback(new Error('数字格式不正确'));
        }else {
            callback();
        }
	}

	return (
		<Modal
			className = 'add_send_class_modal'
			visible = { addSendClassModalVisible }
			title = '添加赠送课时'
			onCancel = { cancelAddSendClass }
			width = '550px'
			maskClosable = { false }
			afterClose = { afterClose }
          	footer = {[
				<Button key = 'send_class_cancel' onClick={ cancelAddSendClass }>取消</Button>,
				<Button
					style = {{ marginLeft : '20px' }}
					key = 'send_class_confirm'
					type = 'primary'
					onClick = { confirmAddSendClassAction }
					loading = { addSendClassModalBtnLoading }
					disabled = { addSendClassModalBtnLoading }
					>确定</Button>
			]}
		>
			<Form>
				<FormItem
					{ ...formItemLayout }
					label = '会员卡号'
				>
					{ getFieldDecorator('id', {
						initialValue : id,
					})(
						<span style = {{ position : 'relative', top : '8px' }}>{ id || '' } </span>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '合同编号'
				>
					{ getFieldDecorator('purchaseId', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请选择合同编号' }
						]
					})(
						<Select
							size = 'default'
							placeholder = '请选择合同编号'
						>
							{ !!contractSelectList && contractSelectList.map(function( item, index ){
								return ( <Option key = { 'add_send_class_' + item.purchaseId } value = { item.purchaseId } >{ item.orderNum }</Option> )
							})}
						</Select>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '课时数量'
                    extra = '非负数，可精确到小数点后2位'
				>
					{ getFieldDecorator('periodNum', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请输入课时数量' , whitespace : true },
                            { validator : checkCourseNum }
						]
					})(
						<Input size = 'default' placeholder = '请输入课时数量' />
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '赠课总成本'
                    extra = '(用于统计赠课消耗的成本，不计入合同总额，也不计入消课统计)'
				>
					{ getFieldDecorator('extPeriodMoney', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请输入赠课总成本' , whitespace : true },
                            { validator : checkCourseNum }
						]
					})(
						<Input size = 'default' placeholder = '请输入赠课总成本' />
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '赠课原因'
				>
					{ getFieldDecorator('extPeriodReason', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请输入赠课原因' , whitespace : true },
						]
					})(
						<Input size = 'default' placeholder = '请输入赠课原因' />
					)}
				</FormItem>
			</Form>
		</Modal>
	)
}

export default Form.create({})(AddSendClassModal);
