import { routerRedux } from 'dva/router';
//是否是番茄田系统
let isTomato = window.runAs=='tomato' ? true : false;
let width_value = isTomato?220:150;
//下面公共布局
export default {

  namespace: 'commonLayoutModel',

  state: {
      width: width_value,  // 展开时宽度
      collapsedWidth: width_value,  //收缩时宽度
      collapsed: false, //收缩状态
  },

  reducers: {

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

  },

}
