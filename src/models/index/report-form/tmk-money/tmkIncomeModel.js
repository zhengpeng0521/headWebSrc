import { queryList } from '../../../../services/report-form/tmk-money/tmkIncomeService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import { GetCountDays } from '../../../../utils/dateFormat';

export default {

	namespace: 'tmkIncomeModel',

    state: {
			dataSource: [],								//数据
			searchValue: {},							//搜索内容
			buttonLoading: false,					//按钮加载
			firstEnter: true,
			loading: false,								//表格加载
			total: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, query }) => {
              if(pathname === '/hq_tmk_report_income_count'){
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
			*getList({ payload },{ call, put, select }){
				yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});

				let { ret } = yield call( queryList, ( payload ) );
				if( ret && ret.errorCode === 0 ){
					let dataSource = []
					ret.incomeItemList && ret.incomeItemList.forEach((item, index) => {
						item.deptIncomeItemList && item.deptIncomeItemList.forEach((child, key) => {
							dataSource.push({
								...child,
								rowKey: index + '' + key
							})
						})
					})

					yield put({
						type : 'updateState',
						payload : {
							total: ret,
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
