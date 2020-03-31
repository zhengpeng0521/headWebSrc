import React from 'react';
import { connect } from 'dva';

import UploadComponent from '../../../components/common/upload/UploadComponent';

function Upload ({dispatch, upload}) {

	let {
		showHistoryModel,
		showUploadModal,
		historyRecordList,
		showModal,
		sourceItem,
		targetItem,
		selectMapping,
		mappingResults,
		select_row,
		selectOrgId,
		haveChosenCampus,
		sourceIndex,
		targetIndex,
		mappingIndex,
		sourceData,
		targetData,
		currentId,
		failMessage,
		
	} = upload;

	function dp(name, parameter) {
		dispatch({
			type : `upload/${name}`,
			payload : {
				...parameter
			}
		})
	}
	
	//历史记录
	function historyFunction() {
		dp('getUploadStuExcelList', {showHistoryModel : !showHistoryModel})
	}
	
	//显示弹框
	function showHistoryModalFunction() {
		dp('updateState', {showHistoryModel : !showHistoryModel})
	}
	
	//隐藏弹框
	function hideHistoryModalFunction() {
		dp('updateState', {showHistoryModel : !showHistoryModel})
	}
	
	//上传表格数据(获取源数据和目标数据)
	function importExcelFunction(paramter) {
		dp('getSourceData', {...paramter})
	}
	
	//上传弹框显隐
	function uploadStateFunction(paramter) {
		dp('updateState', {
			showUploadModal : !showUploadModal,
			haveChosenCampus: false, 
			selectOrgId		: undefined,
		})
	}
	
	//更新校区和选中属性
	function updateOrgIdFunction(id) {
		dp('updateState', {selectOrgId : id, haveChosenCampus : true})
	}
	
	//更新属性
	function updataFunction(paramter) {
		dp('updateState', {...paramter})
	}

	let props = {
		historyFunction,
		showHistoryModel,
		showUploadModal,
		showHistoryModalFunction,
		hideHistoryModalFunction,
		updateOrgIdFunction,
		uploadStateFunction,
		importExcelFunction,
		updataFunction,
		historyRecordList,
		showModal,
		selectOrgId,
		haveChosenCampus,
		sourceItem,
		targetItem,
		selectMapping,
		mappingResults,
		select_row,
		sourceIndex,
		targetIndex,
		mappingIndex,
		sourceData,
		targetData,
		currentId,
		failMessage,
		dp,
	}
	
	return (
		<UploadComponent {...props} />
  	)
}

function mapStateToProps({ upload }) {
  	return { upload };
}

export default connect(mapStateToProps)(Upload);
