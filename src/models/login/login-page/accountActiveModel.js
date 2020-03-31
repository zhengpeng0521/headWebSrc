import {accountActiveAction} from '../../../services/login/LoginPageService';
import { parse } from 'qs';
import {message} from 'antd';

/*登陆页 - 激活账号 model*/
export default {

  namespace: 'accountActiveModel',

  state: {
      visible: false,
      loading: false,
      tenantId: '',
      account: '',
      password: '',

      codeBtnLoading: false,//发送验证码
  },

  effects: {
      *accountActiveAction({ payload }, { call, put, select }) {
          let {mobile, verifyCode,} = payload;

          let accountActiveModel = yield select(state => state.accountActiveModel);
          let {tenantId,account,password} = accountActiveModel;

          yield put({
            type : 'updateState',
            payload : {
                loading: true,
            }
          });

          let { ret } = yield call(accountActiveAction,parse({mobile, verifyCode,tenantId,}));

          if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                    }
                  });
//              yield put({
//                    type : 'loginPageModel/onLogin',
//                    payload : {
//                        tenantId,account,password,
//                    }
//              });
			     yield put({
                    type : 'saas_login/login',
                    payload : {
						mobile : account, password : password, tenantId : tenantId,
                    }
              });
          } else {
              yield put({
                type : 'updateState',
                payload : {
                    loading: false,
                }
              });
              message.error((ret && ret.errorMessage) || '激活账号出错!', 3);
          }
      },
  },

  reducers: {
      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

      /*显示激活账号窗口*/
      show(state, action) {
          let {tenantId, account, password,} = action.payload;
          return { ...state, visible: true, loading: false, tenantId, account, password,};
      },

      closeAccountActive(state, action) {
          return { ...state, visible: false, loading: false, tenantId: '', account: '', password: '',};
      },
  },

}
