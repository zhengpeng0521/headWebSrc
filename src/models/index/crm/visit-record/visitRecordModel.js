import {
	getVisitRecordList,
} from '../../../../services/crm/visit-record/visitRecordService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'visitRecordModel',

    state : {
		searchVisible            : false,         //高级搜索是否显示
		pageSize                 : 10,
		pageIndex                : 0,
		dataSource               : [],
		resultCount              : 0,

		selectedId               : undefined,    //所选择的列表项
		selectedItem             : {},           //列表项内容

		/*搜索条件*/
		stuName                  : undefined,
		orgIds                   : undefined,
		tenantIds                : undefined,
		uidName                  : undefined,
		startVisitTime           : undefined,   //开始时间
		endVisitTime             : undefined,   //结束时间
		source                   : '2',         //来源

		reset                    : undefined,   //切换tab是清空高级搜索
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname == '/hq_orgdata_visit' ){
					let params = {
						pageIndex                : 0,

						stuName                  : undefined,
						orgIds                   : undefined,
						tenantIds                : undefined,
						uidName                  : undefined,
						startVisitTime           : undefined,   //开始时间
						endVisitTime             : undefined,   //结束时间
						source                   : '2',         //来源
						sourceType: '0'
					}
					dispatch({
						type : 'getVisitRecordList',
						payload : {
							params
						}
					})
				}
			})
        }
    },

    effects : {

		/*得到跟进列表*/
		*getVisitRecordList({ payload },{ call, put, select }){
			let { params } = payload;
			let { ret } = yield call( getVisitRecordList, ( { ...params, pageSize : 10 } ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource    : ret.results,
						resultCount   : ret.data.resultCount,
						selectedId    : !!ret.results && !!ret.results[0] && ret.results[0].id,
						selectedItem  : !!ret.results && ret.results[0],
						...params
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表失败' )
			}
		},

		/*切换crm leads*/
		*clickGetFollowRecordList({ payload },{ call, put, select }){
			let state = yield select( state => state.visitRecordModel );
			let { source } = payload;
			let params = {
				pageIndex      : 0,
				source         : source,
				orgIds         : undefined,
				tenantIds      : undefined,
				stuName        : undefined,
				uidName        : undefined,
				startVisitTime : undefined,
				endVisitTime   : undefined,
			}
			yield put({
				type : 'getVisitRecordList',
				payload : {
					params
				}
			})
		},

		/*搜索*/
		*searchFunction({ payload },{ call, put, select }){
			let state = yield select( state => state.visitRecordModel );
			let { values } = payload;
			let params = {
				pageIndex      : 0,
				source         : state.source,
				uidName        : state.uidName,
				startVisitTime : state.startVisitTime,
				endVisitTime   : state.endVisitTime,
				...values
			}
			yield put({
				type : 'getVisitRecordList',
				payload : {
					params
				}
			})
		},

		/*高级搜索*/
		*onSuperSearch({ payload },{ call, put, select }){
			let { values } = payload;
			let state = yield select( state => state.visitRecordModel );
			let startVisitTime = undefined;
			let endVisitTime = undefined;
			let sourceType = undefined;
			if( !!values.time ){
				startVisitTime = values.time[0].format('YYYY-MM-DD HH-mm-ss');
				endVisitTime   = values.time[1].format('YYYY-MM-DD HH-mm-ss');
			}
			if(values.sourceType){
				sourceType =values.sourceType
			}
			let params = {
				pageIndex : 0,
				source    : state.source,
				orgIds    : state.orgIds,
				tenantIds : state.tenantIds,
				stuName   : state.stuName,
				uidName   : values.uidName,
				startVisitTime,
				endVisitTime,
				sourceType
			}
			yield put({
				type : 'getVisitRecordList',
				payload : {
					params
				}
			})
		},

		/*跟进列表分页*/
		*pagination({ payload },{ call, put, select }){
			let state = yield select( state => state.visitRecordModel );
			let params = {
				pageIndex      : payload.pageIndex - 1,
				source         : state.source,
				orgIds         : state.orgIds,
				tenantIds      : state.tenantIds,
				stuName        : state.stuName,

				uidName        : state.uidName,
				startVisitTime : state.startVisitTime,
				endVisitTime   : state.endVisitTime,
			}
			yield put({
				type : 'getVisitRecordList',
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
