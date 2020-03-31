import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Popover, Icon, message } from 'antd';
import moment from 'moment';
import { StatusFlag, NewModal } from '../../../components/common/new-component/NewComponent';
import ContractOrderReceiptComponent from '../../../components/crm/contract-order/ContractOrderReceipt';

function ContractOrderReceiptFormPage({ dispatch, contractOrderReceiptFormModel }) {
	let {
		currentItem,                            //当前收款的合同订单

		receiptFormVisible,                     //收款表单显隐
		receiptFormType,                        //收款单手填或关联pos 1代表关联pos 2代表手填

		isOpenPos,                              //是否开通pos

		waterSingleList,                        //关联pos所得到的流水单列表
		waterSingleSelectedList,                //已选中的流水单列表
		withPosTotalMoney,                      //所选中流水单的总金额
		payStartTime,                           //支付开始时间
		payEndTime,                             //支付结束时间
		uName,                                  //收银人姓名
		posOrderNo,                             //订单号

		receiptPaymentList,                     //手填收款单时的收款方式

		receiptWithPosBtnLoading,
		receiptWriteBtnLoading,

        modalLoading,                           //modal加载状态
        wetherShowOrder,                        //订金是否显示
        orderDepositContent,                    //订金编号列表内容
        paymentMethod,                          //收款方式

    } = contractOrderReceiptFormModel;
	//切换收款方式
	function changeReceiptType( value ){
		dispatch({
			type : 'contractOrderReceiptFormModel/updateState',
			payload : {
				receiptFormType : value == '1' ? '2' : '1'
			}
		})
        if( value == '1' ){
            //获取订金列表内容
            dispatch({
                type:'contractOrderReceiptFormModel/getDepositList',
                payload:{
                    stuId : currentItem.orderStuId || currentItem.stuId,
                    orgId : currentItem.organId,
                    status : '1',
                    pageIndex : 0,
                    pageSize : 99999
                }
            })
        }
	}

//	//改变时间筛选流水单列表
//	function timeChangeGetList( moment, values ){
//		let payStartTime = values[0];
//		let payEndTime = values[1];
//		dispatch({
//			type : 'contractOrderReceiptFormModel/searchWaterSingleList',
//			payload : {
//				params : {
//					payStartTime,
//					payEndTime,
//					uName,
//					posOrderNo
//				}
//			}
//		})
//	}
//
//	//改变合同订单号
//	function purchaseIdChange( value ){
//		dispatch({
//			type : 'contractOrderReceiptFormModel/searchWaterSingleList',
//			payload : {
//				payStartTime,
//				payEndTime,
//				uName,
//				posOrderNo : value
//			}
//		})
//	}
//
//	//改变收银人
//	function chargeManChange( value ){
//		dispatch({
//			type : 'contractOrderReceiptFormModel/searchWaterSingleList',
//			payload : {
//				payStartTime,
//				payEndTime,
//				posOrderNo,
//				uName : value
//			}
//		})
//	}

	//筛选流水单列表
	function searchWaterSingleList( values ){
		dispatch({
			type : 'contractOrderReceiptFormModel/searchWaterSingleList',
			payload : {
				params : values,
			}
		})
	}

	//选择流水号
	function selectPosListItem( index ){
		let currentSelectedItem =  waterSingleList[index];
		let selected = currentSelectedItem.selected;
		currentSelectedItem.selected = !selected;
		waterSingleList[index] = currentSelectedItem;
		let waterSingleSelectedList = [];
		let withPosTotalMoney = 0;
		waterSingleList && waterSingleList.map(function( item, index ){
			if( !!item.selected ){
				//得到所选中的列表 以及总金额
				waterSingleSelectedList.push( item );
				withPosTotalMoney += Number(item.amountMoney)
			}
		})
		dispatch({
			type : 'contractOrderReceiptFormModel/updateState',
			payload : {
				waterSingleList,
				waterSingleSelectedList,
				withPosTotalMoney : withPosTotalMoney.toFixed(2)
			}
		})
	}

	//确认关联pos流水单
	function confirmConnectPosList(){
		if( waterSingleSelectedList.length == 0 ){
			message.error( '未选中流水单' );
			return;
		}
		let posInfo = [];
		!!waterSingleSelectedList && waterSingleSelectedList.length > 0 && waterSingleSelectedList.map(function( item, index ){
			posInfo.push({
				posOrderId   : item.posOrderId,         //交易编号
				amountMoney  : item.amountMoney,        //总金额（保留两位）
				realPayMoney : item.realPayMoney,       //实际支付（保留两位）
				posOrderNo   : item.posOrderNo          //pos订单号
			})
		})
		dispatch({
			type : 'contractOrderReceiptFormModel/confirmConnectPosList',
			payload : {
				posInfo
			}
		})
	}

	//手填时确认收款
	function confirmReceiptContract( values ){
		dispatch({
			type : 'contractOrderReceiptFormModel/confirmReceiptContract',
			payload : {
				values
			}
		})
	}

	//取消收款
	function cancelReceiptContract(){
		dispatch({
			type : 'contractOrderReceiptFormModel/updateState',
			payload : {
				receiptFormVisible      : false,
				waterSingleList         : [],
				waterSingleSelectedList : [],
				withPosTotalMoney       : '0.00',
				payStartTime            : undefined,
				payEndTime              : undefined,
				uName                   : undefined,
				posOrderNo              : undefined,
				receiptFormType         : '1',
                modalLoading            : false,                //modal加载状态

                //关联订金
                wetherShowOrder         : false,                //订金是否显示
                orderDepositContent     : [],                   //订金编号列表内容
			}
		})
	}

    //点击新增订金
    function ShowOrder(){
        //获取订金列表内容
        dispatch({
            type:'contractOrderReceiptFormModel/getDepositList',
            payload:{
                stuId : currentItem.orderStuId,
                orgId : currentItem.organId,
                status : '1',
                pageIndex : 0,
                pageSize : 99999
            }
        })
    }

    //取消新增订金
    function CloseOrder(){
        dispatch({
            type:'contractOrderReceiptFormModel/updateState',
            payload:{
                wetherShowOrder : false
            }
        })
    }

	//收款单属性
	let contractOrderReceiptProps = {
		currentItem,               //当前收款的合同订单
		receiptFormVisible,        //收款表单显隐
		receiptFormType,           //收款单手填或关联pos 1代表关联pos 2代表手填
		changeReceiptType,

		isOpenPos,                 //是否开通pos

		waterSingleList,           //关联pos所得到的流水单列表
		waterSingleSelectedList,   //已选中的流水单列表
		withPosTotalMoney,         //所选中流水单的总金额
		payStartTime,              //支付开始时间
		payEndTime,                //支付结束时间
		uName,                     //收银人姓名
		posOrderNo,                //订单号
//		timeChangeGetList,         //改变时间阶段筛选流水单列表
//		purchaseIdChange,          //改变合同订单号筛选
//		chargeManChange,           //改变收银人筛选
		searchWaterSingleList,     //搜索流水单列表
		confirmConnectPosList,     //确认关联pos流水单

		selectPosListItem,         //选择流水单

		receiptPaymentList,        //手填收款单时的收款方式
		confirmReceiptContract,    //手填收款单确认


		cancelReceiptContract,     //取消收款

		receiptWithPosBtnLoading,
		receiptWriteBtnLoading,

        modalLoading,                  //modal加载状态

        wetherShowOrder,               //订金是否显示
        orderDepositContent,           //订金编号列表内容
        paymentMethod,                 //收款方式
        ShowOrder,                     //点击新增订金
        CloseOrder,                    //取消新增订金

	}
	return (
		<ContractOrderReceiptComponent { ...contractOrderReceiptProps } />
	)
}
function mapStateToProps({ contractOrderReceiptFormModel }) {
  	return { contractOrderReceiptFormModel };
}

export default connect(mapStateToProps)(ContractOrderReceiptFormPage);
