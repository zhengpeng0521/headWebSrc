import { routerRedux } from 'dva/router';
import * as server from '../../services/login/LoginPageService';
import * as codeServer from '../../services/index/common/veryCodeService';

import { parse } from 'qs';
import {message} from 'antd';

export default {

    namespace: 'saas_login',

    state: {
        initData            : {},       //window._init_data
		loginAccount	 	: '', 		//账号
		loginPassword 		: '',		//密码
		tenantList  		: [],
		showTenantModal 	: false,
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
                    if(!window._init_data.hasCheckMsgDiv) {

                        let errorMsgStr = window._init_data && window._init_data.errorMsg ;

                        if(errorMsgStr && errorMsgStr.length > 0) {
                            let msgArr = errorMsgStr.split(':');
                            let errorCode = '', errorMessage = '', tenantId = '', account = '', password = '';
                            if(msgArr && msgArr.length > 1) {
                                errorCode = msgArr[0];
                                errorMessage = msgArr[1];
                            }

                            if(errorCode == '4000') {
                                if(msgArr.length == 5) {
                                    tenantId = msgArr[2];
                                    account = msgArr[3];
                                    password = msgArr[4];
                                }

                                window.location.href = window.BASE_URL + '/activate?tenantId=' + tenantId + '&mobile=' + account;
                                return;
//                                dispatch({
//                                    type : 'accountActiveModel/show',
//                                    payload : {
//                                        tenantId,
//                                        account,
//                                        password,
//                                    }
//                                });
//                                dispatch({
//                                    type: 'updateState',
//                                    payload: {
//                                        loginAccount: account,
//                                        loginPassword: password,
//                                    }
//                                });
                            } else {
                                errorMessage && message.error(errorMessage);
                            }
                        }

                        window._init_data.hasCheckMsgDiv = true;
                    }
              	}
          	});
      	},
  	},

    effects: {

		//登录
        *login({ payload }, { call, put, select }){
            let lt = window._init_data && window._init_data.loginTicket || '';
            let execution = window._init_data && window._init_data.flowExecutionKey || '';

            let params = {
                ...payload,
                username: payload.mobile,
                password: payload.password,
                lt, execution,
            }

            //不带租户号的登陆请求，  先经过sso系统认证
            if(params.tenantId == undefined || params.tenantId == '') {
                let ssoReq = yield call(server.onSsoLoginService, parse(params));
                if( ssoReq && ssoReq.ret && ssoReq.ret.errorCode === 9000 ){
                    //多租户的情况
                    let tenantList = ssoReq.ret.results;
                    if(tenantList && tenantList.length == 1) {
                        let currentTenant = tenantList[0];
                        let currentTenantId = currentTenant.tenantId;

                        yield put({
                            type : 'login',
                            payload : {
                                ...payload,
                                tenantId: currentTenantId,
                            }
                        });

                    } else {
                        yield put({
                            type : 'updateState',
                            payload : {
                                tenantList: ssoReq.ret.results,
                                showTenantModal : true,
                            }
                        });
                    }
                } else {
                    message.error((ssoReq && ssoReq.ret && ssoReq.ret.errorMessage) || '登录出现差错啦!', 3);
                }

                return;
            }

            let login_form = document.forms['login_form'];
            login_form.tenantId.setAttribute('value', params.tenantId);

            function GetQueryString(name) {
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r!=null)return  unescape(r[2]); return null;
            }
            let service = GetQueryString('service');

            var action = SSO_URL + "/login?";
            if(service){
                 action =action+"service="+service+"&locale=zh_CN";
            }else{
                action=action+"locale=zh_CN";
            }
            login_form.setAttribute('action', action);

            login_form.submit();
            return;

            //带租户号的登陆请求
            let { ret } = yield call(server.onLoginService, parse(params));

            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
						showTenantModal : false,
                    }
                });
				message.success('登录成功', 3);
				window.location = BASE_URL;
            } else {
				if(ret && ret.errorCode == 1000) {
                    //多租户的情况
                    let tenantList = ret.results;
                    if(tenantList && tenantList.length == 1) {
                        let currentTenant = tenantList[0];
                        let currentTenantId = currentTenant.tenantId;

                        yield put({
                            type : 'login',
                            payload : {
                                ...payload,
                                tenantId: currentTenantId,
                            }
                        });

                    } else {
                        yield put({
                            type : 'updateState',
                            payload : {
                                tenantList: ret.results,
                                showTenantModal : true,
                            }
                        });
                    }

                } else if(ret && ret.errorCode == 2001) {
                    yield put({
                        type : 'accountActiveModel/show',
                        payload : {
                            tenantId: ret.data,
                            account: payload&&payload.mobile,
                            password: payload&&payload.password,
                        }
                    });
                } else {
                    message.error((ret && ret.errorMessage) || '登录出现差错啦!', 3);
                }
			}
        },
	},

  	reducers: {
      	updateState(state, action) {
		  	return { ...state, ...action.payload, };
      	},
 	 },

}
