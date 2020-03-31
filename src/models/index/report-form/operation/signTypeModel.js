import { querySignList, queryList } from '../../../../services/report-form/operation/signTypeService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import { GetCountDays } from '../../../../utils/dateFormat';

export default {

	namespace: 'signTypeModel',

    state: {
			dataSource: [],								//数据
			searchValue: {},							//搜索内容
			buttonLoading: false,					//按钮加载
			firstEnter: true,
			loading: false,								//表格加载
			totalData: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, query }) => {
              if(pathname === '/hq_tmk_yunying_signType'){
								let nowObj = window.GetNowDateAndTime();
								let rangerPicker = {
										startTime : nowObj.startDate,
										endTime : nowObj.endDate
								};

								let nowDate = rangerPicker.startTime
								let formatNowDate = new Date(nowDate);
								// 默认为本月时
								let year = formatNowDate.getFullYear();
								let month = formatNowDate.getMonth()+1;
								let days = GetCountDays(year,month);           //获取本月有多少天
								rangerPicker.startTime = nowDate.substr(0,8) + '01';
								rangerPicker.endTime = nowDate.substr(0,8) + days;

                dispatch({
									type: 'init',
									payload: {
										...rangerPicker
									}
								})
              }
            })
        },
    },

    effects: {
			/** 初始化 */
			*init({ payload },{ call, put, select }){
				yield put({
					type: 'getList',
					payload
				})
			},

			/*生成报表得到列表*/
			// *getSignList({ payload },{ call, put, select }){
			// 	yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});

			// 	let { ret } = yield call( querySignList, ( payload ) );
			// 	if( ret && ret.errorCode === 0 ){
			// 		let totalData = []
			// 		ret.signBilllist && ret.signBilllist.forEach((item, index) => {
			// 			totalData.push({...item, id: 'dept' + index})
			// 		})

			// 		totalData.push({
			// 			...ret,
			// 			id: 'deptAll',
			// 			deptName: '合计'
			// 		})

			// 		yield put({
			// 			type : 'updateState',
			// 			payload : {
			// 				totalData,
			// 				searchValue: payload
			// 			}
			// 		})

			// 		yield put({
			// 			type: 'getList',
			// 			payload
			// 		})
			// 	}else{
			// 		message.error( ret && ret.errorMessage || '报表查询失败' )
			// 	}
			// 	yield put({ type : 'updateState', payload : { buttonLoading : false, loading : false }});
			// },

			/*生成报表得到列表*/
			*getList({ payload },{ call, put, select }){
				yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});

				let { ret } = yield call( queryList, ( payload ) );
				if( ret && ret.errorCode === 0 ){
					let dataSource = []
					ret.results && ret.results.forEach(item => {
						item.deptResults && item.deptResults.forEach((sign, index) => {
							dataSource.push({
								...sign,
								id: item.deptId + '' + index,
								deptName: item.deptName
							})
						})
					})
					dataSource.push({
						...ret.countItem,
						id: 'all',
						deptName: '合计'
					})

					let totalData = []
					ret.deptCountItemList && ret.deptCountItemList.forEach((item, index) => {
						totalData.push({
							...item,
							id: 'total' + index
						})
					})

					yield put({
						type : 'updateState',
						payload : {
							totalData,
							dataSource,
							searchValue: payload
						}
					})
				}else{
					message.error( ret && ret.errorMessage || '报表查询失败' )
				}
				yield put({ type : 'updateState', payload : { buttonLoading : false, loading : false }});
			},
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
    },
}
