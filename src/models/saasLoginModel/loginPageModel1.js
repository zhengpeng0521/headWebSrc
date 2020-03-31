import { routerRedux } from 'dva/router';
import * as server from '../../services/login/LoginPageService';
import * as codeServer from '../../services/index/common/veryCodeService';
import { parse } from 'qs';
import {message} from 'antd';

export default {

    namespace: 'saas_login',

    state: {
		showLogin			: true,	 	//显示登录弹框
		showRegistered 		: false, 	//显示注册弹框
		showForgotPassword 	: false, 	//显示忘记密码弹框
		showRegisteredSuccress : false, 	//注册成功
//		hiddenStyleName		: '',		//隐藏弹框动画名
		loginAccount	 	: '', 		//账号
		loginPassword 		: '',		//密码
		codeStateString		: '获取验证码', //获取验证码
		codeStateString_r   : '获取验证码',
		codeDisabled		: true,		//是否不可点击  false可以点击
		touchCode			: false,	//是否点击了获取验证码
		schoolTypeArr		: [],		//机构类型
		nextStep			: false,	//是否验证通过
		previousStep		: false,	//上一步
		MerchantList  		: [], 		//商户列表
    },

  	subscriptions: {
      	setup({ dispatch, history }) {
		  	history.listen(( { pathname, query }) => {
              	if(pathname === '/') {

              	}
          	});
      	},
  	},

    effects: {

		//登录
        *login({ payload }, { call, put, select }){
            let { ret } = yield call(server.onLoginService, parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{

                    }
                });
				message.success('登陆成功', 3);
				window.location = BASE_URL;
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '登陆失败');
            } else {
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

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

		//获取机构类型
		*getOrganType({ payload }, { call, put, select }){
            let { ret } = yield call(server.GetSchoolType, parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
                        schoolTypeArr : ret.results,
                    }
                });
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '机构类型获取失败');
            } else {
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

		//注册
		*registration({payload}, {call, put, select}) {

			let data = payload&&payload.data;

			let param = {
				detailAddr 	: data.address,
				orgNeeds 	: data.demand,
				orgName 	: data.orgName,
				schoolType 	: data.organType,
				userName 	: data.personName,
				tel 		: data.personPhone,
				verifyCode  : data.verificationCode,
				platform 	: 'saas',
			}

			let { ret } = yield call(server.SendFreeTrailRequest, parse(param));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
                      	showRegisteredSuccress : true,
                    }
                });
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '注册失败');
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

			let { ret } = yield call(server.PassWordRecoverySecondStep, parse(paramter));
            if( ret && ret.errorCode === 9000 ){
              yield put({
                    type:'updateState',
                    payload:{

					}
                });
				message.success(ret&&ret.errorMessage || '修改成功');
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
