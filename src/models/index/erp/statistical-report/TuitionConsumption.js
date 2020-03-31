import {
    GetTopAllData,              /*获取统计校区，总消耗课时，总学费消耗数*/
    QueryForStoreData,          /*门店数据*/
    QueryForCourseData,         /*课程数据*/
    QueryForClassData,          /*班级数据*/
} from '../../../../services/erp/statistical-report/TuitionConsumption';
import { parse } from 'qs';
import qs from 'qs';
import { message } from 'antd';

//统计报表 学费消耗
export default {

    namespace: 'tuitionConsumption',

    state: {
        storeTimeRange : '',            //门店图用于显示时间范围
        courseTimeRange : '',           //课程图用于显示时间范围
        classTimeRange : '',            //班级图用于显示时间范围
        topAllData : {},                //统计校区，总消耗课时，总学费消耗数
        storeDataLoading : false,       //门店图加载状态
        courseDataLoading : false,      //课程图加载状态
        classDataLoading : false,       //班级图加载状态
        storeData : [],                 //门店图数据
        courseData : [],                //课程图数据
        classData : [],                 //班级图数据
        searchContent : {},             //搜索条件(时间范围)
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/report_erp_refund_expend') {
                    dispatch({
                        type:'updateState',
                        payload:{
                            searchContent : {},
                        }
                    });
                    /*获取统计校区，总消耗课时，总学费消耗数*/
                    dispatch({
                        type : 'GetTopAllData'
                    });
                    /*门店数据*/
                    dispatch({
                        type : 'QueryForStoreData'
                    });
                    /*课程数据*/
                    dispatch({
                        type : 'QueryForCourseData'
                    });
                    /*班级数据*/
                    dispatch({
                        type : 'QueryForClassData'
                    });
                }
            });
        },
    },

    effects: {
        /*获取统计校区，总消耗课时，总学费消耗数*/
        *'GetTopAllData'({ payload }, { call, put, select }){
            let { ret } = yield call(GetTopAllData);
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
                        topAllData : (ret.results)[0]
                    },
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
        },

        /*门店数据*/
        *'QueryForStoreData'({ payload }, { call, put, select }){
            yield put({ type : 'showStoreLoading' });
            let { ret } = yield call(QueryForStoreData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                let results = [];
                for(let i in ret.results){
                    if(((ret.results)[i].orgName).length>5){
                        results.push({
                            cost : (ret.results)[i].cost,
                            课时数 : (ret.results)[i].cost,
                            money : (ret.results)[i].money,
                            消费数 : (ret.results)[i].money,
                            orgName : ((ret.results)[i].orgName).substring(0,4)+'...',
                            orgname : (ret.results)[i].orgName,
                        });
                    }else{
                        results.push({
                            cost : (ret.results)[i].cost,
                            课时数 : (ret.results)[i].cost,
                            money : (ret.results)[i].money,
                            消费数 : (ret.results)[i].money,
                            orgName : ((ret.results)[i].orgName),
                            orgname : (ret.results)[i].orgName,
                        });
                    }
                }
                if(payload && payload.startTime != '' && payload.endTime != ''){
                    yield put({
                        type: 'updateState',
                        payload: {
                            storeTimeRange : payload,
                            storeData : results
                        },
                    });
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            storeTimeRange : '',
                            storeData : results
                        },
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeStoreLoading' });
        },

        /*课程数据*/
        *'QueryForCourseData'({ payload }, { call, put, select }){
            yield put({ type : 'showCourseLoading' });
            let { ret } = yield call(QueryForCourseData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                let results = [];
                for(let i in ret.results){
                    if(((ret.results)[i].title).length>5){
                        results.push({
                            cost : (ret.results)[i].cost,
                            课时数 : (ret.results)[i].cost,
                            money : (ret.results)[i].money,
                            消费数 : (ret.results)[i].money,
                            title : ((ret.results)[i].title).substring(0,4)+'...',
                            Title : (ret.results)[i].title,
                        });
                    }else{
                        results.push({
                            cost : (ret.results)[i].cost,
                            课时数 : (ret.results)[i].cost,
                            money : (ret.results)[i].money,
                            消费数 : (ret.results)[i].money,
                            title : ((ret.results)[i].title),
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
            yield put({ type : 'closeCouserLoading' });
        },

        /*班级数据*/
        *'QueryForClassData'({ payload }, { call, put, select }){
            yield put({ type : 'showClassLoading' });
            let { ret } = yield call(QueryForClassData,parse(payload));
            if (ret && ret.errorCode === 9000) {
                let results = [];
                for(let i in ret.results){
                    if(((ret.results)[i].clsName).length>5){
                        results.push({
                            cost : (ret.results)[i].cost,
                            课时数 : (ret.results)[i].cost,
                            money : (ret.results)[i].money,
                            消费数 : (ret.results)[i].money,
                            clsName : ((ret.results)[i].clsName).substring(0,4)+'...',
                            clsname : (ret.results)[i].clsName,
                        });
                    }else{
                        results.push({
                            cost : (ret.results)[i].cost,
                            课时数 : (ret.results)[i].cost,
                            money : (ret.results)[i].money,
                            消费数 : (ret.results)[i].money,
                            clsName : ((ret.results)[i].clsName),
                            clsname : (ret.results)[i].clsName,
                        });
                    }
                }
                if(payload && payload.startTime != '' && payload.endTime != ''){
                    yield put({
                        type: 'updateState',
                        payload: {
                            classTimeRange : payload,
                            classData : results
                        },
                    });
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            classTimeRange : '',
                            classData : results
                        },
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeClassLoading' });
        },

        /*导出报表*/
        *'ExportData'({ payload }, { call, put, select }){
            window.open(`${BASE_URL}/tuitionReduce/exportExcelDetail?${qs.stringify(payload)}`);
        }
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //门店图加载中
        showStoreLoading(state,action) {
            return { ...state, ...action.payload, storeDataLoading: true };
        },
        //门店图加载消失
        closeStoreLoading(state,action){
            return { ...state, ...action.payload, storeDataLoading: false };
        },
        //课程图加载中
        showCourseLoading(state,action) {
            return { ...state, ...action.payload, courseDataLoading: true };
        },
        //课程图加载消失
        closeCouserLoading(state,action){
            return { ...state, ...action.payload, courseDataLoading: false };
        },
        //班级图加载中
        showClassLoading(state,action) {
            return { ...state, ...action.payload, classDataLoading: true };
        },
        //班级图加载消失
        closeClassLoading(state,action){
            return { ...state, ...action.payload, classDataLoading: false };
        },
    },
};
