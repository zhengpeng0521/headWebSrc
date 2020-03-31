import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Popover, Button, Modal, Input, Select, message } from 'antd';
import styles from './ReceiptContractOrder.less';
const FormItem = Form.Item;
const Option = Select.Option;

function ReceiptContractOrder({
	receiptContractOrderVisible,
	receiptPaymentList,
	currentItem,
	balance,

	confirmReceiptContract,
	cancelReceiptContract,

	receiptBtnLoading,

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

	function cancelReceiptContractAction(){
		cancelReceiptContract();
	}

	function confirmReceiptContractAction(){
		validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
				return;
            }
			let receipts = values.receipts;
			let noAccountTotal = 0;
			let payway = [];
			if( !!receipts && receipts.length > 0 ){
				for( let i = 0; i < receipts.length; i++ ){
					let item = receipts[i];
					if( !getFieldValue('payid_' + item.key ) ){
						message.error('收款方式必选');
						return;
					}
					if( !!getFieldValue('payid_'+ item.key ) && !!getFieldValue('money_' + item.key ) ){
						noAccountTotal += Number( getFieldValue('money_' + item.key ));
						payway.push({
							rate  : getFieldValue('rate_' + item.key )/100 + '',
							payid : getFieldValue('payid_' + item.key ),
							money : getFieldValue('money_' + item.key ),
							realSerialNumber : getFieldValue('real_serial_number_' + item.key )
						})
					}
				}
			}
//			let totalMoney = noAccountTotal + Number(getFieldValue('bExtMoney'));
			if( noAccountTotal != currentItem.orderMoney ){
				message.error('支付金额必须等于合同金额')
				return;
			}
			values.payway = payway;
			confirmReceiptContract( values );
		})
	}

	function afterClose(){
		resetFields();
	}

	/*选择收款方式*/
	function selectPayment( value, option ){
		let currentKey = option.props.currentKey;
		let receipts = getFieldValue('receipts');
		let currentReceipt = undefined;
		!!receipts && receipts.map(function( item, index ){
			if( item.key == currentKey ){
				currentReceipt = item
			}
		})

		let payid = value;
		let money = getFieldValue('money_' + currentKey );
		let rate = option.props.rate * 100;
		let oriMoney = money * ( 1 - option.props.rate ) || 0;
		let payName = option.props.name;
		currentReceipt.item = {
			payid     : payid,
			money     : money,
			rate      : rate,
			oriMoney  : Number(oriMoney).toFixed(2),
			payName   : payName
		}
		setFieldsValue({ 'receipts' : receipts });
	}

	/*金额变化*/
	function moneyChange( currentKey, payName ){
		let receipts = getFieldValue('receipts');
		let currentReceipt = undefined;
		!!receipts && receipts.map(function( item, index ){
			if( item.key == currentKey ){
				currentReceipt = item
			}
		})

		let payid = getFieldValue('payid_' + currentKey );
		let money = getFieldValue('money_' + currentKey );
		let rate = Number(getFieldValue('rate_' + currentKey ));
		let oriMoney = money * ( 1 - rate/100 ) || 0;
		currentReceipt.item = {
			payid     : payid,
			money     : money,
			rate      : rate,
			oriMoney  : Number(oriMoney).toFixed(2),
			payName   : payName
		}
		setFieldsValue({ 'receipts' : receipts });
	}

	/*账户余额金额变化*/
	function accountMoneyChange(){
		let bExtMoney = Number(getFieldValue('bExtMoney')) || 0;
		if( bExtMoney > balance ){
			message.error('所填金额不能大于可支付金额');
			setFieldsValue({ 'bExtMoney' : 0 })
		}
	}

	/*删除收款方式*/
	function deleteReceiptWay( removeKey ){
		let receipts = getFieldValue('receipts') || [];
        let newReceipts = [];
        receipts && receipts.length > 0 && receipts.map(function( item, index ){
            if( item.key != removeKey ){
                newReceipts.push( item )
            }
        })
        setFieldsValue({ 'receipts' : newReceipts });
	}

	/*新增收款方式*/
	function addReceiptWay(){
		let receipts = getFieldValue('receipts') || [];
        if( !!receipts && receipts.length > 0 ){
            let maxItem = receipts[ receipts.length - 1 ] || {};
            let maxKey = maxItem.key;
            receipts.push({
                key  : maxKey + 1,
                item : {}
            })
        }else {
            receipts.push({
                key  : 0,
                item : {}
            })
        }
        setFieldsValue({ 'receipts' : receipts })
	}

	let objReceipts = [{ key  : 0, item : {} }];

    getFieldDecorator('receipts',{
        initialValue : objReceipts,
        rules : []
    });

    let receipts = getFieldValue('receipts');
	let receiptComponents = [];
	!!receipts && receipts.length > 0 && receipts.map(function( item, index ){
		let currentKey = item.key;
		let payid = item.item.payid;
		let money = item.item.money;
		let rate = item.item.rate;
		let oriMoney = item.item.oriMoney || 0;
		let payName = item.item.payName;
		receiptComponents.push(
			<Form key = { 'receipt_form_' + item.key } layout = 'inline' className = { index == 0 ? 'receipt_form receipt_form_first' : 'receipt_form' }>
				<div className = { styles.receipt_item } style = {{ width : '160px' }}>
					<FormItem>
						{ getFieldDecorator('payid_' + item.key, {
							initialValue : payid || undefined,
						})(
							<Select
								style = {{ width : '148px' }}
								placeholder = '选择收款方式'
								onSelect = { selectPayment }
								size = 'default'
							>
								{ !!receiptPaymentList && receiptPaymentList.map(function( item, index ){
									return ( <Option
												 value = { item.id }
												 key = { item.id }
												 rate = { item.rate }
												 name = { item.name }
												 currentKey = { currentKey }
											 >
												{ item.name }
											 </Option>)
								})}
							</Select>
						)}
					</FormItem>
				</div>
				<div className = { styles.receipt_item } style = {{ width : '100px' }}>
					<FormItem>
						{ getFieldDecorator('money_' + item.key, {
							initialValue : money || undefined
						})(
							<Input size = 'default' onBlur = { () => moneyChange( currentKey, payName ) } placeholder = '支付金额' style = {{ width : '88px' }} />
						)}
					</FormItem>
				</div>
				<div className = { styles.receipt_item } style = {{ width : '100px' }}>
					<FormItem>
						{ getFieldDecorator('rate_' + item.key, {
							initialValue : rate || 0
						})(
							<Input size = 'default' disabled = { true } placeholder = '0.0' style = {{ width : '70px' }} />
						)}
					</FormItem>
					<span style = {{ marginLeft : '3px' }}>%</span>
				</div>
				<div style = {{ width : '178px', border : '0' }} className = { styles.receipt_item } >{ '实际到账 : ' + oriMoney }</div>
				<div className = { styles.receipt_item } style = {{ width : '539px', border : 'none', borderTop : '1px solid #ddd' }}>
					<FormItem>
						{ getFieldDecorator('real_serial_number_' + item.key, {
							initialValue : undefined
						})(
							<Input size = 'default'
								placeholder = { !!payName ? payName + '流水号' : '流水号' }
								style = {{ width : '527px' }}
							/>
						)}
					</FormItem>
				</div>
				<a className = { styles.delete_receipt_way } onClick = { () => deleteReceiptWay( item.key ) }>删除</a>
			</Form>
		)
	})

	return (
        <Modal
			className = 'receipt_contract_order_modal'
			width = { 700 }
			title = '订单支付'
			visible = { receiptContractOrderVisible }
			onCancel = { cancelReceiptContract }
			maskClosable = { false }
			afterClose = { afterClose }
			footer = {[
				<Button key = "cancelCheckContractOrderAction"
						onClick = { cancelReceiptContractAction }
						>取消</Button>,
				<Button key = "confirmCheckContractOrderAction"
						type = "primary"
						onClick = { confirmReceiptContractAction }
						style = {{ marginLeft : '20px' }}
						loading = { receiptBtnLoading }
						disabled = { receiptBtnLoading }
					>确认</Button>
			]}
		>
			{ receiptComponents }
			<a onClick = { addReceiptWay }>新增</a>
		</Modal>
    )
};

export default Form.create({})(ReceiptContractOrder);
