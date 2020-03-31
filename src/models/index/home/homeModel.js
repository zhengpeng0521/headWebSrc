import * as services from '../../../services/erp/home/homeService'; //这种写法是把所有的输出包裹到obj对象里
import * as uploadExcelServices from '../../../services/index/common/uploadExcelService'; //这种写法是把所有的输出包裹到obj对象里
import { parse } from 'qs';
import {message} from 'antd';
export default {
 
  namespace: 'homeModel',

  state: {
		namespace				: 'homeModel',	//
		showModal 				: false,		// 是否显示映射modal
		sourceItem 				: {}, 			// 单个源数据
		targetItem 				: {},			// 打个目标数据源
		selectMapping			: {},       	// 当前选中的映射对象
		mappingResults			: [],			// 映射结果
		select_row  			: 1,			// 行数选择
		sourceIndex 			: -1,			// 目标字段
		targetIndex 			: -1,			// 目标索引
		mappingIndex			: -1,			// 映射结果索引
		sourceData				: [], 			// 源数据
		targetData			 	: [], 			// 目标数据
  },

  effects: {

	  	//获取首页数据
		*getHomeData({payload}, {select, call, put}) {
		  	const { ret, err } = yield call(services.homeData);
		  	yield put({
			  	type:'updateState',
			  	payload : {

			  	}
		  	})
		},

  },

  reducers: {
	  updateState(state, action) {return {...state, ...action.payload};},
  },
}
