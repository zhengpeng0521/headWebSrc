
import { parse } from 'qs';
import { message } from 'antd';
import { checkPhoneNum , getVerificationCode , getNetStep } from '../../../../services/system/security-settings/SecuritySettingsService'
export default {

    namespace: 'securitySettingsModel',

    state: {
        settingModalShow : false,
        tiedupShow : false,     //改绑弹框显示
        phoneNumState : '',      //手机号码状态
        tel : '',               //手机号码

        //Modal
        seetingStep : 0,        //步骤
        vCodeSate : 0,          //是否验证成功
        havePhone : false,      //是否有手机
        haveSettingTel : false, //设置安全手机
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_scfg_safety') {
                    dispatch({
                        type : 'getCheckPhoneNum',
                    });
                }
            });
        },
    },

    effects: {
        //是否有安全手机号
        *'getCheckPhoneNum'({ payload }, { call, put, select }) {
            let { ret } = yield call(checkPhoneNum, parse(payload));
            if( ret && ret.errorCode == 10000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        phoneNumState : ret.errorCode,
                    }
                })
            }else if (ret && ret.errorCode == 9000) {
               yield put({
                    type : 'updateState',
                    payload : {
                        phoneNumState : ret.errorCode,
                        tel : ret.results.tel,
                    }
                })
            } else {
                ret && message.error(ret.errorMessage || '查询信息出错！');
            }
        },

        //提交改绑手机号
        *'submitAction'({ payload }, { call, put, select }) {
            let { ret } = yield call(getNetStep, parse(payload));
            if (ret && ret.errorCode == 9000) {
                message.success('操作成功');
                yield put({
                    type : 'updateState',
                    payload : {
                        settingModalShow : false,
                    }
                })
                yield put({
                    type : 'getCheckPhoneNum',
                });
            } else {
                ret && message.error(ret.errorMessage || '查询信息出错！');
            }
        },


    //获取验证码
    *'verificationCodeFun'({ payload }, { call, put, select }) {
        let { ret } = yield call(getVerificationCode, parse(payload));
        if (ret && ret.errorCode == 9000) {
            message.success('验证码发送成功');
            yield put({
                type : 'updateState',
                payload : {
                    VcodeState : 1
                }
            })
        } else {
            ret && message.error(ret.errorMessage || '查询信息出错！');
        }
    },

    //第一步>下一步
    *'nextStep'({ payload }, { call, put, select }) {
        let { ret } = yield call(getNetStep, parse(payload));
        if (ret && ret.errorCode == 9000) {
            yield put({
                type : 'updateState',
                payload : {
                    vCodeSate : 1,
                    seetingStep : 1,
                }
            })
        } else {
            ret && message.error(ret.errorMessage || '查询信息出错！');
        }
    },
    *'nextStep1'({ payload }, { call, put, select }) {
        let { ret } = yield call(getNetStep, parse(payload));
        if (ret && ret.errorCode == 9000) {
            yield put({
                type : 'updateState',
                payload : {
                    vCodeSate : 2,
                    seetingStep : 2,
                }
            })
        } else {
            ret && message.error(ret.errorMessage || '查询信息出错！');
        }
    },
},

    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
    },
};
