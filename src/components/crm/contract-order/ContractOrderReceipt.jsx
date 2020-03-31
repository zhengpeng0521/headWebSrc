import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Popover, Button, Modal, Input, Select, message, DatePicker, Popconfirm , Spin } from 'antd';
import { NullData } from '../../common/new-component/NewComponent';
import moment from 'moment';
import styles from './ContractOrderReceipt.less';
import QueueAnim from 'rc-queue-anim';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;

function ContractOrderReceipt({

	currentItem,                   //当前收款的合同订单
	receiptFormVisible,            //收款表单显隐
	receiptFormType,               //收款单手填或关联pos 1代表关联pos 2代表手填
	changeReceiptType,             //切换收款方式


	isOpenPos,                     //是否开通pos

	/*关联pos后*/
	waterSingleList,               //关联pos所得到的流水单列表
	waterSingleSelectedList,       //已选中的流水单列表
	withPosTotalMoney,             //所选中流水单的总金额
	payStartTime,                  //支付开始时间
	payEndTime,                    //支付结束时间
	uName,                         //收银人姓名
	posOrderNo,                    //订单号

	searchWaterSingleList,         //筛选流水单列表
//	timeChangeGetList,             //改变时间阶段筛选流水单列表
//	purchaseIdChange,              //改变合同订单号筛选
//	chargeManChange,               //改变收银人筛选
	confirmConnectPosList,         //确认关联pos流水单

	selectPosListItem,             //选择pos流水单


	/*手填收款单*/
	receiptPaymentList,
	confirmReceiptContract,        //手填收款单确认


	cancelReceiptContract,         //取消收款

	receiptWithPosBtnLoading,
	receiptWriteBtnLoading,

    modalLoading,                  //modal加载状态

    /*订金*/
    wetherShowOrder,               //订金是否显示
    orderDepositContent,           //订金编号列表内容
    paymentMethod,                 //收款方式
    ShowOrder,                     //点击新增订金
    CloseOrder,                    //取消新增订金

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

    //订金编号select的onChange
    function OrderOnChange(id){
        if(id == '' || id == null || id == undefined){
            setFieldsValue({
                depositId_paId : undefined,
                depositId_money : undefined,
                depositId_rate : undefined,
                depositId_rate_flow : undefined,
                depositId_realMoney : undefined,
            })
        }else{
            for(let i in orderDepositContent){
                if(id == orderDepositContent[i].id){
                    setFieldsValue({
                        depositId_paId : orderDepositContent[i].paId,
                        depositId_money : orderDepositContent[i].money,
                        depositId_rate : orderDepositContent[i].fee,
                        depositId_rate_flow : orderDepositContent[i].realSerialNumber,
                        depositId_realMoney : orderDepositContent[i].realMoney
                    })
                    break;
                }
            }
        }
    }

	//搜索流水单列表
	function searchWaterSingleListAction(){
		let values = {};
		let date = getFieldValue('date');
		if( !!date && date.length > 0 ){
			values.payStartTime = date[0].format('YYYY-MM-DD');
			values.payEndTime = date[1].format('YYYY-MM-DD');
		}
		values.uName = getFieldValue('chargeMan') || undefined;
		values.posOrderNo = getFieldValue('purchaseId') || undefined;
		searchWaterSingleList( values );
	}

	//收款单关闭之后
	function afterClose(){
		resetFields();
	}

	//收款单头部信息展示
	let receiptHeaderComponent = (
		<div className = 'receipt_header_wrap'>
			<div className = 'receipt_header_content'>
				<p className = 'receipt_header_content_item'>
					<span className = { styles.item_label }>合同编号 : </span>
					<span className = { styles.item_text }>{ !!currentItem && currentItem.orderNum || '--' }</span>
				</p>
				<p className = 'receipt_header_content_item'>
					<span className = { styles.item_label }>合同金额 : </span>
					<span className = { styles.item_text }>{ !!currentItem && currentItem.orderMoney || '--' }</span>
				</p>
				<p className = 'receipt_header_content_item'>
					<span className = { styles.item_label }>签约类型 : </span>
					<span className = { styles.item_text }>{ ( !!currentItem && currentItem.orderNewOldstu == '0' ) ? '新签约' : '续约' }</span>
				</p>
				<div className = 'receipt_header_click'>
					<span>切换至&nbsp;&nbsp;<a onClick = { () => changeReceiptType( receiptFormType ) } >{ receiptFormType == '1' ? '手填收款单' : '关联钱包pos机' }</a></span>
				</div>
			</div>
		</div>
	)

	//未关联pos时所展示的页面
	let receiptContentWithoutPos = (
		<div className = 'receipt_content_without_pos'>
			<div className = 'receipt_content_without_pos_tip'>
				<div className = 'without_pos_tip_item'>{ '[ ' + ( !!currentItem && currentItem.orderSubordinateCampus || '--' ) + ' ]'}</div>
				<div className = 'without_pos_tip_item'>未开通钱包pos机, 无法在线收款</div>
				<div className = 'without_pos_tip_item'>如需轻松收款对账</div>
				<div className = 'without_pos_tip_item'>请拨打0571-988889999</div>
			</div>
			<div className = 'receipt_content_without_pos_intro'>
				“钱包iPOS”智能终端，集商户银行卡收单、支付宝/微信支付店内自服务、外卖订单管理、智能对账、卡券核销、会员营销、贷款、数据分析等功能一体，提供全方位的电子商务移动支付及经营解决方案，为连锁商户、品牌专卖店等提供一站式移动互联网经营服务。
				<div className = 'without_pos_intro_shou'>
					收单
				</div>
				<div className = 'without_pos_intro_yan'>
					验卷
				</div>
				<div className = 'without_pos_intro_xin'>
					信贷
				</div>
			</div>
		</div>
	)

	//关联pos时所展示的页面
	let receiptContentWithPos = (
		<div className = 'receipt_content_with_pos'>
			<div className = 'receipt_content_with_pos_search'>
				<Form layout = 'inline' style = {{ lineHeight : '24px' }} >
					<FormItem>
						{ getFieldDecorator('date', {
							initialValue : [moment( payStartTime, 'YYYY-MM-DD' ), moment( payEndTime, 'YYYY-MM-DD' )] || undefined,
						})(
							<RangePicker
								size = 'default'
								style = {{ width : '200px' }}
								format = { 'YYYY-MM-DD' }
							/>
						)}
					</FormItem>
					<FormItem>
						{ getFieldDecorator('purchaseId', {
							initialValue : undefined
						})(
							<Input
								size = 'default'
								style = {{ width : '108px' }}
								placeholder = '订单号'
							/>
						)}
					</FormItem>
					<FormItem>
						{ getFieldDecorator('chargeMan', {
							initialValue : undefined
						})(
							<Input
								size = 'default'
								style = {{ width : '76px' }}
								placeholder = '收银人'
							/>
						)}
					</FormItem>
					<FormItem>
						<Button
							style = {{ width : '44px' }}
							type = 'primary'
							size = 'default'
							icon = 'search'
							onClick = { searchWaterSingleListAction } ></Button>
					</FormItem>
				</Form>
			</div>
			<div className = 'receipt_content_with_pos_list'>
				<div className = 'receipt_content_with_pos_list_box'>
					<div className = 'with_pos_list_tips'>
						请选择该合同在钱包pos机里的流水单，并进行关联
					</div>
					{ waterSingleList && waterSingleList.length > 0 && waterSingleList.map(function( item, index ){
						return (
							<div
								key = { 'receipt_pos_item_' + index }
								className = { item.selected ? 'with_pos_list_item width_pos_list_item_selected' : 'with_pos_list_item' }
								onClick = { () => selectPosListItem( index ) }>
								<div
									style = {{ backgroundImage : item.posPayType == 'WX' ? `url('https://img.ishanshan.com/gimg/img/4ce5acb125504e513afd2c054292efa1')` :
											 					  item.posPayType == 'sk' ? `url('https://img.ishanshan.com/gimg/img/4ce5acb125504e513afd2c054292efa1')` :
											 						item.posPayType == 'AL' ? `url('https://img.ishanshan.com/gimg/img/ff07e367cc92600b3b02c298af703357')` :
																		item.posPayType == 'XJ' ? `url('https://img.ishanshan.com/gimg/img/f5fd52d26ba18d02029e5f72df85f52e')` : '' }}
									className = 'with_pos_list_item_icon'></div>
								<div className = 'with_pos_list_item_info'>
									<div className = 'with_pos_list_item_info_left'>
										<p className = 'with_pos_list_item_info_left_spe'>
											{ item.posPayType == 'WX' ? '微信———开单'
											  : item.posPayType == 'XJ' ? '现金———开单'
											  : item.posPayType == 'SK' ? '银行卡———开单'
											  : item.posPayType == 'AL' ? '支付宝———开单' : null }
										</p>
										<p>订单号 :&nbsp;
											<Popover placement = "top" content = { item.posOrderNo } trigger = 'hover' >
												{ item.posOrderNo || '--' }
											</Popover>
										</p>
										<p>{ '创建时间 : ' + ( item.payTimeStr || '--' ) }</p>
									</div>
									<div className = 'with_pos_list_item_info_right'>
										<p style = {{ fontSize : '14px' }}>金额 : <a>{ ( item.amountMoney || 0 ) + '元' }</a></p>
										<p>{ '收银员 : ' + ( item.cashierName || '--' ) }</p>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
			<div className = 'receipt_content_with_pos_list_footer'>
				<p className = 'with_pos_list_footer_total'> { '已选中' + ( waterSingleSelectedList.length || 0 ) + '条, 合计 : ' }<span>{ withPosTotalMoney + '元' }</span></p>
				<div className = 'with_pos_list_footer_btnGroup'>
					<Button size = 'default' style = {{ marginRight : '20px' }} onClick = { cancelReceiptContract } >取消</Button>
					<Popconfirm title = "请认真校验所选流水单, 确认关联并完成收款?" onConfirm = { confirmConnectPosList } okText = '确认' cancelText = '取消' >
						<Button size = 'default' type = 'primary' disabled = { receiptWithPosBtnLoading } loading = { receiptWithPosBtnLoading }>完成收款</Button>
					</Popconfirm>
				</div>
			</div>
		</div>
	)

	//手填收款单
	function confirmReceiptContractWrite(){
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
						return message.error('收款单收款方式必选');
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
            if(isNaN(parseFloat(values.depositId_money))){
                if(noAccountTotal != currentItem.orderMoney){
                    return message.error('支付金额必须等于合同金额')
                }
            }else{
                if( noAccountTotal + parseFloat(values.depositId_money) != currentItem.orderMoney ){
                    return message.error('支付金额必须等于合同金额')
                }
            }
			values.payway = payway;

            //处理订金,主要是删除无用元素
            delete values.depositId_paId;
            delete values.depositId_money;
            delete values.depositId_rate;
            delete values.depositId_rate_flow;
            delete values.depositId_realMoney;

			confirmReceiptContract( values );
		})
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
		let payid      = item.item.payid;
		let money      = item.item.money;
		let rate       = item.item.rate;
		let oriMoney   = item.item.oriMoney || '0.00';
		let payName    = item.item.payName;
		let selectedPaymentComponents = [];
		{ !!receiptPaymentList && receiptPaymentList.map(function( item, index ){
			if( item.paymentKey != 'pos' ){
				selectedPaymentComponents.push(
					<Option
						 value = { item.id }
						 key = { item.id }
						 rate = { item.rate }
						 name = { item.name }
						 currentKey = { currentKey }
					 >
						{ item.name }
					 </Option>
				)
			}
		})}
		receiptComponents.push(
			<div key = { 'receipt_contract_order_write_' + item.key } className = 'receipt_content_write_body_item'>
                <div className = 'receipt_content_write_body_item_render'>
                    <img src = 'https://img.ishanshan.com/gimg/img/0c4428d0c3ce0f6ac07c3e27a998cbf3'/>
                    <Form layout = 'inline'>
                        <FormItem>
                            { getFieldDecorator('payid_' + item.key, {
                                initialValue : payid || undefined,
                            })(
                                <Select
                                    size = 'default'
                                    style = {{ width : '120px' }}
                                    placeholder = '选择收款方式'
                                    onSelect = { selectPayment }
                                >
                                    { selectedPaymentComponents }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            { getFieldDecorator('money_' + item.key, {
                                initialValue : money || undefined,
                            })(
                                <Input
                                    size = 'default'
                                    style = {{ width : '120px' }}
                                    placeholder = '收款金额'
                                    onBlur = { () => moneyChange( currentKey, payName ) }
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            { getFieldDecorator('rate_' + item.key, {
                                initialValue : rate || '0.0',
                            })(
                                <span className = 'form_item_rate'>{ '手续费率:' + ( rate || '0.00' ) + '%' }</span>
                            )}
                        </FormItem>
                        <FormItem>
                            { getFieldDecorator('real_serial_number_' + item.key, {
                                initialValue : undefined
                            })(
                                <Input
                                    size = 'default'
                                    style = {{ width : '380px' }}
                                    placeholder = '支付宝流水号'
                                />
                            )}
                        </FormItem>
                    </Form>
                </div>
                <div className = 'receipt_content_write_operation'>
                    <div className = 'receipt_content_write_ori_money'>实际到账：<a style = {{ cursor: 'default' }}>{ oriMoney }</a></div>
                    <Button size = 'small' type = 'ghost' onClick = { () => deleteReceiptWay( item.key ) }>删除</Button>
                    {/*<div className = 'receipt_content_write_delete_btn' onClick = { () => deleteReceiptWay( item.key ) }>删 除</div>*/}
                </div>
			</div>
		)
	})
	let receiptContentWrite = (
		<div className = 'receipt_content_write'>
			<div className = 'receipt_content_write_body'>
				<div className = 'receipt_content_write_body_scroll'>
                    <div style = {{ marginBottom : 20 , overflow : 'hidden' }}>
                        <QueueAnim
                            className={ orderDepositContent &&　orderDepositContent.length == 0 ? styles.contract_order_queueAnim : null }
                            type={['top', 'top']}
                            ease={['easeOutQuart', 'easeInOutQuart']}>
                            { !!wetherShowOrder ?
                                <div key = 'deposit_area'>
                                    <div className = 'receipt_content_write_body_item_render'>
                                        <img src = 'https://img.ishanshan.com/gimg/img/ddb03beee2baa9c39c7febf84aa38aab'/>
                                        <Form layout = 'inline' style = {{ lineHeight : '24px' }}>
                                            <FormItem>
                                                { getFieldDecorator('depositId',{
                                                    initialValue : orderDepositContent && orderDepositContent.length > 0 ? orderDepositContent[0].id : undefined
                                                })(
                                                    <Select placeholder = '请选择订金编号'
                                                        size = 'default'
                                                        allowClear
                                                        showSearch
                                                        optionFilterProp = "children"
                                                        notFoundContent = "未找到"
                                                        onChange = { OrderOnChange }
                                                        style = {{ width : 380 }}>
                                                        { orderDepositContent && orderDepositContent.length > 0 ? orderDepositContent.map(function(item,index){
                                                            return(
                                                                <Option value = { item.id + '' } key = { item.id + '' }>{ item.id }</Option>
                                                            )
                                                        }) : [] }
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                { getFieldDecorator('depositId_paId',{
                                                    initialValue : orderDepositContent && orderDepositContent.length > 0 ? orderDepositContent[0].paId : undefined
                                                })(
                                                    <Select
                                                        size = 'default'
                                                        style = {{ width : '120px' }}
                                                        placeholder = '选择收款方式'
                                                        onSelect = { selectPayment }
                                                        disabled = { true }
                                                    >
                                                        { paymentMethod && paymentMethod.length > 0 ? paymentMethod.map(function(item,index){
                                                            return(
                                                                <Option value = { item.id + '' } key = { item.id + '' }>{ item.name }</Option>
                                                            )
                                                        }) : [] }
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                { getFieldDecorator('depositId_money',{
                                                    initialValue : orderDepositContent && orderDepositContent.length > 0 ? orderDepositContent[0].money : undefined
                                                })(
                                                    <Input
                                                        size = 'default'
                                                        style = {{ width : '120px' }}
                                                        placeholder = '收款金额'
                                                        disabled = { true }
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                { getFieldDecorator('depositId_rate',{
                                                    initialValue : orderDepositContent && orderDepositContent.length > 0 ? orderDepositContent[0].fee : '0.00'
                                                })(
                                                    <span className = 'form_item_rate'>
                                                        手续费率:{ (parseFloat(getFieldValue('depositId_rate')*100).toFixed(2) || '0.00') + '%' }
                                                    </span>
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                { getFieldDecorator('depositId_rate_flow',{
                                                    initialValue : orderDepositContent && orderDepositContent.length > 0 ? orderDepositContent[0].realSerialNumber : undefined
                                                })(
                                                    <Input
                                                        size = 'default'
                                                        style = {{ width : '380px' }}
                                                        placeholder = '订金流水号'
                                                        disabled = { true }
                                                    />
                                                )}
                                            </FormItem>
                                        </Form>
                                    </div>
                                    <div className = 'receipt_content_write_operation' style = {{ borderBottom : '1px solid #ddd' }}>
                                        <div className = 'receipt_content_write_ori_money'>
                                            <FormItem>
                                                { getFieldDecorator('depositId_realMoney',{
                                                    initialValue : orderDepositContent && orderDepositContent.length > 0 ? orderDepositContent[0].realMoney : undefined
                                                })(
                                                    <span>
                                                        实际到账：<a style = {{ cursor : 'default' }}>{ (getFieldValue('depositId_realMoney') || '0.00') }</a>
                                                    </span>
                                                )}
                                            </FormItem>
                                        </div>
                                        <Button size = 'small' type = 'ghost' onClick = { CloseOrder }>取消</Button>
                                    </div>
                                </div>
                                :
                                orderDepositContent && orderDepositContent.length == 0 ?
                                <div className={styles.contract_no_order}>该合同并未关联订金</div>
                                :
                                <Button
                                    type = 'primary'
                                    size = 'small'
                                    style = {{ float : 'right' }}
                                    onClick = { ShowOrder }
                                >
                                    关联订金
                                </Button>
                            }
                        </QueueAnim>
                    </div>
                    <QueueAnim
                        type={['top', 'top']}
                        ease={['easeOutQuart', 'easeInOutQuart']}>
					    { receiptComponents }
                    </QueueAnim>
					<Button
						type = 'primary'
						size = 'small'
						style = {{ float : 'right' }}
						onClick = { addReceiptWay }
					>
						新增收款
					</Button>
				</div>
			</div>
			<div className = 'receipt_content_write_footer'>
				<div className = 'with_pos_list_footer_btnGroup'>
					<Button size = 'default' style = {{ marginRight : '20px' }} onClick = { cancelReceiptContract } >取消</Button>
					<Button size = 'default' type = 'primary' onClick = { confirmReceiptContractWrite } disabled = { receiptWriteBtnLoading } loading = { receiptWriteBtnLoading } >确定</Button>
				</div>
			</div>
		</div>
	)
	return (
        <Modal
			className = 'contract_order_receipt_modal'
			width = { 500 }
			title = '收款单'
			visible = { receiptFormVisible }
			onCancel = { cancelReceiptContract }
			maskClosable = { false }
			afterClose = { afterClose }
			footer = { null }
		>
            <Spin spinning = { modalLoading }>
                { receiptHeaderComponent }
                { ( receiptFormType == '1' && isOpenPos == '1' ) ? receiptContentWithPos
                    : ( receiptFormType == '1' && isOpenPos == '0' ) ? receiptContentWithoutPos
                    : receiptContentWrite }
            </Spin>
		</Modal>
    )
};

export default Form.create()(ContractOrderReceipt);
