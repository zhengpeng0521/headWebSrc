import * as service from '../../../../services/scrm/market/marketOfflintLeafletsService/marketOfflintLeafletsService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	
	namespace : 'marketMyOfflineLeaflets',

	state : {
   
		attrOrgId : undefined,
		attrSelectedRowKeys : [],
		attrPaginationSource : {},
		attrPageIndex : 0,
		attrPageSize : 20,
		attrDataSource : [],
		attrShowSearch : false,
		attrActivityList : [],
	},

    subscriptions : {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {
                if(pathname == '/scrm_my_offline_leaflets') {
					let orgId = window._init_data&&window._init_data.firstOrg&&window._init_data.firstOrg.key || undefined;	
					
					dispatch({
						type : 'getList',
						payload : {
							attrOrgId 	: orgId,
						}
					})
					
					//看不懂请移步到市场活动marketModal
					dispatch({
						type : 'marketModel/updateState', 
						payload : {
							fromOfflineLeafletsControl : true,
						}
					})
					dispatch({
						type : 'marketOfflineLeaflets/updateState',
						payload : {
							attrSource : true,
						}
				   	})
                }
            });
        },
    },

	effects : {
		
		//列表数据
		*getList({ payload }, {call, put, select}) {
			
			let model = yield select(state => state.marketMyOfflineLeaflets);
			
			let param = {
				orgId : payload.attrOrgId || model.attrOrgId,
			}
			
			if(payload.value != undefined && payload.value != '') {
				param.name = payload.value.name;
				param.actId = payload.value.actId;
			} 
			
			if(payload.attrOrgId != undefined || model.attrOrgId != undefined) {
				
				let { ret } = yield call(service.getInstLeafletsList, parse(param));

				if( ret && ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
							attrOrgId : param.orgId,
							attrDataSource : ret&&ret.results || [],
							attrPaginationSource : ret&&ret.data || {},
							attrSelectedRowKeys : [],
						}
					})
			   } else {
					message.error( ret && ret.errorMessage || '获取传单实例列表失败')
			   }	
			}
		},
			
		//分页数据
		*getLoadPageData({ payload },{ call, put, select }){
			
			let model = yield select(state => state.marketMyOfflineLeaflets);
			
			let paramter = {
				orgId : model.attrOrgId,
				pageSize : payload.pageSize || model.attrPageSize,
				pageIndex : payload.pageIndex != undefined ? payload.pageIndex : model.attrPageIndex,
			}

			let { ret } = yield call(service.getInstLeafletsList, parse(paramter));

			if( ret && ret.errorCode == 9000 ){

				yield put({
					type : 'updateState',
					payload : {
						attrPageSize : payload.pageSize || model.attrPageSize,
						attrPageIndex : payload.pageIndex != undefined ? payload.pageIndex : model.attrPageIndex,
						attrDataSource : ret&&ret.results || [],
						attrPaginationSource : ret&&ret.data || {},
					}
				})
			} else {
			   message.error( ret && ret.errorMessage || '获取列表数据失败')
			}
		},

		//删除数据
		*getInstDelect({ payload },{ call, put, select }){
			
			let model = yield select(state => state.marketMyOfflineLeaflets);
			
			let paramter = {
				orgId : payload&&payload.attrOrgId || model.attrOrgId,
				status : "0",
				ids	: payload.ids,
			}

			let { ret } = yield call(service.getInstDelect, parse(paramter));

			if( ret && ret.errorCode == 9000 ){

				yield put({
					type : 'getList',
					payload : {
						attrOrgId :  payload&&payload.attrOrgId || model.attrOrgId,
					}
				})
				message.success( '删除成功' )
			} else {
			   message.error( ret && ret.errorMessage || '删除失败')
			}
		},
			
		//获取活动列表
		*getActivityList({payload}, { call, put, select }) {
			
			let param = {
				orgId : payload.attrOrgId,
				type : '1',
			}
			
			if(payload.attrOrgId != undefined) {

				let {ret} = yield call(service.getActivityList, parse(param));

				if(ret.errorCode == 9000) {
					yield put({
						type: 'updateState',
						payload: {
							attrActivityList: ret&&ret.list,
							attrShowSearch: payload && payload.attrShowSearch,
						}
					});
				} else {
					yield put({
						type: 'updateState',
						payload: {
							attrShowSearch: payload && payload.attrShowSearch,
						}
					});
					message.error(ret && ret.errorMessage || '活动列表失败');
				}
			}
		},
		
    },
		
	reducers : {
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
