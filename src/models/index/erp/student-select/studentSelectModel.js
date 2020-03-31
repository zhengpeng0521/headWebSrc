import { message } from 'antd';
import { parse } from 'qs';
// 全局布局model
export default {

  namespace: 'studentSelectModel',

  state: {
      orgId: '',  //选择的校区

  },

  effects: {

        /*加载教室下拉框数据*/
      *showStudentSelect({ payload }, { call, put, select }) {
          let
          let { ret } = yield call( classroomComList );
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classRoomComList: ret.results,
                    }
                });
            } else {
              message.error(ret.errorMessage || '没有获取到教室列表');
          }
      },

  },

  reducers: {

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

  },

}
