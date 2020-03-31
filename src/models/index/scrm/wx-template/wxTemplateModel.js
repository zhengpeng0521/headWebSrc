import parse from 'qs';
import qs from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {

	namespace : 'wx_template',

	state : {
		title : '',
		organId : '',
		formVisible : '',
		activityCode : '',
		activityTypeId : 0,
		currentSelectCampus : '',
    	automatedCompletion : false,
		changeTempletInstanceFormVisible : false,
	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {

            });
        },
    },

	effects : {

    },

	reducers : {
		updateState( state, action ){return { ...state, ...action.payload }}
	}
}
