export default {

  namespace: 'signModel',

  state: {
      showOrHiddenSignModalState : false,
	  showOrHiddenSignDetailModalState : false,
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/sign') {

              }
          });
      },
  },

  effects: {

  },

  reducers: {
	  updateState(state, action) {return {...state, ...action.payload};},
  },
}
