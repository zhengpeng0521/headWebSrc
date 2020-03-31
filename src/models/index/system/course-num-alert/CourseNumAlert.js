import {
    GetCourseNum,               /*获取续费提醒信息*/
    SaveCourseLeastNum          /*点击保存*/
} from '../../../../services/system/course-num-alert/CourseNumAlert';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

/*课时预警设置*/
export default {

    namespace: 'courseNumAlert',

    state: {
        information : {},           //课时信息
        loading : false,            //按钮和整个页面加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_scfg_pr') {
                    dispatch({
                        type:'GetCourseNum',
                        payload:{
                            confKey : 'PERIODNUMREMIND'
                        }
                    });
                }
            });
        },
    },

    effects: {
        /*获取续费提醒信息*/
        *'GetCourseNum'({ payload },{ put , call , select }){
            let { ret } = yield call(GetCourseNum,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type:'updateState',
                    payload:{
                        information : ret.list[0]
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取续费提醒信息失败');
            }
        },

        /*点击保存*/
        *'SaveCourseLeastNum'({ payload },{ put , call , select }){
            yield put({ type : 'showLoading' });
            let { ret } = yield call(SaveCourseLeastNum,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success('保存成功');
                yield put({
                    type:'GetCourseNum',
                    payload:{
                        confKey : 'PERIODNUMREMIND'
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('保存失败');
            }
            yield put({ type : 'closeLoading' });
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
    },
};
