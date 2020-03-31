export default {

  namespace: 'koubeiAuthValidateModel',

  state: {
      authStatus: '',
      alipayAuthUrl: '',
  },

    subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/koubei_auth_qrcode') {
                  dispatch({
                    type: 'updateState',
                    payload: {
                        authStatus: query && query.authStatus,
                        alipayAuthUrl: query && query.alipayAuthUrl,
                    }
                  });
              }
          });
      },
  },

  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },
  }
}
