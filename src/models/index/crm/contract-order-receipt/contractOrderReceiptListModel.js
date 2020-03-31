import {
	getReceiptList,
	getPaymentList,
    checkPayInfo,
} from '../../../../services/crm/contract-order-receipt/contractOrderReceiptListService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'contractOrderReceiptListModel',

    state : {
		searchVisible               : false,

		/*常用搜索*/
		id                          : undefined,            //收款单号
		receiverName                : undefined,            //收款人姓名
		paymentId                   : undefined,            //收款方式

		paymentSelectList           : [],                   //收款下拉列表

		/*高级搜索*/
		orderNum                    : undefined,            //合同号
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

		selectedRowKeys             : [],
        ContractReceiptCheckVisible : false,
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/hq_orgdata_payinfo' ){
					dispatch({
						type : 'getReceiptListParams',
						payload : {
							pageSize : 20
						}
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
				pageSize  : payload.pageSize
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
			yield put({ type : 'updateState', payload : { loading : true } });
			let { params } = payload;
			let state = yield select( state => state.contractOrderReceiptListModel );
			let { ret } = yield call( getReceiptList, ( {  ...params } ));
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
			yield put({ type : 'updateState', payload : { loading : false } });
		},
        //收款单审核
        *checkPayInfo({ payload },{ call, put, select }){
            let params = {
                payInfoId : payload.payInfoId,
                status    : payload.status,
                orgId     : payload.orgId,
            }
			let { ret } = yield call( checkPayInfo, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						ContractReceiptCheckVisible : false,
                        selectedRowKeys             : [],
					}
				})
                yield put({
                    type : 'getReceiptList',
                    payload : {
                        pageIndex : 0,
                        pageSize  : 20,
                    }
                })
                if(payload.status=='1'){
                    message.success( '确认收款成功')
                }else if(payload.status=='2'){
                    message.success( '该收款单作废成功')
                }

			}else{
				message.error( ret && ret.errorMessage || '收款单审核失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false } });
		},
	},

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
