import {
    GetTopAllData,                  /*获取上方总统计数据*/
    QueryOrgAllData,                /*获取校区收入排行数据*/
    QueryTextAllData,               /*获取教材统计数据*/
} from '../../../../services/erp/statistical-report/TextbookSales';
import { parse } from 'qs';
import qs from 'qs';
import { message } from 'antd';

//统计报表 教材销售
export default {

    namespace: 'textbookSales',

    state: {
        orgTimeRange:'',            //校区收入时间范围
        textTimeRange:'',           //教材统计时间范围
        orgListLoading:false,       //图表1加载状态
        textListLoading:false,      //图表2加载状态
        topAllInCome:{},            //上方总收入
        topOrgCount:'',             //上方统计校区数
        orgListData:[],             //校区收入数据
        textListData:[],            //教材统计数据
        searchContent:{},           //搜索条件(时间范围)
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/report_crm_teachstuff') {
                    dispatch({
                        type:'updateState',
                        payload:{
                            searchContent : {},
                        }
                    });
                    /*获取上方总统计数据*/
                    dispatch({
                        type: 'GetTopAllData'
                    });
                    /*获取校区收入排行数据*/
                    dispatch({
                        type: 'QueryOrgAllData'
                    });
                    /*获取教材统计数据*/
                    dispatch({
                        type: 'QueryTextAllData'
                    });
                }
            });
        },
    },

    effects: {
        /*获取上方总统计数据*/
        *'GetTopAllData'({ payload }, { call, put, select }){
            let { ret } = yield call(GetTopAllData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type : 'updateState',
                    payload : {
                        topAllInCome : ret.results[0],
                        topOrgCount : ret.orgNum+''
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
        },

        /*获取校区收入排行数据*/
        *'QueryOrgAllData'({ payload }, { call, put, select }){
            yield put({ type : 'showOrgLoading' });
            let { ret } = yield call(QueryOrgAllData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                let results = [];
                for(let i in ret.results){
                    if(((ret.results)[i].orgName).length>5){
                        results.push({
                            money : (ret.results)[i].money,
                            orgName : ((ret.results)[i].orgName).substring(0,4)+'...',
                            orgname : (ret.results)[i].orgName,
                        });
                    }else{
                        results.push({
                            money : (ret.results)[i].money,
                            orgName : (ret.results)[i].orgName,
                            orgname : (ret.results)[i].orgName,
                        });
                    }
                }
                if(payload && payload.startTime != '' && payload.endTime != ''){
                    yield put({
                        type: 'updateState',
                        payload: {
                            orgTimeRange : payload,
                            orgListData : results,
                        },
                    });
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            orgTimeRange : '',
                            orgListData : results,
                        },
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeOrgLoading' });
        },

        /*获取教材统计数据*/
        *'QueryTextAllData'({ payload }, { call, put, select }){
            yield put({ type : 'showTextLoading' });
            let { ret } = yield call(QueryTextAllData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                let results = [];
                for(let i in ret.results){
                    if(((ret.results)[i].taName).length>5){
                        results.push({
                            money : (ret.results)[i].money,
                            taName : ((ret.results)[i].taName).substring(0,4)+'...',
                            taname : (ret.results)[i].taName,
                        });
                    }else{
                        results.push({
                            money : (ret.results)[i].money,
                            taName : (ret.results)[i].taName,
                            taname : (ret.results)[i].taName,
                        });
                    }
                }
                if(payload && payload.startTime != '' && payload.endTime != ''){
                    yield put({
                        type: 'updateState',
                        payload: {
                            textTimeRange : payload,
                            textListData : results
                        },
                    });
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            textTimeRange : '',
                            textListData : results
                        },
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTextLoading' });
        },

        /*导出数据*/
        *'ExportData'({ payload }, { call, put, select }){
            window.open(`${BASE_URL}/statisticsController/exportExcelDetail?${qs.stringify(payload)}`);
        }
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //表格加载中
        showOrgLoading(state,action) {
            return { ...state, ...action.payload, orgListLoading: true };
        },

        //表格加载消失
        closeOrgLoading(state,action){
            return { ...state, ...action.payload, orgListLoading: false };
        },

        //表格加载中
        showTextLoading(state,action) {
            return { ...state, ...action.payload, textListLoading: true };
        },

        //表格加载中
        closeTextLoading(state,action) {
            return { ...state, ...action.payload, textListLoading: false };
        },
    },
};
