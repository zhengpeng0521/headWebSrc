import {
    GetTimeData,        //获取已经定义好的时间
    FormSubmit          //点击
} from '../../../../services/system/class-schedule-time-set/ClassScheduleTimeSet';
import { parse } from 'qs';
import { message } from 'antd';

/*校区排课课程表时间范围设置*/
export default {

    namespace: 'classScheduleTimeSet',

    state: {
        loading : false,            //整个页面loading状态
        buttonLoading : false,      //按钮loading状态
        startTime : '',             //时间范围开始时间
        endTime : '',               //时间范围结束时间
        initialArr : [],            //查询获取到的数据，提交时需要更新此数组[0]的key
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_scfg_cptime') {
                    //获取时间定义数据
                    dispatch({
                        type:'GetTimeData',
                        payload:{
                            confKey:'CPTIMESET'
                        }
                    });
                }
            });
        },
    },

    effects: {
        //获取时间定义数据
        *'GetTimeData'({ payload } , { put , call , select }){
            yield put({ type:'showLoading' });
            let { ret } = yield call(GetTimeData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                let index = ret.list[0].key.indexOf('-');
                let startTime = ret.list[0].key.substr(0,index);
                let endTime = ret.list[0].key.substr(index+1);
                yield put({
                    type:'updateState',
                    payload:{
                        startTime,
                        endTime,
                        initialArr : ret.list
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取时间设置失败');
            }
            yield put({ type:'closeLoading' });
        },

        //提交保存
        *'FormSubmit'({ payload } , { put , call , select }){
            yield put({ type:'showButtonLoading' });
            let { ret } = yield call(FormSubmit,parse(payload));
            if (ret && ret.errorCode === 9000) {
                message.success('时间范围设置成功');
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('时间范围设置失败');
            }
            yield put({ type:'closeButtonLoading' });
        },
    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showLoading(state, action){
            return { ...state , loading : true };
        },
        closeLoading(state, action){
            return { ...state , loading : false };
        },
        showButtonLoading(state, action){
            return { ...state , buttonLoading : true };
        },
        closeButtonLoading(state, action){
            return { ...state , buttonLoading : false };
        },
    },
};
