import {message} from 'antd';
import { parse } from 'qs';

import { queryWxReservation, batchDeal, updateRemark, } from '../../../../services/scrm/wx-reservation/wxReservationService';

//口碑-商品 管理
export default {

  namespace: 'wxReservationMgrModel',

  state: {
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      loading: false,
      dataSource: [],
      selectedRowKeys: [],

      showSearch: false,
      query: {},//模糊检索的条件

      confirmVisible: false,
      confirmIds: '',
      confirmRemark: '',
      confirmOrgId: '',
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/scrm_wx_maa_list') {
                  dispatch({
                    type: 'queryList',
                    payload: {
                        pageIndex: 0,
                    }
                  });
              }
          });
      },
  },

  effects: {

      /*查询通知列表*/
      *queryList({ payload } , { put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let wxReservationMgrModel = yield select(state => state.wxReservationMgrModel);

            payload = payload || {};
            let pageIndex   = payload.pageIndex != undefined ? payload.pageIndex : wxReservationMgrModel.pageIndex;
            let pageSize    = payload.pageSize != undefined ? payload.pageSize    : wxReservationMgrModel.pageSize;
            let query       = payload.query || wxReservationMgrModel.query;

            let queryParams = {
                pageIndex,pageSize,...query,
            };

            let {ret} = yield call( queryWxReservation, parse(queryParams));

            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource: ret.results,
                        total: ret.data.resultCount,
                        loading: false,
                        pageIndex,pageSize,query,
                        selectedRowKeys: [],
                    }
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((ret && ret.errorMessage) || '没有获取到预约列表');
            }
      },

      *onUpdateRemark({ payload } , { put , call , select }){
            let wxReservationMgrModel = yield select(state => state.wxReservationMgrModel);
            let params = {
                id: wxReservationMgrModel.confirmIds,
                orgId: wxReservationMgrModel.confirmOrgId,
                remark: wxReservationMgrModel.confirmRemark,
            };

            let {ret} = yield call( updateRemark, parse(params));

            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload: {
                        confirmVisible: false,
                        confirmIds: '',
                        confirmRemark: '',
                        confirmOrgId: '',
                    }
                });
                yield put({
                    type : 'queryList',
                });
            } else {
                message.error((ret && ret.errorMessage) || '修改预约备注出错啦!');
            }
      },

      *onConfirmClick({ payload } , { put , call , select }){
           yield put({
                type : 'changeShowLoading',
            });

            let {ids,} = payload;
            let params = {ids,status: '1'};

            let {ret} = yield call( batchDeal, parse(params));

            if( ret && ret.errorCode == 9000 ){
                message.success((ret && ret.errorMessage) || '处理出错啦!');
                yield put({
                    type : 'queryList',
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((ret && ret.errorMessage) || '确认预约出错啦!');
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
