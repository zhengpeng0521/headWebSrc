import {
	getVacateList,             //得到请假申请记录
	confirmCheckVacate,        //审核
} from '../../../../services/cerp/vacate-manage/vacateManageService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'vacateManageModel',

    state : {
		/*快捷搜索*/
        commonSearchContent   : {},         //常用搜索内容

		/*高级搜索*/
		searchVisible         : false,
        superSearchContent    : {},         //高级搜索内容

		/*表格项*/
		loading               : false,
		dataSource            : [],
		newColumns            : [],
		resultCount           : 0,
		pageIndex             : 0,
		pageSize              : 20,
		selectedRows          : [],
		selectedRowKeys       : [],

		//审核表单
		visible               : false,
		checkBtnLoading       : false

    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/cerp_jw_vocation' ){
					dispatch({
						type : 'vacateManageModel/getVacateList',
						payload : {
							pageIndex : 0,
							pageSize  : 20,
							superSearchContent : {},
							commonSearchContent : {}
						}
					})
                }
            })
        }
    },

    effects : {
		//得到 请假记录
		*getVacateList({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true } });
			//必传参数如下四个:
			let { pageSize, pageIndex, superSearchContent, commonSearchContent } = payload;
			let orgId = window._init_data.cerp_orgId;
			let { ret } = yield call( getVacateList, ({ ...superSearchContent, ...commonSearchContent, pageIndex, pageSize, orgId }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						pageSize,
						pageIndex,
						superSearchContent,
						commonSearchContent,
						dataSource  : ret.results || [],
						resultCount : ret.data.resultCount || 0
					}
				})
			}else{
				yield put({ type : 'updateState', payload : { dataSource  : [{ id : '1' }], resultCount : 0 } })
				message.error( ret && ret.errorMessage || '列表加载失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false } })
		},

		//常用搜索 清除 高级搜索 清除
		*searchFunction({ payload },{ call, put, select }){
			let { commonSearchContent, superSearchContent } = payload;
			let state = yield select( state => state.vacateManageModel );
			yield put({
				type : 'getVacateList',
				payload : {
					commonSearchContent,
					superSearchContent,
					pageIndex : 0,
					pageSize  : state.pageSize
				}
			})
		},

		//分页
		*pageChange({ payload },{ call, put, select }){
			let { pageIndex, pageSize } = payload;
			let state = yield select( state => state.vacateManageModel );
			yield put({
				type : 'getVacateList',
				payload : {
					commonSearchContent : state.commonSearchContent,
					superSearchContent  : state.superSearchContent,
					pageIndex : pageIndex - 1,
					pageSize
				}
			})
		},

		//选择表格项
		*rowSelectChange({ payload },{ call, put, select }){
			let { selectedRowKeys, selectedRows } = payload;
			yield put({
				type : 'updateState',
				payload : {
					selectedRows,
					selectedRowKeys
				}
			})
		},

		//审核
		*confirmCheckVacate({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					checkBtnLoading : true
				}
			})
			let { remark, auditStatus } = payload;
			let ids = [];
			let state = yield select( state => state.vacateManageModel );
			state.selectedRows && state.selectedRows.map(function( item, index ){
				ids.push( item.id )
			})
			ids = ids.join(',');
			let { ret } = yield call( confirmCheckVacate, ( {remark, auditStatus, ids} ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						visible         : false,
						selectedRows    : [],
						selectedRowKeys : []
					}
				})
				let state = yield select( state => state.vacateManageModel );
				yield put({
					type : 'getVacateList',
					payload : {
						commonSearchContent : state.commonSearchContent,
						superSearchContent  : state.superSearchContent,
						pageIndex           : 0,
						pageSize            : state.pageSize
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '审核失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					checkBtnLoading : false
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
