import { parse } from 'qs';
import { message } from 'antd';
export default {

  	namespace: 'orgSelectModel',

  	state: {
		orgSelectModalVisible              : false,               //校区选择框显隐
		orgIdList                          : [],
		headMenuList                       : [],
	},

  	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if( pathname == '/org_select' ) {

				}
          	});
      	},
  	},

	effects : {
		//打开校区选择框
		*openOrgSelectModal({ payload },{ call, put, select }){
			let { orgIdList, headMenuList } = payload;
			let state = yield select( state => state.orgSelectModel );
			yield put({
				type : 'updateState',
				payload : {
					orgSelectModalVisible : true,
					orgIdList,
					headMenuList
				}
			})
		},

		*orgSelectChange({ payload },{ call, put, select }){
			let state = yield select( state => state.orgSelectModel );
			let headMenuList = state.headMenuList;

			window.hasInitMenu = true;
			yield put({
				type: 'mainLayoutModel/updateState',
				payload : {
					hasInitMenu: true,
				}
			});


			//判断是否打开过最新版的版本提示
			yield put({
				type: 'mainLayoutModel/checkVersionInfo'
			});

			yield put({
				type : 'updateState',
				payload : {
					orgSelectModalVisible : false
				}
			})
		}
	},


  	reducers: {
		updateState( state, action ){
			return {...state, ...action.payload};
		},
  	},
}
