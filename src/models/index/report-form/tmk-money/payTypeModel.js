import { queryList } from '../../../../services/report-form/tmk-money/payTypeService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import { GetCountDays } from '../../../../utils/dateFormat';

export default {

	namespace: 'payTypeModel',

    state: {
			dataSource: [],								//数据
			searchValue: {},							//搜索内容
			buttonLoading: false,					//按钮加载
			firstEnter: true,
			loading: false,								//表格加载
			columns: [],									//表格项
			totalProjects: [],						//总计支出项目
			totalData: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, query }) => {
              if(pathname === '/hq_tmk_report_payIncome'){
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
					let projectCols = []
					let dataSource = []
					ret.deptBalanceItemList && ret.deptBalanceItemList.forEach((dept, deptIndex) => {
						dept.balanceItemList && dept.balanceItemList.forEach((org, orgIndex) => {
							let proObj = {}
							org.spendItemList && org.spendItemList.forEach(pro => {
								// 支出项目表头
								if(deptIndex === 0 && orgIndex === 0){
									projectCols.push({
										key: pro.projectId,
										label: pro.projectName
									})
								}
								proObj[pro.projectId] = pro.spendItemMoney
							})
							// 数据
							dataSource.push({
								id: deptIndex + '' + orgIndex,
								deptName: org.deptName,
								orgName: org.orgName,
								spendMoney: org.spendMoney,
								purchaseMoney: org.purchaseMoney,
								incomeMoney: org.incomeMoney,
								money: org.money,
								...proObj
							})
						})
					})

					yield put({
						type : 'updateState',
						payload : {
							dataSource,
							columns: projectCols,
							totalProjects: ret.countSpendItemList || [],
							totalData: ret,
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
