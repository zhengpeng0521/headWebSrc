import React, { PropTypes } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import SendRecordSheetPageTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import SendRecordSheetComponent from '../../../../components/report-form/sales-report/send-record-sheet/SendRecordSheet';
import { getSsToken } from '../../../../utils/getSsToken';

function SendRecordSheetPage({ dispatch, sendRecordSheetModel }) {
    let {
		firstEnter,

		commCourseNum,
        excCourseNum,
        costCommCourseNum,
        costExcCourseNum,

		createContractSendClass,
		afterContractSendClass,

		commCourseMoney,
        excCourseMoney,
        costCommCourseMoney,
        costExcCourseMoney,
		newPurPeriodExtMoney,
		newSerPeriodExtMoney,

		exportSearchContent,

		loading

    } = sendRecordSheetModel;

	let classByTypeList = [
		{ type : "通用课时新增", '数量' : Number(commCourseNum.toFixed(2)), '成本' : Number(commCourseMoney.toFixed(2)) },
		{ type : "专用课时新增", '数量' : Number(excCourseNum.toFixed(2)), '成本' : Number(excCourseMoney.toFixed(2)) },
        { type : "通用课时消耗", '数量' : Number(costCommCourseNum.toFixed(2)), '成本' : Number(costCommCourseMoney.toFixed(2)) },
        { type : "专用课时消耗", '数量' : Number(costExcCourseNum.toFixed(2)), '成本' : Number(costExcCourseMoney.toFixed(2)) }
	]

	let classByTimeList = [
		{ type : "开合同时", '数量' : Number(createContractSendClass.toFixed(2)), '成本' : Number(newPurPeriodExtMoney.toFixed(2)) },
		{ type : "服务期间", '数量' : Number(afterContractSendClass.toFixed(2)), '成本' : Number(newSerPeriodExtMoney.toFixed(2)) }
	]

	/*点击生成报表*/
	function GeneratingReports( values ){
		dispatch({
			type : 'sendRecordSheetModel/generatingReports',
			payload : {
				exportSearchContent : values
			}
		})
	}

	function exportData( exportPath ){
		if( !exportSearchContent.startDate || !exportSearchContent.endDate ){
            return message.warn('请选择时间范围');
        }
		window.excelExport( exportPath, exportSearchContent )
	}

	/*按照类型导出*/
	function exportFuncByType(){
		let exportPath = '/crm/hq/statistics/seller/giveExport';
        if( !commCourseNum && !excCourseNum && !costCommCourseNum && !costExcCourseNum ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	/*按时间导出*/
	function exportFuncByTime(){
		let exportPath = '/crm/hq/statistics/seller/giveExport';
       if( !createContractSendClass && !afterContractSendClass ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	/*头部 参数*/
	let sendRecordSheetPageTopProps = {
		firstEnter,
        GeneratingReports,      //点击生成报表
		buttonLoading    : loading
	}

	/*报表主体 参数*/
	let sendRecordSheetComponnetProps = {
		classByTypeList,
		classByTimeList,
		commCourseNum,
        excCourseNum,
        costCommCourseNum,
        costExcCourseNum,
		createContractSendClass,
		afterContractSendClass,
		loading,

		exportFuncByType,
		exportFuncByTime
	}

    return (
        <div style = {{ height : '100%' }} >
			<SendRecordSheetPageTop { ...sendRecordSheetPageTopProps } />
			<SendRecordSheetComponent { ...sendRecordSheetComponnetProps } />
        </div>
  );
}


function mapStateToProps({ sendRecordSheetModel }) {
  return { sendRecordSheetModel };
}

export default connect(mapStateToProps)(SendRecordSheetPage);
