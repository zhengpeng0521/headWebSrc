//顶部导航-版本信息
export default {

  namespace: 'headerProductServiceModel',

  state: {
      modalVisible: false,
  },

  effects: {

  },

  reducers: {
      changeModalVisible(state, action) {
          return { ...state, modalVisible: !state.modalVisible, };
      },
  },

}
