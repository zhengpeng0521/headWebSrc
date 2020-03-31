import {
    GetCheckBoxAndChoose,       //获取checkbox并且获取选中了哪些
    SaveSmallTicketSet          //保存设置选项
} from '../../../../services/system/check-on-work-attendance/checkOnWorkAttendance';
import { parse } from 'qs';
import { message } from 'antd';

/*校区logo*/
export default {

    namespace: 'checkOnWorkAttendance',

    state: {
        loading          : false,                //是否加载状态
        attendWorkStatus : '1',         //出勤状态
        leaveWorkStatus  : '1',         //请假状态
        outSchoolStatus  : '1',         //旷课状态

        conent           : '' ,
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_cfg_sign') {
                    dispatch({
                        type:'GetCheckBoxAndChoose',
                        payload:{
                           confKey: "DEDUCTCOST",
                        }
                    });
                }
            });
        },
    },

    effects: {

        *'GetCheckBoxAndChoose'({ payload },{ put , call , select }){
            const { ret } = yield call(GetCheckBoxAndChoose,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let list=ret.list;
                let attendStatus ='';        //出勤状态
                let leaveStatus = '';         //请假状态
                let outStatus  = '';         //旷课状态

                for(var i in list){
                    if(list[i].key=='attendance'){
                        if(list[i].value=='1'){
                            attendStatus='1'
                        }else{
                             attendStatus='0'
                        }
                    }
                    if(list[i].key=='leave'){
                        if(list[i].value=='1'){
                            leaveStatus='1'
                        }else{
                            leaveStatus='0'
                        }
                    }
                    if(list[i].key=='truant'){
                        if(list[i].value=='1'){
                            outStatus='1'
                        }else{
                            outStatus='0'
                        }
                    }

                }

                yield put({
                    type:'updateState',
                    payload:{
                        attendWorkStatus : attendStatus,         //出勤状态
                        leaveWorkStatus  : leaveStatus,         //请假状态
                        outSchoolStatus  : outStatus,         //旷课状态
                        conent           : ret.list,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取配置信息出错');
            }
        },

        //保存设置选项
        *'SaveLeadRecordRule'({ payload },{ put , call , select }){
            yield put({type:'showLoading'});
            const { ret } = yield call(SaveSmallTicketSet,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success('保存成功');
                yield put({
                    type:'GetCheckBoxAndChoose',
                    payload:{
                       confKey:'DEDUCTCOST'
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('保存配置信息出错');
            }
            yield put({type:'closeLoading'});
        },
    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showLoading(state, action) {
            return { ...state, ...action.payload , loading : true};
        },
        closeLoading(state, action) {
            return { ...state, ...action.payload , loading : false};
        },
    },
};
