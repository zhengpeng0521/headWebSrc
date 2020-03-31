import {message} from 'antd';
import { parse } from 'qs';
import {getCourseComList} from '../../../../services/erp/courseManage/courseManageService';
import {getEmployeeComList} from '../../../../services/erp/employee/employeeService';
import {classComList,} from '../../../../services/erp/class/classService';
import {allStuComList} from '../../../../services/erp/student/studentService';
import {getSignScheduleList} from '../../../../services/erp/stu-sign/studentSignService';
import moment from 'moment';

/*
 * 学员签到
 * 查询全部的排课计划
 * @author yujq
 */
export default {

  namespace: 'stuSignModel',

  state: {
      visible: false,
      loading: false,
      query: {},
      scheduleList: [],

      courseComList: [],//查询下拉框数据
      classComList: [],//查询下拉框数据
      employeeComList: [],//查询下拉框数据
      stuComList: [],//查询下拉框数据

      searchContent : {},   //查询内容
  },

  effects: {

      /*初始化课程摘要信息*/
      *initCourseComList({ payload }, { call, put, select }) {
          let {orgId} = payload;
          let { ret } = yield call(getCourseComList, parse({orgId}));
          if( ret && ret.errorCode == 9000 ){
            yield put({
                type : 'updateState',
                payload : {
                    courseComList: ret.results,
                }
            });
          } else {
            message.error((ret && ret.errorMessage) || '没有获取到课程摘要信息');
          }
      },

     /*初始化 员工摘要信息*/
      *initEmployeeComList({ payload }, { call, put, select }) {
          let {orgId} = payload;
          let { ret } = yield call( getEmployeeComList, parse({orgId}));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        employeeComList: ret.results,
                    }
                });
            } else {
              message.error((ret && ret.errorMessage) || '没有获取到教师列表');
          }
      },

      /*加载班级下拉框数据*/
      *initClassComList({ payload }, { call, put, select }) {
          let {orgId} = payload;
          let { ret } = yield call( classComList, parse({orgId}));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classComList: ret.results,
                    }
                });
            } else {
              message.error((ret && ret.errorMessage) || '没有获取到班级列表');
          }
      },

          /*加载所有学员下拉框数据*/
      *initAllStuComList({ payload }, { call, put, select }) {
          let {orgId} = payload;
          let { ret } = yield call( allStuComList, parse({orgId}));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuComList: ret.results,
                    }
                });
            } else {
              message.error((ret && ret.errorMessage) || '没有获取到学员列表');
          }
      },

      *showSignModal({ payload }, { call, put, select }) {
          let firstOrgId = window._init_data.firstOrg.key;
          yield put({
            type : 'updateState',
            payload : {
                visible: true,
            }
          });

          yield put({
            type : 'onOrgChange',
            payload : {
                orgId: firstOrgId,
            }
          });
      },

      *onOrgChange({ payload }, { call, put, select }) {
          let startDay = payload && payload.startDay ? payload.startDay : moment().format('YYYY-MM-DD');
          let endDay = payload && payload.endDay ? payload.endDay : moment().format('YYYY-MM-DD');
          delete payload.startDay;
          delete payload.endDay;
          yield put({
            type : 'initCourseComList',
            payload : {
                orgId : payload.orgId,
            }
          });
          yield put({
            type : 'initClassComList',
            payload : {
                orgId : payload.orgId,
            }
          });
          yield put({
            type : 'initEmployeeComList',
            payload : {
                orgId : payload.orgId,
            }
          });
          yield put({
            type : 'initAllStuComList',
            payload : {
                orgId : payload.orgId,
            }
          });
          yield put({
            type : 'queryScheduleList',
            payload : {
                startDay,
                endDay,
                ...payload
            }
          });
      },

      *queryScheduleList({ payload }, { call, put, select }) {

          if(payload.orgId == undefined || payload.orgId == '') {
               return message.warn('请先选择门店');
          }
          yield put({
            type : 'updateState',
            payload : {
                loading: true,
            }
          });
          let { ret } = yield call( getSignScheduleList, parse(payload) );
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        scheduleList: ret.results,
                        searchContent : payload
                    }
                });
            } else {
              message.error((ret && ret.errorMessage) || '没有获取到排课计划');
          }
          yield put({
            type : 'updateState',
            payload : {
                loading: false,
            }
          });
      },
  },

  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },
  },
}
