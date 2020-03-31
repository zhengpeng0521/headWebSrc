import {message} from 'antd';
import { parse } from 'qs';
import {getNoticeList, getNoticeReadInfo, getStudentList, getParentsNoticeDetail,} from '../../../../services/erp/parents-notice/parentsNoticeService';
import {getEmployeeComList} from '../../../../services/erp/employee/employeeService';
import {getCourseComList} from '../../../../services/erp/courseManage/courseManageService';
export default {

  namespace: 'parentsNoticeFormModel',

  state: {
      visible: false,   //表单窗口是否显示
      loading: false,
      noticeId: '',//通知编号
      sendTime: '',        //发送时间
      stuList: [],    //通知的学员
      stuObjList: [],    //通知的学员对象集合
      noticeTitle: '',          //通知的标题
      noticeContent: '',    //通知的内容  html

      studentSelectVisible: false,  //学生选择窗口是否显示
      allStudentList: [],  //学生选择窗口 显示的所有学员

      stuLoading: false,
      courseComList: [],
      employeeComList: [],
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/erp_fnotice_list') {
                  dispatch({
                    type : 'initCourseComList',
                });
                dispatch({
                    type : 'initEmployeeComList',
                });
              }
          });
      },
  },

  effects: {

      /*初始化下拉框数据*/
      *initCourseComList({ payload } , { put , call , select }){
          let { ret } = yield call(getCourseComList);
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
        /*初始化下拉框数据*/
      *initEmployeeComList({ payload } , { put , call , select }){
          let { ret } = yield call(getEmployeeComList);
          if( ret && ret.errorCode == 9000 ){
            yield put({
                type : 'updateState',
                payload : {
                    employeeComList: ret.results,
                }
            });
          } else {
            message.error((ret && ret.errorMessage) || '获取老师数据失败');
          }
      },

      /*显示家长通知的表单*/
      *showParentsNoticeForm({ payload } , { put , call , select }){

            let noticeId = payload && payload.noticeId;

            if(noticeId != undefined && noticeId != '') {
                let { ret } = yield call( getParentsNoticeDetail, parse({id: noticeId}));
                if( ret && ret.errorCode == 9000 ){

                    let stuObjList = (ret.students && ret.students.length > 0) ? JSON.parse(ret.students) : []  ;
                    let stuList = [];
                    stuObjList && stuObjList.length > 0 && stuObjList.map(function(item) {
                        stuList.push(item.stuId);
                    });

                    yield put({
                        type : 'updateState',
                        payload : {
                            noticeId: ret.noticeId,
                            stuList,
                            stuObjList,
                            noticeTitle: ret.title,
                            sendTime: ret.sendTime,
                            noticeContent: ret.detailHtml,
                            visible: true,
                            loading: false,
                        }
                    });

                    yield put({
                        type : 'updateAllStuStatus',
                    });
                } else {
                    message.error(ret.errorMessage || '家长通知不存在或者已经被删除');
                }
            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        noticeId: '',
                        orgId: '',
                        stuList: [],
                        stuObjList: [],
                        noticeTitle: '',
                        noticeContent: '',
                        visible: true,
                        loading: false,
                    }
                });
            }
      },

      /*查询相关学员*/
      *searchStudents({ payload } , { put , call , select }){
          let query = payload.query || {};

          yield put({
            type : 'updateState',
            payload: {
                stuLoading: true,
            }
          });

          let { ret } = yield call(getStudentList, parse(query));
          if( ret && ret.errorCode == 9000 ){
            yield put({
                type : 'updateState',
                payload : {
                    allStudentList: ret.classList,
                    stuLoading: false,
                }
            });

            yield put({
                type : 'updateAllStuStatus',
            });
         } else {
             yield put({
                type : 'updateState',
                payload: {
                    stuLoading: false,
                }
              });
            message.error((ret && ret.errorMessage) || '查询学员失败');
         }
      },

          //请客所有已选学员
      *onRemoveAllStu({ payload } , { put , call , select }){
          yield put({
                type : 'updateState',
                payload : {
                    stuList: [],
                    stuObjList: [],
                }
            });

            yield put({
                type : 'updateAllStuStatus',
            });
      },
},


  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },

      changeStudentSelectVisible(state, action) {
          let studentSelectVisible = state.studentSelectVisible;
          return {...state, studentSelectVisible: !studentSelectVisible};
      },

      onClose(state, action) {
          return {...state, visible: false}
      },

      //改变选择的学员
      changeStuSelect(state, action) {
          let {check, type, classId, stuId, stuName} = action.payload;
          let {stuList, stuObjList, allStudentList} = state;

          if(type == 'class') {
              //全选或全不选班级

              if(allStudentList && allStudentList.length > 0) {
                  for(let i = 0; i < allStudentList.length; i++) {
                      let classItem = allStudentList[i];
                      let itemClassId = classItem.classId;
                      let itemStuList = classItem.stuList;
                      if(itemClassId == classId) {
                          classItem.select = check ? 'all' : 'none';

                          if(itemStuList && itemStuList.length > 0) {
                              if(check) {
                                  //全选班级的学员
                                  for(let j = 0; j < itemStuList.length; j++) {
                                      let itemStuId = itemStuList[j].stuId;
                                      let itemStuName = itemStuList[j].stuName;
                                      if(!stuList.includes(itemStuId)) {
                                          stuList.push(itemStuId);
                                          stuObjList.push({
                                              stuId: itemStuId,
                                              stuName: itemStuName,
                                          });
                                      }
                                  }
                              } else {
                                  //全不选 班级学员
                                  for(let j = 0; j < itemStuList.length; j++) {
                                      let itemStuId = itemStuList[j].stuId;

                                      //找到学员编号在已选学员数组的位置
                                      let itemIndex = stuList.findIndex((value, index, arr)=>value==itemStuId);

                                      if(itemIndex > -1) {
                                          stuList.splice(itemIndex, 1);
                                          stuObjList.splice(itemIndex, 1);
                                      }
                                  }
                              }
                          }
                      }
                  }
              }

          } else {
              //选择或取消选中 学员
              if(check) {
                  //选择学员
                  stuList.push(stuId);
                  stuObjList.push({
                    stuId,
                    stuName,
                  });
              } else {
                  //取消选中学员
                  //找到学员编号在已选学员数组的位置
                  let itemIndex = stuList.findIndex((value, index, arr)=>value==stuId);
                  if(itemIndex > -1) {
                      stuList.splice(itemIndex, 1);
                      stuObjList.splice(itemIndex, 1);
                  }
              }

              //修改班级列表的是否全选状态
              if(allStudentList && allStudentList.length > 0) {
                  for(let i = 0; i < allStudentList.length; i++) {
                      let classItem = allStudentList[i];
                      let itemClassId = classItem.classId;
                      let itemStuList = classItem.stuList;

                      if(itemStuList && itemStuList.length > 0) {
                          let class_all = true;
                          let class_none = true;

                          for(let j = 0; j < itemStuList.length; j++) {
                              let itemStu = itemStuList[j];
                              let itemStuId = itemStu.stuId;

                              if(stuList.includes(itemStuId)) {
                                  class_none = false;
                              } else {
                                  class_all = false;
                              }
                          }

                          classItem.select = class_all ? 'all' : class_none ? 'none' : 'half';
                      }
                  }
              }
          }

          return {...state, allStudentList: allStudentList, stuList: stuList, stuObjList,};
      },

      updateAllStuStatus(state, action) {
          let {stuList, allStudentList} = state;

          //修改班级列表的是否全选状态
          if(allStudentList && allStudentList.length > 0) {
              for(let i = 0; i < allStudentList.length; i++) {
                  let classItem = allStudentList[i];
                  let itemClassId = classItem.classId;
                  let itemStuList = classItem.stuList;

                  if(itemStuList && itemStuList.length > 0) {
                      let class_all = true;
                      let class_none = true;

                      for(let j = 0; j < itemStuList.length; j++) {
                          let itemStu = itemStuList[j];
                          let itemStuId = itemStu.stuId;

                          if(stuList.includes(itemStuId)) {
                              class_none = false;
                          } else {
                              class_all = false;
                          }
                      }

                      classItem.select = class_all ? 'all' : class_none ? 'none' : 'half';
                  }
              }
          }

          return {...state, allStudentList,};
      },
  }
}
