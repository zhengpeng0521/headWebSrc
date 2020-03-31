import React, { PropTypes } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import ContractIncomeSheetPageTop from '../../../../components/common/report-form/report-form-top/ReportFormTop';
import ContractIncomeSheetComponent from '../../../../components/report-form/sales-report/contract-income-sheet/ContractIncomeSheet';
import { getSsToken } from '../../../../utils/getSsToken';

function ContractIncomeSheetPage({ dispatch, contractIncomeSheetModel }) {
    let {
		firstEnter,

		newSignMoney,
		oldSignMoney,
		newSignIntroMoney,
		newStuMoney,
		oldStuMoney,
		incomeByClassPackageList,
		incomeByTeachingList,
		nurseryList,
		exportSearchContent,

		loading
    } = contractIncomeSheetModel;

	/*点击生成报表*/
	function GeneratingReports( values ){
		dispatch({
			type : 'contractIncomeSheetModel/generatingReports',
			payload : {
				exportSearchContent : values
			}
		})
	}

	function exportData( exportPath, proType ){
        if( !exportSearchContent.startDate || !exportSearchContent.endDate ){
            return message.warn('请选择时间范围');
		}
		let params = {
			...exportSearchContent
		}
		if(!!proType){
			params.proType = proType;
		}
		window.excelExport( exportPath, params )
	}

	function exportFuncByType(){
		let exportPath = `/crm/hq/statistics/seller/exportSignTypeList`;
        if( !newSignMoney && !oldSignMoney ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	//按学员类型导出
	function exportFuncByStu(){
		let exportPath = `/crm/hq/statistics/seller/exportStuType`;
        if( !newStuMoney && !oldStuMoney ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	function exportFuncByPackage(){
		let proType = '1';
		let exportPath = '/crm/hq/statistics/seller/exportPeriodPackList';
        if( incomeByClassPackageList.length == '0' ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath, proType )
		}
	}

	function exportFuncByTeaching(){
		let exportPath = '/crm/hq/statistics/seller/exportTeachAidList';
        if( incomeByTeachingList.length == '0' ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath )
		}
	}

	function exportFuncByNursery(){
		let proType = '3';
		let exportPath = '/crm/hq/statistics/seller/exportPeriodPackList';
        if( nurseryList.length == '0' ){
            return message.warn('无查询结果可导出');
        }else{
			exportData( exportPath, proType )
		}
	}

	/*头部 参数*/
	let contractIncomeSheetPageTopProps = {
        GeneratingReports,      //点击生成报表

		firstEnter,
		buttonLoading    : loading
	}

	/*报表主体 参数*/
	let contractIncomeSheetComponnetProps = {
		newSignMoney,
		oldSignMoney,
		newSignIntroMoney,
		newStuMoney,
		oldStuMoney,
		incomeByClassPackageList,
		incomeByTeachingList,
		nurseryList,

		loading,

		exportFuncByType,
		exportFuncByStu,
		exportFuncByPackage,
		exportFuncByTeaching,
		exportFuncByNursery
	}

    return (
        <div style = {{ height : '100%' }} >
			<ContractIncomeSheetPageTop { ...contractIncomeSheetPageTopProps } />
			<ContractIncomeSheetComponent { ...contractIncomeSheetComponnetProps } />
        </div>
  );
}


function mapStateToProps({ contractIncomeSheetModel }) {
  return { contractIncomeSheetModel };
}

export default connect(mapStateToProps)(ContractIncomeSheetPage);
