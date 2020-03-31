import { message } from 'antd';

export default {

  namespace: 'scheduleModel',

  state: {
      headMenuKey: '',
      allMenuList: [],
  },

	effects: {
	},

  reducers: {
      updateState(state, action) {
          return { ...state, ...action.payload, };
      },
  },
}
