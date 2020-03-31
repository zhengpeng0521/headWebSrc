import {
    QueryList,
    UpdateCloudData,
    ConfirmDeptOrgSelect,
    OnconfirmDeptOrgSelect
} from '../../../../services/report-form/sales-report/salesAchievementSheet';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//销售业绩表
export default {

    namespace: 'salesAchievementSheet',

    state: {
        modalBoxAppears: false,
        updateshow: true,
        content: "暂未更新",
        modalToVisible: false,
        firstEnter: false,             //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        /*列表*/
        tableLoading: false,           //列表加载状态
        topAllData: [],                //总计列表数据
        tableDataSource: [],           //列表数据
        tableTotal: 0,                 //列表条数
        tablePageIndex: 0,             //列表页码
        tablePageSize: 40,             //列表每页条数
        sortParams: [
            { key: '1', value: '合同合计数' },
            { key: '2', value: '合同合计金额' },
            { key: '3', value: '合同合计占比金额' },
            { key: '4', value: '合同业绩金额' },
        ],      //排序方式(放在state里方便做统一处理)
        exportSearchContent: {},       //报表导出条件(没有分页信息)

        buttonLoading: false,          //生成报表按钮加载状态
        name: '销售业绩表',//更新云数据的参数
        startTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        dataSelectValue: undefined,    //是否自定义选择时间方式
        startDate: undefined,
        endDate: undefined,
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, query }) => {
                if (pathname === '/hq_orgstats_sellscore') {
                    // 东书房定制化
                    let sortParams = window._init_data.language && window._init_data.language == 'dsf' ? [
                        { key: '1', value: '合同合计数' },
                        { key: '2', value: '合同合计金额' },
                        { key: '3', value: '合同合计占比金额' },
                        { key: '4', value: '合同业绩金额' },
                    ] : [
                            { key: '1', value: '合同合计数' },
                            { key: '2', value: '合同合计金额' },
                            { key: '3', value: '合同合计占比金额' },
                        ]
                    dispatch({
                        type: 'updateState',
                        payload: {
                            sortParams
                        }
                    })
                    //初次进入页面查询当天数据
                    if (query.jump == 'true') {
                        let exportSearchContent = {};
                        exportSearchContent.startDate = query.startDate;
                        exportSearchContent.endDate = query.endDate;
                        dispatch({
                            type: 'updateState',
                            payload: {
                                startTime: query.startDate,
                                endTime: query.endDate,
                                dataSelectValue: 'free',
                            }
                        });
                        dispatch({
                            type: 'InitialQuery',
                            payload: {
                                firstEnter: true,
                                pageIndex: 0,
                                pageSize: 40,
                                exportSearchContent,
                            }
                        })
                    } else {
                        let nowObj = window.GetNowDateAndTime();
                        dispatch({
                            type: 'updateState',
                            payload: {
                                startTime: nowObj.startDate,
                                endTime: nowObj.endDate,
                                dataSelectValue: undefined,

                            }
                        });
                        dispatch({
                            type: 'InitialQuery',
                            payload: {
                                firstEnter: true,
                                pageIndex: 0,
                                pageSize: 40,
                                exportSearchContent: window.GetNowDateAndTime()
                            }
                        });
                        dispatch({
                            type: 'UpdateCloudData',
                            payload: {
                                name: '销售业绩表'
                            }
                        });

                    }

                }
            });
        },
    },

    effects: {
        //初次进入页面查询当天数据
        *'InitialQuery'({ payload }, { call, put, select }) {
            let salesAchievementSheet = yield select(state => state.salesAchievementSheet);
            let sortParams = salesAchievementSheet.sortParams;
            //默认查询下拉查询第一个
            payload.exportSearchContent = { ...payload.exportSearchContent, sortParam: sortParams[0].key }
            yield put({ type: 'QueryList', payload });
        },
        /*查询*/
        *'QueryList'({ payload }, { call, put, select }) {
            yield put({ type: 'showTableLoading' });
            yield put({ type: 'showButtonLoading' });
            yield put({ type: 'updateState', payload: { firstEnter: payload.firstEnter || false } });        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.firstEnter;
            delete payload.exportSearchContent;
            let params = { ...payload, ...exportSearchContent };
            let res = yield call(QueryList, parse(params));
            if (!!res && res.ret && res.ret.errorCode === 9000) {
                let { ret } = res;
                yield put({
                    type: 'updateState',
                    payload: {
                        topAllData: [{
                            all: '总计',
                            newPurMoney: ret.newPurMoney || 0,
                            newPurNum: ret.newPurNum || 0,
                            renewPurMoney: ret.renewPurMoney || 0,
                            renewPurNum: ret.renewPurNum || 0,
                            totalPurMoney: ret.totalPurMoney || 0,
                            totalPurNum: ret.totalPurNum || 0,
                            tranSchInMoney: ret.tranSchInMoney || 0,
                            tranSchInNum: ret.tranSchInNum || 0,
                            tranSchOutMoney: ret.tranSchOutMoney || 0,
                            tranSchOutNum: ret.tranSchOutNum || 0,
                            newDicmoneyMoney: ret.newDicmoneyMoney || 0,
                            renewDicmoneyMoney: ret.renewDicmoneyMoney || 0,
                            totalDicmoneyMoney: ret.totalDicmoneyMoney || 0,
                        }],
                        tableDataSource: ret.results || [],
                        tablePageIndex: ret.data && ret.data.pageIndex || 0,
                        tablePageSize: ret.data && ret.data.pageSize || 40,
                        tableTotal: ret.data && ret.data.resultCount || 0,
                        exportSearchContent,
                    }
                })
            } else {
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '查询失败');
                yield put({
                    type: 'updateState',
                    payload: {
                        topAllData: [{ all: '总计' }],
                        tableDataSource: [],
                        tablePageIndex: 0,
                        tablePageSize: 40,
                        tableTotal: 0,
                        exportSearchContent,
                    }
                })
            }
            yield put({ type: 'closeTableLoading' });
            yield put({ type: 'closeButtonLoading' });
            yield put({ type: 'updateState', payload: { firstEnter: false } });                              //报表头部已初始化，需要将状态重置
        },
        //更新云数据
        *'UpdateCloudData'({ payload }, { call, put, select }) {
            // yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.salesAchievementSheet);
            let params = {
                name: state.name
            }
            let { ret } = yield call(UpdateCloudData, params);
            if (ret && ret.errorCode === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        content: '上次更新时间 :'+ret.lastTime, //把请求到的数据赋值给全局变量content，然后传给page
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
        //弹框确定更新云数据
        *'ConfirmDeptOrgSelect'({ payload }, { call, put, select }) {
            // yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.salesAchievementSheet);
            let {startDate, endDate} = payload.params
            let params = {
                name: state.name,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            }
            let { ret } = yield call(ConfirmDeptOrgSelect, params);
            if (ret && ret.errorCode === 0) {
                payload.colback()
            }
        },
        *onconfirmDeptOrgSelect({ payload }, { call, put, select }) {
			// yield put({ type : 'updateState', payload : { buttonLoading : true, loading : true }});
            let state = yield select(state => state.salesAchievementSheet);
			let params = {
				name: state.name,
			}
            let { ret } = yield call(OnconfirmDeptOrgSelect, params);
			if (ret.errorCode == 0) {
				payload.coleback()
			}
			if (ret.errorCode == 1000) {
				payload.shutback()
                message.warning('每天只能更新一次，请明天再试~');
			}
		}
    },
    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
        showTableLoading(state, action) {
            return { ...state, tableLoading: true };
        },
        closeTableLoading(state, action) {
            return { ...state, tableLoading: false };
        },
        showButtonLoading(state, action) {
            return { ...state, buttonLoading: true };
        },
        closeButtonLoading(state, action) {
            return { ...state, buttonLoading: false };
        },
        updateDate(state, action) {
            return { ...state, ...action.payload };
        },
    },
}
