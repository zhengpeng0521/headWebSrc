import {classroomComList} from '../../../../services/erp/classRoom/classRoom';
import {classComList, courseClassComList,} from '../../../../services/erp/class/classService';
import {getCourseComList,} from '../../../../services/erp/courseManage/courseManageService';
import {getEmployeeComList} from '../../../../services/erp/employee/employeeService';
import {allStuComList, classStuComList, } from '../../../../services/erp/student/studentService';
import {submitSchedule, deleteSchedule,updateRemedialStuData,getScheduleDetail,} from '../../../../services/erp/classSchedule/classScheduleService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

// 全局布局model
export default {

  namespace: 'classScheduleFormModel',

  state: {
      visible: false,
      formLoading: false,
      formData: {},                //排课的初始化数据

      classRoomComList: [],         //教室下拉框数据
      courseComList: [],             //班级下拉框数据
      classComList: [],             //班级下拉框数据
      teacherComList: [],           //教师下拉框数据
      classStuComList: [],           //下拉框数据-班内学员
      classStuComArr: [],           //班课-学员选中值
      allStuComList: [],           //下拉框数据-所有学员
      remedialStuData: [],          //补课学员的下拉框数据

      remedialStuArr: [{key: 'remedialStu_0', index: 0, value: undefined}],           //补课学员数组
      remedialStuArrInit: false, //补课学员数组是否可用的
  },

  effects: {

      /*显示排课表单窗口*/
      *show({ payload }, { call, put, select }) {
          let cpId = payload && payload.cpId;
          let orgId = payload && payload.orgId;
          let startTime = payload && payload.startTime;
          let endTime = payload && payload.endTime;
		  let studyDate = payload && payload.studyDate;
		  let ptArr = payload && payload.ptArr || undefined;
		  let roomId = payload && payload.roomId || undefined;

          if(cpId != undefined && cpId != '') {
              //查询排课计划的详细
              yield put({
                type : 'changeFormLoading',
              });
              let {ret} = yield call(getScheduleDetail, parse({cpId, orgId}));

              if( ret && ret.errorCode == 9000 ){
                let {
                    cpId,type,orgId,startTime,endTime,roomId,repeatable,cronExp,studyDate,
                    clsId,courseId,ptArr,atArr,normalStuArr,auditionStuArr,remedialStuArr,
                    cpContent,color,
                } = ret;
                let classStuComList = [];
                let remedialStuArrObj = [];
                let classStuComArr = [];
                if(normalStuArr && normalStuArr.length > 0) {
                    classStuComArr = normalStuArr.split(',');
                    yield put({
                        type : 'updateClassStudent',
                        payload: {
                            orgId, courseId,classId: clsId,classStuComArr,
                        }
                    });
                }

                if(remedialStuArr && remedialStuArr.length > 0) {
                    yield put({
                        type : 'updateRemedialStuData',
                        payload: {
                            orgId, courseId
                        }
                    });
                    remedialStuArr.map(function(remedStuItem, remedStuIndex) {
                        remedialStuArrObj.push({
                            key: 'remedialStu_' + remedStuIndex,
                            index: remedStuIndex,
                            value: remedStuItem.stuId,
                            stuCourseId: remedStuItem.stuCourseId,
                            progress: remedStuItem.progress,
                        });
                    });
                }

                let formData = {
                    cpId,orgId,roomId,repeatable,cronExp,studyDate,type,clsId,courseId,ptArr,atArr,auditionStuArr,cpContent,color,startTime,endTime,
                };

                yield put({
                    type : 'updateState',
                    payload : {
                        visible: true,formLoading: false,
                        formData,
                        remedialStuArr: remedialStuArrObj,
                        classStuComList,classStuComArr,
                    }
                });
                //选择机构
                yield put({
                    type : 'changeOrgSelect',
                    payload: {
                        orgId,
                    }
                });

              } else {
                message.error((ret && ret.errorMessage) || '排课计划不存在或者已经被删除');
              }
          } else {
              //新增排课
              yield put({
                type : 'updateState',
                payload : {
                    visible  : true,
					formLoading : false,
                    formData : { startTime, endTime, studyDate, ptArr, roomId },
                    remedialStuArr: [{ key: 'remedialStu_0', index: 0, value: undefined }],
                    classStuComArr: [],
                }
              });
              //选择机构
              yield put({
                type : 'changeOrgSelect',
              });
          }
      },

      /*选择门店改变时  联动改变下拉框数据*/
      *changeOrgSelect({ payload }, { call, put, select }) {
          let orgId = payload && payload.orgId;
          if(orgId == undefined || orgId == '') {
              let firstOrg = window._init_data.firstOrg;
              if(firstOrg) {
                  orgId = firstOrg.key;
              }
          }
          yield put({
            type : 'updateFormDataOrgId',
            payload: {
                orgId,
            }
          });

          yield put({
            type : 'initCourseComList',
            payload: {
                orgId,
            }
          });
          yield put({
            type : 'initClassroomComList',
            payload: {
                orgId,
            }
          });
          yield put({
            type : 'initClassComList',
            payload: {
                orgId,
            }
          });
          yield put({
            type : 'initTeacherComList',
            payload: {
                orgId,
            }
          });
          yield put({
            type : 'initAllStuComList',
            payload: {
                orgId,
            }
          });
      },

        /*加载教室下拉框数据*/
      *initClassroomComList({ payload }, { call, put, select }) {
          let {orgId} = payload;
          let { ret } = yield call( classroomComList, parse({orgId}));
          if( ret && ret.errorCode == 9000 ){
            yield put({
                type : 'updateState',
                payload : {
                    classRoomComList: ret.results,
                }
            });
          } else {
            message.error((ret && ret.errorMessage) || '没有获取到教室列表');
          }
      },

          /*加载课程下拉框数据*/
      *initCourseComList({ payload }, { call, put, select }) {
          let {orgId} = payload;
          let { ret } = yield call( getCourseComList, parse({orgId}));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        courseComList: ret.results,
                    }
                });
            } else {
              message.error((ret && ret.errorMessage) || '没有获取到课程列表');
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

      /*加载教师下拉框数据*/
      *initTeacherComList({ payload }, { call, put, select }) {
          let {orgId} = payload;
          let { ret } = yield call( getEmployeeComList, parse({orgId}));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        teacherComList: ret.results,
                    }
                });
            } else {
              message.error((ret && ret.errorMessage) || '没有获取到教师列表');
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
                        allStuComList: ret.results,
                    }
                });
            } else {
              message.error((ret && ret.errorMessage) || '没有获取到学员列表');
          }
      },

          /*加载班级学员下拉框数据*/
      *updateClassStudent({ payload }, { call, put, select }) {
          let {classId,courseId,orgId,classStuComArr} = payload;

          if(courseId == undefined) {
              yield put({
                    type : 'updateState',
                    payload : {
                        classStuComList: [],
                    }
                })
              return;
          }
          let params = {
//              clsId: classId,
              courseId,orgId,clsId: classId,
          };
          //查询班级所在课程所有学员
          let { ret } = yield call( updateRemedialStuData, parse(params) );
            if( ret && ret.errorCode == 9000 ){
                let classStuComList = ret.results;

                yield put({
                    type : 'updateState',
                    payload : {
                        classStuComList,
                    }
                });
            } else {
              message.error((ret && ret.errorMessage) || '没有获取到课程学员');
          }

          //查询班级内学员
          let result = yield call( classStuComList, parse(params) );
            if( result && result.ret && result.ret.errorCode == 9000 ){
                let classStuComList = result.ret.results;

                if(classStuComArr == undefined) {
                    classStuComArr = [];
                    classStuComList && classStuComList.map(function(csItem, csindex) {
                        classStuComArr.push(csItem.stuId);
                    });
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        classStuComArr,
                    }
                });
            } else {
              message.error((result && result.ret && result.ret.errorMessage) || '没有获取到班级学员');
          }
      },

      /*修改课程下的补课学员  数据*/
      *updateRemedialStuData({ payload }, { call, put, select }) {
          let {orgId, courseId} = payload;

          let { ret } = yield call( updateRemedialStuData, parse({orgId, courseId}) );
          if( ret && ret.errorCode == 9000 ){
              yield put({
                  type : 'updateState',
                  payload: {
                      remedialStuData: ret.results,
                  }
              });
          } else {
            message.error((ret && ret.errorMessage) || '查询补课学员失败');
          }
      },

      /*删除排课计划*/
      *deleteSchedule({ payload }, { call, put, select }) {
          let {orgId,cpId,afterSubmitFunction,onCloseFunction,} = payload;
          yield put({
              type : 'changeFormLoading',
          });

          let { ret } = yield call( deleteSchedule, parse({orgId,cpId}) );
          if( ret && ret.errorCode == 9000 ){
                yield put({
                  type : 'changeFormLoading',
              });
                yield put({
                  type : 'resetRemedialStuArr',
              });
                onCloseFunction && onCloseFunction();
                afterSubmitFunction && afterSubmitFunction();
            } else {
                yield put({
                  type : 'changeFormLoading',
              });
              message.error((ret && ret.errorMessage) || '课程表删除失败');
          }
      },

          /*提交保存课程表计划*/
      *submitSchedule({ payload }, { call, put, select }) {
          let {params, afterSubmitFunction,onCloseFunction,} = payload;

          yield put({
              type : 'changeFormLoading',
          });

          let classScheduleFormModel = yield select(state => state.classScheduleFormModel);

          params.studyDate = params.studyDate != undefined ?　params.studyDate.format('YYYY-MM-DD')　: '';
          params.startTime = params.classTime[0];
          params.endTime = params.classTime[1];

          let {
              type,
              ptArr,
              atArr,
              normalStuArr,
              remedialStuArr,
              auditionStuArr,
              scheduleTypeRepeatType,
              scheduleTypeRepeatTypeValue,
              classTime,
          } = params;

          if(scheduleTypeRepeatType != undefined) {
              if(scheduleTypeRepeatType == '1') {
                  //按周重复
                  let weekValue = parseInt(scheduleTypeRepeatTypeValue + '') + 1;
                  params.cronExp = '0 0 0 ? * ' + weekValue + ' *';
              } else if(scheduleTypeRepeatType == '2') {
                  //按月重复
                  params.cronExp = '0 0 0 ' + (parseInt(scheduleTypeRepeatTypeValue + '') + 1) + ' * ? *';
              }
          }

          params.normalStuArr   = (normalStuArr && normalStuArr.length > 0) ? normalStuArr.join(',') : '';

          params.auditionStuArr = (auditionStuArr && auditionStuArr.length > 0) ? auditionStuArr.join(',') : '';

          //补课时的补课学员
          if(type == '3') {
              let {remedialStuArr,remedialStuArrInit} = classScheduleFormModel;
              if(!remedialStuArrInit) {
                  remedialStuArr = params.remedialStuArr;
              }

              let remedialStuArrList = [];
              if(remedialStuArr && remedialStuArr.length > 0) {
                  remedialStuArr.map(function(remeItem) {
                      remedialStuArrList.push({
                          stuId: params[remeItem.key],
                          stuCourseId: params['courseClass_'+remeItem.key],
                          progress : params['courseClassPross_'+remeItem.key],
                      });
                  });
                  params.remedialStuArr = JSON.stringify(remedialStuArrList);
              }
          }

          params.ptArr   = (ptArr && ptArr.length > 0) ? ptArr.join(',') : '';
          params.atArr   = (atArr && atArr.length > 0) ? atArr.join(',') : '';

          params.classTime = (classTime && classTime.length > 0) ? classTime.join('-') : '';

          let { ret } = yield call( submitSchedule, parse(params) );
            if( ret && ret.errorCode == 9000 ){
                yield put({
                  type : 'changeFormLoading',
              });
                yield put({
                  type : 'resetRemedialStuArr',
              });
                onCloseFunction && onCloseFunction();
                afterSubmitFunction && afterSubmitFunction();
            } else {
                yield put({
                  type : 'changeFormLoading',
              });
              message.error((ret && ret.errorMessage) || '课程表保存失败');
          }
      },

  },

  reducers: {

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },
      /*重置补课学员数组*/
      resetRemedialStuArr(state, action) {
          return { ...state,
              remedialStuArr: [{key: 'remedialStu_0', index: 0, value: undefined}],
          };
      },

      changeFormLoading(state, action) {
          let formLoading = state.formLoading;
          return { ...state, formLoading: !formLoading, };
      },

      onClose(state, action) {
          return { ...state, formLoading: false, visible: false, formData: {}, remedialStuArr: [{key: 'remedialStu_0', index: 0, value: undefined}], };
      },

      resetFormModel(state, action) {
          return { ...state, formLoading: false, formData: {}, remedialStuArr: [{key: 'remedialStu_0', index: 0, value: undefined}], classStuComList: [], remedialStuData: []};
      },

      updateFormDataOrgId(state, action) {
          let {orgId} = action.payload;
          let {formData} = state;
          formData.orgId = orgId;
          return { ...state, formData, };
      },

      changeClassTime(state, action) {
         let {formData} = state;
         let {type, time, timeString} = action.payload;
         formData = formData || {};
         if(type == 'classBeginTime') {
             formData.startTime = timeString;
         } else {
             formData.endTime = timeString;
         }
         return { ...state, formData, };
      },
  },

}
