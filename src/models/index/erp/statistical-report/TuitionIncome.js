import {
    GetTopAllData,                      /*获取上方统计数据*/
    QueryOrgData,                       /*获取校区统计数据*/
    QueryCourseData,                    /*获取课程统计数据*/
    QueryPayWayData,                    /*获取支付方式统计数据*/
    queryForAllDataByTimeRange
} from '../../../../services/erp/statistical-report/TuitionIncome';
import { parse } from 'qs';
import qs from 'qs';
import { message } from 'antd';

//统计报表 学费收入
export default {

    namespace: 'tuitionIncome',

    state: {
        activeIndex : 0,            //饼状图鼠标hover索引

        orgTimeRange:'',            //校区时间范围
        courseTimeRange:'',         //课程时间范围
        payWayTimeRange:'',         //支付方式时间范围

        orgListLoading:false,       //图表1加载状态
        courseListLoading:false,    //图表2加载状态
        payWayListLoading:false,    //图表3加载状态

        topAllOrg:'',               //上方统计校区数量
        topAllData:{},              //上方总统计数据
        orgData:[],                 //校区统计数据
        courseData:[],              //课程统计数据
        payWayData:[],              //饼状图统计数据

        searchContent : {},         //搜索数据(时间范围)
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/report_crm_pay_income') {
                    dispatch({
                        type:'updateState',
                        payload:{
                            searchContent : {},
                        }
                    });
                    /*获取上方总计数据*/
                    dispatch({
                        type: 'GetTopAllData'
                    });
                    /*获取校区统计数据*/
                    dispatch({
                        type: 'QueryOrgData'
                    });
                    /*获取课程统计数据*/
                    dispatch({
                        type: 'QueryCourseData'
                    });
                    /*获取支付方式统计数据*/
                    dispatch({
                        type: 'QueryPayWayData'
                    });
                }
            });
        },
    },

    effects: {
        /*获取上方总计数据*/
        *'GetTopAllData'({ payload }, { call, put, select }){
            let { ret } = yield call(GetTopAllData);
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type:'updateState',
                    payload:{
                        topAllData : ret.results[0],
                        topAllOrg : ret.orgNum+''
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
        },

        /*获取校区统计数据*/
        *'QueryOrgData'({ payload }, { call, put, select }){
            yield put({ type : 'showOrgLoading' });
            let { ret } = yield call(QueryOrgData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                let results = [];
                for(let i in ret.results){
                    if(((ret.results)[i].orgName).length>5){
                        results.push({
                            realMoney : (ret.results)[i].realMoney,
                            orgName : ((ret.results)[i].orgName).substring(0,4)+'...',
                            orgname : (ret.results)[i].orgName,
                        });
                    }else{
                        results.push({
                            realMoney : (ret.results)[i].realMoney,
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
                            orgData : results
                        },
                    });
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            orgTimeRange : '',
                            orgData : results
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

        /*获取课程统计数据*/
        *'QueryCourseData'({ payload }, { call, put, select }){
            yield put({ type : 'showCourseLoading' });
            let { ret } = yield call(QueryCourseData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                let results = [];
                for(let i in ret.results){
                    if(((ret.results)[i].title).length>5){
                        results.push({
                            money : (ret.results)[i].money,
                            title : ((ret.results)[i].title).substring(0,4)+'...',
                            Title : (ret.results)[i].title,
                        });
                    }else{
                        results.push({
                            money : (ret.results)[i].money,
                            title : (ret.results)[i].title,
                            Title : (ret.results)[i].title,
                        });
                    }
                }
                if(payload && payload.startTime != '' && payload.endTime != ''){
                    yield put({
                        type: 'updateState',
                        payload: {
                            courseTimeRange : payload,
                            courseData : results
                        },
                    });
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            courseTimeRange : '',
                            courseData : results
                        },
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeCourseLoading' });
        },

        /*获取支付方式统计数据*/
        *'QueryPayWayData'({ payload }, { call, put, select }){
            yield put({ type : 'showPayWayLoading' });
            let { ret } = yield call(QueryPayWayData,parse(payload));
            if(ret && ret.errorCode === 9000){
                let results = [];
                for(let i in ret.results){
                    results.push({
                        value : ret.results[i].payMoney,
                        paymentValue : ret.results[i].paymentValue,
                    });
                }
                if(payload && payload.startTime != '' && payload.endTime != ''){
                    yield put({
                        type: 'updateState',
                        payload: {
                            payWayTimeRange : payload,
                            payWayData : results
                        },
                    });
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            payWayTimeRange : '',
                            payWayData : results
                        },
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closePayWayLoading' });
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
        showCourseLoading(state,action) {
            return { ...state, ...action.payload, courseListLoading: true };
        },
        //表格加载中
        closeCourseLoading(state,action) {
            return { ...state, ...action.payload, courseListLoading: false };
        },
        //表格加载中
        showPayWayLoading(state,action) {
            return { ...state, ...action.payload, payWayListLoading: true };
        },
        //表格加载中
        closePayWayLoading(state,action) {
            return { ...state, ...action.payload, payWayListLoading: false };
        },
    },
};
