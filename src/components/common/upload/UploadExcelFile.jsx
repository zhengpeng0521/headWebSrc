/*
 * 上传excel文件 参数
 *	state: {
 *		showModal 				: false,		// 是否显示映射modal
 *		sourceItem 				: {}, 			// 单个源数据
 *		targetItem 				: {},			// 单个目标源数据
 *		selectMapping			: {},       	// 选中的映射对象
 *		mappingResults			: [],			// 映射结果
 *		sourceData				: [], 			// 源数据（重要）
 *		targetData				: [],			// 目标源数据（重要）
 *		select_row  			: 2,			// 行数选择
 *		sourceIndex 			: -1,			// 点击的源索引
 *		targetIndex 			: -1,			// 点击的目标索引
 *		mappingIndex			: -1,			// 点击的映射结果索引
 *
 *		使用:
 *		import UploadPage from '../../../pages/common/upload/UploadPage';
 *		<UploadPage />
 *
 */

import React from 'react';
import styles from './UploadExcelFile.less';
import {Upload, Button, Icon, message, Modal, Radio, InputNumber} from 'antd';
const RadioGroup = Radio.Group;

function UploadExcelFile ({
	
	updateFunction, select_row,sourceIndex, showModal, sourceItem, selectMapping, sourceData,
	targetData, targetIndex, targetItem, mappingResults, mappingIndex, currentId, showErrorInfoFunction,
	
}) {
	
	//显示错误详情
	function showErrorInfo () {
		showErrorInfoFunction()
	}
	 
	let subProps = {
		select_row,sourceIndex, sourceItem, selectMapping, sourceData,
		targetData, targetIndex, targetItem, mappingResults, mappingIndex, updateFunction,
	}
	
	let disabledState = true;
	//获取映射元的key
	let keyArray = [];
	for(let idx in mappingResults) {
		keyArray.push(mappingResults[idx].data.target.key);
	}
	
	if(keyArray.indexOf('seller') != -1 && keyArray.indexOf('name') != -1) {
		disabledState = !disabledState;
	}

	//弹框确定
	function handleOk() {
		updateFunction('updateState', {showModal : !showModal});
	}
	
	//选择有效数据从第几行开始
	function selectRow(value) {
		updateFunction('updateState', {select_row : value});
	}
	
	//添加映射
	function onAddMapping() {

		if(sourceIndex == -1 || targetIndex == -1) {
			message.error('请选择匹配关系', 1);
			return;
		}

		let mapping = {
			'data' : {
				'source' : sourceItem,
				'target' : targetItem,
				'sourceIndex' : sourceIndex,
				'targetIndex' : targetIndex,
			}
		}
		
		//去重操作
		sourceData && sourceData.length > 0 ? sourceData.splice(sourceIndex, 1) : '';
		targetData && targetData.length > 0 ? targetData.splice(targetIndex, 1) : '';
		
		//添加一个空对象（暂时解决）
		sourceData.splice(sourceIndex, 0, {key : 100 + sourceIndex, value : ''});
		targetData.splice(targetIndex, 0, {key : 100 + targetIndex, value : ''});

		mappingResults.push(mapping);

		updateFunction('updateState', {mappingResults 	: mappingResults,
									   sourceData 		: sourceData,
									   sourceItem 		: sourceItem,
									   targetItem 		: targetItem,
									   sourceIndex 		: -1,
									   targetIndex 		: -1,
									  });
	}
	
	//删除映射结果
	function delectMapping() {

		//删除选中映射
		mappingResults.splice(mappingIndex, 1);

		//恢复去重
		sourceData.splice(selectMapping.data.sourceIndex, 0, 
						  {[selectMapping.data.sourceIndex]: selectMapping.data.source.value});
		
		targetData.splice(selectMapping.data.targetIndex, 0, selectMapping.data.target);
		
		//删除占位空对象
		sourceData && sourceData.length > 0 ? sourceData.splice(selectMapping.data.sourceIndex + 1, 1) : '';
		targetData && targetData.length > 0 ? targetData.splice(selectMapping.data.targetIndex + 1, 1) : '';
		
		updateFunction('updateState', {mappingResults 	: mappingResults,
									   sourceData 		: sourceData,
									   mappingIndex 	: -1,
									   sourceIndex 	: -1,
									   targetIndex 	: -1,
									  });
	}

	//确定按钮(上传数据并且成功后隐藏modal)
	function determineButton() {
		let tempDic = {};
		mappingResults&&mappingResults.length > 0 ? mappingResults.map(function(item, index){
			//tempArr.push({[item.data.source.key] : item.data.target.key});
			tempDic[item.data.source.key] = item.data.target.key 
		}) : '';
		
		let uploadData = {"regex" : JSON.stringify(tempDic), "id" : currentId, "validRow" : select_row.toString()};		
		updateFunction('uploadMappingData', {data : uploadData});
	}
	
	
	//取消按钮
	function cancelButton() {
		updateFunction('updateState', { 	showModal 		: !showModal,
											select_row 		: 2,
											sourceData 		: [],
											targetData 		: [],
											mappingResults 	: []
									   });
	}

	return (
        <div className="upload-base">
						
			<Modal 
				title="&nbsp;&nbsp;&nbsp;&nbsp;映射匹配" 
				visible={showModal}
				onOk={handleOk}
				onCancel={cancelButton}
				maskClosable={false}
				wrapClassName="upload-ss-modal"
				footer=""
				afterClose={showErrorInfo}
			>
				{/*有效数据从哪里开始*/}
				<div className={styles.excel_content_effective_row_div}>
					<div className={styles.excel_content_input_row_div}>
						<span>1.有效数据从第</span>
						<InputNumber 
							min={2} 
							max={100}
							defaultValue={2} 
							onChange={selectRow}
							value={select_row}
							style={{marginLeft : 10, width : 50, marginRight : 10,}}
						/>
						<span>行开始?</span>
					</div>
				</div>
				
				{/*分割线*/}
				<div className={styles.excel_content_line}></div>
				
				{/*源数据*/}
				<SourceData {...subProps}/>
				
				{/*目标数据*/}
				<TargetData {...subProps}/>
				
				{/*添加删除*/}
				<div className={styles.excel_content_delect_and_add_div}>
					<Button type="primary" style={{marginBottom: 10, width : 75}} onClick={() => onAddMapping()}>添加</Button>
					<Button style={{width : 75}} onClick={delectMapping} disabled={mappingIndex == -1 ? true : false}>删除</Button>
				</div>
				
				{/*映射数据*/}
				<MappingData {...subProps}/>
				
				{/*保存取消*/}
				<div className={styles.excel_content_button_div}>
						<Button style={{marginRight: 10, width : 75}} onClick={cancelButton}>取消</Button>
						<Button style={{width : 75}} 
							type="primary" 
							onClick={determineButton}
							disabled={disabledState}>
							确定
						</Button>
				</div>
				
			</Modal>
        </div>
    );
}

