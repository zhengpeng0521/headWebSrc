import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import { FormatDate } from '../../../../utils/dateFormat';
import { lodopPrintAttendance } from '../../../../utils/lodopPrintUtils'

import {
    getStuSignScheduleList,
    stuFastSign,
    SignRecordPrint         //选中小票打印后打印
} from '../../../../services/erp/stu-sign/studentSignService';

// 首页根据学员进行快捷签到
export default {

  namespace: 'signByStuModel',

  state: {
    loading: false,//加载
    visible: false,//是否显示

    orgId: '',//校区编号
    stuId: '',//学员编号
    stuName: '',//学员名称

    scheduleList: [],//学员的排课列表
    wetherPrintTicket:false,    //是否打印小票
    printTicketIndex: '',       //选择小票的索引
  },

  effects: {

      /*显示按学员签到界面*/
      *showSign({ payload }, { call, put, select }) {
          let { orgId,stuId,stuName } = payload;
          if(stuName == undefined) {
              let signByStuModel = yield select(state => state.signByStuModel);
              stuName = signByStuModel.stuName;
          }

          let params = {
              orgId,stuId,
          };

          //加载学员的排课
          let { ret } = yield call( getStuSignScheduleList, parse(params) );
          if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        scheduleList: ret.results,
                        orgId,stuId,stuName,
                        loading: false,
                        visible: true,
                    }
                });
            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                    }
                  });
              message.error((ret && ret.errorMessage) || '没有获取到排课计划');
          }
      },

      /*学员快速签到*/
      *stuQuickSign({ payload }, { call, put, select }) {
          let {cpId, orgId, stuId, signType,wetherPrintTicket,index} = payload;
          yield put({
              type: 'updateState',
              payload: {
                  loading: true,
              }
          });

          let params = {
              cpId, orgId, stuId, signType
          };
          //加载学员的排课
          let { ret } = yield call( stuFastSign, parse(params) );
          if( ret && ret.errorCode == 9000 ){
                message.success('快速签到成功');
                let signByStuModel = yield select(state => state.signByStuModel);
                let printTicketIndex = signByStuModel.printTicketIndex;
                yield put({
                    type : 'showSign',
                    payload : {
                        orgId, stuId,
                    }
                });
                if(wetherPrintTicket && printTicketIndex == index){
                    yield put({
                        type:'SignRecordPrint',
                        payload:{
                            type:0,
                            orgId,
                            cpId,
                            date : FormatDate(new Date()),
                            stuId,
                        }
                    });
                }
            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                    }
                  });
              message.error((ret && ret.errorMessage) || '学员快速签到出错啦!');
          }
      },

        //列表点击打印
        *'SignRecordPrint'({ payload } , { put , call , select }){
            let obj = {};
            obj.type = 0;
            obj.orgId = payload.orgId;
            obj.cpId = payload.cpId;
            obj.date = payload.date.substr(0,10);
            obj.stuIds = payload.stuId;
            let { ret } = yield call(SignRecordPrint,parse(obj));
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
          return { ...state, ...action.payload, };
      },

      showScheduleOpts(state, action) {
          let {scheduleList} = state;
          let {cpId} = action.payload;
          if(cpId != undefined && cpId != '' && scheduleList && scheduleList.length > 0) {
              for(let i = 0; i < scheduleList.length; i++) {
                  let scheduleItem = scheduleList[i];
                  if(scheduleItem.cpId == cpId) {
                      scheduleItem.showOpts = true;
                  }
              }
          }
          return { ...state, scheduleList, };
      },
  },

}
