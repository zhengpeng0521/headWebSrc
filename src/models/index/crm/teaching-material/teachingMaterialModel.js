import {message} from 'antd';
import { parse } from 'qs';
import {getTeachingMaterialList, deleteTeachingMaterial, getTeachingMaterialDetail } from '../../../../services/crm/teaching-material/teachingMaterialService';

//教材管理收付款账号
export default {

  namespace: 'teachingMaterialModel',

  state: {
      pageIndex       : 0,
      pageSize        : 20,
      total           : 0,
      loading         : false,
      dataSource      : [],
      selectedRowKeys : [],
      selectedRows    : [],
      showSearch      : false,
      query           : {},//模糊检索的条件
	  newColumns      : []
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/crm_product_teachaid_list') {
                  dispatch({
                  	  type : 'queryList',
					  payload : {
						  pageSize : 20,
						  pageIndex : 0,
						  query : {
							  orgId  : undefined,
							  name   : undefined,
							  status : undefined
						  }
					  }
                  });
              }
          });
      },
  },

  effects: {
      /*查询通知列表*/
      *queryList({ payload },{ put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let teachingMaterialModel = yield select(state => state.teachingMaterialModel);

            payload = payload || {};
            let pageIndex = payload.pageIndex != undefined ? payload.pageIndex : teachingMaterialModel.pageIndex;
            let pageSize = payload.pageSize != undefined ? payload.pageSize    : teachingMaterialModel.pageSize;
            let query = payload.query || teachingMaterialModel.query;

            let queryParams = {
                pageIndex,
				pageSize,
				...query,
            };
            let { ret } = yield call( getTeachingMaterialList, parse(queryParams));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource : ret.results,
                        total      : ret.data.resultCount,
                        loading    : false,
                        pageIndex,
						pageSize,
						query,
                        selectedRowKeys : [],
                    }
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((ret && ret.errorMessage) || '没有获取到教材列表');
            }
      },

      /*删除家长通知*/
      *deleteBatch({ payload } , { put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let queryParams = {
                id: payload.ids,
            };
            let { ret } = yield call( deleteTeachingMaterial, parse(queryParams));
            if( ret && ret.errorCode == 9000 ){
                message.success('删除成功');
                yield put({
                    type : 'queryList',
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });

                message.error((ret && ret.errorMessage) || '删除教材出现错误啦');
            }
      },

},


  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },

      /*显隐模糊检索栏*/
      changeShowSearch(state, action) {
          let showSearch = state.showSearch;
          return {...state, showSearch: !showSearch};
      },

      /*显隐模糊检索栏*/
      changeShowLoading(state, action) {
          let loading = state.loading;
          return {...state, loading: !loading};
      },

  }
}
