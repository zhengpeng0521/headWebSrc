import {
	getContractOrderList,               //得到合同订单列表
    passOrder,                          //审核通过订单
	rejectOrder,                        //审核不通过
} from '../../../../services/crm/contract-order/contractOrderService';
import React from 'react';
import { parse } from 'qs';
import { message } from 'antd';
export default {

  	namespace: 'contractOrderModel',

  	state: {
		/*表格项参数*/
		dataSource                 : [],
		newColumns                 : [],
		resultCount                : 0,
		loading                    : false,
		pageIndex                  : 0,
		pageSize                   : 20,

        /*审核*/
        selectedRows               : [],
        selectedRowKeys            : [],
        currentItem                : {},
        checkContractBtnLoading    : false,
        checkContractOrderVisible  : false,
        checkContractBtnFailLoading: false,

		searchValues							 : {},
		/*搜索*/
		orgIds                     : undefined,
		tenantIds                  : undefined,
		mobile                     : undefined,                //手机号

		/*高级搜索*/
		searchVisible              : false,
		orderNewOldStu             : undefined,                //签约类型
		signType                   : undefined,
		type                       : undefined,                //购买类型
		parentName                 : undefined,                //签约家长
		orderState                 : undefined,                //审核状态
		receiptStatus              : undefined,                //收款状态
		createPersonName           : undefined,                //创建人姓名
		startTime                  : undefined,
		endTime                    : undefined,                //签约日期
        estartTime                 : undefined,
        eendTime                   : undefined,                //到期日期
        expireInvalid              : undefined,                //过期作废
	},

  	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if( pathname === 'hq_orgdata_purchase' ){
					dispatch({
						type : 'getContractOrderListParams',
						payload : {
							pageSize : 20
						}
					})
				}
          	});
      	},
  	},

  	effects: {
		/*得到合同订单列表所需参数*/
		*getContractOrderListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderModel );
			let params = {
				pageIndex         : state.pageIndex,
				pageSize          : payload.pageSize,

                /*常用搜索*/
				orgIds            : state.orgIds,
				tenantIds         : state.tenantIds,
                mobile            : state.mobile,                //手机号

                /*高级搜索*/
                orderNewOldStu    : state.orderNewOldStu,        //签约类型
                signType          : state.signType,
                type              : state.type,                  //购买类型
                parentName        : state.parentName,            //签约家长
                orderState        : state.orderState,            //审核状态
                receiptStatus     : state.receiptStatus,         //收款状态
                createPersonName  : state.createPersonName,      //创建人姓名
                startTime         : state.startTime,
                endTime           : state.endTime,               //签约日期
                estartTime        : state.estartTime,
                eendTime          : state.eendTime,              //到期日期
                expireInvalid     : state.expireInvalid,
			}
			yield put({
				type : 'getContractOrderList',
				payload : {
					params
				}
			})
		},

		/*得到合同订单列表*/
		*getContractOrderList({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true } })
			let { params } = payload;
			let { ret } = yield call( getContractOrderList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				let searchValues = {...params}
				delete searchValues.pageIndex
				delete searchValues.pageSize

				yield put({
					type : 'updateState',
					payload : {
						dataSource  : ret.results,
						resultCount : ret.data.resultCount,
						searchValues,
						...params
					}
				})
			}
			yield put({ type : 'updateState', payload : { loading : false } })
		},

		/*常用搜索 重置*/
		*searchFunction({ payload },{ call, put, select }){
			let { values } = payload;
			let state = yield select( state => state.contractOrderModel );
			let params = {
				pageSize          : state.pageSize,
				pageIndex         : 0,

				/*高级搜索*/
				signType          : state.signType,
				type              : state.type,
				parentName        : state.parentName,
				orderState        : state.orderState,
				receiptStatus     : state.receiptStatus,
				createPersonName  : state.createPersonName,
				startTime         : state.startTime,
				endTime           : state.endTime,
                estartTime        : state.estartTime,
                eendTime          : state.eendTime,              //到期日期
                expireInvalid     : state.expireInvalid,

				...values
			}
			yield put({
				type : 'getContractOrderList',
				payload : {
					params
				}
			})
		},

		/*高级搜索 重置*/
		*onSuperSearch({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderModel );
			let { values } = payload;
			let startTime = undefined;
			let endTime = undefined;

            let estartTime = undefined;
            let eendTime = undefined;

			if( !!values && !!values.time && values.time[0] && values.time[1] ){
				startTime = values.time[0].format('YYYY-MM-DD HH:mm:00')
				endTime = values.time[1].format('YYYY-MM-DD HH:mm:00')
			}
            if( !!values && !!values.eTime && values.eTime[0] && values.eTime[1] ){
				estartTime = values.eTime[0].format('YYYY-MM-DD HH:mm:00')
				eendTime = values.eTime[1].format('YYYY-MM-DD HH:mm:59')
			}
			let params = {
				pageSize          : state.pageSize,
				pageIndex         : 0,

				orgIds            : state.orgIds,
				tenantIds         : state.tenantIds,
				mobile            : state.mobile,

				/*高级搜索*/
				signType          : values.signType,
				type              : values.type,
				parentName        : values.parentName,
				orderState        : values.orderState,                //审核状态
				receiptStatus     : values.receiptStatus,          //收款状态

				createPersonName  : values.createPersonName,
				startTime,
				endTime,
                estartTime ,
				eendTime,
                expireInvalid     : values.expireInvalid,

			}
			yield put({
				type : 'getContractOrderList',
				payload : {
					params
				}
			})
		},

		/*分页*/
		*pagination({ payload },{ call, put, select }){
			let state = yield select( state => state.contractOrderModel );
			let params = {
				pageSize          : payload.pageSize,
				pageIndex         : payload.pageIndex - 1,

				orgIds            : state.orgIds,
				tenantIds         : state.tenantIds,
				mobile            : state.mobile,

				/*高级搜索*/
				orderNewOldStu    : state.orderNewOldStu,
				type              : state.type,
				parentName        : state.parentName,
				orderState        : state.orderState,
				receiptStatus     : state.receiptStatus,
				createPersonName  : state.createPersonName,
				startTime         : state.startTime,
				endTime           : state.endTime,
                estartTime        : state.estartTime,
                eendTime          : state.eendTime,              //到期日期
                expireInvalid     : state.expireInvalid,

			}
			yield put({
				type : 'getContractOrderList',
				payload : {
					params
				}
			})
		},

        /*选择列表项*/
		*rowSelectChange({ payload },{ call, put, select }){
			let { selectedRowKeys, selectedRows } = payload;
			yield put({
				type : 'updateState',
				payload : {
					currentItem : !!selectedRows && selectedRows[0],
					selectedRowKeys,
					selectedRows,
				}
			})
		},

        /*审核*/
		*confrimCheckContractOrder({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					checkContractBtnLoading : true,
					checkContractBtnFailLoading : true
				}
			})
			let { status, values } = payload;
			let state = yield select( state => state.contractOrderModel );
            let indexMainLayoutModel = yield select( state => state.indexMainLayoutModel );
			let params = {
				orderId     : !!state.currentItem && state.currentItem.orderNumber,
                orgId       : !!state.currentItem && state.currentItem.organId,
                tenantId    : !!state.currentItem && state.currentItem.tenantId,
                checkUserId : !!indexMainLayoutModel.userMsg && indexMainLayoutModel.userMsg.userId,
				...values
			}
			let ret = {};
			if( status == '1' ){
				/*审核通过*/
				ret = yield call( passOrder, ( params ));
			}else if( status == '0' ){
                /*驳回*/
				ret = yield call( rejectOrder , ( params ))
			}

			if( ret && ret.ret && ret.ret.errorCode == 9000 ){
                message.success( ret && ret.ret && ret.ret.errorMessage ? ret.ret.errorMessage : '成功');
				yield put({
					type : 'getContractOrderListParams',
                    payload : {
                        pageSize : state.pageSize
                    }
				})
				yield put({
					type : 'updateState',
					payload : {
						checkContractOrderVisible : false,
						selectedRows              : [],
						selectedRowKeys           : []
					}
				})
			}else{
				message.error( ret && ret.ret && ret.ret.errorMessage ? ret.ret.errorMessage : '操作失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					checkContractBtnLoading     : false,
					checkContractBtnFailLoading : false
				}
			})
		},
  	},

  	reducers: {
		updateState( state, action ){
			return { ...state, ...action.payload };
		},
        showContractOrderImportModalButtonLoading(state, action){
            return { ...state, contractOrderImportModalButtonLoading : true };
        },
        closeContractOrderImportModalButtonLoading(state, action){
            return { ...state, contractOrderImportModalButtonLoading : false };
        },
        showThirdButtonDisplay(state, action){
            return { ...state, thirdLastButtonDisplay : 'inline-block' };
        },
        closeThirdButtonDisplay(state, action){
            return { ...state, thirdLastButtonDisplay : 'none' };
        }
  	},
}
