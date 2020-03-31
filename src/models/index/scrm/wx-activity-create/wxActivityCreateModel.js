import *as service from '../../../../services/scrm/wx-activity/wxActivityService';
import parse from 'qs';
import qs from 'qs';
import { message } from 'antd';

export default {

	namespace : 'NAMESPACECREATEACTIVITY',

	state : {
        attrActivityList            : [],
        attrSelectedRows            : [],
        attrSelectedRowKeys         : [],
        attrActivityData            : {},
        attrModifyData              : {}, //修改数据源
        attrModify                  : false,
        attrListLoading             : false,
        attrSearchVisible           : false,
        attrPageModal               : false,
        attrQrCodeShow              : false,
        attrPageIndex               : 0,
        attrImageList : [],
        attrPageSize                : 10,
        attrOrgId                   : '',
        attrName                    : '',
        attrStatus                  : '',
        attrQrUrl                   : '',
        attrTabActiveKey            : '',
        attrCampusSelectIds         : [],
        //报名成功
        attrSuccessDataSource       : [],
        attrSuccessModalVisible     : false,
        attrRemarkModalVisible      : false,
        attrSuccessLoading          : false,
        attrSuccessSearchVisible    : false,
        attrCampusShowModal         : false,
        attrSuccessPageIndex        : 0,
        attrSuccessPageSize         : 10,
        attrSuccessResultCount      : '',
        attrSuccessOrgId            : '',
        attrApplyStatus             : '',
        attrActivityId              : '',
        attrApplyId                 : '',                
        attrRemark                  : '',                
        attrSaveSuccess             : false,
        attrHTMLValue               : undefined,
	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {
                if (pathname == '/scrm_woffice_activity') {
                    dispatch({
                        type: 'getActivityParams',
                    })
                }
            });
        },
    },

	effects : {

        //进入页面得到传参
        *getActivityParams({ payload },{ call, put, select }){
            let model = yield select(state => state.NAMESPACECREATEACTIVITY);
            yield put({
                type : 'getActivityList',
                payload : {
                    params : {
                        attrPageSize    : model.attrPageSize,
                        attrPageIndex   : model.attrPageIndex,
                        attrOrgId       : model.attrOrgId,
                        attrName        : model.attrName,
                        attrStatus      : model.attrStatus,
                    }
                }
            })
        },

        //得到活动列表
        *getActivityList({ payload },{ call, put ,select }){
            yield put({
                type : 'updateState',
                payload : {
                    attrListLoading : true,
                }
            })

            let params = {
                pageSize: payload && payload.params.attrPageSize || 10,
                pageIndex: payload && payload.params.attrPageIndex || 0,
                orgId: payload && payload.params.attrOrgId || (payload.params.orgId || ''),
                name: payload && payload.params.attrName || (payload.params.name || ''),
                status: payload && payload.params.attrStatus || (payload.params.status || ''),
            }
            
            let { ret } = yield call( service.getActivityList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        attrActivityList    : ret.results,
                        attrActivityData    : ret.data,
                        attrSelectedRows    : [],
                        attrSelectedRowKeys : [],
                        ...payload,
                        ...payload.params,
                    }
                })
            } else {
                message.error( ret && ret.errorMessage || '列表加载失败' );
            }
            yield put({
                type : 'updateState',
                payload : {
                    attrListLoading : false,
                }
            });
        },

        //搜索 AND 清除
        *searchAndClearFunction({ payload }, { call, put, select }) {     
            
            let model = yield select(state => state.NAMESPACECREATEACTIVITY)
            let { values } = payload;
            let params = {
                pageIndex: 0,
                pageSize: model.attrPageSize || 10,
                ...values,
            };
            yield put({
                type: 'getActivityList',
                payload: {
                    params: {
                        ...params
                    }
                }
            })
        },

        //分页改变
        *paginationChange({ payload }, { call, put, select }) {
            let model = yield select(state => state.NAMESPACECREATEACTIVITY)
            let { pageSize, pageIndex } = payload;
            yield put({
                type: 'getActivityList',
                payload: {
                    params : {
                        attrPageSize    : pageSize,
                        attrPageIndex   : pageIndex - 1,
                        attrOrgId       : model.attrOrgId,
                        attrName        : model.attrName,
                        attrStatus      : model.attrStatus,
                    }
                }
            })
        },

        //新增活动
        *createActivity({ payload },{ call, put, select }){
			window.wActivityTimer = setInterval(function(){
				serviceRequest(
					BASE_URL + '/organController/getTenant', {}
				)
            }, 600000)
            
            yield put({
                type : 'updateState',
                payload : {
                    attrPageModal: payload.attrPageModal,
                    attrModify  : false,
                    attrModifyData: payload.attrModifyData,
                    attrCampusSelectIds : [],
                    attrSaveSuccess : false,
                }
            })
        },

        //删除上架、下架活动
        *updateActivityStatus({ payload },{ call, put, select }){
            let model = yield select(state => state.NAMESPACECREATEACTIVITY);
            let { selectedRows, status } = payload;
            let ids = [];
            selectedRows && selectedRows.map(function( item, index ){
                ids.push( item.id );
            });
            ids = ids.join(',');
            let { ret } = yield call( service.updateActivityStatus, ({ ids : ids, status : status }));
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    attrPageSize   : model.attrPageSize,
                    attrPageIndex  : model.attrPageIndex,
                    attrOrgId      : model.attrOrgId,
                    attrName       : model.attrName,
                    attrStatus     : model.attrStatus,
                }
                yield put({
                    type : 'getActivityList',
                    payload : {
                        params
                    }
                });
                if( status == '0' ) {
                    message.success( '删除成功' );
                } else if( status == '1' ){
                    message.success( '上架成功' );
                } else if( status == '2' ){
                    message.success( '下架成功' );
                }
            } else {
                if( status == '1' ) {
                    message.error( ret && ret.errorMessage || '上架失败' );
                } else if( status == '2' ) {
                    message.error( ret && ret.errorMessage || '下架失败' );
                } else if( status == '0' ) {
                    message.error( ret && ret.errorMessage || '删除失败' );
                }
            }
        },

        //查看二维码
        *showActivityUrl({ payload }, { call, put, select }) {
            if (!!window._init_data.firstOrg) {
                let { codeId, urlOrgIds } = payload;
                let urlOrgId = urlOrgIds[0];    
                let { ret } = yield call(service.showActivityUrl, ({ actId: codeId, orgId: urlOrgId }));
                if (ret && ret.errorCode == '9000') {
                    yield put({
                        type: 'updateState',
                        payload: {
                            attrQrCodeShow: true,
                            attrQrUrl: window.compatibleProtocol(ret.address), 
                            // urlOrgId,
                            // urlOrgIds,
                            // codeId,
                        }
                    })
                }
            }
        },

        //报名成功列表
        *applySuccess({ payload }, { call, put, select }) {
            let model = yield select(state => state.NAMESPACECREATEACTIVITY);
            let attrSuccessModalVisible = model.attrSuccessModalVisible;
            let { id } = payload;
            yield put({
                type: 'updateState',
                payload: {
                    attrSuccessModalVisible: !attrSuccessModalVisible,
                    activityId: id,
                }
            });
            let params = {
                activityId  : id,
                orgId       : model.attrSuccessOrgId,
                status      : model.attrApplyStatus,
                pageIndex   : model.attrSuccessPageIndex,
                pageSize    : model.attrSuccessPageSize,
            };
            yield put({
                type: 'getApplyList',
                payload: {
                    params
                }
            })
        },

        //得到报名成功的列表
        *getApplyList({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    attrSuccessLoading : true,
                }
            })
            let { params } = payload;
            let { ret } = yield call( service.applySuccessList, ({ ...params }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        attrSuccessDataSource  : ret.results,
                        attrSuccessResultCount : ret.data.resultCount,
                        attrActivityId         : params.activityId,
                        attrSuccessOrgId       : params.orgId,
                        attrApplyStatus        : params.status,
                        attrSuccessPageSize    : params.pageSize,
                        attrSuccessPageIndex   : params.pageIndex,
                    }
                })
            };
            yield put({
                type : 'updateState',
                payload : {
                    attrSuccessLoading : false,
                }
            });
        },

        //报名成功搜索/清除条件
        *successSearchAndClearFunction({ payload },{ call, put, select }){
            let { values } = payload;
            let model = yield select(state => state.NAMESPACECREATEACTIVITY );
            let params = {
                pageIndex  : 0,
                pageSize   : model.attrSuccessPageSize,
                activityId : model.attrActivityId,
                ...values,
            };
            yield put({
                type : 'getApplyList',
                payload : {
                    params
                }
            })
        },

        //取消报名
        *cancelApply({ payload },{ call, put, select }){
            let { id, activityId } = payload;
            let model = yield select(state => state.NAMESPACECREATEACTIVITY );
            let { ret } = yield call( service.cancelApply, ({ id : id, activityId : activityId }) );
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    orgId      : model.attrSuccessOrgId,
                    pageIndex  : model.attrSuccessPageIndex,
                    pageSize   : model.attrSuccessPageSize,
                    status     : model.attrApplyStatus,
                    activityId : model.attrActivityId,
                };
                yield put({
                    type : 'getApplyList',
                    payload : {
                        params
                    }
                });
                message.success( '取消报名成功' );
            }else{
                message.error( ret && ret.errorMessage || '取消报名失败' )
            }
        },

        //优先等位
        *toBeNumberOne({ payload },{ call, put, select }){
            let { id, activityId } = payload;
            let model = yield select(state => state.NAMESPACECREATEACTIVITY );
            let { ret } = yield call( service.toBeNumberOne, ({ id : id, activityId : activityId }) );
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    orgId      : model.successOrgId,
                    status     : model.applyStatus,
                    pageIndex  : model.successPageIndex,
                    pageSize   : model.successPageSize,
                    activityId : model.activityId,
                };
                yield put({
                    type : 'getApplyList',
                    payload : {
                        params
                    }
                });
                message.success( '优先等位成功' )
            }else {
                message.error( ret && ret.errorMessage || '优先等位失败'  );
            }
        },

        //导出
        *exportSuccess({ payload },{ call, put, select }){
            let model = yield select(state => state.NAMESPACECREATEACTIVITY );
            let params = {
                orgId      : model.attrSuccessOrgId,
                status     : model.attrApplyStatus,
                activityId : model.attrActivityId,
            }
            window.excelExport('/micNetApplyController/export', { ...params })            
        },

        //报名成功分页
        *successPagination({ payload },{ call, put, select }){
            let { successPageIndex, successPageSize } = payload;
            let model = yield select(state => state.NAMESPACECREATEACTIVITY );
            let params = {
                pageIndex  : successPageIndex - 1,
                pageSize   : successPageSize,
                orgId      : model.attrSuccessOrgId,
                status     : model.attrApplyStatus,
                activityId : model.attrActivityId,
            }
            yield put({
                type : 'getApplyList',
                payload : {
                    params
                }
            })
        },

        //添加备注
        *addRemark({ payload },{ call, put, select }){
            let model = yield select(state => state.NAMESPACECREATEACTIVITY );
            let attrRemarkModalVisible = model.attrRemarkModalVisible;
            let { id, remark } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    attrRemark             : remark,
                    attrApplyId            : id,
                    attrRemarkModalVisible : !attrRemarkModalVisible,
                }
            })
        },

        //确认添加备注
        *confirmAddRemark({ payload },{ call, put, select }){
            let model = yield select(state => state.NAMESPACECREATEACTIVITY );
            let { value } = payload;
            let remark = value.remark;
            let attrRemarkModalVisible = model.attrRemarkModalVisible;
            let params = {
                remark     : remark,
                id         : model.attrApplyId,
                activityId : model.attrActivityId,
            }
            let { ret } = yield call( service.confirmAddRemark, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                let obj = {
                    orgId      : model.attrSuccessOrgId,
                    status     : model.attrApplyStatus,
                    pageIndex  : model.attrSuccessPageIndex,
                    pageSize   : model.attrSuccessPageSize,
                    activityId : model.attrActivityId,
                };
                yield put({
                    type : 'getApplyList',
                    payload : {
                        params : obj
                    }
                })
                yield put({
                    type : 'updateState',
                    payload : {
                        attrRemarkModalVisible : !attrRemarkModalVisible,
                        attrActivityId         : '',
                        attrRemark             : '',
                    }
                })
            } else {
                message.error(ret && ret.errorMessage || '添加备注失败');
            }
        },

        // //打开校区选择框
        // *onOpenSelectOrgModal({ payload },{ select , put , call }){
        //     let { selectModalVisible } = payload;
        //     yield put({
        //         type : 'updateState',
        //         payload : {
        //             selectModalVisible : !selectModalVisible
        //         }
        //     })
        // },

        // //关闭校区选择框
        // *onSelectOrgModalClose({ payload },{ select , put , call }){
        //     let { selectModalVisible } = payload;
        //     yield put({
        //         type : 'updateState',
        //         payload : {
        //             selectModalVisible : !selectModalVisible
        //         }
        //     })
        // },

        // //点击提交更新校区
        // *afterSelectOrgModalSubmit({ payload },{ select , put , call }){
        //     let { selectOrgs } = payload;
        //     yield put({
        //         type : 'updateState',
        //         payload : {
        //             selectOrgs
        //         }
        //     })
        // },

        //修改活动
        *updateActivity({ payload },{ call, put, select }){
            let { id } = payload;
            let { ret } = yield call( service.getActivityInfo, ({ id : id }));
            if( ret && ret.errorCode == '9000' ){
                let activityInfo = {
                    name              : ret.name || '',
                    activityCover     : ret.activityCover || '',
                    orgIds            : ret.orgIds && ret.orgIds.join(',') || '',
                    applyStartTime    : ret.applystartTime || '',
                    applyEndTime      : ret.applyendTime || '',
                    activityStartTime : ret.activitystartTime || '',
                    activityEndTime   : ret.activityendTime || '',
                    activityType      : ret.activityType || '',
                    applyType         : ret.applyType || '',
                    classCus          : ret.classCus || '',
                    materialFee       : ret.materialFee || '',
                    cancelTime        : ret.cancelTime || '',
                    address           : ret.address || '',
                    target            : ret.target || '',
                    oldDetail         : ret.activityContent || '',
                    id                : ret.id || '', 
                    shareTitle        : ret.shareTitle || '',
                    shareInfo         : ret.shareInfo || '',
                    shareCover        : ret.shareCover || '',
                    actBanner         : ret.detailPic || ret.actBanner,
                    actHtml           : ret.actHtml || '',
                    waiting           : ret.waiting || 0,
                    participate       : ret.participate || 0,
                    sort              : ret.sort || 0,
                    number            : ret.number || 0,
                    vipSet            : ret.vipSet || 0,
                    enablePay         : ret.enablePay || '0',
                    payAmount         : ret.payAmount || 0.00,
                    isHq              : ret.isHq || false,

                }
				window.wActivityTimer = setInterval(function(){
					serviceRequest(
						BASE_URL + '/organController/getTenant', {}
					)
				}, 600000 )
                yield put({
                    type : 'updateState',
                    payload : {
                        attrPageModal           : true,
                        attrModifyData          : activityInfo,
                        attrModify              : true,
                        attrSaveSuccess         : false,
                        attrCampusSelectIds     : ret.orgIds,
                    }
                })
            }
        },

        // //改变校区
        // *TenantOrgFilterAction({ payload },{ call, put, select }){
        //     let { urlOrgId } = payload;
        //     let wxActivityModel = yield select( state => state.wxActivityModel );
        //     let params = {
        //         actId    : wxActivityModel.codeId,
        //         orgId    : urlOrgId,
        //     }
        //     let { ret } = yield call( showActivityUrl, ({ ...params }));
        //     if( ret && ret.errorCode == '9000' ){
        //         yield put({
        //             type : 'updateState',
        //             payload : {
        //                 url : ret.address,
        //             }
        //         })
        //     }
        // },

        //确认新增、修改活动
        *confirmAddWxActivity({ payload },{ call, put, select }){
            let model = yield select(state => state.NAMESPACECREATEACTIVITY );
            let params = payload.params || {};
            let { ret } = yield call(service.confirmAddWxActivity, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
				clearInterval( window.wActivityTimer );
                yield put({
                    type : 'updateState',
                    payload : {
                        attrTabActiveKey : 'baseSet',
                        attrPageModal   : payload.attrPageModal || false,
                        attrModifyData  : {},
                        attrSaveSuccess : true,
                        attrHTMLValue   : undefined,
                        attrCampusSelectIds : [],
                    }
                })
                let params = {
                    attrPageSize    : model.attrPageSize,
                    attrPageIndex   : model.attrPageIndex,
                    attrOrgId       : model.attrOrgId || '',
                    attrName        : model.attrName || '',
                    // status     : model.status,
                };
                yield put({
                    type : 'getActivityList',
                    payload : {
                        params
                    }
                });
                message.success( '保存活动成功' );
            }
        },


        // //分页
        // *pagination({ payload },{ call, put, select }){
        //     let { pageSize, pageIndex } = payload;
        //     let wxActivityModel = yield select( state => state.wxActivityModel );
        //     let params = {
        //         pageSize     : pageSize,
        //         pageIndex    : pageIndex - 1,
        //         orgId        : wxActivityModel.orgId,
        //         name         : wxActivityModel.name,
        //         status       : wxActivityModel.status,
        //     };
        //     yield put({
        //         type : 'getActivityList',
        //         payload : {
        //             params
        //         }
        //     })
        // },
    },
	reducers : {
		updateState( state, action ){return { ...state, ...action.payload }}
	}
}
