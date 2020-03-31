import React from 'react';
import qs from 'qs';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { exportFile } from '../../../../utils/exportFile';
import LeadsFollowSheetBar from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import LeadsFollowSheetComponent from '../../../../components/report-form/sales-report/leads_follow_sheet/LeadsFollowSheet';

function LeadsFollowSheet({ dispatch, leadsFollowSheet }){

    let {
        firstEnter,                     //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        currentKernel,                  //当前浏览器内核

        followRecordSheetLoading,       //跟进记录加载状态
        followRecordSheetData,          //跟进记录数据

        salesFunnelSheetLoading,        //销售漏斗加载状态
        salesFunnelSheetData,           //销售漏斗报表数据

        reservationSheetLoading,        //预约试听加载状态
        reservationSheetData,           //预约试听雷达图报表数据

        visitedSheetLoading,            //到访记录加载状态
        visitedSheetData,               //到访记录雷达图报表数据

        exportSearchContent,            //查询条件

        buttonLoading,                  //生成报表按钮加载状态
    } = leadsFollowSheet;

    function dp(path, obj){
		dispatch({
			type : path,
			payload : {
				...obj
			}
		});
	}

    //点击生成报表
    function GeneratingReports(data){
        /*跟进记录数字图*/
        dp('leadsFollowSheet/QueryFollowRecord',{ exportSearchContent : data });

        /*查询销售漏斗图*/
        dp('leadsFollowSheet/QuerySalesFunnelPlot',{ exportSearchContent : data });

        /*预约试听雷达图*/
        dp('leadsFollowSheet/QueryReservationRadar',{ exportSearchContent : data });

        /*到访记录雷达图*/
        dp('leadsFollowSheet/QueryVisitedRadar',{ exportSearchContent : data });
    }

    //销售漏斗legend点击事件
    function SalesFunnelLegendItemOnClick(key,flag){
        for(let i in salesFunnelSheetData){
            if(salesFunnelSheetData[i].key == key){
                salesFunnelSheetData[i].click = flag;
                break;
            }
        }
        dp('leadsFollowSheet/updateState',{
            salesFunnelSheetData
        })
    }

    //销售漏斗导出
    function ExportSheet(type){
        if(type == 'sales_funnel'){
            if(salesFunnelSheetData.length > 0){
                exportFile(`${BASE_URL}/sellerReport/exportLeadsSource?${qs.stringify(exportSearchContent)}`)
            }else{
                message.warn('无查询结果可导出');
            }
        }else if(type == 'reservation'){
            if(reservationSheetData.length > 0){
                exportFile(`${BASE_URL}/sellerReport/exportAppointAudition?${qs.stringify(exportSearchContent)}`)
            }else{
                message.warn('无查询结果可导出');
            }
        }else if(type == 'visited'){
            if(visitedSheetData.length > 0){
                exportFile(`${BASE_URL}/sellerReport/exportVisitRecord?${qs.stringify(exportSearchContent)}`)
            }else{
                message.warn('无查询结果可导出');
            }
        }else if(type == 'follow_record'){
            if(!!followRecordSheetData){
                exportFile(`${BASE_URL}/sellerReport/exportFollowRecord?${qs.stringify(exportSearchContent)}`)
            }else{
                message.warn('无查询结果可导出');
            }
        }
    }

    let LeadsFollowSheetBarProps = {
        GeneratingReports,              //点击生成报表
        buttonLoading,                  //生成报表按钮加载状态
        firstEnter,                     //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    }


    let LeadsFollowSheetComponentProps = {
        currentKernel,                  //当前浏览器内核

        followRecordSheetLoading,       //跟进记录加载状态
        followRecordSheetData,          //跟进记录数据

        salesFunnelSheetLoading,        //销售漏斗加载状态
        salesFunnelSheetData,           //销售漏斗报表数据

        reservationSheetLoading,        //预约试听加载状态
        reservationSheetData,           //预约试听雷达图报表数据

        visitedSheetLoading,            //到访记录加载状态
        visitedSheetData,               //到访记录雷达图报表数据

        SalesFunnelLegendItemOnClick,   //销售漏斗legend点击事件
        ExportSheet,                    //报表导出
    }

    return (
        <div style = {{ overflow : 'hidden' , height : '100%' }}>
            <LeadsFollowSheetBar { ...LeadsFollowSheetBarProps } style = {{ marginBottom : 20 }}/>
            <LeadsFollowSheetComponent {...LeadsFollowSheetComponentProps} />
        </div>
    )
};

function mapStateToProps ({ leadsFollowSheet }){
	return { leadsFollowSheet };
};

export default connect( mapStateToProps )( LeadsFollowSheet );
