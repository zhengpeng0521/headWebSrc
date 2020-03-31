import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Popover, Button, Modal, Input, Popconfirm } from 'antd';
import styles from './CheckContractOrder.less';
const FormItem = Form.Item;

function CheckContractOrder({

	checkContractOrderVisible,
	currentItem,

	checkContractBtnLoading,
	checkContractBtnFailLoading,

	cancelCheckContract,        //关闭审核窗口
	confirmCheckContractOrder,  //审核

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

	/*审核通过*/
	function confirmCheckContractOrderAction(){
		validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
				return;
            }
			let status = '1';
			confirmCheckContractOrder( values, status )
		})
	}

	/*审核不通过*/
	function cancelCheckContractOrderAction(){
		validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
				return;
            }
			let status = '0';
			confirmCheckContractOrder( values, status )
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

	let orderType = !!currentItem && currentItem.orderType;
	let orderPeriod = !!currentItem && currentItem.orderPeriod;
	let extPeriod   = !!currentItem && currentItem.extPeriod;
	let orderPeriodTotal = orderPeriod + extPeriod;
    return (
        <Modal
			className = 'check_contract_order_modal'
			width = { 550 }
			title = '审核合同'
			visible = { checkContractOrderVisible }
			onCancel = { cancelCheckContract }
			maskClosable = { false }
			afterClose = { afterClose }
			footer = {[
                <Popconfirm placement = "top" title = '确定驳回？' onConfirm = {cancelCheckContractOrderAction} okText = "是" cancelText = "否">
                    <Button
                        type = "primary"
                        className = 'check_contract_order_failed_btn'
                        key = "cancelCheckContractOrderAction"
                        loading = { checkContractBtnFailLoading }
                        disabled = { checkContractBtnFailLoading }
                        >驳回</Button>
                </Popconfirm>,
                <Popconfirm placement = "top" title = '确定通过？' onConfirm = {confirmCheckContractOrderAction} okText = "是" cancelText = "否">
                    <Button
                        key = "confirmCheckContractOrderAction"
                        type = "primary"
                        style = {{ marginLeft : '20px' }}
                        loading = { checkContractBtnLoading }
                        disabled = { checkContractBtnLoading }
                        >通过</Button>
                </Popconfirm>
			]}
		>
			<p className = { styles.p }>
				<span className = { styles.item_label }>合同编号 : </span>
				<span className = { styles.item_text }>{ !!currentItem && currentItem.orderNumber }</span>
			</p>
			<p className = { styles.p }>
				<span className = { styles.item_label }>合同类型 : </span>
				<span className = { styles.item_text }>{ orderType == '1' ? '充值' : orderType == '2' ? ('课时包/' + orderPeriodTotal.toFixed(2) + '课时') : '' }</span>
			</p>
			<p className = { styles.p }>
				<span className = { styles.item_label }>合同金额 : </span>
				<span className = { styles.item_text }>{ !!currentItem && '￥' + currentItem.orderMoney }</span>
			</p>
			<Form className = 'check_form' >
				<FormItem>
					{ getFieldDecorator('orderRemark',{
						initialValue : undefined,
						rules : [
							{ validator : checkRemark }
						]
					})(
						<Input type = 'textarea' placeholder = '请输入备注' />
					)}
				</FormItem>
			</Form>
		</Modal>
    )
};

export default Form.create({})(CheckContractOrder);
