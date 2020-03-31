import {message} from 'antd';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import {queryDataSource,queryGameType,otherGameList,queryThemeInst,createThemeInst,getDomain} from '../../../../services/scrm/micro-game/microGameService';
/*
 * 微游戏管理model
 */
export default {

  namespace: 'microGameMgrModel',

  state: {
    	dataSource: [],
    	pageIndex: 0,
    	pageSize: 10,
    	loading: false,
    	query: {}, 
    	hasMore: true,
    	gameFrameVisible: false,
    	gameFrameUrl: '',
		buyModalVisible: false,
		instDataSource : {},
		attrModifyFrameUrl : '',
		openGameModalVisible: false,
		gameTypeList: [],
		labelIds:'',// 为初始的数据结构
		checkOrPickup : 'check' ,     //默认是查看更多按钮
		themeInfo: {}, // 模板信息
		baseUrl: '', // 域名
		h5createUrl: '', // 新版游戏编辑器地址
		newGameLoading: false // 游戏加载
	},
	
	subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {
            	
                if(pathname === '/scrm_wx_wgame_list') {
									dispatch({
										type:'getDomain'
									})
                	dispatch({
                		type: 'queryDataSource',
                		payload: {
                			pageIndex: 0,
                			pageSize: 20,
                			query: {
                				selectOrgId: window._init_data && window._init_data.firstOrg && window._init_data.firstOrg.key
                			}
                		}
					});
					dispatch({
                		type: 'queryGameType',
                		payload: {
                			product: 2
                		}
					});
                	
					window.addEventListener('message', function(e){
						if( e.data == 'close' ){
							dispatch({
								type: 'updateState',
								payload: {
									gameFrameVisible: false,
									gameFrameUrl: '',
									attrModifyFrameUrl : '',
									instDataSource: {}
								}
							});
							dispatch({
								type: 'gameTemplateCreate/updateState',
								payload: {
									attrShowPageModal: false,
									attrGameFrameUrl: '',
								}
							});
							window.wActivityTimer && clearInterval( window.wActivityTimer );
						} else if( e.data == 'closeAndLink' ){
							dispatch({
								type: 'updateState',
								payload: {
									gameFrameVisible: false,
									gameFrameUrl: '',
								}
							});
							dispatch({
								type: 'gameTemplateCreate/updateState',
								payload: {
									attrShowPageModal: false,
									attrGameFrameUrl: '',
								}
							});
							dispatch(
								routerRedux.push('/scrm_wx_myscrm_list')
							);
							window.wActivityTimer && clearInterval(window.wActivityTimer);
						} else if(e.data == 'closeGame') {
							dispatch({
								type: 'gameTemplateCreate/updateState',
								payload: {
									attrShowPageModal: false,
									h5createUrl: '',
								}
							});
						}
						else {
							let message_data = e.data;
							if (message_data && message_data.messageType && message_data.messageType == 'preview') {								
								dispatch({
									type: 'updateState',
									payload: {
										gameFrameVisible: false,
										gameFrameUrl: '',
										instDataSource : {
											gameInstPreviewVisible: true,
											gameInstId: message_data.instId,
											instH5Url: message_data.instH5Url,
											instH5PreviewUrl: message_data.instH5PreviewUrl,
											gameInstData: {
												...message_data
											}
										}
									}
								});
								dispatch({
									type: 'gameTemplateCreate/updateState',
									payload: {
										attrShowPageModal: false,
										attrGameFrameUrl: '',
									}
								});
							}
						}
					}, false );

					document.documentElement.style.lineHeight = 'normal';
                }
            });
        },
    },


  effects: {
    *queryDataSource({ payload }, { call, put, select }) {
    	yield put({
    		type: 'updateState',
    		payload: {
				loading: true,
    		}
		});
    	let microGameMgrModel = yield select(state => state.microGameMgrModel);
    	let pageIndex = (payload && payload.pageIndex != undefined) ? payload.pageIndex : microGameMgrModel.pageIndex;
    	let pageSize = (payload && payload.pageSize != undefined) ? payload.pageSize : microGameMgrModel.pageSize;
    	let query = (payload && payload.query != undefined) ? payload.query : microGameMgrModel.query;
    	let orgId = query && query.selectOrgId;
		let gameName = query && query.moduleName;
		let labelIds = payload.new_labelIds ? payload.new_labelIds : microGameMgrModel.labelIds;
		let formatLabelIds = payload.formatLabelIds
    	let params = {
    		pageIndex,pageSize,orgId,labelIds:formatLabelIds
    	}
    	
    	if(gameName && gameName.length > 0) {
    		params.gameName = gameName;
    	}
    	
    	let {ret} = yield call( queryDataSource, parse(params));

        if( ret && ret.errorCode == 9000 ){
        	
        	yield put({
    			type: 'updateState',
	    		payload: {
					pageIndex,
					pageSize,
					query,
					dataSource: ret.results,
					labelIds,
	    			hasMore: ret.results.length < ret.data.resultCount
	    		}
	    	});
        } else {
            message.error((ret && ret.errorMessage) || '微游戏查询出错啦');
        }
    	
    	yield put({
    		type: 'updateState',
    		payload: {
    			loading: false
    		}
    	});
	},
	
	*queryGameType({ payload }, { call, put, select}){
		let { product } = payload;
		let {ret} = yield call( queryGameType, { product });
		let microGameMgrModel = yield select(state => state.microGameMgrModel);
		if( ret && ret.errorCode == 9000 ){
			for (let i in ret.results) {
				ret.results[i].parentId = i,                //父组件id
					ret.results[i].wetherChooseAll = true      //是否选中全部
				ret.results[i].value.splice(0, 0, { id: undefined, labelName: '全部' })
			}
        	yield put({
    			type: 'updateState',
	    		payload: {
					gameTypeList : ret.results,
					// dataSource : [],
					labelIds: "",
					checkOrPickup: microGameMgrModel.checkOrPickup,
	    		}
			});
        } else {
            message.error((ret && ret.errorMessage) || '微游戏类型出错啦');
        }
	},

	*otherGameList({ payload }, { call, put, select}){
		let { gameId } = payload;
		let {ret} = yield call( otherGameList, { gameId });
		if( ret && ret.errorCode == 9000 ){
			yield put({
				type:'updateState',
				payload: {
					gameOtherList : ret.gameList,
				}
			})
        } else {
            message.error((ret && ret.errorMessage) || '推荐游戏出错啦');
        }
	},
	*queryGameItem({ payload }, { call, put, select }) {
		const { resolve } = payload;
		let gameId = payload.gameId;
		let microGameMgrModel = yield select(state => state.microGameMgrModel);
    	let pageIndex = (payload && payload.pageIndex != undefined) ? payload.pageIndex : microGameMgrModel.pageIndex;
    	let pageSize = (payload && payload.pageSize != undefined) ? payload.pageSize : microGameMgrModel.pageSize;
    	let query = (payload && payload.query != undefined) ? payload.query : microGameMgrModel.query;
    	let orgId = query && query.selectOrgId;
			let gameName = query && query.moduleName;
			let labelIds = payload.new_labelIds ? payload.new_labelIds : microGameMgrModel.labelIds;
			let formatLabelIds = payload.formatLabelIds
    	let params = {
    		pageIndex,pageSize,orgId,gameId:gameId
    	}
    	
    	if(gameName && gameName.length > 0) {
    		params.gameName = gameName;
    	}
    	
    	let {ret} = yield call( queryDataSource, parse(params));

			if( ret && ret.errorCode == 9000 ){
			!!resolve && resolve(!!ret.results && !!ret.results.length && !!ret.results.length>0 ? ret.results[0] : null);
			} else {
				message.error((ret && ret.errorMessage) || '微游戏查询出错啦');
			}
		},
		/* 查询新版编辑器游戏模板信息 */
		*queryThemeInst({ payload }, { call, put, select}){
			let { themeId } = payload;
			let {ret} = yield call( queryThemeInst, { themeId });
			if( ret && ret.errorCode == 0 ){
				yield put({
					type:'updateState',
					payload: {
						themeInfo : ret.data,
					}
				})
			} else {
				message.error((ret && ret.errorMessage) || '查询模板信息出错');
			}
		},
		*createThemeInst({ payload }, { call, put, select}){
			yield put({ type : 'showNewGameLoading' });
			let microGameMgrModel = yield select(state => state.microGameMgrModel);
			let baseUrl = (payload && payload.baseUrl != undefined) ? payload.baseUrl : microGameMgrModel.baseUrl;
			let {ret} = yield call( createThemeInst, payload);
			if( ret && ret.errorCode == 0 ){
				let token = ''
				let arr
				var reg = new RegExp("(^| )" + 'Authorization' + "=([^;]*)(;|$)");
      	if (arr = document.cookie.match(reg)) {
					token = unescape(arr[2]).slice(7)
				}
				let h5createUrl = `${baseUrl}/headquarters.html?action=createInst&instId=` + ret.data.instId +`&token=` + token
				yield put({
					type:'updateState',
					payload: {
						h5createUrl
					}
				})
				yield put({
					type:'gameTemplateCreate/showCreateGamePage',
					payload: {
						h5createUrl,
						isH5: 1,
						attrShowPageModal: true,
					}
				})
			} else {
				message.error((ret && ret.errorMessage) || '创建游戏实例出错');
			}
			yield put({ type : 'closeNewGameLoading' });
		},
		*getDomain ({ payload },{ select, call, put}) {
			let {ret} = yield call(getDomain);
			let baseUrl = ret.domain.replace("\"","").replace("\"","");
			yield put({
					type : 'updateState',
					payload : {
						baseUrl,
					}
				});
			},
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload };
		},
		//新游戏加载
		showNewGameLoading(state, action) {
			return { ...state, ...action.payload, newGameLoading : true };
		},
		//新游戏取消加载
		closeNewGameLoading(state, action) {
				return { ...state, ...action.payload, newGameLoading : false };
		},
  },

};
