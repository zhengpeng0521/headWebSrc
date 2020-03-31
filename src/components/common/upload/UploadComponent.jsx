import React from 'react';
import {Upload, message, Button, Icon, Modal, notification} from 'antd';
import styles from './UploadComponent.less';
import UploadMain from './UploadExcelFile';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';

function UploadComponent ({
	
	historyFunction,
	showHistoryModel,
	showUploadModal,
	historyRecordList,
	showHistoryModalFunction,
	hideHistoryModalFunction,
	updateOrgIdFunction,
	uploadStateFunction,
	importExcelFunction,
	updataFunction,
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
	
}) {
	
	//历史记录
	function historyTouch() {
		historyFunction()	
	}
	
	//隐藏弹框
	function importCancel() {
		hideHistoryModalFunction()
	}
	
	//显示弹框
	function importOk() {
		showHistoryModalFunction()
	}
	
	//导入表格
	function importExcel(item) {
		importExcelFunction({'id' : item.id, fp : item.filePath})
	}
	
	//取消上传mdal
	function uploadCancel() {
		uploadStateFunction();
	}
	
	//打开上传modal
	function uploadTouch() {
		uploadStateFunction();
	}
	
	//选择校区
	function currentSelectCampus(id) {
		updateOrgIdFunction(id)
	}

	//上传文件
	const props = {
		name	: 'file',
		action	: `${BASE_URL}/upload/uploadExcel`,
		accept 	: '.xlsx' || '.xls',
		data 	: {
			 orgId : selectOrgId,
		},
		showUploadList : false,
		onChange(info) {
			message.warning(`正在上传`);
			updataFunction({haveChosenCampus : false});
			if (info.file.status !== 'uploading') {
				if(info.file.response.errorCode != 9000) {
					updataFunction({haveChosenCampus : true});
					return message.error(info.file.response.errorMessage);
				}
    		}
			
			if (info.file.status === 'done') {
				uploadStateFunction();
			  	message.success(`上传成功`);
			} else if (info.file.status === 'error') {
			  	message.error(`上传失败`);
			}
		},
	};
	
	//下载文件
	function downloadFileFunction(id) {
		window.open(`${BASE_URL}/download/downloadByFileSys?id=${id}`)
	}
	
	//下载模板
	function downloadTemplate() {
		window.open(`${BASE_URL}/download/downloadStuInfoModel?type=1`)
	}
	
	//更新属性
	function updateFunction(name, paramter) {
		dp(name, paramter)
	}
	
	let mainProps = {
		showModal,
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
		updateFunction,
		currentId,
		showErrorInfoFunction,
	}
	
	function showErrorInfoFunction() {	
		if(failMessage.length > 0) {
			openNotification();
		}
	}
  
	function openNotification() {
		
		let string = '';
		for(let val of failMessage) {
			string += val; 
		}

	  	const args = {
			message: '失败条数错误原因',
			description: <p style={{color : 'red', width : '73%'}}>{string}</p>,
			duration: 0,
	  	};
		notification.open(args);
	};

	//数据处理
	let content = (
		
		historyRecordList&&historyRecordList.length>0&&historyRecordList.map((item, index) => {
			return  <div key={index} className={styles.fileDiv}>
						<p className={styles.fileNameStyle}>{item.fileName}&nbsp;&nbsp;&nbsp;&nbsp;</p>
						<p className={styles.fileNameStyle}>{item.fileName}上传时间：{item.createTime}</p>
						<div className={styles.del_add}>
							<a onClick={() => importExcel(item)}>导入</a>
							&nbsp;&nbsp;
							<a onClick={() => downloadFileFunction(item.id)}>下载</a>
						</div>
					</div>
		})
	)
		
//					<Button type="primary" onClick={historyTouch}><Icon type="cloud-download-o" />上传历史</Button>
//				<Button type="primary" onClick={uploadTouch} style={{marginLeft: 10}}><Icon type="cloud-upload-o" />导入学员</Button>
//				<Button type="primary" style={{marginLeft : 10}} onClick={downloadTemplate}><Icon type="cloud-download-o" />模板下载</Button>
//				<Button type="primary" style={{marginLeft : 10}} onClick={downloadTemplate}>模板下载</Button>
	return (
		<div>
			<div className={styles.btnDiv}>
				<Button type="primary" onClick={historyTouch}>上传历史</Button>
				<Button type="primary" onClick={uploadTouch} style={{marginLeft: 10}}>导入学员</Button>
			</div>
			<Modal
				width={550}
				title="导入学员"
				visible={showUploadModal}
				onCancel={() => uploadCancel()}
				maskClosable={false}
				footer={null}
			>
				<div style={{float : 'left'}}>
					<TenantOrgSelect width="425px" onChange={currentSelectCampus} value={selectOrgId} />		
				</div>
				<Upload {...props}>
					<Button disabled={!haveChosenCampus} type="primary"  style={{marginLeft: 10}}>选择文件
					</Button>
				</Upload>
			</Modal>
			<Modal
				width={550}
				title="导入历史"
				visible={showHistoryModel}
				onCancel={() => importCancel()}
				onOk={() => importOk()}
				maskClosable={false}
				okText="确定"
				wrapClassName="history_ecord_modal"
				style={{height: 700}}
			>
				<div className={styles.packaging}>
					{content}
				</div>
			</Modal>
			<UploadMain {...mainProps} />
		</div>
    );
}

export default UploadComponent;
