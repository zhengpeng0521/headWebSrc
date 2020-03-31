import { queryList } from '../../../../services/report-form/teaching-report/timeMonthKnotService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

export default {

	namespace: 'timeMonthKnotSheet',

    state: {
		buttonLoading           : false,                              //按钮loading
		month                   : '',         //月份
		orgIds                  : undefined,
        tenantIds               : undefined,

		pageIndex               : 0,
		pageSize                : 20,
		resultCount             : 0,
		dataSource              : [],

		loading                 : false,             //加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, query }) => {
                if( pathname === '/hq_orgstats_purchase_result' ) {
					dispatch({
						type : 'queryList',
						payload : {
							orgIds : undefined,
              tenantIds : undefined,
							month : '',
							pageSize : 20,
							pageIndex : 0
						}
					})
                }
            });
        },
    },

    effects: {
		/*生成报表得到列表*/
		*queryList({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
			let state = yield select( state => state.timeMonthKnotSheet );
			let {  month, tenantIds, orgIds } = payload;
			let params = {
				pageIndex : 0,
				pageSize  : state.pageSize,
				tenantIds,
                orgIds,
				month   : month
			}
			let { ret } = yield call( queryList, ( params ) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource : ret.results,
						resultCount : ret.data.resultCount,
						pageIndex : 0,
						pageSize : state.pageSize,
						month,
						tenantIds,
                		orgIds,
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { buttonLoading : false, loading : false, month, tenantIds, orgIds }});
		},

		//报表分页
		*paginationChange({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
			let { pageIndex, pageSize } = payload;
			let state = yield select( state => state.timeMonthKnotSheet );
			let params = {
				tenantIds : state.tenantIds,
                orgIds    : state.orgIds,
				month   : state.month,
				pageIndex : pageIndex - 1,
				pageSize
			}
			let { ret } = yield call( queryList, ( params ) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource  : ret.results,
						resultCount : ret.data.resultCount,
						pageIndex   : pageIndex - 1,
						pageSize    : pageSize,
						month		: state.month
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '报表查询失败' )
			}
			yield put({ type : 'updateState', payload : { buttonLoading : false, loading : false }});
		}
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
    },
}
