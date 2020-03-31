import * as services from '../../../services/index/common/uploadExcelService'; //这种写法是把所有的输出包裹到obj对象里
import { parse } from 'qs';
import {message} from 'antd';
export default {
 
  	namespace: 'upload',

  	state: {
		showModal 				: false,		// 是否显示映射modal
		showUploadModal			: false,		// 显示上传modal
		showHistoryModel 		: false,		// 显示历史记录modal
		haveChosenCampus		: false, 		// 是否选择了校区
		sourceItem 				: {}, 			// 单个源数据
		targetItem 				: {},			// 打个目标数据源
		selectMapping			: {},       	// 当前选中的映射对象
		mappingResults			: [],			// 映射结果
		selectOrgId				: 0,			// 当前选择的校区
		currentId				: 0,			// 当前点击的id
		pageIndex 				: 0,			// 分页
	  	pageSize 				: 99999,		// 页码
		select_row  			: 2,			// 行数选择
		sourceIndex 			: -1,			// 目标字段
		targetIndex 			: -1,			// 目标索引
		mappingIndex			: -1,			// 映射结果索引
		sourceData				: [], 			// 源数据
		targetData			 	: [], 			// 目标数据
		historyRecordList		: [],			// 历史记录数组
		failMessage				: [],			// 记录失败原因
		studentAccount			: 0,			// 学员账户
  	},

  	effects: {
		
		//获取历史上传列表
		*getUploadStuExcelList({payload}, {select, call, put}) {
			let model = yield select(state => (state.upload))
			let params = {
				pageSize 	: model.pageSize,
				pageIndex 	: model.pageIndex,
			}
			let { ret } = yield call(services.getUploadStuExcelList, parse(params));
			if(ret && ret.errorCode == 9000){
				yield put({
					type : 'updateState',
					payload : {
						historyRecordList	: ret.results || [],
						showHistoryModel	: payload.showHistoryModel || true,
					}
				});
			} else {
				message.error((ret && ret.errorMessage) || '获取上传列表失败')
			}
	  	},
			
		//获取源数据
		*getSourceData({payload}, {put, call, select}) {
			const {ret, err} = yield call(services.getSourceData, parse(payload));
			if(ret.errorCode == 9000) {
				yield put({
				  	type : 'updateState',
				  	payload : {
						currentId  : payload.id,
						filePath   : payload.fp,
					  	showModal  : true, 
					  	sourceData : ret.data.sourceFields,
						targetData : ret.data.dataModelFields,
				  	}
			  	})
			} else {
				message.error((ret && ret.errorMessage) || '获取源数据失败');
			}
		},

		//上传映射数据
		*uploadMappingData({payload}, {put, call, select}) {
			const {ret, err} = yield call(services.uploadMappingData, parse(payload.data));
			if(ret.errorCode == 9000) {
				yield put({
					type : 'updateState',
				  	payload : {
						failMessage 	: ret.data.messages,
						showModal 		: false, 
						select_row 		: 2,
						sourceData 		: [],
						targetData 		: [],
						mappingResults 	: [],
				  	}
				})
				message.success(`上传成功${ret.data.sucNum}条, 失败${ret.data.failNum}条`);
			} else {
				message.error((ret && ret.errorMessage) || '上传失败');
			}
		},
			
  	},

  	reducers: {
	  	updateState(state, action) {return {...state, ...action.payload};},
  	},
}
