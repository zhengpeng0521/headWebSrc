import { queryList } from '../../../../services/report-form/tmk-teach/activeStuService';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import { GetCountDays } from '../../../../utils/dateFormat';

export default {

	namespace: 'activeStuModel',

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
              if(pathname === '/hq_tmk_cerpReport_active'){
								let nowObj = window.GetNowDateAndTimeCommon();
								let yearAndMonth = moment(nowObj.date).format('YYYY-MM')


                dispatch({
									type: 'init',
									payload: {
										yearAndMonth
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
					ret.results && ret.results.forEach((item, index) => {
							dataSource.push({
								...item,
								id: 'sheet' + index,
							})
					})

					let totalData = [{...ret.countItem, id: 'total1', type: '总计'}]

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