/*
 * 源数据
 */
function SourceData({
	sourceItem,sourceIndex,sourceData,updateFunction,
}) {
	
	function touchCurrentItem (item, index) {
		updateFunction('updateState', {sourceIndex : index, sourceItem: item});
	}
	let layouArr = [];
	let layout = (
		sourceData&&sourceData.length > 0 ? sourceData.map(function(item, index){
						
			let name = index;
			let newItem = {
				key : index,
				value : item[name],
			}
			let item_name = index == sourceIndex ? styles.item_select_div : styles.item_no_select_div;
			if(item.key >= 100) {item_name = styles.item_hidden_div;}
			return layouArr.push(
				<p key={index} className={item_name} onClick={()=>touchCurrentItem(newItem, index)}>{item[name]}</p>
			)
		}) : ''
	)
	
	return (
		<div className="source_base">
			<p className={styles.title}>源字段</p>
			<div className="target_base">
				<div className={styles.base_content_div}>
					{layouArr}
				</div>
			</div>
		</div>
	)
}

/*
 * 目标数据
 */
function TargetData({
	targetItem, targetIndex,targetData,updateFunction,
}) {

	function touchCurrentItem (item, index) {
		updateFunction('updateState', {targetIndex : index, targetItem: item});
	}

	let layouArr = [];
	let layout = (
		targetData&&targetData.length > 0 ? targetData.map(function(item,index){
			let name = index;
			let item_name = index == targetIndex ? styles.item_select_div : styles.item_no_select_div;
			if(item.key >= 100) {item_name = styles.item_hidden_div;}
			return layouArr.push(
				<p key={index} className={item_name} onClick={()=>touchCurrentItem(item, index)}>
					{item.value}
					{(item.key === 'seller' || item.key === 'name') ? <string style={{color : 'red'}}>(必填)</string> : ''}
				</p>
				
			)
		}) : ''
	)
	
	return (
		<div className="source_base">
			<p className={styles.title}>目标源字段</p>
			<div className="target_base">
				<div className={styles.base_content_div}>
					{layouArr}
				</div>
			</div>
		</div>
	)
}

/*
 * 映射数据
 */
function MappingData({
	updateFunction, mappingResults, mappingIndex, selectMapping,
}) {

	//选中映射结果
	function delectMapping(item, index) {
		updateFunction('updateState', {mappingIndex : index, selectMapping : item});
	}
	
	let dataArr = [];
	let data = (
		mappingResults&&mappingResults.length > 0 ? mappingResults.map(function(item,index){
			let item_name = index == mappingIndex ? styles.mapping_item_select_div : styles.mapping_item_no_select_div;
			return dataArr.push(
				<p  key={index} 
					className={item_name} 
					onClick={()=>delectMapping(item, index)}>
					{item.data.source.value} —> {item.data.target.value}
				</p>
			)
		}) : ''
	)

	return (
		<div className="mapping_base">
			<p className={styles.title}>映射</p>
			<div className="mapping_base_content">
				<div className={styles.base_content_div}>
					{dataArr}
				</div>
			</div>
		</div>
	)
}

export default UploadExcelFile;
