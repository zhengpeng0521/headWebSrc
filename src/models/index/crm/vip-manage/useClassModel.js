import {
	getUseClassList,            //得到消课记录列表

} from '../../../../services/crm/vip-manage/useClassService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'useClassModel',

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
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/crm_card_repealcourse' ){
					dispatch({
						type : 'getUseClassList',
						payload : {
							pageSize  : 20,
							pageIndex : 0,
							superSearchContent  : {},
							commonSearchContent : {}
						}
					})
                }
            })
        }
    },

    effects : {

		//刷新列表
		*refreshList({ payload },{ call, put, select }){
			let state = yield select( state => state.useClassModel );
			yield put({
				type : 'getUseClassList',
				payload : {
					commonSearchContent : state.commonSearchContent,
					superSearchContent  : state.superSearchContent,
					pageSize  : state.pageSize,
					pageIndex : state.pageIndex
				}
			})
		},

		//得到消课记录列表 ( 公共调取接口 )
		*getUseClassList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					loading : true
				}
			})
			//必传参数如下四个:
			let { pageSize, pageIndex, superSearchContent, commonSearchContent } = payload;
			let { ret } = yield call( getUseClassList, ({ ...superSearchContent, ...commonSearchContent, pageIndex, pageSize }));
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
				yield put({
					type : 'updateState',
					payload : {
						dataSource  : [],
						resultCount : 0
					}
				})
				message.error( ret && ret.errorMessage || '列表加载失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					loading : false
				}
			})
		},

		//常用搜索 清除条件 高级搜索 清除条件
		*searchFunction({ payload },{ call, put, select }){
			let { commonSearchContent, superSearchContent } = payload;
			let state = yield select( state => state.useClassModel );
			yield put({
				type : 'getUseClassList',
				payload : {
					commonSearchContent,
					superSearchContent,
					pageSize  : state.pageSize,
					pageIndex : 0
				}
			})
		},

		//分页
		*pageChange({ payload },{ call, put, select }){
			let { pageIndex, pageSize } = payload;
			let state = yield select( state => state.useClassModel );
			yield put({
				type : 'getUseClassList',
				payload : {
					pageIndex : pageIndex - 1,
					pageSize,
					commonSearchContent : state.commonSearchContent,
					superSearchContent  : state.superSearchContent
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
