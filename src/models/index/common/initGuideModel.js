import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'initGuideModel',
	state : {
		stepNum   : 1,            //步骤
		visible   : false,        //是否打开新手指导
	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/cerp_kcjs_course') {

                }
            });
        },
    },

	effects : {
		//判断是否 打开 新手引导
		*openGuideFunc({ payload },{ call, put, select }){
//			let storage = window.localStorage;
//			let isOpenGuide = storage.getItem('isOpenGuide');
//			if( !isOpenGuide || isOpenGuide == undefined || isOpenGuide == '' || isOpenGuide == null ){
//				yield put({
//					type : 'updateState',
//					payload : {
//						visible : true
//					}
//				});
//				storage.setItem( 'isOpenGuide', true )
//			}
		}
	},

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		},
	}
}
