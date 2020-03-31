import {
	getReceiptList,
	getPaymentList
} from '../../../../services/crm/contract-order/contractOrderReceiptListService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'contractOrderReceiptListModel',

    state : {
		searchVisible               : false,

		/*常用搜索*/
		tenantId										: undefined,
		orgId												: undefined,
		id                          : undefined,            //收款单号
		receiverName                : undefined,            //收款人姓名
		paymentId                   : undefined,            //收款方式

		paymentSelectList           : [],                   //收款下拉列表

		/*高级搜索*/
		purchaseId                  : undefined,            //合同号
		orgId                       : undefined,            //校区id
		acctNo                      : undefined,            //收款账号
		realSerialNumber            : undefined,            //流水号

		/*高级搜索*/
		loading                     : false,
		dataSource                  : [],
		resultCount                 : 0,
		pageIndex                   : 0,
		pageSize                    : 20,
		newColumns                  : [],

		selectedRowKeys             : []
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/crm_sorder_receiptlist' ){
					dispatch({
						type : 'getReceiptListParams'
					})
					dispatch({
						type : 'getSelectList'
					})
				}
            })
        }
    },

    effects : {
		/*初次进入得到下拉列表*/
		*getSelectList({ payload },{ call, put, select }){
			let { ret } = yield call( getPaymentList, ({ pageIndex : 0, pageSize : 9999 }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						paymentSelectList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '收款下拉列表加载失败' )
			}
		},

		/*初次进入所需参数*/
		*getReceiptListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderReceiptListModel );
			let params = {
				pageIndex : 0,
				pageSize  : state.pageSize
			}
			yield put({
				type : 'getReceiptList',
				payload : {
					params
				}
			})
		},

		/*得到收款单列表*/
		*getReceiptList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					loading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getReceiptList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource  : ret.results,
						resultCount : ret.data.resultCount,
						...params
					}
				})
			}else{
				message.error( ret && ret.errorCode || '收款单列表加载失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					loading : false
				}
			})
		}
	},

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
