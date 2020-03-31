import {message} from 'antd';
import { parse } from 'qs';
import {getNoticeList, getNoticeReadInfo,deleteNotice, } from '../../../../services/erp/parents-notice/parentsNoticeService';
import {getEmployeeComList} from '../../../../services/erp/employee/employeeService';
export default {

  namespace: 'parentsNoticeModel',

  state: {
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      loading: false,
      dataSource: [],
      selectedRowKeys: [],

      employComList: [], //发送人列表
      showSearch: false,
      query: {},//模糊检索的条件

      statusActive: 'up',

      readInfoVisible: false,//通知的阅读信息是否展示
      readInfoList: [],//通知的阅读信息
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/erp_fnotice_list') {
                     dispatch({
                        type: 'initEmployComList',
                    });
                  dispatch({
                        type: 'queryNoticeList',
                    });
              }
          });
      },
  },

  effects: {

      /*初始化发送人列表*/
      *initEmployComList({ payload } , { put , call , select }){

            let { ret } = yield call( getEmployeeComList);
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        employComList: ret.results,
                    }
                });
            } else {
                message.error((ret && ret.errorMessage) || '没有获取到员工列表');
            }
      },

      /*查询通知列表*/
      *queryNoticeList({ payload } , { put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let parentsNoticeModel = yield select(state => state.parentsNoticeModel);

            payload = payload || {};
            let pageIndex = payload.pageIndex != undefined ? payload.pageIndex : parentsNoticeModel.pageIndex;
            let pageSize = payload.pageSize != undefined ? payload.pageSize : parentsNoticeModel.pageSize;
            let query = payload.query || parentsNoticeModel.query;

            let queryParams = {
                pageIndex,pageSize,...query,
            };
            let { ret } = yield call( getNoticeList, parse(queryParams));
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
                message.error((ret && ret.errorMessage) || '没有获取到家长通知列表');
            }
      },

          /*查询通知的阅读信息*/
      *showReadInfo({ payload } , { put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let queryParams = {
                id: payload.noticeId,
            };
            let { ret } = yield call( getNoticeReadInfo, parse(queryParams));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                        readInfoVisible: true,
                        readInfoList: ret.stuList,
                    }
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((ret && ret.errorMessage) || '没有获取到通知的阅读情况');
            }
      },

          /*删除家长通知*/
      *deleteNotice({ payload } , { put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let queryParams = {
                ids: payload.ids,
            };
            let { ret } = yield call( deleteNotice, parse(queryParams));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'queryNoticeList',
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((ret && ret.errorMessage) || '删除家长通知出现错误啦');
            }
      },

        //显隐编辑界面
        *showEditFunction( { payload },{ select , call , put }){
            let { showEdit } = payload;
            yield put ({
                type : 'updateState',
                payload : {
                    showEdit : !showEdit
                }
            });
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
