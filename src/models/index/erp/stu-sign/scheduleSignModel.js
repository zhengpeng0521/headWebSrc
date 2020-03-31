import {message} from 'antd';
import { parse } from 'qs';
import {getEmployeeComList} from '../../../../services/erp/employee/employeeService';
import {
    getSignScheduleDetail,
    saveSign,
    SignRecordTableItemPrint            //获取打印配置
} from '../../../../services/erp/stu-sign/studentSignService';
import { FormatDate } from '../../../../utils/dateFormat';
import { lodopPrintAttendance } from '../../../../utils/lodopPrintUtils';

/*排课签到*/
export default {

  namespace: 'scheduleSignModel',

  state: {
      visible: false,
      loading: false,

      cpId: '', //排课编号
      orgId: '', //机构编号
      ptArr: [],//主教老师
      atArr: [],//助教老师

      className: '',
      clourseName: '',

      clsSignTime: '', //班级签到时间
      clsSignCostTpl: '', //班级签到消耗课时   1,2,3,4 上课1,请假2,补课3,旷课4
      cpContent: '', //上课内容
      homework: '', //课后作业
      remarks: '', //备注

      normalStuArr: [], //班课学员
      remedialStuArr: [], //补课学员
      auditionStuArr: [], //试听学员

      employeeComList: [],//查询下拉框数据

      stuSignErrorMessage: [],//学员签到的错误原因

      wetherPrintTicket : false,       //是否打印小票

      editing:'', //是否为考勤 且是否可以编辑
  },

  effects: {
      //打开排课签到界面
      *showScheduleSign({ payload }, { call, put, select }) {

          let scheduleSignModel = yield select(state => state.scheduleSignModel);

          let afterOpen = payload.afterOpen;
          let cpId = (payload.cpId != undefined && payload.cpId != '') ? payload.cpId : scheduleSignModel.cpId;
          let orgId = (payload.orgId != undefined && payload.orgId != '') ? payload.orgId : scheduleSignModel.orgId;

          let editing = (payload.editing != undefined && payload.editing != '') ? payload.editing : '';

          let stuSignErrorMessage = payload.stuSignErrorMessage || [];

          let {employeeComList} = scheduleSignModel;

          if(employeeComList.length == 0) {
              yield put({
                type : 'initEmployeeComList',
                payload: {
                    orgId
                }
              });
          }

          let signType_class = '1';//签到类型-上课
          let signType_leave = '2';//签到类型-请假
          let signType_remedial = '3';//签到类型-补课
          let signType_cut = '4';//签到类型-旷课
          let signType_listen = '5';//签到类型-试听
          let signType_absent = '6';//签到类型-缺席

          let { ret } = yield call( getSignScheduleDetail, parse({orgId, cpId}) );


          if( ret && ret.errorCode == 9000 ){
                let cpId            = ret.cpId;
                let ptArr           = ret.ptArr;
                let atArr           = ret.atArr;
                let clsSignTime     = ret.clsSignTime;
                let clsSignCostTpl  = ret.clsSignCostTpl || '';
                let cpContent       = ret.cpContent;
                let homework        = ret.homework;
                let remarks         = ret.remarks;
                let className = ret.className;
                let courseName = ret.courseName;

                let students = ret.results;
                let normalStuArr    = [];
                let remedialStuArr  = [];
                let auditionStuArr  = [];

              let clsSignCostTplArr = clsSignCostTpl.split(',');
              //学员签到类型分类
                students && students.length > 0 && students.map(function(stuItem) {
                    let stuCpType = stuItem.stuCpType;
                    let stuSignType = stuItem.stuSignType;
                    if(stuSignType != undefined && stuSignType != '') {
                        stuItem.disabled = true;

                       if(clsSignCostTplArr && clsSignCostTplArr.length == 4) {
                            if(stuSignType == '1') {
                                stuItem.period = clsSignCostTplArr[0];
                            } else if(stuSignType == '2') {
                                stuItem.period = clsSignCostTplArr[1];
                            } else if(stuSignType == '3') {
                                stuItem.period = clsSignCostTplArr[2];
                            } else if(stuSignType == '4') {
                                stuItem.period = clsSignCostTplArr[3];
                            }
                        }
                    }

                    if(stuCpType == '1') {
                        auditionStuArr.push(stuItem);
                    } else if(stuCpType == '2') {
                        normalStuArr.push(stuItem);
                    } else if(stuCpType == '3') {
                        remedialStuArr.push(stuItem);
                    }
                });
                yield put({
                    type : 'updateState',
                    payload : {
                        editing:editing,
                        visible: true,
                        loading: false,
                        cpId,
                        orgId,
                        ptArr,
                        atArr,
                        clsSignTime,
                        clsSignCostTpl,
                        cpContent,
                        homework,
                        remarks,
                        className,courseName,
                        normalStuArr,
                        remedialStuArr,
                        auditionStuArr,
                        stuSignErrorMessage,
                    }
                });


              afterOpen && afterOpen();//关闭之前窗口的加载事件
            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                    }
                  });
                afterOpen && afterOpen();//关闭之前窗口的加载事件
              message.error((ret && ret.errorMessage) || '没有获取到排课计划');
          }

      },

      /*初始化 员工摘要信息*/
      *initEmployeeComList({ payload }, { call, put, select }) {
          let orgId = payload && payload.orgId;
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

      /*保存签到信息*/
      *saveSign({ payload }, { call, put, select }) {

          yield put({
            type : 'updateState',
            payload : {
                loading: true,
            }
          });
          let params = payload.params;
          let afterSave = payload.afterSave;

          let scheduleSignModel = yield select(state => state.scheduleSignModel);
          let {normalStuArr,remedialStuArr,auditionStuArr,} = scheduleSignModel;

          let newParams = {};
          newParams.cpId = params.cpId;
          newParams.orgId = params.orgId;
          newParams.classContent = params.classContent;
          newParams.homework = params.homework;
          newParams.remarks = params.remarks;

          let signArr = [];
          //解析班课学员的签到信息
          normalStuArr && normalStuArr.length > 0 && normalStuArr.map(function(normalStuItem) {
              let stuSignType = normalStuItem.stuSignType;
              if(stuSignType != undefined && stuSignType != '') {
                  let stuSignRemark = params['normal_stuRemark_'+normalStuItem.stuId];
                  let stuSignEffect = params['normal_stuScore_'+normalStuItem.stuId];
                  signArr.push({
                      stuId: normalStuItem.stuId,
                      stuName: normalStuItem.stuName,
                      stuType: '2',
                      stuSignType: normalStuItem.stuSignType,
                      stuSignRemark,
                      stuSignEffect,
                      isCreate: !normalStuItem.disabled,
                  });
              }
          });

          //解析补课学员的签到信息
          remedialStuArr && remedialStuArr.length > 0 && remedialStuArr.map(function(stuItem) {
              let stuSignType = stuItem.stuSignType;
              if(stuSignType != undefined && stuSignType != '') {
                  let stuSignRemark = params['remedial_stuRemark_'+stuItem.stuId];
                  let stuSignEffect = params['remedial_stuScore_'+stuItem.stuId];
                  signArr.push({
                      stuId: stuItem.stuId,
                      stuName: stuItem.stuName,
                      stuType: '3',
                      stuSignType: stuItem.stuSignType,
                      stuSignRemark,
                      stuSignEffect,
                      isCreate: !stuItem.disabled,
                  });
              }
          });

          //解析试听学员的签到信息
          auditionStuArr && auditionStuArr.length > 0 && auditionStuArr.map(function(stuItem) {
              let stuSignType = stuItem.stuSignType;
              if(stuSignType != undefined && stuSignType != '') {
                  let stuSignRemark = params['audition_stuRemark_'+stuItem.stuId];
                  let stuSignEffect = params['audition_stuScore_'+stuItem.stuId];
                  signArr.push({
                      stuId: stuItem.stuId,
                      stuName: stuItem.stuName,
                      stuType: '1',
                      stuSignType: stuItem.stuSignType,
                      stuSignRemark,
                      stuSignEffect,
                      isCreate: !stuItem.disabled,
                  });
              }
          });

          newParams.signArr = JSON.stringify(signArr);

          let { ret } = yield call( saveSign, parse(newParams) );
            if( ret && ret.errorCode == 9000 ){
                message.success('签到成功');
                afterSave && afterSave();
                //是否选中了打印小票
                if(scheduleSignModel.wetherPrintTicket){
                    let stuIds = [];
                    for(let i in signArr){
                        stuIds.push(signArr[i].stuId);
                    }
                    yield put({
                        type:'initLodopConfing',
                        payload:{
                            cpId : newParams.cpId,
                            orgId : newParams.orgId,
                            date : FormatDate(new Date()),
                            stuIds : stuIds.join(',')
                        }
                    });
                }
            } else {
                let errorMessage = ret && ret.errorMessage;
                let stuSignErrorMessage = [];
                if(errorMessage && errorMessage.length > 0) {
                    let arr = errorMessage.split(';');
                    arr && arr.length > 0 && arr.map(function(arrItem) {
                        let stuArr = arrItem.split(':');
                        if(stuArr && stuArr.length > 1) {
                            stuSignErrorMessage.push({
                                stuId: stuArr[0],
                                message: stuArr[1],
                            });
                        }
                    });
                }
                yield put({
                    type : 'showScheduleSign',
                    payload : {
                        stuSignErrorMessage,
                    }
                });
              message.error(stuSignErrorMessage.length > 0 ? '签到出错啦' : (ret && ret.errorMessage) || '连接服务器超时,请稍后重试');
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
            yield put({
                type:'SignRecordTableItemPrint',
                payload:{
                    ...payload
                }
            });
        },

        //获取打印配置
        *'SignRecordTableItemPrint'({ payload } , { put , call , select }){
            let obj = {};
            obj.type = 0;
            obj.orgId = payload.orgId;
            obj.cpId = payload.cpId;
            obj.date = payload.date.substr(0,10);
            obj.stuIds = payload.stuIds;
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
  },

  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },

      changeSignType(state, action) {
          let {check,type,signType,stuId,} = action.payload;
          let {normalStuArr,remedialStuArr,auditionStuArr,clsSignCostTpl,} = state;
          let clsSignCostTplArr = clsSignCostTpl.split(',');
          let stuArr;
          if(type == '1') {
              stuArr = auditionStuArr;
          } else if(type == '2') {
              stuArr = normalStuArr;
          } else if(type == '3') {
              stuArr = remedialStuArr;
          }

          let signType_class = '1';//签到类型-上课
          let signType_leave = '2';//签到类型-请假
          let signType_remedial = '3';//签到类型-补课
          let signType_cut = '4';//签到类型-旷课
          let signType_listen = '5';//签到类型-试听
          let signType_absent = '6';//签到类型-缺席

          stuArr && stuArr.length > 0 && stuArr.map(function(item) {
              if(stuId == item.stuId) {
                  item.stuSignType = check ? signType : '';
                  if(check) {
                      if(signType == signType_class) {
                          item.period = clsSignCostTplArr[0];
                      } else if(signType == signType_leave) {
                          item.period = clsSignCostTplArr[1];
                      } else if(signType == signType_remedial) {
                          item.period = clsSignCostTplArr[2];
                      } else if(signType == signType_cut) {
                          item.period = clsSignCostTplArr[3];
                      }
                  } else {
                      item.period = 0;
                  }
              }
          });

          return {...state, normalStuArr,remedialStuArr,auditionStuArr};
      },
  },
}
