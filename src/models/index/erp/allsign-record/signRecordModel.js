import {message} from 'antd';
import { parse } from 'qs';
import { lodopPrintAttendance } from '../../../../utils/lodopPrintUtils'
import {
    listenrecordsList,
    repealSignrecode,
    SignRecordTableItemPrint        //列表点击打印
} from '../../../../services/erp/allsign-record/allsignRecordService';

//学员签到记录
export default {

  namespace: 'signRecordModel',

  state: {
      pageIndex: 0,
      pageSize: 20,
      total: 0,
      loading: false,
      dataSource: [],
      selectedRowKeys: [],

      showSearch: false,
      query: {},//模糊检索的条件
      initQuery: {},//初始查询条件
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/erp_stusign_list') {

                  dispatch({
                      type:'initLodopConfing'
                  });

                  dispatch({
                    type: 'updateState',
                    payload: {
                        initQuery: query,
                    }
                  });

                  dispatch({
                    type: 'queryList',
                    payload: {
                        query
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

            let signRecordModel = yield select(state => state.signRecordModel);

            payload = payload || {};
            let pageIndex = payload.pageIndex != undefined ? payload.pageIndex : signRecordModel.pageIndex;
            let pageSize = payload.pageSize != undefined ? payload.pageSize    : signRecordModel.pageSize;
            let query = payload.query || signRecordModel.query;

            let queryParams = {
                pageIndex,pageSize,...query,
            };

            let { ret } = yield call( listenrecordsList, parse(queryParams));
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
                message.error((ret && ret.errorMessage) || '没有查询到签到记录');
            }
      },

      /*删除家长通知*/
      *deleteBatch({ payload } , { put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let queryParams = {
                ids: payload.ids,
            };
            let { ret } = yield call( repealSignrecode, parse(queryParams));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'queryList',
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((ret && ret.errorMessage) || '撤销签到出现错误啦');
            }
      },

      /*单条签到记录撤销签到*/
      *cancleSign({ payload } , { put , call , select }){
          yield put({
            type : 'changeShowLoading',
          });
          let params = {
              orgId: payload.orgId,
              stuSignId: payload.stuSignId,
          };
          let { ret } = yield call( repealSignrecode, parse(params));
          if( ret && ret.errorCode == 9000 ){
            yield put({
                    type : 'queryList',
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((ret && ret.errorMessage) || '撤销签到出现错误啦');
            }
      },

        //列表点击打印
        *'SignRecordTableItemPrint'({ payload } , { put , call , select }){
            let obj = {};
            obj.type = 0;
            obj.orgId = payload.orgId;
            obj.cpId = payload.cpId;
            obj.date = payload.createTime.substr(0,10);
            obj.stuIds = payload.stuId;
            let { ret } = yield call(SignRecordTableItemPrint,parse(obj));
            if(ret && ret.errorCode === 9000){
                let data = {};
                data.checkedConfArray = ret.checkedConfArray;
                data.content = ret.results;
                lodopPrintAttendance(data);
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取打印信息出错');
            }
        },

        //初始化lodop打印配置
        *'initLodopConfing'({ payload }, { call, put, select }) {
            let ret = {
                errorCode: 9000,
                host: '127.0.0.1',
                port: '18000',
            };
            let head= document.getElementsByTagName('body')[0];
            let lodopjs_script= document.createElement('script');
            lodopjs_script.type= 'text/javascript';
            lodopjs_script.name= 'lodopjs';
            lodopjs_script.src= 'http://' + ret.host + ':' + ret.port + '/CLodopfuncs.js';

            function initGetCLodopFunc() {
                window.LODOP = getCLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM'));
            }

            lodopjs_script.onreadystatechange= function () {
                if (this.readyState == 'complete')  {
                    initGetCLodopFunc();
                }
            }
            lodopjs_script.onload= function(){
                initGetCLodopFunc();
            }
            head.appendChild(lodopjs_script);
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
