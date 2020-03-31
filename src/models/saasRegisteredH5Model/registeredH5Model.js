import { routerRedux } from 'dva/router';
import * as server from '../../services/login/LoginPageService';
import * as codeServer from '../../services/index/common/veryCodeService';
import { parse } from 'qs';
import {message} from 'antd';

export default {

    namespace: 'saas_registered_h5',

    state: {
		touchCode  : false,
		codeDisabled : true,
		codeStateString : '获取验证码',
		submitSuccess : false,
		showMask : false,
		richText : undefined,
		schoolTypeArr : [],
        formConfiguration : [],
        formList : [],
        id:'',
    },

  	subscriptions: {
      	setup({ dispatch, history }) {
		  	history.listen(( { pathname, query }) => {

              	if(pathname === '/') {
					dispatch({
						type : 'getH5RichText',
					})
					dispatch({
						type : 'getOrganType',
					})
                    dispatch({
						type : 'registerChannel',
                        payload: {
                            id  : platform
                        }
					})
                    dispatch({
						type : 'registerChannelList',
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
            let { ret } = yield call(codeServer.registerChannel, parse({channelId: payload.id || undefined}));
            if( ret && ret.errorCode === 9000 ){
                let shall = ret.results.baseForm
                yield put({
					type : 'updateState',
					payload : {
						formConfiguration : JSON.parse(shall),
					}
				});
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '注册表单配置获取失败');
            } else {
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },
        //获取banner图
        *registerChannelList({ payload }, { call, put, select }){
            let { ret } = yield call(codeServer.registerChannelList, parse({channelId: payload.id || undefined}));
            if( ret && ret.errorCode === 9000 ){
                yield put({
					type : 'updateState',
					payload : {
						 formList: ret.results,
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

		//获取富文本内容
		*getH5RichText({payload}, { call, put, select }) {
			let { ret } = yield call(server.getH5RichText);
            if( ret && ret.errorCode === 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						richText: ret.results&&ret.results.length > 0 ? ret.results[0] : {},
					}
				});
			} else if(ret && ret.errorMessage) {
            	message.error(ret&&ret.errorMessage || '获取图片失败');
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

		//提交注册
		*registration({payload}, {call, put, select}) {
			let data = payload&&payload.data;
			let param = {
				address 	: data.oegAddress || '',
				orgNeed 	: data.orgDemand || '',
				orgName 	: data.orgName || '',
				orgType 	: data.orgType || '',
				userName 	: data.preson || '',
				tel 		: data.presonMobile || '',
				verifyCode  : data.verificationCode || '',
				channelId 	: platform,
                city        : data.city || '',
			}

			let { ret } = yield call(server.SendFreeTrailRequest, parse(param));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
						submitSuccess : true,
                    }
                });
            } else if(ret && ret.errorMessage) {
                message.error(ret&&ret.errorMessage || '注册失败');
            } else {
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },
	},

  	reducers: {
      	updateState(state, action) {
		  	return { ...state, ...action.payload };
      	},
 	 },

}
