import {
	queryCity,
	queryList
} from '../../../../services/report-form/tmk-money/payProjectService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

export default {

	namespace: 'payProjectModel',

    state: {
			years: [],                    //年份
			currentYear: undefined,				//当前年
			cityList: [],									//城市下拉
			orgList: [],									//校区下拉
			projectList: [],							//支出项目下拉

			dataSource: [],								//数据
			searchValue: {},							//搜索内容
			buttonLoading: false,					//按钮加载
			loading: false,								//表格加载
			popoverTitle: '支出汇总表',
			popoverContent: [
				{
					name: '支出项：',
					content: '支出类别下的支出项。'
				},
				{
					name: '全年汇总：',
					content: '支出项的全年合计。'
				}
			]
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, query }) => {
              if(pathname === '/hq_tmk_report_spend'){
                let years = []
								let nowObj = window.GetNowDateAndTime() || {startDate: moment().format('YYYY')}
								let currentYear = moment(nowObj.startDate).format('YYYY')
                for(let i = 0; i < (Number(currentYear) - 1999); i++){
                  years.push(2000 + i + '')
                }
                dispatch({
                  type: 'updateState',
                  payload: {
										years,
										currentYear
                  }
								})
								// 城市下拉
								dispatch({
									type: 'getCityList'
								})
								// 获取列表
								dispatch({
                  type: 'getList',
                  payload: {
										year: currentYear
                  }
								})
              }
            })
        },
    },

    effects: {

			/*获取城市下拉*/
			*getCityList({ payload },{ call, put, select }){
				let { ret } = yield call( queryCity, ( payload ) );
				if( ret && ret.errorCode === 0 ){
					// let cityList = []
					// ret.deptTreeItemList && ret.deptTreeItemList.forEach(item => {
					// 	if(item.mark == 'city'){
					// 		cityList.push(item)
					// 	}
					// })
					yield put({
						type : 'updateState',
						payload : {
							cityList: ret.deptTreeItemList
						}
					})
				}else{
					message.error( ret && ret.errorMessage || '获取城市下拉失败' )
				}
			},

			/*生成报表得到列表*/
			*getList({ payload },{ call, put, select }){
				yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});

				let { ret } = yield call( queryList, ( payload ) );
				if( ret && ret.errorCode === 0 ){
					yield put({
						type : 'updateState',
						payload : {
							dataSource : ret.reults,
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
