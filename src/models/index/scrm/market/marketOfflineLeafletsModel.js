import * as service from '../../../../services/scrm/market/marketOfflintLeafletsService/marketOfflintLeafletsService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	
	namespace : 'marketOfflineLeaflets',
	
	state : {
   
		attrInsId				: undefined,
		attrDefId 				: undefined,
		attrOrgId 				: undefined,
		attrQrInputString 		: undefined, 
		attrVisible				: false,
		attrLeafletsListSource 	: [],
		arrrLeafletsListPage 	: {},
		attrPageSize 			: Math.ceil(document.body.clientWidth / 200),
		attrPageIndex 			: 0,
		attrDefaultTitle 		: '',
		attrDefaultContent 		: '',
		attrPageModal			: false,
		attrPageMode			: 'baseSet',
		attrConfigData			: undefined,
		attrSelectElement 		: undefined,
		attrOriginConfigData	: undefined,
		attrRadioValue			: 'select',
		attrActivityList		: [],
		attrUserList			: [],
		attrQrCodeStatus 		: false,
		attrDomain 				: undefined,
		attrShowDownLoad 		: false,
		attrDownload			: 1,
		attrDownloadString		: '下载传单',
		attrSource				: true,
		attrHiddenEdit			: false,
		attrInstData			: {},
		attrQrImages			: {},
		attrReturnQrurl			: {},
		attrLoding 				: false,
		attrEditElementText		: false,
		attrLoadNextPage		: false,
		attrAligntext 			: [	{title : '上对齐', value : 'font-align-top', selectStatus : false},
								   	{title : '垂直居中',value : 'font-align-center-v', selectStatus : false},
									{title : '下对齐',	value : 'font-align-bottom', selectStatus : false},
									{title : '左对齐', value : 'font-align-left', selectStatus : false},
									{title : '水平居中',value : 'font-align-center', selectStatus : false},
									{title : '右对齐', value : 'font-align-right', selectStatus : false},
									{title : '加粗', value : 'jiacu', selectStatus : false},
									{title : '倾斜', value : 'qingxie', selectStatus : false},
									{title : '下划线', value : 'xiahuaxian', selectStatus : false}
								  ],
		attrStyleText 			: [],
		attrStyleLetterSpacing 	: [],

	},

    subscriptions : {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {
                if(pathname == '/scrm_offline_leaflets') {				
					let orgId = window._init_data&&window._init_data.firstOrg&&window._init_data.firstOrg.key || undefined;
					dispatch({
						type : 'updateState',
						payload : {
							attrSource : false,
							attrHiddenEdit : false,
							attrLeafletsListSource : [],
							attrOrgId 	: orgId,
							attrPageIndex : 0,
							attrPageModal : false,
						}
				   	})
					dispatch({
						type : 'queryLeafletsList',
						payload : {
							attrOrgId 	: orgId,
						}
					})
					dispatch({
						type : 'getActivityList',
						payload : {
							attrOrgId 	: orgId,
						}
					})
					dispatch({
						type : 'getDataInit',
				   	})
				}
            });
        },
    },

	effects : {
	
		//获取域名
		*getDataInit({ payload }, {call, put, select}) {
			
			let { ret } = yield call(service.getDataInit);
			
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						attrDomain : ret&&ret.data.h5Url || undefined,
					}
				})
		   } else {
                message.error( ret && ret.errorMessage || '获取域名失败')
           }	
		},
			
		//获取传单列表
		*queryLeafletsList({ payload }, {call, put, select}) {
						
			let model = yield select(state => state.marketOfflineLeaflets);
			
			if(payload.attrOrgId != undefined || model.attrOrgId != undefined) {
				let param = {
					pageSize 	: payload.attrPageSize * 2 || model.attrPageSize * 2,
					pageIndex 	: payload.attrPageIndex != undefined ? payload.attrPageIndex : model.attrPageIndex,
					orgId 		: payload.attrOrgId || model.attrOrgId,
				}

				let { ret } = yield call(service.getLeafletsList, parse(param));

				if( ret && ret.errorCode == 9000 ){

					let tempArr = [];
									
					if(model.attrLeafletsListSource.length > 0) {
					   tempArr = model.attrLeafletsListSource;
					}
					
					if(tempArr.length < ret.data.resultCount) {
						ret&&ret.results.map((item, index) => {
							tempArr.push(item) 
						});
					} 
										
					yield put({
						type : 'updateState',
						payload : {
							...param,
							attrOrgId : payload.attrOrgId,
							attrLeafletsListSource : tempArr || [],
							arrrLeafletsListPage : ret&&ret.data || {},
							attrPageIndex : param.pageIndex,
							attrPageSize : param.pageSize / 2,
							attrLoadNextPage : false,
						}
					})
			   } else {
					message.error( ret && ret.errorMessage || '获取模板列表失败')
			   }	
			}
		},
			
		//获取配置信息
		*getInstMsg({ payload }, {call, put, select}) {
						
			let model = yield select(state => state.marketOfflineLeaflets);
					
			let param = {
				orgId : payload.attrOrgId || model.attrOrgId,
				id : payload.id || undefined,
				defId : payload.defId || undefined,	
			}
			
			if(payload.source === "offlineLeaflets") {
			   yield put({
					type : 'getUserList',
					payload : {
						attrOrgId : payload.attrOrgId,
						activityId : payload.activityId,
					}
				})
				 yield put({
					type : 'getDataInit',
					payload : {
						orgId : param.attrOrgId,
						activityId : payload.activityId,
					}
				})
				yield put({
					type : 'getActivityList',
					payload : {
						attrOrgId : payload.attrOrgId,
					}
				})
			}

			let { ret } = yield call(service.getInstMsg, parse(param));

			if( ret && ret.errorCode === 9000 ){
//				//更新菜单项
//				yield put({
//					type: 'leftMenuModel/updateState',
//					payload: {
//						menuType: 'vertical',
//					}
//				});
//				yield put({
//          		type: 'commonLayoutModel/updateState',
//          		payload: {
//              		collapsed: true,
//          		}
//      		});
								
				yield put({
					type : 'updateState',
					payload : {
						attrDefId	: param.defId,
						attrPageModal: payload.attrPageModal != undefined ? payload.attrPageModal : false,
						attrShowDownLoad : payload.attrShowDownLoad != undefined ? payload.attrShowDownLoad : false,
						attrConfigData : ret&&ret.detailData.length > 0 ? JSON.parse(ret.detailData) : {},
						attrOriginConfigData : ret&&ret.detailData.length > 0 ? JSON.parse(ret.detailData) : {},
						attrInstData : ret&&ret,
						attrOrgId :  param.orgId,
						attrHiddenEdit : payload.attrHiddenEdit || false,	
						attrReturnQrurl : undefined,
						attrRadioValue : 'select',
					}
				})
											
				if(payload.attrPageModal) {
					yield put({
						type: 'countDownMs/startCountDownRequest',
						payload: {							
							attrTotalTime 		: 600000,
							attrDelay 			: 1000,
							attrIsStart 		: true,
							attrSourceNamespace : 'marketOfflineLeaflets',
							attrSourceMethods 	: 'getDataInit',
						}
					});
				}

		   } else {
				message.error( ret && ret.errorMessage || '获取模板列表失败')
		   }	
		},
			
		//图片上传
		*uploadImage({payload}, { call, put, select }) {
					
			let model = yield select(state => state.marketOfflineLeaflets);
			
			let behindOrFront = model.attrConfigData.mainConfig.attrFrontAndBehind;
						
			let ret = yield call(service.uploadImageMethods, payload.file);
				
			let itemArr = behindOrFront == 'front' ? model.attrConfigData.frontPageConfig.itemConfig : model.attrConfigData.behindPageConfig.itemConfig;
				
			let timeStamp = String(new Date().getTime());
										
			if(ret&&ret.errorCode == 9000) {
				
				itemArr&&itemArr.length>0&&itemArr.map((item, index) => {
					if(index === model.attrSelectElement.index) {
						itemArr[index].item.backgroundImage = ret.data.url;
					}
				})
										
				if(behindOrFront === 'front') {
					model.attrConfigData.frontPageConfig.itemConfig = itemArr;
				} else {
					model.attrConfigData.behindPageConfig.itemConfig = itemArr;
				}
				
				yield put({
					type: 'updateState',
					payload: {
						attrConfigData: model.attrConfigData,
					}
				});
			} else {
				message.error(ret && ret.errorMessage || '上传图片失败');
			}
		},

		//获取活动列表
		*getActivityList({payload}, { call, put, select }) {
			
			let param = {
				orgId : payload.attrOrgId,
				type : '1',
			}
			
			if(payload.attrOrgId != undefined) {
				let {ret} = yield call(service.getActivityList, parse(param));

				if(ret.errorCode == 9000) {

					yield put({
						type: 'updateState',
						payload: {
							attrActivityList: ret&&ret.list
						}
					});
				} else {
					message.error(ret && ret.errorMessage || '活动列表失败');
				}
			}
		},
		
		//获取人员列表
		*getUserList({payload}, { call, put, select }) {
			
			let model = yield select(state => state.marketOfflineLeaflets);

			let param = {
				orgId : payload.attrOrgId || model.attrOrgId,
				activityId : payload.activityId,
			}
			
			if(payload.activityId != undefined) {
				
				let {ret} = yield call(service.getUserLink, parse(param));
				if(ret.errorCode == 9000) {
					yield put({
						type: 'updateState',
						payload: {
							attrUserList: ret&&ret.members,
						}
					});
				} else {
					message.error(ret && ret.errorMessage || '活动列表失败');
				}
			}
		},		

		//保存实例
		*saveData({payload}, { call, put, select }) {

			let param = {
				orgId 	: payload.data.fromData.form_org_id,
				id 		: payload.data.id,
				detailData : payload.data.allConfig,
				name 	: payload.data.fromData.form_leaflets_name,
				type 	:  payload.data.type,
				marketId : payload.data.marketId,
				defId 	: payload.data.defId,
				index1 	: payload.data.index1,
				index2 	: payload.data.index2,
			}
			
			let {ret} = yield call(service.saveData, parse(param));

			if(ret.errorCode == 9000) {

				let data = JSON.parse(ret&&ret.data);

				yield put({
					type: 'updateState',
					payload: {
						attrShowDownLoad : true,
						attrInsId: data.id || undefined, 
						attrReturnQrurl : data,	//后台返回image
					}
				});
				message.success(ret && ret.errorMessage || '成功');
			} else {
				message.error(ret && ret.errorMessage || '活动列表失败');
			}
			
			yield put({
				type: 'updateState',
				payload: {
					attrLoding : false,
				}
			});
		},
    },
		
	reducers : {
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
