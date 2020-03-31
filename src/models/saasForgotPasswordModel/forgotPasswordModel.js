import { routerRedux } from 'dva/router';
import * as server from '../../services/login/LoginPageService';
import * as codeServer from '../../services/index/common/veryCodeService';
import { parse } from 'qs';
import {message} from 'antd';

export default {

    namespace: 'saas_forgot_password',

    state: {
        initData            : {},       //window._init_data
		codeStateString		: '获取验证码', //获取验证码
		codeDisabled		: true,		//是否不可点击  false可以点击
		touchCode			: false,	//是否点击了获取验证码
		nextStep			: false,	//是否验证通过
		previousStep		: false,	//上一步
		MerchantList  		: [], 		//商户列表
    },

  	subscriptions: {
      	setup({ dispatch, history }) {
		  	history.listen(( { pathname, query }) => {
              	if(pathname === '/') {
                    dispatch({
                        type:'updateState',
                        payload:{
                            initData : window._init_data || {}
                        }
                    })
					document.onkeydown = function() {
            			if (event.keyCode == 9) {
                			return false;
            			}
					}
              	}
          	});
      	},
  	},

    effects: {

		//获取验证码
		*getVerificationCode({payload}, { call, put, select }) {
			let param = {
				mobile : payload&&payload.phone,
			}
			let { ret } = yield call(codeServer.sendVerifyCode, parse(param));
            if( ret && ret.errorCode === 9000 ){
                message.success('发送成功');
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '发送失败');
            } else {
                message.error('您的网络状况不佳，请检查网络情况');
            }
		},

		//修改密码进行验证手机
		*changePassword({payload}, {call, put, select}) {

			let data = payload&&payload.data;

			let paramter = {
				mobile : data.mobile,
				verifyCode : data.code,
			}

			let { ret } = yield call(server.PassWordRecoveryFirstStep, parse(paramter));
            if( ret && ret.errorCode === 9000 ){
              yield put({
                    type:'updateState',
                    payload:{
                        nextStep : true,
						previousStep : false,
						MerchantList : ret.results,
                    }
                });
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '验证失败');
            } else {
                message.error('您的网络状况不佳，请检查网络情况');
            }
		},

		//保存修改后的密码
		*saveNewPassWord({payload}, {call, put, select}) {

			let data = payload&&payload.data;

			let paramter = {
				tenantId : data.merchants,
				mobile : data.mobile,
				newPassword : data.pwd,
				confirmPassword : data.confirmPwd,
				verifyCode : data.code,
			}

			var pushLogin = function(s) {
				return new Promise(function() {
					setTimeout(function() {
						window.location.href = BASE_URL + '/login';
					}, s)
				})
			}

			let { ret } = yield call(server.PassWordRecoverySecondStep, parse(paramter));
            if( ret && ret.errorCode === 9000 ){
				message.success(ret&&ret.errorMessage || '修改成功');
				yield pushLogin(2000);
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '修改失败');
            } else {
                message.error('您的网络状况不佳，请检查网络情况');
            }
		},
	},

  	reducers: {
      	updateState(state, action) {
		  	return { ...state, ...action.payload, };
      	},
 	 },

}
