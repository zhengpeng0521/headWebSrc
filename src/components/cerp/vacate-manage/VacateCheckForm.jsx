import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Popover, Button, Modal, Input, Popconfirm } from 'antd';
import styles from './VacateCheckForm.less';
const FormItem = Form.Item;

function VacateCheckForm({
	visible,
	selectedRowKeys,

	checkBtnLoading,

	cancelCheckVacate,               //关闭审核窗口
	confirmCheckVacate,              //审核 通过或驳回

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
		wrapperCol : { span : 19 }
	}

	/*审核通过*/
	function confirmCheckVacateAction(){
		validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
				return;
            }
			let status = '3';
			confirmCheckVacate( values, status )
		})
	}

	/*审核不通过*/
	function cancelCheckVacateAction(){
		validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
				return;
            }
			let status = '2';
			confirmCheckVacate( values, status )
		})
	}

	/*关窗之后*/
	function afterClose(){
		resetFields()
	}

	/*校验跟进记录 字数*/
	function checkRemark( rule, value, callback ){
		if( !(/^[^\n]{1,200}$/.test(value)) ){
    		callback('不能超过200个字');
    	}else if((/^[\s]{1,200}$/.test(value))){
			callback("不能全为空格")
    	} else {
    		callback();
    	}
	}

    return (
        <Modal
			className = 'check_contract_order_modal'
			width = { 550 }
			title = '审核合同'
			visible = { visible }
			onCancel = { cancelCheckVacate }
			maskClosable = { false }
			afterClose = { afterClose }
			footer = {[
                <Popconfirm placement = "top" title = '确定驳回？' onConfirm = {cancelCheckVacateAction} okText = "是" cancelText = "否">
                    <Button
                        key = 'cancel_Check_vacate_action'
                        type = 'primary'
                        className = 'check_contract_order_failed_btn'
                        loading = { checkBtnLoading }
                        disabled = { checkBtnLoading }
                    >驳回</Button>
                </Popconfirm>,
                <Popconfirm placement = "top" title = '确定通过？' onConfirm = {confirmCheckVacateAction} okText = "是" cancelText = "否">
                    <Button
                        type = 'primary'
                        key = 'confirm_check_vacate_action'
                        style = {{ marginLeft : '20px' }}
                        loading = { checkBtnLoading }
                        disabled = { checkBtnLoading }
                    >通过</Button>
                </Popconfirm>
			]}
		>
			<p style = {{ marginLeft : '23px' }}>
				{ '请审核已选中的' + selectedRowKeys.length + '条请假信息' }
			</p>
			<Form className = 'check_form' >
				<FormItem
					{ ...formItemLayout }
					label = '处理结果'
				>
					{ getFieldDecorator('remark',{
						initialValue : undefined,
						rules : [
							{ validator : checkRemark }
						]
					})(
						<Input type = 'textarea' placeholder = '请输入处理结果' />
					)}
				</FormItem>
			</Form>
		</Modal>
    )
};

export default Form.create({})(VacateCheckForm);
