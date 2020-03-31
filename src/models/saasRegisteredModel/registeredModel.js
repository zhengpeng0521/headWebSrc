import { routerRedux } from 'dva/router';
import * as server from '../../services/login/LoginPageService';
import * as codeServer from '../../services/index/common/veryCodeService';
import { parse } from 'qs';
import {message} from 'antd';

export default {

    namespace: 'saas_registered',

    state: {
		showRegistered 		: true, 	//显示注册弹框
		showRegisteredSuccress : false, 	//注册成功
		codeStateString_r   : '获取验证码',
		codeDisabled		: true,		//是否不可点击  false可以点击
		touchCode			: false,	//是否点击了获取验证码
		schoolTypeArr		: [],		//机构类型
        formConfiguration   : undefined, //表单配置
    },

  	subscriptions: {
      	setup({ dispatch, history }) {
		  	history.listen(( { pathname, query }) => {
              	if(pathname === '/') {
					dispatch({
						type : 'getOrganType',
					})
                    dispatch({
						type : 'registerChannel',
                        payload: {
                            id  : platform
                        }
					})
              	}
          	});
      	},
  	},

    effects: {
        //注册渠道配置
        *registerChannel({ payload }, { call, put, select }){
            let { ret } = yield call(codeServer.registerChannel, parse({channelId: payload.id || 'undefined'}));
            if( ret && ret.errorCode === 9000 ){
                let flag = ret.results.baseForm;
                yield put({
                    type:'updateState',
                    payload:{
                        formConfiguration : JSON.parse(flag),
                    }
                });
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '注册表单配置获取失败');
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
				address 	: data.address || '',
				orgNeed 	: data.demand || '',
				orgName 	: data.orgName || '',
				orgType 	: data.organType || '',
				userName 	: data.personName || '',
				tel 		: data.personPhone || '',
				verifyCode  : data.verificationCode || '',
				channelId 	: platform,
                city        : data.city || '',
			}

			let { ret } = yield call(server.SendFreeTrailRequest, parse(param));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
                      	showRegisteredSuccress : true,
                    }
                });
				message.success('注册成功');
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '注册失败');
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
