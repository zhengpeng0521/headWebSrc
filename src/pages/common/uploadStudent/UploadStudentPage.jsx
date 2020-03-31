import React from 'react';
import { connect } from 'dva';

import UploadStudentComponent from '../../../components/common/uploadStudent/UploadStudentComponent';

function UploadStudentPage ({dispatch, uploadStudent,Changecolor}) {

	let {

		showModal,
		recordIndex,
		nextString,
		excelString,
		keyIndex,
		showResult,
		showResultData,
		regexDic,
		sourceData,
		targetData,
        parentTargetData,
        importParent,
		selectCampusId,
		firstStepSuccess,
		secondStepSuccess,
		thirdStepSuccess,
		lastStepSuccess,
		previewData,
		flag,
		currentId,
        uploadLoading,     //上传时加载状态

	} = uploadStudent;



	function dp(name, parameter) {
		dispatch({
			type : `uploadStudent/${name}`,
			payload : {
				...parameter
			}
		})
	}

	//console.log("lllll",Changecolor);

	let props = {
		dp,
		flag,
		showModal,
		recordIndex,
		nextString,
		excelString,
		previewData,
		keyIndex,
		showResult,
		showResultData,
		regexDic,
		sourceData,
		targetData,
        parentTargetData,
        importParent,
		selectCampusId,
		firstStepSuccess,
		secondStepSuccess,
		thirdStepSuccess,
		lastStepSuccess,
		currentId,
        Changecolor,//颜色改变
        uploadLoading,     //上传时加载状态
	}

	return (
		<UploadStudentComponent {...props} />
  	)
}

function mapStateToProps({ uploadStudent }) {
  	return { uploadStudent };
}

export default connect(mapStateToProps)(UploadStudentPage);
