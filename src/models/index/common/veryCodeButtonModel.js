import {sendVerifyCode} from '../../../services/index/common/veryCodeService';
import { parse } from 'qs';
import {message} from 'antd';

/*发送验证码按钮 model*/
export default {

  namespace: 'veryCodeButtonModel',

  state: {
      waitTime: 0,//等待的时间  秒
      waitMaxTime: 60,//发送后等待的时间  秒
  },

  effects: {
      *sendVerifyCode({ payload }, { call, put, select }) {
          if(window.very_code_button_status_stop) {
              window.very_code_button_status_stop = false;
          }
          let {mobile} = payload;

          let veryCodeButtonModel = yield select(state => state.veryCodeButtonModel);
          let { ret } = yield call(sendVerifyCode,parse({mobile}));
          if( ret && ret.errorCode == 9000 ){
              //验证码发送成功
              message.success('验证码发送成功!');
              let waitMaxTime = veryCodeButtonModel.waitMaxTime || 0;
              yield put({
                  type: 'updateWaitTime',
                  payload: {
                      waitTime: waitMaxTime,
                  }
              });

          } else {
              message.error((ret && ret.errorMessage) || '发送验证码出错啦!', 3);
          }
      },

      /*延迟发送*/
      *updateWaitTime({ payload }, { call, put, select }) {
          let {waitTime} = payload;

          var sleep = function(ms) {
            return new Promise(function(resolve, reject){
                    setTimeout(function(){
                        resolve()
                    }, ms);
                });
            }

          for(let i = 0; i <= waitTime; i++) {
              if(window.very_code_button_status_stop) {
                  yield put({
                      type: 'updateState',
                      payload: {
                          waitTime: 0,
                      }
                  });
                  return;
              }
              yield put({
                  type: 'updateState',
                  payload: {
                      waitTime: waitTime-i,
                  }
              });
              yield sleep(1000);
          }

      },
  },

  reducers: {
      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

  },

}
