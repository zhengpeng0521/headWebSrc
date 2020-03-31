import {
    QueryFollowRecord,          /*跟进记录数字图*/
    QuerySalesFunnelPlot,       /*查询销售漏斗图*/
    QueryReservationRadar,      /*预约试听雷达图*/
    QueryVisitedRadar           /*到访记录雷达图*/
} from '../../../../services/report-form/sales-report/leadsFollowSheet';
import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';

//名单跟进表
export default {

  namespace: 'leadsFollowSheet',

    state: {
        firstEnter : true,                      //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        currentKernel : undefined,              //当前浏览器内核

        followRecordSheetLoading : false,       //跟进记录加载状态
        followRecordSheetData : '--',           //跟进记录数据

        salesFunnelSheetLoading : false,        //销售漏斗加载状态
        salesFunnelSheetData : [],              //销售漏斗报表数据

        reservationSheetLoading : false,        //预约试听加载状态
        reservationSheetData : [],              //预约试听雷达图报表数据

        visitedSheetLoading : false,            //到访记录加载状态
        visitedSheetData : [],                  //到访记录雷达图报表数据

        exportSearchContent : {},               //查询条件

        buttonLoading : false,                  //生成报表按钮加载状态
    },


    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/report_crm_leadsfollow') {
                    //初次进入页面查询当天数据(避免相互影响所以分别请求)
                    let exportSearchContent = window.GetNowDateAndTime();
                    let functionArr = ['QueryFollowRecord','QuerySalesFunnelPlot','QueryReservationRadar','QueryVisitedRadar'];
                    functionArr.map((item,index) => {
                        dispatch({
                            type : item,
                            payload : {
                                firstEnter : true,
                                exportSearchContent
                            }
                        })
                    })
                    //漏斗图js控制渐变色属性需要获取当前浏览器内核
                    dispatch({
                        type : 'updateState',
                        payload : {
                            currentKernel : window.currentKernel || '-webkit-', //当前浏览器内核
                        }
                    });
                }
            });
        },
    },

    effects: {
        /*跟进记录数字图*/
        *'QueryFollowRecord'({ payload },{ call, put, select }){
            yield put({ type : 'showFollowRecordSheetLoading' });
            yield put({ type : 'showButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.exportSearchContent;
            let params = { ...payload , ...exportSearchContent };
            let res = yield call(QueryFollowRecord,parse(params));
            if (!!res && res.ret && res.ret.errorCode === 9000) {
                let { ret } = res;
                yield put({
                    type:'updateState',
                    payload:{
                        followRecordSheetData : ret.totalNum,
                        exportSearchContent,
                    }
                })
            }else{
                message.error('跟进记录查询失败');
                yield put({
                    type:'updateState',
                    payload:{
                        followRecordSheetData : '--',
                        exportSearchContent,
                    }
                })
            }
            yield put({ type : 'closeFollowRecordSheetLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
        },

        /*查询销售漏斗图*/
        *'QuerySalesFunnelPlot'({ payload },{ call, put, select }){
            yield put({ type : 'showSalesFunnelSheetLoading' });
            yield put({ type : 'showButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.exportSearchContent;
            let params = { ...payload , ...exportSearchContent };
            let res = yield call(QuerySalesFunnelPlot,parse(params));
            if (!!res && res.ret && res.ret.errorCode === 9000) {
                let { ret } = res;
                yield put({
                    type:'updateState',
                    payload:{
                        salesFunnelSheetData : ret.results,
                        exportSearchContent,
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '销售漏斗查询失败');
                yield put({
                    type:'updateState',
                    payload:{
                        salesFunnelSheetData : [],
                        exportSearchContent,
                    }
                })
            }
            yield put({ type : 'closeSalesFunnelSheetLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
        },

        /*预约试听雷达图*/
        *'QueryReservationRadar'({ payload },{ call, put, select }){
            yield put({ type:'showReservationSheetLoading' });
            yield put({ type:'showButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.exportSearchContent;
            let params = { ...payload , ...exportSearchContent };
            let res = yield call(QueryReservationRadar,parse(params));
            if (!!res && res.ret && res.ret.errorCode === 9000) {
                let { ret } = res;
                yield put({
                    type:'updateState',
                    payload:{
                        reservationSheetData : ret.results,
                        exportSearchContent,
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '预约试听查询失败');
                yield put({
                    type:'updateState',
                    payload:{
                        reservationSheetData : [],
                        exportSearchContent,
                    }
                })
            }
            yield put({ type : 'closeReservationSheetLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
        },

        /*到访记录雷达图*/
        *'QueryVisitedRadar'({ payload },{ call, put, select }){
            yield put({ type:'showVisitedSheetLoading' });
            yield put({ type:'showButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : payload.firstEnter || false }});        //更新变量，使报表头部初始化
            let exportSearchContent = payload.exportSearchContent;
            delete payload.exportSearchContent;
            let params = { ...payload , ...exportSearchContent };
            let res = yield call(QueryVisitedRadar,parse(params));
            if (!!res && res.ret && res.ret.errorCode === 9000) {
                let { ret } = res;
                yield put({
                    type:'updateState',
                    payload:{
                        visitedSheetData : ret.results,
                        exportSearchContent,
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '到访记录查询失败');
                yield put({
                    type:'updateState',
                    payload:{
                        visitedSheetData : [],
                        exportSearchContent,
                    }
                })
            }
            yield put({ type : 'closeVisitedSheetLoading' });
            yield put({ type : 'closeButtonLoading' });
            yield put({ type : 'updateState' , payload : { firstEnter : false }});                              //报表头部已初始化，需要将状态重置
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
        //生成报表按钮加载
        showButtonLoading(state, action){
            return { ...state, buttonLoading : true };
        },
        //生成报表按钮取消加载
        closeButtonLoading(state, action){
            return { ...state, buttonLoading : false };
        },
        //跟进记录加载
        showFollowRecordSheetLoading(state, action){
            return { ...state, followRecordSheetLoading : true };
        },
        //跟进记录取消加载
        closeFollowRecordSheetLoading(state, action){
            return { ...state, followRecordSheetLoading : false };
        },
        //销售漏斗加载
        showSalesFunnelSheetLoading(state, action){
            return { ...state, salesFunnelSheetLoading : true };
        },
        //销售漏斗取消加载
        closeSalesFunnelSheetLoading(state, action){
            return { ...state, salesFunnelSheetLoading : false };
        },
        //预约试听加载
        showReservationSheetLoading(state, action){
            return { ...state, reservationSheetLoading : true };
        },
        //预约试听取消加载
        closeReservationSheetLoading(state, action){
            return { ...state, reservationSheetLoading : false };
        },
        //到访记录加载
        showVisitedSheetLoading(state, action){
            return { ...state, visitedSheetLoading : true };
        },
        //到访记录取消加载
        closeVisitedSheetLoading(state, action){
            return { ...state, visitedSheetLoading : false };
        },
    },
}
