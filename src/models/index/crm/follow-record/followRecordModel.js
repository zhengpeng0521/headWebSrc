import {
	getFollowRecordList,
} from '../../../../services/crm/follow-record/followRecordService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'followRecordModel',

    state : {
		searchVisible            : false,         //高级搜索是否显示
		pageIndex                : 0,
		pageSize                 : 10,
		dataSource               : [],
		resultCount              : 0,

		selectedId               : undefined,
		selectedItem             : undefined,

		/*搜索条件*/
		orgIds                   : undefined,       //所选校区
		tenantIds                : undefined,
		name                     : undefined,       //学员姓名
		startTime                : undefined,       //开始时间
		endTime                  : undefined,       //结束时间

		source                   : '2',             //来源

		reset                    : undefined,       //切换tab是清空高级搜索
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname == '/hq_orgdata_comm' ){
					let params = {
						pageIndex : 0,
						orgIds    : undefined,
						tenantIds : undefined,
						name      : undefined,
						startTime : undefined,
						endTime   : undefined,
						source    : '2',
            sourceType: '0'
					}
					dispatch({
						type : 'getFollowRecordList',
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
		*getFollowRecordList({ payload },{ call, put, select }){
			let { params } = payload;
			let { ret } = yield call( getFollowRecordList, ( { ...params, pageSize : 10 } ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource   :  ret.results,
						resultCount  :  ret.data.resultCount,
						selectedId   :  !!ret.results && !!ret.results[0] && ret.results[0].id,
						selectedItem :  !!ret.results && ret.results[0],
						...params
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取列表失败' )
			}
		},

		/*切换crm leads*/
		*clickGetFollowRecordList({ payload },{ call, put, select }){
			let state = yield select( state => state.followRecordModel );
			let { source } = payload;
			let params = {
				pageIndex : 0,
				source    : source,
				orgIds    : undefined,
				tenantIds : undefined,
				name      : undefined,
				startTime : undefined,
				endTime   : undefined,
			}
			yield put({
				type : 'getFollowRecordList',
				payload : {
					params
				}
			})
		},

		/*搜索*/
		*searchFunction({ payload },{ call, put, select }){
			let state = yield select( state => state.followRecordModel );
			let { values } = payload;
			let params = {
				pageIndex  : 0,
				source     : state.source,
				startTime  : state.startTime,
				endTime    : state.endTime,
				...values
			}
			yield put({
				type : 'getFollowRecordList',
				payload : {
					params
				}
			})
		},

		/*高级搜索*/
		*onSuperSearch({ payload },{ call, put, select }){
			let { values } = payload;
			let state = yield select( state => state.followRecordModel );
			let startTime = undefined;
			let endTime = undefined;
			let sourceType = undefined;
			if( !!values.time && values.time.length > 0 ){
				startTime = !!values.time[0] && values.time[0].format('YYYY-MM-DD HH-mm-ss') || undefined;
				endTime   = !!values.time[1] && values.time[1].format('YYYY-MM-DD HH-mm-ss') || undefined;
			}
			if(values.sourceType){
				sourceType =values.sourceType
			}
			let params = {
				source    : state.source,
				orgIds    : state.orgIds,
				tenantIds : state.tenantIds,
				name      : state.name,
				collectName: values.collectName,
				pageIndex : 0,
				startTime,
				endTime,
				sourceType
			}
			yield put({
				type : 'getFollowRecordList',
				payload : {
					params
				}
			})
		},

		/*跟进列表分页*/
		*pagination({ payload },{ call, put, select }){
			let state = yield select( state => state.followRecordModel );
			let params = {
				pageIndex : payload.pageIndex - 1,
				source    : state.source,
				orgIds    : state.orgIds,
				tenantIds : state.tenantIds,
				name      : state.name,
				startTime : state.startTime,
				endTime   : state.endTime,
			}
			yield put({
				type : 'getFollowRecordList',
				payload : {
					params
				}
			})
		},

    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
