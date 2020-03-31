import { parse } from 'qs';
import { message } from 'antd';

export default {

	namespace: 'gameTemplateCreate',

	state: {
		attrShowPageModal: false,
		attrGameFrameUrl: '',
		isH5: '',
	},

	// subscriptions : {
	//     setup({ dispatch, history }) {
	//         history.listen(( { pathname, query } ) => {
	// 			if (pathname != 'scrm_wx_myscrm_list') {
	// 				dispatch({
	// 					type : 'updateState',
	// 					payload : {
	// 						attrShowPageModal: false,
	// 					}
	// 				})
	// 			}
	//         });
	//     },
	// },

	effects: {
		*showCreateGamePage({ payload }, { call, put, select }) {
			let frameUrl = '';
			if(payload.isH5 == 1) {
				frameUrl = payload.h5createUrl
			}else if(payload.isH5DataDetail) {
				frameUrl = payload.h5createUrl
			}else {
				if (payload.attrGameFrameUrl != '' && payload.attrGameFrameUrl != undefined) {
					frameUrl = payload.attrGameFrameUrl + '&isHq=' + payload.isHq;
				} else {
					frameUrl = frameUrl;
				}
			}
			yield put({
				type: 'updateState',
				payload: {
					attrShowPageModal: payload.attrShowPageModal,
					attrGameFrameUrl: frameUrl,
					isH5: payload.isH5
				}
			})
		},
	},

	reducers: {
		updateState(state, action) {
			return { ...state, ...action.payload }
		}
	}
}
