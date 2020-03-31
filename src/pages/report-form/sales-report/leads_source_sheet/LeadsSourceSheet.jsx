import React from 'react';
import qs from 'qs';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { exportFile } from '../../../../utils/exportFile';
import LeadsSourceSheetBar from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import LeadsSourceSheetComponent from '../../../../components/report-form/sales-report/leads_source_sheet/LeadsSourceSheet';

function LeadsSourceSheet({ dispatch, leadsSourceSheet }){

    let {
        firstEnter,                 //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
        sheetLoading,               //报表加载状态
        sheetData,                  //报表数据
        firstChannel,               //一级来源数据
        secondChannel,              //二级来源数据
        exportSearchContent,        //查询条件

        buttonLoading,              //生成报表按钮加载状态
    } = leadsSourceSheet;

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
        dp('leadsSourceSheet/QueryList',{
            exportSearchContent : data
        })
    }

    //点击导出
    function Export(type,data){
        if(type == '1'){
            if(firstChannel && firstChannel.length > 0){
                exportFile(`${BASE_URL}/crmStatsLeadsSource/exportLeadsSource?${qs.stringify(exportSearchContent)}&type=${type}`)
            }else{
                message.warn('无查询结果可导出');
            }
        }else if(type == '2'){
            if(secondChannel && secondChannel.length > 0){
                exportFile(`${BASE_URL}/crmStatsLeadsSource/exportLeadsSource?${qs.stringify(exportSearchContent)}&type=${type}`)
            }else{
                message.warn('无查询结果可导出');
            }
        }
    }

    let LeadsSourceSheetBarProps = {
        GeneratingReports,          //点击生成报表
        buttonLoading,
        firstEnter,                 //是否是点击路由进入，如果是则true，反之false(告诉报表头部是否需要还原默认)
    }

    //饼状图属性
    let LeadsSourceSheetComponentProps = {
        sheetLoading,               //报表加载状态
        sheetData,                  //报表数据
        firstChannel,               //一级来源数据
        secondChannel,              //二级来源数据

        Export,                     //点击导出
    }

    return (
        <div style = {{ overflow : 'hidden' , height : '100%' }}>
            <LeadsSourceSheetBar { ...LeadsSourceSheetBarProps } style = {{ marginBottom : 20 }}/>
            <LeadsSourceSheetComponent {...LeadsSourceSheetComponentProps} />
        </div>
    )
};

function mapStateToProps ({ leadsSourceSheet }){
	return { leadsSourceSheet };
};

export default connect( mapStateToProps )( LeadsSourceSheet );
