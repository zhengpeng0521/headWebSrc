import React from 'react';
import Media from 'react-media';
import { Button , Icon } from 'antd';
import { NullData , ProgressBar } from '../../../common/new-component/NewComponent';
import PieChart from '../../chart-type/pie-chart/PieChart';
import LeadsSourceSheetList from './LeadsSourceSheetList';
import thead from './thead.json';
import styles from '../../chart-less/ReportFormPie.less';

/*名单跟进表*/
function LeadsSourceSheet({
    sheetLoading,               //报表加载状态
    sheetData,                  //报表数据
    firstChannel,               //一级来源数据
    secondChannel,              //二级来源数据

    Export,                     //点击导出
}){

    //格式化饼状图数据
    function formatSheet(array){
        let data = [];
        for(let i in array){
            data.push({
                name : array[i].sourceName,
                value : parseInt(array[i].sourceNum)
            });
        }
        return data;
    }

    let LeadsSourceSheetListProps = {
        sheetLoading,               //报表加载状态
        sheetData,                  //报表数据
    }

    return(
        <Media query="(max-width: 1650px)">
            { matches => matches ?
                (<div className = 'report_form_pie_charts_wrap_small'>
                    <div className = 'report_form_pie_chart_column'>
                        <div className = 'report_form_pie_chart_title'>
                            <p>一级来源</p>
                            <Button type = 'primary' onClick = {() => Export('1',firstChannel)}><Icon type = 'export' />按查询结果导出</Button>
                        </div>
                        <div className = 'report_form_pie_chart_area'>
                            <PieChart data = { firstChannel } loading = { sheetLoading }/>
                        </div>
                    </div>
                    <div className = 'report_form_pie_chart_column'>
                        <div className = 'report_form_pie_chart_title'>
                            <p>二级来源</p>
                            <Button type = 'primary' onClick = {() => Export('2',secondChannel)}><Icon type = 'export' />按查询结果导出</Button>
                        </div>
                        <div className = 'report_form_pie_chart_area'>
                            <PieChart data = { secondChannel } loading = { sheetLoading }/>
                        </div>
                    </div>
                    <LeadsSourceSheetList {...LeadsSourceSheetListProps}/>
                </div>)
                :
                (<div className = 'report_form_pie_charts_wrap_large'>
                    <div className = 'report_form_pie_chart_row'>
                        <div className = 'report_form_pie_chart_title'>
                            <p>一级来源</p>
                            <Button type = 'primary' onClick = {() => Export('1',firstChannel)}><Icon type = 'export' />按查询结果导出</Button>
                        </div>
                        <div className = 'report_form_pie_chart_area'>
                            <PieChart data = { firstChannel } loading = { sheetLoading }/>
                        </div>
                    </div>
                    <div className = 'report_form_pie_chart_row'>
                        <div className = 'report_form_pie_chart_title'>
                            <p>二级来源</p>
                            <Button type = 'primary' onClick = {() => Export('2',secondChannel)}><Icon type = 'export' />按查询结果导出</Button>
                        </div>
                        <div className = 'report_form_pie_chart_area'>
                            <PieChart data = { secondChannel } loading = { sheetLoading }/>
                        </div>
                    </div>
                    <LeadsSourceSheetList {...LeadsSourceSheetListProps}/>
                </div>)
            }
        </Media>
    );
}

export default LeadsSourceSheet;
