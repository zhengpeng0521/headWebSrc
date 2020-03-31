import {message} from 'antd';
//下面公共布局
export default {

  namespace: 'eyebeamModel',

  state: {
      phoneNumber: '',
      phoneState: 'unline', //话机状态  ready/number/calling/unline
      lineTime: 0,//通话时间

      recordVisible: false,
  },

    subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname != '/crm_stu_alllist' && pathname != '/crm_stu_list') {
                  if(window.agent_socket == '1') {
                    agentLogout();
                    dispatch({
                        type: 'updateState',
                        payload: {
                            phoneNumber: '',
                        }
                    });
                  }
              }
          });
      },
  },

   effects: {
        *eventEstablished({ payload }, { call, put, select }) {
            yield put({
                type: 'updateState',
                payload: {
                    phoneState: 'talking',
                }
            });
            yield put({
                type: 'getOnlineTime',
            });
            yield put({
                type: 'followUpRecordCreateModel/openFollowUpRecordModal',
                payload: {

                }
            });
        },

        *getOnlineTime({ payload }, { call, put, select }) {
            let eyebeamModel = yield select(state => state.eyebeamModel);
            let sleep = function(ms) {
                return new Promise(function(resolve, reject){
                    setTimeout(function(){
                        resolve()
                    }, ms);
                });
            }

            if(eyebeamModel.phoneState == 'talking') {
                let lineTime = (eyebeamModel.lineTime || 0) + 1;
                yield sleep(1000);
                yield put({
                    type: 'updateState',
                    payload: {
                        lineTime
                    }
                });
                yield put({
                    type: 'getOnlineTime',
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: {
                        lineTime: 0,
                    }
                });
            }
        },
   },

  reducers: {

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

      eventNotOnline(state, action) {
          message.warn('软电话未能成功加载，请检查是否开启软电话或者软电话注册号码是否与登录坐席一致。');
          return { ...state, phoneState: 'unline'};
      },
      eventAgentLogin(state, action) {
          return { ...state, phoneState: 'unline'};
      },
      eventAgentLogout(state, action) {
          return { ...state, phoneState: 'unline'};
      },
       eventAgentReady(state, action) {
          return { ...state, phoneState: 'ready', lineTime: 0,};
      },
      eventDialing(state, action) {
          let {data} = action.payload;
          return { ...state, phoneState: 'calling', phoneNumber: data.otherDN,};
      },
//      eventEstablished(state, action) {
//          return { ...state, phoneState: 'talking'};
//      },
      eventReleased(state, action) {
          return { ...state, phoneState: 'ready'};
      },
  },

}
