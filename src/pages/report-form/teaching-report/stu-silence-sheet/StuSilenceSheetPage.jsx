import React from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import StuSilenceSheetTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import StuSilenceSheetComponent from '../../../../components/report-form/teaching-report/stu-silence-sheet/StuSilenceSheet';
import { getSsToken } from '../../../../utils/getSsToken';

function StuSilenceSheetPage({ dispatch, stuSilenceSheetModel }){

    let {
		firstEnter,

		loading,
		newPurStuNum,                 //新签学员
		renewPurStuNum,               //续约学员
		uncostStuNum,                 //未消耗课时学员

		oldStuNum,                    //新学员
		newStuNum,                    //老学员

		exportSearchContent

    } = stuSilenceSheetModel;

    //点击生成报表
    function GeneratingReports( values ){
		dispatch({
			type : 'stuSilenceSheetModel/GeneratingReports',
			payload : {
				values
			}
		})
    }

	function exportData( exportPath ){
        if( !exportSearchContent.startDate || !exportSearchContent.endDate ){
            return message.warn('请选择时间范围');
        }
		window.excelExport( exportPath, exportSearchContent )
	}

	function exportUnPackFunc(){
		let exportPath = '/crm/hq/erp/stats/silenceCost/purExport';
        if( !newPurStuNum && !renewPurStuNum ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	function exportUnCostFunc(){
		let exportPath = '/crm/hq/erp/stats/silenceCost/costExport';
        if( !uncostStuNum ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

    let stuSilenceSheetTopProps = {
		firstEnter,

        GeneratingReports,      //点击生成报表
		buttonLoading : loading
    }

    let stuSilenceSheetComponentProps = {
		loading,
		newPurStuNum,                 //新签学员
		renewPurStuNum,               //续约学员
		uncostStuNum,                 //未消耗课时学员
		oldStuNum,                    //新学员
		newStuNum,                    //老学员

		exportUnPackFunc,             //导出未开课包学员
		exportUnCostFunc,             //导出未消课学员
    }

    return (
        <div style = {{ overflow : 'hidden' , height : '100%' }}>
            <StuSilenceSheetTop { ...stuSilenceSheetTopProps } style = {{ marginBottom : 20 }}/>
            <StuSilenceSheetComponent { ...stuSilenceSheetComponentProps } />
        </div>
    )
};

function mapStateToProps ({ stuSilenceSheetModel }){
	return { stuSilenceSheetModel };
};

export default connect( mapStateToProps )( StuSilenceSheetPage );
