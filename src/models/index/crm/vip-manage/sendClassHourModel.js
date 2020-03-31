import {
	getSendClassHourList,
	checkSendClass            //审核
} from '../../../../services/crm/vip-manage/sendClassHourService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'sendClassHourModel',

    state : {
		/*常用搜索项*/
		purchaseId            : undefined,
		cardId                : undefined,
		status                : undefined,

		/*高级搜索项*/
		searchVisible         : false,
		orgId                 : undefined,
		creatorName           : undefined,

		/*表格参数*/
		dataSource            : [],
		loading               : false,
		resultCount           : 0,
		pageSize              : 20,
		pageIndex             : 0,
		newColumns            : [],

		selectedRowKeys       : [],
		selectedRows          : [],
		selectedRecordIds     : [],

		/*审核模态框*/
		chechClassVisible     : false,
		checkClassBtnLoading  : false,
		checkClassBtnFailLoading : false

    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/crm_card_give' ){
                    dispatch({
                        type    : 'getSendClassHourListParams',
                        payload : {

                        }
                    });
				}
            })
        }
    },

    effects : {
        *getSendClassHourListParams({ payload },{ call, put, select }){
			let sendClassHourModel = yield select( state => state.sendClassHourModel );
			let params = {
				pageIndex : 0,
				pageSize : sendClassHourModel.pageSize,
			}
			yield put({
				type : 'getSendClassHourList',
				payload : {
					params
				}
			})
		},
		/*得到列表*/
		*getSendClassHourList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					loading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getSendClassHourList, ( params ) );
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
				message.error( ret && ret.errorMessage || '获取列表失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					loading : false
				}
			})
		},

		/*常用搜索*/
		*searchFunction({ payload },{ call, put, select }){
			let { values } = payload;
			let sendClassHourModel = yield select( state => state.sendClassHourModel );
			let params = {
				pageIndex   : 0,
				pageSize    : sendClassHourModel.pageSize,
				orgId       : sendClassHourModel.orgId,
				creatorName : sendClassHourModel.creatorName,
				...values
			};
			yield put({
				type : 'getSendClassHourList',
				payload : {
					params
				}
			})
		},

		/*高级搜索*/
		*onSuperSearch({ payload },{ call, put, select }){
			let { values } = payload;
			let sendClassHourModel = yield select( state => state.sendClassHourModel );
			let params = {
				pageIndex  : 0,
				pageSize   : sendClassHourModel.pageSize,
				purchaseId : sendClassHourModel.purchaseId,
				cardId     : sendClassHourModel.cardId,
				status     : sendClassHourModel.status,
				...values,
			}
			yield put({
				type : 'getSendClassHourList',
				payload : {
					params
				}
			})
		},

		/*表格项选择*/
		*rowSelectChange({ payload },{ call, put, select }){
			let { selectedRows, selectedRowKeys } = payload;
			let selectedRecordIds = [];
			!!selectedRows && selectedRows.map(function( item, index ){
				selectedRecordIds.push( item.id )
			})
			yield put({
				type : 'updateState',
				payload : {
					selectedRows,
					selectedRowKeys,
					selectedRecordIds
				}
			})
		},

		/*审核赠课*/
		*checkSendClass({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					checkClassBtnFailLoading : true,
					checkClassBtnLoading : true
				}
			})
			let { recordIds, status } = payload;
			let sendClassHourModel = yield select( state => state.sendClassHourModel );
			let params = {
				pageSize    : sendClassHourModel.pageSize,
				pageIndex   : sendClassHourModel.pageIndex,
				orgId       : sendClassHourModel.orgId,
				status      : sendClassHourModel.status,
				cardId      : sendClassHourModel.cardId,
				purchaseId  : sendClassHourModel.purchaseId,
				creatorName : sendClassHourModel.creatorName,
			}
			let { ret } = yield call( checkSendClass, ({ id : recordIds, status : status }));
			if( ret && ret.errorCode == 9000 ){
                message.success(status == '1' ? '审核通过' : status == '2' ? '驳回成功' : '');
				yield put({
					type : 'updateState',
					payload : {
						selectedRows : [],
						selectedRowKeys : [],
						selectedRecordIds : [],
						chechClassVisible : false
					}
				})
				yield put({
					type : 'getSendClassHourList',
					payload : {
						params
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '审核失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					checkClassBtnFailLoading : false,
					checkClassBtnLoading : false
				}
			})
		},

		/*分页*/
		*pagination({ payload },{ call, put, select }){
			let { pageSize, pageIndex } = payload;
			let sendClassHourModel = yield select( state => state.sendClassHourModel );
			let params = {
				pageSize,
				pageIndex   : pageIndex - 1,
				orgId       : sendClassHourModel.orgId,
				status      : sendClassHourModel.status,
				cardId      : sendClassHourModel.cardId,
				purchaseId  : sendClassHourModel.purchaseId,
				creatorName : sendClassHourModel.creatorName,
			}
			yield put({
				type : 'getSendClassHourList',
				payload : {
					params
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
