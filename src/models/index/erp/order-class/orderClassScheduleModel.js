import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'orderClassScheduleModel',

	state: {
	  headMenuKey : '',
	  allMenuList : [],
	},

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/cerp_yk_mgr' ){
                    dispatch({
                        type:'orderClassDetailModel/updateState',
                        payload:{
                            detailVisible : false
                        }
                    })
				}
            })
        }
    },

	effects: {
	},

	reducers: {
		updateState( state, action ) {
		  return { ...state, ...action.payload };
		}
	},
}
