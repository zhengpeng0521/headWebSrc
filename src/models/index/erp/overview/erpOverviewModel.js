import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

import {allStuComList} from '../../../../services/erp/student/studentService';
import {tenantOrgList} from '../../../../services/index/common/searchSelectListService';
import {queryFirstSchedule} from '../../../../services/erp/classSchedule/classScheduleService';
import {getErpOverviewData} from '../../../../services/erp/overview/erpOverviewService';

// 全局布局model
export default {

  namespace: 'erpOverviewModel',

  state: {
      loading: false,//首页加载
      selectOrgId: '',//首页选择的校区

      firstSchedule: {},//首恶最近的排课计划

      allStuComList: [], //首页所有签到学员列表

      overviewData: {},
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/erp_homepage') {
                  dispatch({
                      type: 'loadOverviewData',
                  });
                  dispatch({
                      type:'initLodopConfing'
                  });
              }
          });
      },
  },

  effects: {

      /*加载首页数据*/
      *loadOverviewData({ payload }, { call, put, select }) {
          yield put({
            type : 'updateState',
            payload : {
                loading: true,
            }
          });

          let orgId = payload ? payload.orgId : '';

          if(orgId == undefined || orgId == '') {
              //默认取第一家机构
              orgId = window._init_data.firstOrg ? window._init_data.firstOrg.key : '';
          }

          yield put({
            type : 'initStuComList',
            payload: {
                orgId,
            }
          });

          yield put({
            type : 'queryFirstSchedule',
            payload: {
                orgId,
            }
          });

          yield put({
            type : 'queryOverviewData',
            payload: {
                orgId,
            }
          });

          yield put({
            type : 'updateState',
            payload : {
                loading: false,
                selectOrgId: orgId,
            }
          });
      },

      /*初始化下拉框数据*/
      *initStuComList({ payload } , { put , call , select }){
          let orgId = payload ? payload.orgId : '';
          let { ret } = yield call(allStuComList, parse({orgId}));
          if( ret && ret.errorCode == 9000 ){
            yield put({
                type : 'updateState',
                payload : {
                    allStuComList: ret.results,
                }
            });
          } else {
            message.error((ret && ret.errorMessage) || '没有获取到学员信息');
          }
      },

      //查询当天最近的排课计划
      *queryFirstSchedule({ payload } , { put , call , select }){
          let orgId = payload ? payload.orgId : '';
          let { ret } = yield call(queryFirstSchedule, parse({orgId}));
          if( ret && ret.errorCode == 9000 ){
              if(ret.results) {
                  yield put({
                    type : 'updateState',
                    payload : {
                        firstSchedule: (ret.results.length > 0 && ret.results[0]) ? ret.results[0] : {},
                    }
                });
              }

          } else {
            message.error((ret && ret.errorMessage) || '没有最近排课计划出错啦!');
          }
      },

          //查询首页的数据
      *queryOverviewData({ payload } , { put , call , select }){
          let orgId = payload ? payload.orgId : '';
          let { ret } = yield call(getErpOverviewData, parse({orgId}));
          if( ret && ret.errorCode == 9000 ){
              yield put({
                type : 'updateState',
                payload : {
                    overviewData: {...ret}
                }
              });

          } else {
            message.error((ret && ret.errorMessage) || '查询教学首页数据出错啦!');
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
          return { ...state, ...action.payload, };
      },
  },

}
