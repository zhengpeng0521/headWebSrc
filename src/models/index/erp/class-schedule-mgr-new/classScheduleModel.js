import { message } from 'antd';
// 全局布局model
export default {

  namespace: 'classScheduleModel',

  state: {
      headMenuKey: '',
      allMenuList: [],
  },

  effects: {

      /*加载所有菜单*/
      *initMenuList({ payload }, { call, put, select }) {

      },

  },

  reducers: {

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

  },

}
