import React from 'react';
import Media from 'react-media';
import { Button , Icon } from 'antd';
import { NullData , ProgressBar } from '../../../common/new-component/NewComponent';
import TextBackground from '../../chart-type/text-background/TextBackground';
import FunnelPlot from '../../chart-type/funnel-plot/FunnelPlot';
import RadarMap from '../../chart-type/radar-map/RadarMap';
import styles from './LeadsFollowSheet.less';

/*名单跟进表*/
function LeadsFollowSheet({
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
}){

    //跟进记录属性
    let TextBackgroundProps = {
        data : followRecordSheetData,                       //跟进记录数据
        loading : followRecordSheetLoading,                 //加载状态
        ExportSheet,
    }

    //销售漏斗属性
    let FunnelPlotProps = {
        currentKernel,                                      //当前浏览器内核
        loading : salesFunnelSheetLoading,                  //加载状态
        data : salesFunnelSheetData,                        //销售漏斗报表数据
        LegendItemOnClick : SalesFunnelLegendItemOnClick,   //legend点击事件
    }

    //预约试听属性
    let ReservationRadarMapProps = {
        loading : reservationSheetLoading,                  //加载状态
        color : ['rgba(93,156,236,.8)'],
        data : reservationSheetData,                        //预约试听雷达图报表数据
    }

    //到访记录属性
    let VisitedRadarMapProps = {
        loading : visitedSheetLoading,                      //加载状态
        color : ['rgba(129,117,199,.8)'],
        data : visitedSheetData,                            //到访记录雷达图报表数据
    }

    return(
        <Media query="(max-width: 1650px)">
            { matches => matches ?
                (<div className = 'report_form_pie_charts_wrap_small'>
                    <div className={styles.row_sheet}>
                        <div className={styles.sfollow_record_sheet}>
                            <TextBackground {...TextBackgroundProps}/>
                        </div>
                        <div className={styles.ssheet}>
                            <div className={styles.sheet_title}>
                                <p>销售漏斗(最多显示7项，查看全部请导出报表)</p>
                                <Button type = 'primary' onClick = {() => ExportSheet('sales_funnel')}><Icon type = 'export' />按查询结果导出</Button>
                            </div>
                            <div className={styles.sheet_content_special}>
                                <FunnelPlot {...FunnelPlotProps}/>
                            </div>
                        </div>
                    </div>
                    <div className = 'report_form_pie_chart_column'>
                        <div className = 'report_form_pie_chart_title'>
                            <p>预约试听</p>
                            <Button type = 'primary' onClick = {() => ExportSheet('reservation')}><Icon type = 'export' />按查询结果导出</Button>
                        </div>
                        <div className = 'report_form_pie_chart_area'>
                            <RadarMap {...ReservationRadarMapProps}/>
                        </div>
                    </div>
                    <div className = 'report_form_pie_chart_column'>
                        <div className = 'report_form_pie_chart_title'>
                            <p>到访记录</p>
                            <Button type = 'primary' onClick = {() => ExportSheet('visited')}><Icon type = 'export' />按查询结果导出</Button>
                        </div>
                        <div className = 'report_form_pie_chart_area'>
                            <RadarMap {...VisitedRadarMapProps}/>
                        </div>
                    </div>
                </div>)
                :
                (<div className = 'report_form_pie_charts_wrap_large'>
                    <div className={styles.row_sheet}>
                        <div className={styles.lfollow_record_sheet}>
                            <TextBackground {...TextBackgroundProps}/>
                        </div>
                        <div className={styles.lsheet}>
                            <div className={styles.sheet_title}>
                                <p>销售漏斗(最多显示7项，查看全部请导出报表)</p>
                                <Button type = 'primary' onClick = {() => ExportSheet('sales_funnel')}><Icon type = 'export' />按查询结果导出</Button>
                            </div>
                            <div className={styles.sheet_content_special}>
                                <FunnelPlot {...FunnelPlotProps}/>
                            </div>
                        </div>
                    </div>
                    <div className = 'report_form_pie_chart_row'>
                        <div className = 'report_form_pie_chart_title'>
                            <p>预约试听</p>
                            <Button type = 'primary' onClick = {() => ExportSheet('reservation')}><Icon type = 'export' />按查询结果导出</Button>
                        </div>
                        <div className = 'report_form_pie_chart_area'>
                            <RadarMap {...ReservationRadarMapProps}/>
                        </div>
                    </div>
                    <div className = 'report_form_pie_chart_row'>
                        <div className = 'report_form_pie_chart_title'>
                            <p>到访记录</p>
                            <Button type = 'primary' onClick = {() => ExportSheet('visited')}><Icon type = 'export' />按查询结果导出</Button>
                        </div>
                        <div className = 'report_form_pie_chart_area'>
                            <RadarMap {...VisitedRadarMapProps}/>
                        </div>
                    </div>
                </div>)
            }
        </Media>
    );
}

export default LeadsFollowSheet;
