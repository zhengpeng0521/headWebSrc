import * as services from '../../../services/index/common/searchSelectListService'; //这种写法是把所有的输出包裹到obj对象里
import {parse} from 'qs';
import {message} from 'antd';

export default {

	namespace: 'maintenanceModel',

	state: {
		pageSize 			: 200,
		pageIndex 			: 0,
		selectTitleIndex 	: 0,
		dicListSource 		: [],
		dictValue 			: [],
		untreatedDicValue 	: [],		//存放状态为0的数据
		addStatus 			: false,
        showStatus          : '0',      //赢率显示状态

	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if(pathname === '/sys_scfg_param_set') {
					dispatch({
						type: 'getSystemDicList',
					})
				}
			});
		},
	},

	effects: {

		//获取列表数据
		*getSystemDicList({payload}, {put, call, select}) {
			let model = yield select(state => (state.maintenanceModel));
			let params = {
				pageIndex : model.pageIndex,
				pageSize : model.pageSize,
			}
			const {ret} = yield call(services.getDicList, parse(params));
			if(ret&&ret.errorCode == 9000) {
				let parseValue = JSON.parse(ret.results.length>0&&ret.results[0].value);
				yield put({
					type : 'updateState',
					payload : {
						dicListSource 	: ret&&ret.results,
						dictValue 		: parseValue,
					}
				})
			} else {
				message.error(ret&&ret.errorMessage || '获取列表失败');
			}
			yield put({
				type : 'updateSelectData',
				payload : {
					idx        : '0',
					showStatus : '0'
				}
			})
		},

		//更新选中数据
		*updateSelectData({payload},{put, call, select}) {
			let model = yield select(state => (state.maintenanceModel));
			let parseValue = JSON.parse(model.dicListSource[payload.idx].value);
			yield put({
				type : 'updateState',
				payload : {
					selectTitleIndex : payload.idx,
					dictValue 		 : parseValue,
					addStatus 		 : false,
                    showStatus       : payload.showStatus,
				}
			})
		},

		//保存数据 删除数据 修改数据
		*saveData({payload}, {put, call, select}) {
			const model = yield select(state => (state.maintenanceModel));
			let newValue = payload.value;
			let params = {
				id : payload.id,
				value : JSON.stringify(newValue),
			}

			const {ret} = yield call(services.save, parse(params));
			if(ret&&ret.errorCode == 9000) {
				let params = {
					pageIndex 	: model.pageIndex,
					pageSize 	: model.pageSize,
				}

				let recordIndex = model.selectTitleIndex || 0;
				const {ret} = yield call(services.getDicList, parse(params));
				if(ret.errorCode == 9000) {
					let parseValue = JSON.parse(ret.results[recordIndex].value);
					yield put({
						type : 'updateState',
						payload : {
							dicListSource 	: ret&&ret.results,
							dictValue 		: parseValue,
							addStatus 		: false,
						}
					})
				} else {
					message.error(ret&&ret.errorMessage || '获取列表失败');
				}
			} else {
				message.error(ret&&ret.errorMessage || '保存失败');
			}
		}
	},

	reducers: {
		updateState(state, action) {return {...state, ...action.payload};},
	},
}
