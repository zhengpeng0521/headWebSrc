import {
	getMessageList
} from '../../../../services/system/message/messageService';
import { parse } from 'qs';
import { message } from 'antd';

export default {

	namespace: 'messageModel',

	state: {
		searchVisible           : false,           //搜索框是否显示

		pageSize                : 10,
		pageIndex               : 0,
		mobile                  : '',
		orgId                   : '',
		startTime               : '',
		endTime                 : '',
		dataSource              : [],
		resultCount             : '',
		loading                 : false,

	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if(pathname === '/sys_sms_record') {
					dispatch({
						type : 'getMessageParams',
						payload : {}
					})
				}
			});
		},
	},

	effects: {
		//得到获取列表所需参数
		*getMessageParams({ payload },{ call, put, select }){
			let messageModel = yield select( state => state.messageModel );
			let params = {
				pageSize  : messageModel.pageSize,
				pageIndex : messageModel.pageIndex,
				mobile    : messageModel.mobile,
				orgId     : messageModel.orgId,
				startTime : messageModel.startTime,
				endTime   : messageModel.endTime,
			};
			yield put({
				type : 'getMessageList',
				payload : {
					params
				}
			})
		},
		//得到列表数据
		*getMessageList({ payload },{ call, put, select }){
			let { params } = payload;
			let { ret } = yield call( getMessageList, ( params ));
			if( ret && ret.errorCode == '9000' ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource  : ret.results,
						resultCount : ret.data.resultCount,
						...params
					}
				})
			}
		},
		//搜索、重置
		*searchAndClearFunction({ payload },{ call, put, select }){
			let { values } = payload;
			let messageModel = yield select( state => state.messageModel );
			let startTime = '';
			let endTime   = '';
			if( !!values.time ){
				startTime = values.time[0].format('YYYY-MM-DD');
				endTime   = values.time[1].format('YYYY-MM-DD');
			};
			let params = {
				orgId     : values.orgId,
				mobile    : values.mobile,
				startTime : startTime,
				endTime   : endTime,
				pageIndex : 0,
				pageSize  : messageModel.pageSize,
			};
			yield put({
				type : 'getMessageList',
				payload : {
					params
				}
			})
		},
		//分页
		*paginationChange({ payload },{ call, put, select }){
			let messageModel = yield select( state => state.messageModel );
			let { pageIndex, pageSize } = payload;
			let params = {
				pageIndex : pageIndex - 1,
				pageSize  : pageSize,
				orgId     : messageModel.orgId,
				mobile    : messageModel.mobile,
				startTime : messageModel.startTime,
				endTime   : messageModel.endTime,
			};
			yield put({
				type : 'getMessageList',
				payload : {
					params
				}
			})
		}
	},

	reducers: {
		updateState( state, action ) {
			return { ...state, ...action.payload };
		}
	},
}
