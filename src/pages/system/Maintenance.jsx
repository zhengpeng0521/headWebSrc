import React from 'react';
import { connect } from 'dva';

import MaintenanceComponent from '../../components/system/maintenance/MaintenanceComponent';

function SystemDicDataMaintenance({dispatch, maintenanceModel}) {

	let {
		dictValue, dicListSource, selectTitleIndex, untreatedDicValue, addStatus,
        showStatus,//赢率显示状态

	} = maintenanceModel;

	//原始数据处理(添加一个编辑的状态栏)
	if(dictValue&&dictValue.length > 0) {
		 dictValue = dictValue.map((item,index) => {
             item.key 		= index;
             item.editable 	= item.editable || false;
             if(item.v=='微官网') {
                item.mark = true;
             } else {
                item.mark = false;
             }
			 return item;
		});
	}

	//处理删除的数据（剔除无效状态的的数据）
	let newDictValue = [];
	let newUntreatedDictValue = [];
	if(dictValue&&dictValue.length > 0) {
		 dictValue.map((item,index) => {
			 if(item.s != 0) {
				 newDictValue.push(item);
			 } else {
				 newUntreatedDictValue.push(item);
			 }
			 dictValue 			= newDictValue;
			 untreatedDicValue 	= newUntreatedDictValue;
		});
	}
	
	function dp(methods, payload) {
		dispatch({
			type : `maintenanceModel/${methods}`,
			payload : {
				...payload,
			}
		});
	}

	//更新数据
	function callUpdataFunction(p) {
		dp('updateState', {...p});
	}

	//添加数据
	function callbaseAddFunction(p) {
		dp('saveData', {...p});
	}

	//删除数据
	function callbaceDelectFunction(p) {
		dp('saveData', {...p});
	}

	//保存数据
	function saveDataFunction(p) {
		dp('saveData', {...p});
	}

	//更新选中的title索引
	function callbackSelectTitleFunction(index,status) {
		dp('updateSelectData', {idx : index, addStatus : !addStatus ,showStatus:status});
	}

    //编辑后取消

	function callbackSelectTitleCancelFunction(index) {
        //if(showStatus=='1'){}

		dp('updateSelectData', {idx : index, addStatus : !addStatus ,showStatus:showStatus});
	}

	let props = {
		saveDataFunction,
		callUpdataFunction,
		callbackSelectTitleFunction,
        callbackSelectTitleCancelFunction,
		callbaseAddFunction,
		selectTitleIndex,
		dicListSource,
		dictValue,
		untreatedDicValue,
		callbaceDelectFunction,
		addStatus,
        showStatus,
	}

    return (
        <MaintenanceComponent {...props} />
    );
}

function mapStateToProps({ maintenanceModel }) {
  	return { maintenanceModel };
}

export default connect(mapStateToProps)(SystemDicDataMaintenance);
