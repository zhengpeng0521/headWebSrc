import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import CrmOverviewComponent from '../../../components/crm/overview/CrmOverviewComponent';

function CrmOverview({dispatch, crmOverviewModel}) {

	let {

        loading,
        selectMonth,            /*全局显示的月份*/

        /*上方数据看板*/
        topDataBoard,           /*上方数据看板数据*/

        /*右方当日数据看板*/
        rightDataBoard,         /*右方数据看板数据*/

        /*学员栏日历*/
        stuDate,                /*学员栏日历日期显示*/
        stuTableMessage,        /*学员信息table数据*/
        stuChartMessage,        /*学员信息chart数据*/

        /*销售订单*/
        salesOrderDate,         /*销售订单栏历日期显示*/
        salesOrderChartData,    /*销售订单chart数据*/
        salesOrderCalenderData, /*销售订单calender数据*/

        /*漏斗图*/
        funnelData,             /*漏斗图数据*/
        funnelLoading,          /*漏斗图加载状态*/

    } = crmOverviewModel;

    /*全局选择切换选择的时间*/
    let changeSelectMonth = function(selectMonth) {
        dispatch({
            type:'crmOverviewModel/updateState',
            payload:{
                selectMonth,
                stuDate : selectMonth,              /*全局切换时学员栏时间范围也做相应切换*/
                salesOrderDate : selectMonth,       /*全局切换时销售订单栏时间范围也做相应切换*/
            }
        });
        dispatch({
            type: 'crmOverviewModel/loadOverviewData',
            payload: {
                selectMonth
            }
        });
    }

    /*学员栏日期选择*/
    let StuMonthChange = function(date, dateString){
        dispatch({
            type:'crmOverviewModel/updateState',
            payload:{
                stuDate : dateString,
            }
        });
        dispatch({
            type:'crmOverviewModel/GetStuChartMessage',
            payload:{
                date : dateString,
            }
        });
        dispatch({
            type:'crmOverviewModel/GetStuTableMessage',
            payload:{
                date : dateString,
            }
        });
    }

    /*销售订单栏日历日期选择事件*/
    let SalesOrderOnPanelChange = function(date,dateString){
        dispatch({
            type:'crmOverviewModel/updateState',
            payload:{
                salesOrderDate : dateString
            }
        });
        dispatch({
            type:'crmOverviewModel/GetSaleOrderChartData',
            payload:{
                date : dateString,
                rightDataBoard
            }
        });
    }

    /*点击区块跳转到相应路由*/
    let JumpToOtherRouter = function(router,type){
        dispatch({
            type:'crmOverviewModel/JumpToOtherRouter',
            payload:{
                router,
                type
            }
        });
    }

    let componProps = {
        loading,
        selectMonth,
        changeSelectMonth,

        /*上方数据看板*/
        topDataBoard,               /*上方数据看板数据*/

        /*右方当日数据看板*/
        rightDataBoard,             /*右方数据看板数据*/

        /*学员栏表格*/
        stuDate,                    /*学员栏日期显示*/
        stuTableMessage,            /*学员信息table数据*/
        stuChartMessage,            /*学员信息chart数据*/
        StuMonthChange,             /*学员栏日期选择*/

        /*销售订单*/
        salesOrderDate,             /*销售订单栏历日期显示*/
        salesOrderChartData,        /*销售订单chart数据*/
        salesOrderCalenderData,     /*销售订单calender数据*/
        SalesOrderOnPanelChange,    /*销售订单栏日历日期选择事件*/

        /*漏斗图*/
        funnelData,                 /*漏斗图数据*/
        funnelLoading,              /*漏斗图加载状态*/
        JumpToOtherRouter,          /*点击区块跳转到相应路由*/
    };

    return (
        <div>
            <CrmOverviewComponent {...componProps} />
        </div>
    );
}

function mapStateToProps({ crmOverviewModel }) {
  	return { crmOverviewModel };
}

export default connect(mapStateToProps)(CrmOverview);
