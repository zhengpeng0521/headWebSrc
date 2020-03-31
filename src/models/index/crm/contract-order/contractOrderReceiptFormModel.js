import {
	getCurrentDate,              //得到当前日期值
	getIsOpenPos,                //判断是否开通pos
	getWaterSingleList,          //得到关联pos所得到的流水单列表
	confirmConnectPosList,       //确认关联流水单列表
	getPaymentList,              //得到收款方式列表
	confirmReceiptContract,      //手填收款单确认收款
    getDepositList,              //获取订金列表内容
    getPayment                   //获取收款方式
}from '../../../../services/crm/contract-order/contractOrderReceiptFormService';
import { parse } from 'qs';
import { message } from 'antd';
import moment from 'moment';
export default {

  	namespace: 'contractOrderReceiptFormModel',

  	state: {
		currentItem                      : undefined,            //当前收款的合同订单
		receiptFormVisible               : false,                //收款表单显隐
		receiptFormType                  : '1',                  //收款单手填或关联pos 1代表关联pos 2代表手填

		isOpenPos                        : '0',                  //是否开通pos   1代表开通, 0代表未开通

		/*关联pos参数*/
		payStartTime                     : undefined,            //支付开始时间
		payEndTime                       : undefined,            //支付结束时间
		uName                            : undefined,            //收银人姓名
		posOrderNo                       : undefined,            //订单号
		waterSingleList                  : [],                   //关联pos所得到的流水单列表
		waterSingleSelectedList          : [],                   //已选中的流水单列表
		withPosTotalMoney                : '0.00',               //所选中流水单的总金额
		receiptWithPosBtnLoading         : false,

		receiptPaymentList               : [],                   //手填收款单时的收款方式
		receiptWriteBtnLoading           : false,

        modalLoading                     : false,                //modal加载状态

        //关联订金
        wetherShowOrder                  : false,                //订金是否显示
        orderDepositContent              : [],                   //订金编号列表内容
        paymentMethod                    : [],                   //收款方式
	},



  	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if( pathname == '/crm_sorder_list' ) {

              	}
          	});
      	},
  	},

  	effects: {
		/*打开收款界面*/
		*openReceiptContract({ payload },{ call, put, select }){
			let { currentItem } = payload;            //当前所选中付款的合同
			/*调用接口判断是否开通pos*/
			let orgId = currentItem.organId;
			let isOpenPos = yield call( getIsOpenPos, ({ orgId }) );
			if( isOpenPos && isOpenPos.ret && isOpenPos.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						isOpenPos : !!isOpenPos.ret.data && isOpenPos.ret.data.status,
						currentItem
					}
				})
				//如果开通pos, 查询流水单列表
				if( !!isOpenPos.ret.data && isOpenPos.ret.data.status == '1' ){
					//得到当前日期
					let date = moment().format('YYYY-MM-DD');
					let params = {
						orgId,
						purchaseId   : currentItem.orderNumber,
						payStartTime : date,
						payEndTime   : date
					}
					/*获取已关联的pos流水单*/
					let waterSingleList = yield call( getWaterSingleList, ( params ));
					if( waterSingleList && waterSingleList.ret && waterSingleList.ret.errorCode == 9000 ){
						yield put({
							type : 'updateState',
							payload : {
								waterSingleList : waterSingleList.ret.results,
								...params
							}
						})
					}else{
						message.error( waterSingleList && waterSingleList.ret && waterSingleList.ret.errorMessage || '获取pos流水单列表失败' )
					}
				}
			}

			/*打开收款单框*/
			yield put({
				type : 'updateState',
				payload : {
					receiptFormVisible : true,
                    currentItem
				}
			})

			let state = yield select( state => state.contractOrderReceiptFormModel );

			/*获取收款方式下拉列表*/
			let paymentList = yield call( getPaymentList, ({ pageSize : 9999, pageIndex : 0 }));
			if( paymentList && paymentList.ret && paymentList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						receiptPaymentList : paymentList.ret.results
					}
				})
			}else{
				message.error( paymentList && paymentList.ret && paymentList.ret.retMessage || '收款方式下拉列表获取失败' )
			}

		},

		/*筛选流水单列表*/
		*searchWaterSingleList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					searchWaterListLoading : true
				}
			})
			let { params } = payload;
			let state = yield select( state => state.contractOrderReceiptFormModel );
			let currentItem = state.currentItem;
			let values = {
				orgId      : currentItem.organId,
				purchaseId : currentItem.orderNumber,
				...params
			}
			let waterSingleList = yield call( getWaterSingleList, ( values ));
			if( waterSingleList && waterSingleList.ret && waterSingleList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						waterSingleList         : waterSingleList.ret.results,
						waterSingleSelectedList : [],
						withPosTotalMoney       : '0.00',
						...params
					}
				})
			}else{
				message.error( waterSingleList && waterSingleList.ret && waterSingleList.ret.errorMessage || '获取pos流水单列表失败' )
			}
		},

		//确认关联pos流水单
		*confirmConnectPosList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					receiptWithPosBtnLoading : true
				}
			})
			let { posInfo } = payload;
			let state = yield select( state => state.contractOrderReceiptFormModel );
			let currentItem = state.currentItem;
			let params = {
				orgId      : currentItem.organId,
				purchaseId : currentItem.orderNumber,
				posInfo    : JSON.stringify( posInfo )
			}
			let { ret } = yield call( confirmConnectPosList, ( params ) );
			if( ret && ret.errorCode == 9000 ){
                message.success('关联pos流水单成功');
				yield put({
					type : 'contractOrderModel/getContractOrderListParams',
					payload : {}
				})
				yield put({
					type : 'contractOrderModel/updateState',
					payload : {
						selectedRows              : [],
						selectedRowKeys           : []
					}
				})
				yield put({
					type : 'updateState',
					payload : {
						currentItem             : undefined,
						waterSingleList         : [],
						waterSingleSelectedList : [],
						withPosTotalMoney       : '0.00',
						receiptFormVisible      : false,
						receiptFormType         : '1'
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '关联流水单失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					receiptWithPosBtnLoading : false
				}
			})
		},

		/*手填收款单支付成功*/
		*confirmReceiptContract({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					receiptWriteBtnLoading   : true,
				}
			})
			let state = yield select( state => state.contractOrderReceiptFormModel );
			let currentItem = state.currentItem;
			let { values } = payload;
			let params = {
                depositId : values && values.depositId ? values.depositId : undefined,
				orderId   : currentItem.orderNumber,
				bExtMoney : 0,
				payway    : JSON.stringify( values.payway )
			}
			let { ret } = yield call( confirmReceiptContract, ( params ));
			if( ret && ret.errorCode == 9000 ){
                message.success('手填收款单支付成功');
				yield put({
					type : 'contractOrderModel/getContractOrderListParams',
					payload : {}
				})
				yield put({
					type : 'contractOrderModel/updateState',
					payload : {
						selectedRows              : [],
						selectedRowKeys           : []
					}
				})
				yield put({
					type : 'updateState',
					payload : {
						currentItem             : undefined,
						waterSingleList         : [],
						waterSingleSelectedList : [],
						withPosTotalMoney       : '0.00',
						receiptFormVisible      : false,
						receiptFormType         : '1',
                        wetherShowOrder         : false,                //订金是否显示
                        orderDepositContent     : [],                   //订金编号列表内容
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '收款失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					receiptWriteBtnLoading   : false,
				}
			})
		},

        //获取订金列表内容
        *'getDepositList'({ payload },{ call, put, select }){
            yield put({ type : 'showModalLoading' });
            let { ret } = yield call(getDepositList,parse(payload));
            if(ret && ret.errorCode == '9000'){
                //获取收款方式
                yield put({
                    type:'getPayment',
                    payload:{
                        pageIndex:0,
                        pageSize:99999,
                        orderDepositContent : ret.results,
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取订金列表内容')
            }
            yield put({ type : 'closeModalLoading' })
        },

        //获取收款方式
        *'getPayment'({ payload },{ call, put, select }){
            let orderDepositContent = payload.orderDepositContent;
            delete payload.orderDepositContent;
            let { ret } = yield call(getPayment,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type:'updateState',
                    payload:{
                        paymentMethod : ret.results,
                        orderDepositContent,
                        wetherShowOrder : true
                    }
                })
                if(orderDepositContent.length > 0){
                    yield put({ type:'updateState' , payload : { wetherShowOrder : true } })
                }else{
                    yield put({ type:'updateState' , payload : { wetherShowOrder : false } })
                }
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取收款方式失败')
            }
        },
  	},

  	reducers: {
		updateState( state, action ){
			return {...state, ...action.payload};
		},
        showModalLoading( state, action ){
            return { ...state, modalLoading : true };
        },
        closeModalLoading( state, action ){
            return { ...state, modalLoading : false };
        },
  	},
}
