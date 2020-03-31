import { routerRedux } from 'dva/router';
import {onLoginService,
        onMainService,
        PassWordRecoveryFirstStep,          /*发送修改密码第一步请求*/
        PassWordRecoverySecondStep,         /*发送修改密码第二步请求*/
        GetSchoolType,                      /*免费申请获取机构类型下拉列表数据*/
        SendFreeTrailRequest,               /*提交免费使用申请*/
} from '../../../services/login/LoginPageService';
import { parse } from 'qs';
import {message} from 'antd';

/*登陆页model*/
export default {

    namespace: 'loginPageModel',

    state: {
        loginModalVisible: false,     //登陆界面是否显示
        loading: false,
        errMsg: '',//错误消息
        loginType: 'account_login',     //登陆方式  account_login/qrcode_login 账号密码登陆/二维码登陆

        tenantSeelctVisible: false,//租户选择是否显示
        tenantList: [],//租户选择列表

        account: '',//点击登陆后记录的账号
        password: '',//点击登陆后记录的密码

        /*免费试用表单*/
        freeTrailModalVisible : false,                          //免费试用modal是否显示
        freeTrailModalButtonLoading : false,                    //免费试用modal按钮是否在加载状态
        freeTrailModalSchoolTypeData : [],                      //免费试用modal选择机构类型下拉列表数据

        /*密码重置第一步表单*/
        passWordRecoveryFirstStepModalVisible : false,          //密码重置modal是否显示
        passWordRecoveryFirstStepModalButtonLoading : false,    //密码重置modal按钮是否在加载状态
        mobileAndCodeObject : {},                               //保存手机号和验证码

        /*密码重置第二步表单*/
        passWordRecoverySecondStepModalVisible : false,         //密码重置第二步modal是否显示
        passWordRecoverySecondStepModalButtonLoading : false,   //密码重置第二步modal按钮是否在加载状态
        tenantArray : [],                                       //租户下拉列表数组

    },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/') {
                  new Promise((resolve, reject) => {
                    setTimeout(resolve, 500);
                  }).then(function(){
                      dispatch({
                          type: 'showHandelModal'
                      });
                  });
              }
          });
      },
  },

    effects: {

        *onLogin({ payload }, { call, put, select }) {
            let {account, password, tenantId,} = payload;

            yield put({
                type : 'updateState',
                payload : {
                    loading: true,
                }
            });
            let params = {mobile: account, password,};
            if(tenantId != undefined && tenantId != '') {
                params.tenantId = tenantId;
            }
            let { ret } = yield call(onLoginService,parse(params));

            if( ret && ret.errorCode == 9000 ){
                message.success('登陆成功啦!', 3);
            yield put({
                type : 'updateState',
                payload : {
                    loading: false,
                }
            });
            window.location = BASE_URL;
            } else {
                if(ret && ret.errorCode == 1000) {
                //账号有多个租户
                    yield put({
                        type : 'updateState',
                        payload : {
                            tenantSeelctVisible: true,
                            tenantList: ret.results,
                            account, password,
                            loading: false,
                        }
                    });
                }else if(ret && ret.errorCode == 2001) {
                //账号未激活
                    yield put({
                        type : 'accountActiveModel/show',
                        payload : {
                            tenantId: ret.data,
                            account: account,
                            password: password,
                        }
                    });
                } else {
                //其他错误
                    yield put({
                        type : 'updateState',
                        payload : {
                            loading: false,
                        }
                    });
                    message.error((ret && ret.errorMessage) || '登陆出现差错啦!', 3);
                }
            }
        },

        /*发送修改密码第一步请求*/
        *'PassWordRecoveryFirstStep'({ payload }, { call, put, select }){
            yield put({
                type:'updateState',
                payload:{
                    passWordRecoveryFirstStepModalButtonLoading : true,
                }
            });
            let { ret } = yield call(PassWordRecoveryFirstStep,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                //保存手机号和验证码，第二步请求时需要调用数据
                yield put({
                    type:'updateState',
                    payload:{
                        tenantArray : ret.results,
                        mobileAndCodeObject : payload,
                        passWordRecoverySecondStepModalVisible : true,                  //将来写在成功回调里
                    }
                });
            }else if(ret && ret.errorMessage){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({
                type:'updateState',
                payload:{
                    passWordRecoveryFirstStepModalButtonLoading : false,
                    passWordRecoveryFirstStepModalVisible : true,                       //第二步请求后一起关闭
                }
            });
        },

        /*发送修改密码第二步请求*/
        *'PassWordRecoverySecondStep'({ payload }, { call, put, select }){
            yield put({
                type:'updateState',
                payload:{
                    passWordRecoverySecondStepModalButtonLoading : true,
                }
            });
            let { ret } = yield call(PassWordRecoverySecondStep,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type:'updateState',
                    payload:{
                        /*重置第一步表单*/
                        passWordRecoveryFirstStepModalVisible : false,          //密码重置modal是否显示
                        mobileAndCodeObject : {},                               //保存手机号和验证码

                        /*重置第二步表单*/
                        passWordRecoverySecondStepModalVisible : false,         //密码重置第二步modal是否显示
                        tenantArray : [],                                       //租户下拉列表数组
                    }
                });
            }else if(ret && ret.errorMessage){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({
                type:'updateState',
                payload:{
                    passWordRecoverySecondStepModalButtonLoading : false,
                }
            });
        },

        /*免费申请获取机构类型下拉列表数据*/
        *'GetSchoolType'({ payload }, { call, put, select }){
            let { ret } = yield call(GetSchoolType,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type:'updateState',
                    payload:{
                        freeTrailModalVisible : true,
                        freeTrailModalSchoolTypeData : ret.results
                    }
                });
            }else if(ret && ret.errorMessage){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*提交免费使用申请*/
        *'SendFreeTrailRequest'({ payload }, { call, put, select }){
            yield put({
                type:'updateState',
                payload:{
                    freeTrailModalButtonLoading : true
                }
            });
            let { ret } = yield call(SendFreeTrailRequest,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type:'updateState',
                    payload:{
                        freeTrailModalVisible : false,
                    }
                });
            }else if(ret && ret.errorMessage){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({
                type:'updateState',
                payload:{
                    freeTrailModalButtonLoading : false,
                }
            });
        },
    },

  reducers: {

      showHandelModal(state, action) {
          return { ...state, loginModalVisible: true, };
      },

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

      closeTenantSelect(state, action) {
          return { ...state, tenantSeelctVisible: false, tenantList: [], account: '', password: '', };
      },
  },

}
