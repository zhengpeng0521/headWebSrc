import * as service from '../../../../services/scrm/market/market-activity/marketActivityService';
import { parse } from 'qs';
import qs from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';

export default {
	
	namespace : 'marketModel',

	state : {
   
		mode : 'top',
		subMode : '1',
		showAddActivityModal : false,
		showCreateQRModal : false,
		showAnalysisModal : false,
        showSearch : false,		
		pageIndex : 0,
		pageSize : 10,
		dayValue : 7,
		drawingData : {},
		orgId : undefined,
		tenementId : undefined,
		analysisPageData : {},
		analysisDataSource : [],
		salesStaffDataSource : [],			//采单人员信息
		gatheringPlaceDataSource : [],		//收集地点数据
		collectInformationDataSource : [],  //收集信息数据
		selectedRowKeys : [],
		itemDataSource : {},
		editStatus : false,
		analysisPageTopData : {},
		itemId : undefined,
		domain : undefined,
		qrData : [],
		draw_members: {},
		saveButtonDsiabled : false,
		paginationSource : {},
		dataSource : [],
		drawingDataCount : 0,
		analysisPageSize : 10,
		analysisPageIndex : 0,
		disabledCreateQrBtn : false,
		currentActCreateTime : undefined,
		dayValueSelect : 10000,
		orgIdsArr : '',
		showSelectModal : false, //校区选择组件
		fromOfflineLeafletsControl : false, //进来
	},

    subscriptions : {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {
                if(pathname == '/scrm_market_activity') {
					
					// let orgId = window._init_data&&window._init_data.firstOrg&&window._init_data.firstOrg.key || undefined;
					// dispatch({
					// 	type : 'updateState',
					// 	payload : {
					// 		orgIdsArr : orgId,
					// 	}
					// })
					
					dispatch({
						type : 'getDataInit',
				   	})
					
					// if(orgId != undefined) {
						dispatch({
							type : 'getMarketList',
							// payload : {
								//orgId : orgId,
							// }
						})
					// }
					
					// dispatch({
					// 	type : 'summaryQuery',
				   	// })
						
					// dispatch({
					// 	type : 'getCollectAddress',
				   	// })
							
					dispatch({
						type : 'defaultFormConfig',
				   	})
					
					//此发起是为了更新显隐状态，因为我在线下传单界面用了此界面的page界面，因为component界面并不是一个组件组成，而我只需要用到其中一个组件所以隐藏了其他的，请看component操作
					dispatch({
						type: 'updateState',
						payload: {
							fromOfflineLeafletsControl : false,
						}
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
						domain : ret&&ret.data.h5Url || undefined,
					}
				})
		   } else {
                message.error( ret && ret.errorMessage || '获取域名失败')
           }	
		},
		
		//收集人员信息
		*summaryQuery({ payload }, {call, put, select}) {
			
			let model = yield select(state => state.marketModel);
						
			let param = {
				orgId: payload && payload.orgId || model.orgId,
			}
			
			let { ret } = yield call(service.summaryQuery, parse(param));

			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						orgIdsArr: param.orgId,
						salesStaffDataSource : ret&&ret.results || [],
						// showSearch: payload && payload.showSearch,
					}
				})
		   } else {
				yield put({
					type: 'updateState',
					payload: {
						// showSearch: payload && payload.showSearch,
					}
				})
                message.error( ret && ret.errorMessage || '获取员工列表失败')
           }	
		},
					
		//收集地点列表
		*getCollectAddress({ payload }, {call, put, select}) {
			
			let model = yield select(state => state.marketModel);
			
			let param = {
				dictkey : 'secondChannel',
				orgId : payload.orgId || '',
			}
			let { ret } = yield call(service.getdictkey, parse(param));
			
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						gatheringPlaceDataSource : ret&&ret.list || [],
					}
				})
		   } else {
                message.error( ret && ret.errorMessage || '获取收集地点失败')
           }	
		},
			
		//新增数据(同时获取收集配置项)
		*defaultFormConfig({ payload }, {call, put, select}) {
			
			let model = yield select(state => state.marketModel);
			
			let { ret } = yield call(service.defaultFormConfig);
			
			if( ret && ret.errorCode == 9000 ){

				yield put({
					type : 'updateState',
					payload : {
						collectInformationDataSource : JSON.parse(ret&&ret.results.base_form) || [],
					}
				})
		   } else {
                message.error( ret && ret.errorMessage || '获取配置项失败')
           }	
		},
			
		//获得列表数据
		*getMarketList({ payload }, { call, put, select }){

			let model = yield select(state => state.marketModel);
			let param = {};
			if(payload&&payload.param != undefined) {
			   param = payload.param;
			}

			let paramter = {
				orgId : payload&&payload.orgId || model.orgId,
				pageSize : model.pageSize || 10,
				pageIndex : model.pageIndex || 0,
				...param,
			}

            let { ret } = yield call(service.getActivity, parse(paramter));
			
            if( ret && ret.errorCode == 9000 ){

                yield put({
                    type : 'updateState',
                    payload : {
                      	paginationSource : ret.data,
						dataSource : ret&&ret.results || [],
                    }
                })
            } else {
                message.error( ret && ret.errorMessage || '获取列表数据失败')
            }
        },
			
		//删除数据
		*delectItem({ payload }, { call, put, select }){ 
			
			let model = yield select(state => state.marketModel);

			let parma = {
				status : 0,
				orgId : model.orgId || undefined,
				activityId : payload.activityId || undefined,
			}
			
			let { ret } = yield call(service.delectActivityItem, parse(parma));
			
			if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'getMarketList',
                })
				message.success('删除成功', 1);
            } else {
                message.error( ret && ret.errorMessage || '删除数据失败')
            }			
		},
					
		//批量删除
		*batchDelect({ payload }, { call, put, select }){ 
			
			let model = yield select(state => state.marketModel);

			let parma = {
				status : 0,
				orgId : model.orgId || undefined,
				activityIds : payload.ids || undefined,
			}
			
			let { ret } = yield call(service.batchDelect, parse(parma));
			
			if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'getMarketList',
                })
				
				yield put({
                    type : 'updateState',
					 payload: {
						 selectedRowKeys : [],
					 }
                })

				message.success('删除成功', 1);
            } else {
                message.error( ret && ret.errorMessage || '删除数据失败')
            }			
		},

		//分页数据
		*getPageIndexData({ payload },{ call, put, select }){
			
			let model = yield select(state => state.marketModel);
			
			let paramter = {
				orgId : model.orgId || payload.orgId,
				pageSize : payload.pageSize || model.pageSize,
				pageIndex : payload.pageIndex != undefined ? payload.pageIndex : model.pageIndex,
			}

			let { ret } = yield call(service.getActivity, parse(paramter));

			if( ret && ret.errorCode == 9000 ){

				yield put({
					type : 'updateState',
					payload : {
						pageSize : payload.pageSize || model.pageSize,
						pageIndex : payload.pageIndex != undefined ? payload.pageIndex : model.pageIndex,
						paginationSource : ret.data || {},
						dataSource : ret.results || [],
					}
				})
			} else {
			   message.error( ret && ret.errorMessage || '获取列表数据失败')
			}
		},
		
		//创建活动
		*createOrUpdate({payload}, {call, put, select}) {
			
			let model = yield select(state => state.marketModel);
			
			payload.param.orgId = model.orgId || undefined;
			
			let {ret} = yield call(service.createOrUpdate, parse(payload.param));
			
			yield put({type : 'updateState', payload : {saveButtonDsiabled : true,}})

			if( ret && ret.errorCode == 9000 ){

				if(payload.editStatus != undefined) {
				   yield put({
						type : 'updateState',
						payload : {
							showAddActivityModal : payload.showAddActivityModal || false,
							saveButtonDsiabled : false,

						}
					})

					yield put({type : 'updateState', payload : {editStatus : payload.editStatus,}})

					yield put({type : 'getMarketList'})

				} else {
					yield put({
						type : 'updateState',
						payload : {
							showAddActivityModal : payload.showAddActivityModal || false,
							orgIdsArr : '',
						}
					})
					yield put({type : 'getMarketList'})
					yield put({type : 'defaultFormConfig'})
					yield put({
						type : 'getQrCodeData',
						payload : {
							orgId : ret&&ret.orgId,
							tenantId : ret&&ret.tenantId,
							tenementId : ret&&ret.tenantId,
							activityId : ret&&ret.activityId,
							showCreateQRModal : payload.showCreateQRModal,
						}
					})
				}
            } else {
				yield put({type : 'updateState', payload : {disabledCreateQrBtn : false, saveButtonDsiabled : false}});
				message.error(ret && ret.message || '保存数据失败')
            }			
		},
			
		//获取二维码接口
		*getQrCodeData({payload}, {call, put, select}) {

			let model = yield select(state => state.marketModel);
						
			let param = {
				orgId : payload&&payload.orgId || model.orgId,
				tenantId : payload&&payload.tenantId || model.tenantId,
				activityId : payload&&payload.activityId || undefined,
			}
						
			let {ret} = yield call(service.getQrLink, parse(param));
			if(ret && ret.errorCode == 9000) {
				yield put({
					type : 'updateState',
					payload : {
						qrData : ret.members || [],
						showCreateQRModal : payload&&payload.showCreateQRModal,
					}
				})
			} else {
				 message.error( ret && ret.errorMessage || '获取二维码失败')
			}
		},
			
		//查询数据
		*selectItemData({payload}, {call, put, select}) {
			
			let param = {
				activityId : payload.record.id || undefined,
				orgId : payload.record.orgId || undefined,
				tenantId: payload.record.tenantId || undefined,
			}
						
			let { ret } = yield call(service.queryDetail, parse(param));
			
			if( ret && ret.errorCode == 9000 ){	
				
				let pageLogo = [];
				if(ret.pageLogo && ret.pageLogo.length > 0) {
					pageLogo.push({
						uid: -1,
						status: 'done',
						url: ret.pageLogo,
						response: {
							errorCode: 9000,
							data: {
								url: ret.pageLogo
							}
						}
					});
				}
				
				ret.pageLogo = pageLogo;
				
				yield put({
					type : 'updateState',
					payload : {
						itemDataSource : ret || {},
						showAddActivityModal : payload.showAddActivityModal || true,
						editStatus : payload.editStatus || true,
						orgIdsArr: ret.orgIds || '',
						// orgIdsArr: ret.orgIds && ret.orgIds.split(',') || [],
					}
				})
			} else {
				 message.error( ret && ret.errorMessage || '查询单条数据失败')
			}	
		},
			
		//请求分析Top数据
		*getAnalysisData({payload}, {call, put, select}) {

			let model = yield select(state => state.marketModel);
								
			//来源于线下传单界面数据，因为共用了次数据分析界面
			if(payload.source != undefined && payload.source === 'offlineLeaflets') {
				yield put({
					type : 'summaryQuery',
					payload : {
						orgId : payload.orgId,
					}
				})
				yield put({
					type : 'getCollectAddress',
				})
			}
			
			let param = {
				// orgId : payload&&payload.orgId || model.orgId,
				activityId : payload&&payload.actId || undefined,
				tenantId: payload && payload.tenantId || model.tenantId,
			}
						
			let { ret } = yield call(service.overviewDataQuery, parse(param));
			
			if( ret && ret.errorCode == 9000 ){		
				yield put({
					type : 'updateState',
					payload : {
						// orgId : payload&&payload.orgId || model.orgId,
						analysisPageTopData : ret&&ret,
						itemId : payload&&payload.actId,
						showAnalysisModal : payload.showAnalysisModal,
						currentActCreateTime : payload.createTime,
//						fromOfflineLeafletsControl : payload.fromOfflineLeafletsControl || false,
					}
				})
				
				yield put({
					type : 'viewDataByDayQuery',
					payload : {
						...param
					}
				})
				
			} else {
				 message.error( ret && ret.errorMessage || '获取统计数据失败')
			}	
		},
			
		//报表活动访问量数据
		*viewDataByDayQuery({payload}, {call, put, select}) {	

			let model = yield select(state => state.marketModel);
			let endDate = undefined;
			let newDate = undefined;
			endDate = moment().format('YYYY-MM-DD');
			newDate = moment().subtract(payload&&payload.dayValue || model.dayValue, 'days').format('YYYY-MM-DD');
			
			let param = {
				orgId : model.orgId || payload.orgId,
				activityId : payload.activityId || undefined,
				startDate : newDate || undefined,
				endDate : endDate || undefined,
			}

			let { ret } = yield call(service.viewDataByDaysQuery, parse(param));
			
			let data_list = ret && ret.list;

			let draw_data = {};

			data_list && data_list.map(function(dataItem, dataIndex) {
				let {view_date, views} = dataItem;

				let draw_data_item = draw_data[view_date];
				if(draw_data_item == undefined) {
					draw_data_item = {};
					draw_data_item.view_date = view_date;
				}
				draw_data_item.value = views;
				draw_data[view_date] = draw_data_item;
			});
			if( ret && ret.errorCode == 9000 ){		
								
				yield put({
					type : 'updateState',
					payload : {
						drawingData : draw_data,
						drawingDataCount : ret.allCount || 0,
						dayValue : payload&&payload.dayValue || 7,
						dayValueSelect : payload&&payload.dayValueSelect || 10000,
						subMode : payload&&payload.subMode || '1',
					}
				})
			} else {
				 message.error( ret && ret.errorMessage || '获取统计数据失败')
			}	
		},
			
		*countDataByDayQuery({payload}, {call, put, select}) {	
			
			let model = yield select(state => state.marketModel);
			let endDate = undefined;
			let newDate = undefined;
			endDate = moment().format('YYYY-MM-DD');
			newDate = moment().subtract(payload&&payload.dayValue || model.dayValue, 'days').format('YYYY-MM-DD');
			
			let param = {
				orgId : model.orgId || payload.orgId,
				activityId : payload.activityId || undefined,
				startDate : newDate || undefined,
				endDate : endDate || undefined,
			}

			let { ret } = yield call(service.countDataByDaysQuery, parse(param));

			if( ret && ret.errorCode == 9000 ){		
				
				let data_list = ret && ret.list;

				let draw_data = {};

				data_list && data_list.map(function(dataItem, dataIndex) {
					let {view_date, count} = dataItem;

					let draw_data_item = draw_data[view_date];
					if(draw_data_item == undefined) {
						draw_data_item = {};
						draw_data_item.view_date = view_date;
					}
					draw_data_item.value = count;
					draw_data[view_date] = draw_data_item;
				});

				yield put({
					type : 'updateState',
					payload : {
						drawingData : draw_data,
						drawingDataCount : ret.allCount || 0,
						dayValue : payload&&payload.dayValue || 30,
						dayValueSelect : payload&&payload.dayValueSelect || 20000,
						subMode : payload&&payload.subMode || '2',
					}
				})
			} else {
				 message.error( ret && ret.errorMessage || '获取统计数据失败')
			}	
		},
			
		*countDataByDaysOnMemberQuery({payload}, {call, put, select}) {	
				
			let model = yield select(state => state.marketModel);

			let {subMode} = model;

			let param = {
				orgId : model.orgId || payload.orgId,
				activityId : payload.activityId || undefined,
			}
			
			let { ret } = yield call(service.countDataByDaysOnMemberQuery, parse(param));

			if( ret && ret.errorCode == 9000 ){		
	
				let data_list = ret && ret.list;//接口获取的原始数据

				//构造图表数据
				let draw_data = {};

				//菜单人员列表
				let draw_members = {};

				data_list && data_list.map(function(dataItem, dataIndex) {
					let {view_date, member_name, count} = dataItem;
					let draw_data_item = draw_data[view_date];
					if(draw_data_item == undefined) {
						draw_data_item = {};
						draw_data_item.view_date = view_date;
					}
					draw_data_item[member_name] = count;
					draw_data[view_date] = draw_data_item;
					if(draw_members[member_name] == undefined) {
						draw_members[member_name] = 0;
					}
				});

				yield put({
					type : 'updateState',
					payload : {
						dayValue : payload&&payload.dayValue || undefined,
						dayValueSelect : payload&&payload.dayValueSelect || undefined,
						drawingData : draw_data,
						draw_members,
						subMode : payload&&payload.subMode || '3',
					}
				})
			} else {
				 message.error( ret && ret.errorMessage || '获取统计数据失败')
			}	
		},
						
		*getFormDataQuery({payload}, {call, put, select}) {	
				
			let model = yield select(state => state.marketModel);
			
			let param = {};

			if(payload.param != undefined) {
			   	param = {
					pageSize : 10,
					pageIndex : 0,
					orgId : model.orgId || payload.orgId,
					...payload.param,
				}
			} else {
				param = {
					pageSize : 10,
					pageIndex : 0,
					orgId : model.orgId || payload.orgId,
					activityId : payload.activityId || undefined,
				}
			}
			
			let { ret } = yield call(service.getFormDataQuery, parse(param));

			if( ret && ret.errorCode == 9000 ){

				yield put({
					type : 'updateState',
					payload : {
						analysisPageData : ret&&ret.data,
						analysisDataSource : ret&&ret.results,
						analysisPageSize : 10,
						analysisPageIndex : 0,
					}
				})
			} else {
				 message.error( ret && ret.errorMessage || '获取统计数据失败')
			}
		},

		//加载更多数据
		*getMoreFormDataQuery({payload}, {call, put, select}) {

			let model = yield select(state => state.marketModel);

			let param = {};


			if(payload.param != undefined) {
			   	param = {
					pageSize : payload.analysisPageSize || model.analysisPageSize,
					pageIndex : payload.analysisPageIndex != undefined ? payload.analysisPageIndex : model.analysisPageIndex,
					orgId : model.orgId || payload.orgId,
					...payload.param,
				}
			} else {
				param = {
					pageSize : payload.analysisPageSize || model.analysisPageSize,
					pageIndex : payload.analysisPageIndex != undefined ? payload.analysisPageIndex : model.analysisPageIndex,
					orgId : model.orgId || payload.orgId,
					activityId : payload.activityId || undefined,
				}
			}

			let { ret } = yield call(service.getFormDataQuery, parse(param));

			if( ret && ret.errorCode == 9000 ){		
	
				yield put({
					type : 'updateState',
					payload : {
						analysisPageData : ret&&ret.data,
						analysisDataSource : ret&&ret.results,
						analysisPageSize : payload.analysisPageSize || model.analysisPageSize,
						analysisPageIndex : payload.analysisPageIndex != undefined ? payload.analysisPageIndex : model.analysisPageIndex,
					}
				})
			} else {
				 message.error( ret && ret.errorMessage || '获取统计数据失败')
			}	
		},

		//导出用户数据
		*exportUserFormData({payload}, {call, put, select}) {
			let model = yield select(state => state.marketModel);
			let param = {
				...payload.param,
				orgId: model.orgId || undefined,
			}
			window.excelExport('/zsb/market/exportFormData', param);
			
			//let jsonparam = qs.stringify(payload.param);
			// window.open(`${BASE_URL}/zsb/market/exportFormData?orgId=${model.orgId}&${jsonparam}`);
			// var p = payload.param&&payload.param.place || undefined;
			// var s = payload.param&&payload.param.sourceId || undefined;
			// var st = payload.param && payload.param.firstCreateTime || undefined;
			// var et = payload.param && payload.param.endCreateTime || undefined;

			// if((p != undefined && p != '') && (s != undefined && s != '')) {
			//    	window.open(`${BASE_URL}/zsb/market/exportFormData?orgId=${model.orgId}&activityId=${payload.param.activityId}&place=${p}&sourceId=${s}&sourceType=1`);
			// } else if(p != undefined && p != '') {
			// 	window.open(`${BASE_URL}/zsb/market/exportFormData?orgId=${model.orgId}&activityId=${payload.param.activityId}&place=${p}`);
			// } else if(s != undefined && s != '') {
			// 	window.open(`${BASE_URL}/zsb/market/exportFormData?orgId=${model.orgId}&activityId=${payload.param.activityId}&sourceId=${s}&sourceType=1`);
			// } else {
			// 	window.open(`${BASE_URL}/zsb/market/exportFormData?orgId=${model.orgId}&activityId=${payload.param.activityId}`);
			// }
		},
    },
		
	reducers : {
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
