import { routerRedux } from 'dva/router';
import * as server from '../../services/login/LoginPageService';
import * as codeServer from '../../services/index/common/veryCodeService';
import { parse } from 'qs';
import {message} from 'antd';

export default {

    namespace: 'saas_activation',

    state: {
        initData            : {},       //window._init_data
		codeStateString		: '获取验证码', //获取验证码
		codeDisabled		: false,		//是否不可点击  false可以点击
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
				mobile : mobile || '',
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

		//激活账号
		*activation({payload}, {call, put, select}) {

			let data = payload&&payload.data;

			let paramter = {
				mobile : mobile || '',
				tenantId : tenantId || '',
				verifyCode : data.code || '',
			}

			var pushLogin = function(s) {
				return new Promise(function() {
					setTimeout(function() {
						window.location.href = BASE_URL + '/login';
					}, s)
				})
			}
						
			let { ret } = yield call(server.accountActiveAction, parse(paramter));
            if( ret && ret.errorCode === 9000 ){
				message.success(ret&&ret.errorMessage || '激活成功');
				yield pushLogin(2000);
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '激活失败');
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
