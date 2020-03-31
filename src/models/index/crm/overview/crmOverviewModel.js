import {
    GetNowTime,                 /*获取当前日期与时间*/
    getOverviewData,            /*加载首页数据*/
    GetTopDataBoard,            /*上方数据看板数据*/
    GetRightDataBoard,          /*右方当日数据看板数据*/
    GetStuTableMessage,         /*获取学员信息table数据*/
    GetStuChartMessage,         /*获取学员信息chart数据*/
    GetSaleOrderChartData,      /*获取销售订单数据(包括chart和calender)*/
    GetFunnelDate,              /*获取漏斗图数据*/
    GetUserBranch               /*获取用户信息*/
} from '../../../../services/crm/overview/overviewService';
import { message } from 'antd';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import { FormatDate , GetCountDays } from '../../../../utils/dateFormat';
import moment from 'moment';



// 全局布局model
export default {

  namespace: 'crmOverviewModel',

    state: {

        nowDate : '',               /*当前日期 YYYY-MM-DD*/
        loading: false,
        selectMonth: '',            /*选中的月份 YYYY-MM*/

        /*上方每月数据看板*/
        topDataBoard : [],          /*上方数据看板数据*/

        /*右方当日数据看板*/
        rightDataBoard : [],        /*右方数据看板数据*/

        /*学员栏日历*/
        stuDate : '',               /*学员栏日历日期显示*/
        stuTableMessage : [],       /*学员信息table数据*/
        stuChartMessage : [],       /*学员信息chart数据*/

        /*销售订单*/
        salesOrderDate : '',        /*销售订单栏历日期显示*/
        salesOrderChartData : [],   /*销售订单chart数据*/
        salesOrderCalenderData : [],/*销售订单calender数据*/

        /*漏斗图*/
        funnelData : [],            /*漏斗图数据*/
        funnelLoading : false,      /*漏斗图加载状态*/
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/crm_homepage') {
                    dispatch({
                        type: 'GetNowTime',
                    });
                }
            });
        },
    },

    effects: {
        /*获取当前日期与时间*/
        *'GetNowTime'({ payload }, { call, put, select }){
            //若接口报错，则通过前端获取当前时间作为权宜之计
            let date = '';
            let { ret } = yield call(GetNowTime);
            if(ret && ret.errorCode === 9000){
                date = ret.date.substr(0,7);
            }else{
                date = moment().format('YYYY-MM');
            }
            yield put({
                type:'updateState',
                payload:{
                    nowDate : ret.date
                }
            });
            yield put({
                type:'loadOverviewData',
                payload:{
                    selectMonth : date
                }
            })
        },

        /*加载首页数据*/
        *'loadOverviewData'({ payload }, { call, put, select }) {
            let selectMonth = !!payload && !!payload.selectMonth ? payload.selectMonth : moment().format('YYYY-MM');
            let { ret } = yield call(getOverviewData, parse({month: selectMonth}));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                        selectMonth,
                    }
                });
                /*上方每月数据看板数据*/
                yield put ({
                    type:'GetTopDataBoard',
                    payload:{
                        date : selectMonth
                    }
                });
                /*右方当日数据看板数据*/
                yield put ({
                    type:'GetRightDataBoard',
                    payload:{
                        selectMonth
                    }
                });

                /*获取学员信息chart数据*/
                yield put ({
                    type:'GetStuChartMessage',
                    payload:{
                        date : selectMonth
                    }
                });

                /*获取学员信息table数据*/
                yield put ({
                    type:'GetStuTableMessage',
                    payload:{
                        date : selectMonth
                    }
                });

                /*获取漏斗图数据*/
                yield put({
                    type:'GetFunnelDate'
                });

            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        selectMonth,
                    }
                });
                message.error((ret && ret.errorMessage) || '没有获取到首页数据');
            }
        },

        /*上方数据看板数据*/
        *'GetTopDataBoard'({ payload }, { call, put, select }){
            let { ret } = yield call(GetTopDataBoard, parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type : 'updateState',
                    payload:{
                        topDataBoard : ret.data,          /*上方数据看板数据*/
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*右方当日数据看板数据*/
        *'GetRightDataBoard'({ payload }, { call, put, select }){
            let { ret } = yield call(GetRightDataBoard);
            if(ret && ret.errorCode === 9000){
                yield put({
                    type : 'updateState',
                    payload:{
                        rightDataBoard : ret.data,        /*上方数据看板数据*/
                    }
                });
                /*获取销售订单数据(包括chart和calender)*/
                yield put ({
                    type:'GetSaleOrderChartData',
                    payload:{
                        date : payload.selectMonth,
                        rightDataBoard : ret.data,        /*上方数据看板数据*/
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*获取学员信息chart数据*/
        *'GetStuChartMessage'({ payload }, { call, put, select }){
            let { ret } = yield call(GetStuChartMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                let results = [];
                if(ret.results && (ret.results).length > 0){
                    for(let i in ret.results){
                        results.push({
                            specialTime : (ret.results)[i].specialTime,
                            dateTime : (ret.results)[i].dateTime,
                            followStu : (ret.results)[i].followStu,
                            followRecord : (ret.results)[i].followRecord,
                            newlyStu : (ret.results)[i].newlyStu,
                            跟进学员 : (ret.results)[i].followStu,
                            跟进记录 : (ret.results)[i].followRecord,
                            新增学员 : (ret.results)[i].newlyStu,
                        });
                    }
                }
                yield put({
                    type : 'updateState',
                    payload:{
                        stuChartMessage : results,        /*学员信息chart数据*/
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*获取学员信息table数据*/
        *'GetStuTableMessage'({ payload }, { call, put, select }){
            let { ret } = yield call(GetStuTableMessage,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type : 'updateState',
                    payload:{
                        stuTableMessage : ret.results,        /*学员信息table数据*/
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*获取销售订单数据(包括chart和calender)*/
        *'GetSaleOrderChartData'({ payload }, { call, put, select }){
            let rightDataBoard = !!payload && !!payload.rightDataBoard ? payload.rightDataBoard : undefined;
            delete payload.rightDataBoard;
            let { ret } = yield call(GetSaleOrderChartData,parse(payload));
            if(ret && ret.errorCode === 9000){
                let crmOverviewModel = yield select(state => state.crmOverviewModel);
                let nowDate = crmOverviewModel.nowDate;                     //当前时间
                let month = new Date(payload.date).getMonth() + 1;          //查询月份
                let results = [];
                if(ret.results && (ret.results).length > 0){
                    for(let i in ret.results){
                        results.push({
                            rightDate : (ret.results)[i].rightDate,
                            leftDate : (ret.results)[i].leftDate,
                            orderNum : (ret.results)[i].orderNum,
                            合同订单数 : (ret.results)[i].orderNum,
                        });
                    }
                }
                /*如果是本月数据查询则需要加今天的数据，否则不加*/
                if(parseInt(month) == parseInt(new Date(nowDate).getMonth()+1)){
                    results.splice(
                        results.length,
                        0,
                        {
                            rightDate:nowDate.substr(0,10),
                            leftDate:nowDate.substr(5,5),
                            orderNum:rightDataBoard.orderNum,
                            合同订单数:rightDataBoard.orderNum,
                        }
                    )
                }
                yield put({
                    type : 'updateState',
                    payload:{
                        salesOrderCalenderData : results,       /*销售订单calender数据*/
                        salesOrderChartData : results,          /*销售订单数据*/
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },

        /*获取漏斗图数据*/
        *'GetFunnelDate'({ payload }, { call, put, select }){
            yield put({ type : 'showFunnelLoading' });
            let { ret } = yield call(GetFunnelDate,parse(payload));
            if(ret && ret.errorCode === 9000){
                yield put({
                    type : 'updateState',
                    payload:{
                        funnelData : ret.results,               /*漏斗图数据*/
                    }
                });
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
            yield put({ type : 'closeFunnelLoading' });
        },

        /*点击区块跳转到相应路由*/
        *'JumpToOtherRouter'({ payload }, { call, put, select }){
            let { ret } = yield call(GetUserBranch);
            if(ret && ret.errorCode === 9000){
                let crmOverviewModel = yield select( state => state.crmOverviewModel );
                let endDate = crmOverviewModel.nowDate;
                let selectMonth = crmOverviewModel.selectMonth;
                let fastSearchContent = {};             //快捷搜索栏搜索条件
                let superSearchContent = {};            //高级搜索栏搜索条件
                let checkMonthMs = new Date(selectMonth).getTime();             //首页月份查询的毫秒数
                let nowMs = new Date(endDate.substr(0,7)).getTime();            //当前月份的毫秒数
                let year = new Date(selectMonth).getFullYear();
                let month = new Date(selectMonth).getMonth()+1;
                let days = GetCountDays(year,month);                            //首页选中月份有多少天
                if(payload.router == 'crm_leads_mine'){         //跳到我的名单
                    if(payload.type == 'today_need_follow'){    //点击今日需要跟进的名单
                        endDate = endDate.substr(0,11) + '23:59:59';
                        superSearchContent = { endNextFollowTime : endDate };
                    }else if(payload.type == 'new_leads'){      //点击月份新增名单(统计当月第一天到最后一天)
                        if(checkMonthMs != nowMs){              //选中月不是当前月
                            superSearchContent = { startCreateTime : selectMonth + '-01 00:00:00' , endCreateTime : selectMonth + '-' + days + ' 23:59:59' };
                        }else{                                  //选中月恰好是当前月
                            superSearchContent = { startCreateTime : endDate.substr(0,7) + '-01 00:00:00' , endCreateTime : endDate + ' 23:59:59' };
                        }
                    }else{                                      //漏斗图
                        fastSearchContent = { studentFollowState : payload.type };
                    }
                    yield put(routerRedux.push({
                        pathname: payload.router,
                        query:{
                            jump : true,
                            type : payload.type,
                            pageIndex : 0,
                            pageSize : 20,
                            fastSearchContent : JSON.stringify(fastSearchContent),
                            superSearchContent : JSON.stringify(superSearchContent),
                        }
                    }));
                }else if(payload.router == 'crm_follow_mine'){      //跳到我负责的跟进
                    if(checkMonthMs != nowMs){                      //选中月不是当前月
                        superSearchContent = { startTime : selectMonth + '-01 00:00:00' , endTime : selectMonth + '-' + days + ' 23:59:59' };
                    }else{                                          //选中月恰好是当前月
                        superSearchContent = { startTime : endDate.substr(0,7) + '-01 00:00:00' , endTime : endDate + ' 23:59:59' };
                    }
                    yield put(routerRedux.push({
                        pathname: payload.router,
                        query:{
                            jump : true,
                            pageIndex : 0,
                            pageSize : 20,
                            source : 2,
                            ...fastSearchContent,
                            ...superSearchContent
                        }
                    }));
                }else if(payload.router == 'crm_sorder_list'){      //跳到我负责的合同
                    if(checkMonthMs != nowMs){                      //选中月不是当前月
                        superSearchContent = { startTime : selectMonth + '-01 00:00:00' , endTime : selectMonth + '-' + days + ' 23:59:59' };
                    }else{                                          //选中月恰好是当前月
                        superSearchContent = { startTime : endDate.substr(0,7) + '-01 00:00:00' , endTime : endDate + ' 23:59:59' };
                    }
                    yield put(routerRedux.push({
                        pathname: payload.router,
                        query:{
                            jump : true,
                            pageIndex : 0,
                            pageSize : 20,
                            orderState : '4',
                            ...fastSearchContent,
                            ...superSearchContent
                        }
                    }));
                }
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('获取用户信息失败，无法跳转');
            }
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
        //显示漏斗图加载状态
        showFunnelLoading(state, action) {
            return { ...state, ...action.payload, funnelLoading : true};
        },
        //关闭漏斗图加载状态
        closeFunnelLoading(state, action) {
            return { ...state, ...action.payload, funnelLoading : false};
        },
    },

}
