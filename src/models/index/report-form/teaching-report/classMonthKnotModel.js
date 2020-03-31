import { queryList, queryPeriodMonthTotal, queryUpdateCloudData, ConfirmDeptOrgSelect, OnconfirmDeptOrgSelect } from '../../../../services/report-form/teaching-report/classMonthKnotService';
import { uniqueArr } from '../../../../utils/arrayUtils';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

export default {

	namespace: 'classMonthKnotModel',

	state: {
		modalToVisible: false,	//模态框的隐藏
		menuOrgList: [],                                 //校区下拉列表
		isShowOrgName: false,                              //是否选择了校区
		orgId: undefined,                          //所选校区Id
		orgName: undefined,                          //所选校区Name
		buttonLoading: false,                              //按钮loading
		month: moment().format('YYYY-MM'),         //月份
		orgIds: undefined,
		tenantIds: undefined,
		content: '暂未更新',									//报表内容
		queryPeriodMonthTotal: {},
		shadow: false,
		pageIndex: 0,
		pageSize: 20,
		resultCount: 0,
		dataSource: [],
		name: '课时月结表',
		loading: false,             //加载状态
		startDate: undefined,
		endDate: undefined,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname, query }) => {
				let menuOrgList = window._init_data.orgIdList;
				if (pathname === '/hq_orgstats_period') {
					dispatch({
						type: 'queryList',
						payload: {
							month: moment().format('YYYY-MM'),
							orgIds: undefined,
							tenantIds: undefined,
							pageSize: 20
						}
					})
					dispatch({
						type: 'queryPeriodMonthTotal',
						payload: {
							month: moment().format('YYYY-MM')
						}
					})
					dispatch({
						type: 'updateState',
						payload: {
							menuOrgList,
							month: moment().format('YYYY-MM'),
						}
					})
					dispatch({
						type: 'paginationChange',
						payload: {
							pageSize: 20,
							pageIndex: 1
						}
					})
					dispatch({
						type: 'queryUpdateCloudData',
						payload: {
							name: '课时月结表'
						}
					})
				}
			});
		},
	},

	effects: {
		/*生成报表得到列表*/
		*queryList({ payload }, { call, put, select }) {
			yield put({ type: 'updateState', payload: { buttonLoading: true, loading: true } });
			let state = yield select(state => state.classMonthKnotModel);
			let { month } = payload;

			let params = {
				pageIndex: 0,
				pageSize: payload.pageSize || state.pageSize,
				date: month,
				tenantIds: state.tenantIds,
				orgIds: state.orgIds,
			}
			let { ret } = yield call(queryList, (params));
			if (ret && ret.errorCode == 9000) {
				yield put({
					type: 'updateState',
					payload: {
						dataSource: ret.results,
						resultCount: ret.data.resultCount,
						pageIndex: 0,
					}
				})
			} else {
				message.error(ret && ret.errorMessage || '报表查询失败')
			}
			yield put({ type: 'updateState', payload: { buttonLoading: false, loading: false } });
		},
		/*会员卡课时月结表合计信息*/
		*queryPeriodMonthTotal({ payload }, { call, put, select }) {
			let state = yield select(state => state.classMonthKnotModel);
			let { month } = payload;
			let params = {
				date: month,
				tenantIds: state.tenantIds,
				orgIds: state.orgIds,
			}
			let { ret } = yield call(queryPeriodMonthTotal, (params));
			if (ret && ret.errorCode == 9000) {
				yield put({
					type: 'updateState',
					payload: {
						queryPeriodMonthTotal: ret && ret.data
					}
				})
			} else {
				message.error(ret && ret.errorMessage || '报表查询失败')
			}
			yield put({ type: 'updateState', payload: { buttonLoading: false, loading: false } });
		},
		//报表分页
		*paginationChange({ payload }, { call, put, select }) {
			yield put({ type: 'updateState', payload: { buttonLoading: true, loading: true } });
			let { pageIndex, pageSize } = payload;
			let state = yield select(state => state.classMonthKnotModel);

			let params = {
				orgIds: state.orgIds,
				tenantIds: state.tenantIds,
				date: state.month,
				pageIndex: pageIndex - 1,
				pageSize
			}
			let { ret } = yield call(queryList, (params));
			if (ret && ret.errorCode == 9000) {
				yield put({
					type: 'updateState',
					payload: {
						dataSource: ret.results,
						resultCount: ret.data.resultCount,
						pageIndex: pageIndex - 1,
						pageSize: pageSize
					}
				})
			} else {
				message.error(ret && ret.errorMessage || '报表查询失败')
			}
			yield put({ type: 'updateState', payload: { buttonLoading: false, loading: false } });
		},
		//云更新数据
		*queryUpdateCloudData({ payload }, { call, put, select }) {
			// yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
			let state = yield select(state => state.classMonthKnotModel);
			let params = {
				name: state.name
			}
			let { ret } = yield call(queryUpdateCloudData, params);
			if (ret && ret.errorCode === 0) {
				yield put({
					type: 'updateState',
					payload: {
						content: '上次更新时间 :' + ret.lastTime, //把请求到的数据赋值给全局变量content，然后传给page
					}
				})
			}
			if (ret.lastTime == null) {
				yield put({
					type: 'updateState',
					payload: {
						content: "暂未更新" //把请求到的数据赋值给全局变量content，然后传给page
					}
				})
			}
		},
		//点击确定
		*confirmDeptOrgSelect({ payload }, { call, put, select }) {
			// yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
			let state = yield select(state => state.classMonthKnotModel);
			let params = {
				name: state.name,
				startDate: state.startDate,
				endDate: state.startDate
			}
			let { ret } = yield call(ConfirmDeptOrgSelect, params);
			if (ret && ret.errorCode == 9000) {
				// yield put({
				// 	type : 'updateState',
				// 	payload: {
				// 	}
				// })
			}
		},
		*onconfirmDeptOrgSelect({ payload }, { call, put, select }) {
			// yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
			let state = yield select(state => state.classMonthKnotModel);
			let params = {
				name: state.name,
			}
			let { ret } = yield call(OnconfirmDeptOrgSelect, params);
			const date = new Date()
			const hour = date.getHours()
			if (hour >= 8 && hour <= 22) {
				if (ret && ret.errorCode == 0) {
					yield put({
						type: 'updateState',
						payload: {
							modalToVisible: true,
						}
					})
				}
				if (ret && ret.errorCode == 1000) {
					yield put({
						type: 'updateState',
						payload: {
							modalToVisible: false,
						}
					})
					message.warning('该任务执行间隔15天~');
				}
			} else {
				yield put({
					type: 'updateState',
					payload: {
						modalToVisible: false,
					}
				})
				message.warning('请在08:00-22:00这段间内操作');
			}
		}
	},

	reducers: {
		updateState(state, action) {
			return { ...state, ...action.payload, };
		},
		updateDate(state, date) {
			return { ...state, ...date.payload }
		}
	},
}
