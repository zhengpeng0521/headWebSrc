import {
	getReceiptList,            //收款单列表
	getSendClassList,          //赠送课时列表
	getContractOrderDetail,    //合同详情

	getOrder,                  //得到合同订单内容打印

	passOrder,                 //审核通过订单
	rejectOrder,               //审核不通过


	getCurrentItem,            //合同编号查询得到单条记录

	getPaymentList,            //得到收款方式
	getBalance,                //得到余额信息

	confirmReceiptContract,   //确认支付
	deleteContractOrder,      //删除合同订单


} from '../../../../services/crm/contract-order/contractOrderDetailService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'contractOrderDetailModel',

    state : {
		id                    : undefined,           //合同id
        tenantId              : undefined,
        orgId                 : undefined,
		currentItem           : undefined,           //选择的列表项
		detailVisible         : false,               //详情是否显示
		activeKey             : '1',                 //当前激活的tab
		routerType            : undefined,

		/*收款单参数*/
		receiptDataSource     : [],
		receiptResultCount    : 0,
		receiptPageIndex      : 0,
		receiptPageSize       : 10,
		receiptLoading        : false,

		/*赠课记录参数*/
		sendClassDataSource   : [],
		sendClassResultCount  : 0,
		sendClassPageSize     : 10,
		sendClassPageIndex    : 0,
		sendClassLoading      : false,

		/*合同详情*/
		contractOrderDetail   : {},

		/*审核合同参数*/
		checkContractOrderVisible  : false,

		/*收款参数*/
		ReceiptContractOrderVisible : false,
		receiptPaymentList          : [],
		balance                     : 0
	},

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/contract_order_detail' ){

				}
            })
        }
    },

    effects : {
		/*显示详情*/
		*showDetail({ payload },{ call, put, select }){
			let { id, item } = payload;                         //得到合同id
			yield put({
				type : 'updateState',
				payload : {
					detailVisible : true,
					activeKey     : '1',
					currentItem   : item,
					id,
                    tenantId : item.tenantId,
                    orgId : item.orgId
				}
			});
//			yield put({
//				type : 'contractOrderDetail',
//				payload : {
//                    id,
//                    tenantId : item.tenantId,
//                    orgId    : item.orgId,
//				}
//			})
            yield put({
				type : 'getReceiptListParams',
				payload : {

				}
			})
		},

		/*改变tab*/
		*changeTab({ payload },{ call, put, select }){
			let { activeKey } = payload;
			yield put({
				type : 'updateState',
				payload : {
					activeKey
				}
			})
			if( activeKey == '1' ){
				yield put({
					type : 'getReceiptListParams',
					payload : {}
				})
			}else if( activeKey == '2' ){
				yield put({
					type : 'getSendClassListParams',
					payload : {}
				})
			}else if( activeKey == '3' ){
				yield put({
					type : 'contractOrderDetail',
					payload : {}
				})
			}
		},

        /*获取收款单所需参数*/
		*getReceiptListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderDetailModel );
			let params = {
				purchaseId : state.id,
                tenantId   : state.tenantId,
                orgId      : state.orgId,
				pageSize   : state.receiptPageSize,
				pageIndex  : 0,
			}
			yield put({
				type : 'getReceiptList',
				payload : {
					params
				}
			})
		},

        /*获取收款单记录*/
		*getReceiptList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					receiptLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getReceiptList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						receiptDataSource  : ret.results,
						receiptResultCount : ret.data.resultCount,
						receiptPageSize    : params.pageSize,
						receiptPageIndex   : params.pageIndex
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					receiptLoading : false
				}
			})
		},

        /*收款单分页*/
		*receiptPagination({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderDetailModel );
			let params = {
				purchaseId : state.id,
				pageSize   : payload.receiptPageSize,
				pageIndex  : payload.receiptPageIndex - 1
			}
			yield put({
				type : 'getReceiptList',
				payload : {
					params
				}
			})
		},

        /*赠送课时所需参数*/
		*getSendClassListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderDetailModel );
			let params = {
				purchaseId : state.id,
				pageSize   : state.sendClassPageSize,
				pageIndex  : 0,
                tenantId   : state.tenantId,
                orgId      : state.orgId,
			}
			yield put({
				type : 'getSendClassList',
				payload : {
					params
				}
			})
		},

		/*赠送课时列表*/
		*getSendClassList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					sendClassLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getSendClassList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						sendClassDataSource  : ret.results,
						sendClassResultCount : ret.data.resultCount,
						sendClassPageSize    : params.pageSize,
						sendClassPageIndex   : params.pageIndex
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表数据失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					sendClassLoading : false
				}
			})
		},

		/*赠送课时分页*/
		*sendClassPagination({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderDetailModel );
			let params = {
				purchaseId : state.id,
				pageSize   : payload.sendClassPageSize,
				pageIndex  : payload.sendClassPageIndex - 1
			}
			yield put({
				type : 'getSendClassList',
				payload : {
					params
				}
			})
		},

		/*合同详情界面*/
		*contractOrderDetail({ payload },{ call, put, select }){
            let state = yield select( state => state.contractOrderDetailModel );
			let params = {
				id : state.id,
                tenantId : state.tenantId,
                orgId : state.orgId,
			}
			let { ret } = yield call( getContractOrderDetail, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						contractOrderDetail : ret.data
					}
				})
			}
		},

		/*审核*/
		*confrimCheckContractOrder({ payload },{ call, put, select }){
			let { status, values } = payload;
			let state = yield select( state => state.contractOrderDetailModel );
			let params = {
				orderId : state.id,
				...values
			}
			let ret = {};
			if( status == '1' ){
				/*审核通过*/
				ret = yield call( passOrder, ( params ));
			}else if( status == '0' ){
				ret = yield call( rejectOrder , ( params ))
			}
			if( ret && ret.ret && ret.ret.errorCode == 9000 ){
				yield put({
					type : 'contractOrderModel/getContractOrderListParams',
					payload : {}
				})
				yield put({
					type : 'updateState',
					payload : {
						checkContractOrderVisible : false
					}
				})
				let currentItem = yield call( getCurrentItem, ({ pageSize : 10, pageIndex : 0, orderNumber : state.id }));
				if( currentItem && currentItem.ret && currentItem.ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
							currentItem : !!currentItem.ret.results && currentItem.ret.results[0]
						}
					})
				}
				if( state.routerType == 300 ){
					yield put({
						type : 'updateState',
						payload : {
							detailVisible : false
						}
					})
				}
			}
		},

		/*打开收款模态框*/
		*receiptContractOrder({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderDetailModel );
			let currentItem = state.currentItem;
			let cardId = currentItem.stuCardId;
			let receiptContractOrderVisible = state.receiptContractOrderVisible;
			let balance = yield call( getBalance, ({ stuCardId : cardId }));
			if( balance && balance.ret && balance.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						balance : balance.ret.data.balance || 0
					}
				})
			}
			let { ret } = yield call( getPaymentList );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						receiptContractOrderVisible : true,
						receiptPaymentList          : ret.results
					}
				})
			}
		},

		/*支付成功*/
		*confirmReceiptContract({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderDetailModel );
			let { values } = payload;
			let params = {
				orderId   : state.id,
				bExtMoney : 0,
				payway    : JSON.stringify( values.payway )
			}
			let { ret } = yield call( confirmReceiptContract, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'contractOrderModel/getContractOrderListParams',
					payload : {}
				})
				yield put({
					type : 'updateState',
					payload : {
						receiptContractOrderVisible : false
					}
				})
				let currentItem = yield call( getCurrentItem, ({ pageSize : 10, pageIndex : 0, orderNumber : state.id }));
				if( currentItem && currentItem.ret && currentItem.ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
							currentItem : !!currentItem.ret.results && currentItem.ret.results[0]
						}
					})
				}
				if( state.routerType == 400 ){
					yield put({
						type : 'updateState',
						payload : {
							detailVisible : false
						}
					})
				}
			}
		},

		/*删除合同订单*/
		*deleteContractOrder({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderDetailModel );
			let { orderId } = payload;
			let { ret } = yield call( deleteContractOrder, ({ orderId }));
			if( ret && ret.errorCode == 9000 ){
                message.success('删除成功')
				yield put({
					type : 'contractOrderModel/getContractOrderListParams',
				})
				yield put({
					type : 'updateState',
					payload : {
						detailVisible : false
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '删除失败' )
			}
		}
    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
