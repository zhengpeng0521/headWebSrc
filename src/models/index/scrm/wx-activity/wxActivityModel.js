import {
    getActivityList,         //得到活动列表
    applySuccessList,        //报名成功的列表
    getActivityInfo,
    confirmAddWxActivity,

    updateActivityStatus,    //上下架删除

    cancelApply,             //取消报名
    toBeNumberOne,          //优先等位

    confirmAddRemark,        //确认添加备注

    getProductLabel,         //获取标签
    exportSuccess,

    showActivityUrl,        //查看二维码

} from '../../../../services/scrm/wx-activity/wxActivityService';
import parse from 'qs';
import qs from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'wxActivityModel',

	state : {
        searchVisible                      : false,           //筛选框是否可见
        modifyCourse                       : false,
        orgId                              : '',
        name                               : '',
        status                             : '',

        loading                            : false,
        dataSource                         : [],              //列表数据
        resultCount                        : '',
        pageIndex                          : 0,
        pageSize                           : 10,
        selectedRows                       : [],
        selectedRowKeys                    : [],

        //表单属性
        wxActivityCreateVisible            : false,
        activityInfo                       : {},
        id                                 : '',
        isModify                           : false,
        limitTime                          : '',

        selectModalVisible                 : false,
        selectOrgs                         : [],

        //报名成功
        successModalVisible                : false,
        successDataSource                  : [],
        successResultCount                 : '',
        successPageIndex                   : 0,
        successPageSize                    : 10,
        successLoading                     : false,

        successOrgId                       : '',
        applyStatus                        : '',
        activityId                         : '',
        successSearchVisible               : false,

        applyId                            : '',                //报名id
        remark                             : '',                //备注信息

        remarkModalVisible                 : false,

        //二维码
        url                                : '',
        urlOrgId                           : '',
        urlOrgIds                          : [],
        codeUrlModalVisible                : false,
        codeId                             : '',

	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {
                if(pathname == '/1') {
                    dispatch({
                        type : 'getActivityParams',
                        payload : {

                        }
                    })
                }
            });
        },
    },

	effects : {
        //搜索 清除条件
        *searchAndClearFunction({ payload },{ call, put, select }){
            let wxActivityModel = yield select( state => state.wxActivityModel )
            let { values } = payload;
            let params = {
                pageIndex   : 0,
                pageSize    : wxActivityModel.pageSize,
                ...values,
            };
            yield put({
                type : 'getActivityList',
                payload : {
                    params
                }
            })
        },

        //进入页面得到传参
        *getActivityParams({ payload },{ call, put, select }){
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let params = {
                pageSize   : wxActivityModel.pageSize,
                pageIndex  : wxActivityModel.pageIndex,
                // orgId      : wxActivityModel.orgId,  //傲娇的总部不需要
                name       : wxActivityModel.name,
                status     : wxActivityModel.status,
            };
            yield put({
                type : 'getActivityList',
                payload : {
                    params
                }
            })
        },

        //得到活动列表
        *getActivityList({ payload },{ call, put ,select }){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true,
                }
            })
            let { params } = payload;
            let { ret } = yield call( getActivityList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource      : ret.results,
                        resultCount     : ret.data.resultCount,
                        selectedRows    : [],
                        selectedRowKeys : [],
                        ...params
                    }
                })
            }else {
                message.error( ret && ret.errorMessage || '列表加载失败' );
            }
            yield put({
                type : 'updateState',
                payload : {
                    loading : false,
                }
            });
        },

        //删除上架、下架活动
        *updateActivityStatus({ payload },{ call, put, select }){
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let { selectedRows, status } = payload;
            let ids = [];
            selectedRows && selectedRows.map(function( item, index ){
                ids.push( item.id );
            });
            ids = ids.join(',');
            let { ret } = yield call( updateActivityStatus, ({ ids : ids, status : status }));
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    pageSize   : wxActivityModel.pageSize,
                    pageIndex  : wxActivityModel.pageIndex,
                    orgId      : wxActivityModel.orgId,
                    name       : wxActivityModel.name,
                    status     : wxActivityModel.status,
                }
                yield put({
                    type : 'getActivityList',
                    payload : {
                        params
                    }
                });
                if( status == '0' ){
                    message.success( '删除成功' );
                }else if( status == '1' ){
                    message.success( '上架成功' );
                }else if( status == '2' ){
                    message.success( '下架成功' );
                }
            }else {
                if( status == '1' ){
                    message.error( ret && ret.errorMessage || '上架失败' );
                }else if( status == '2' ){
                    message.error( ret && ret.errorMessage || '下架失败' );
                }else if( status == '0' ){
                    message.error( ret && ret.errorMessage || '删除失败' );
                }
            }
        },

        //打开校区选择框
        *onOpenSelectOrgModal({ payload },{ select , put , call }){
            let { selectModalVisible } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    selectModalVisible : !selectModalVisible
                }
            })
        },

        //关闭校区选择框
        *onSelectOrgModalClose({ payload },{ select , put , call }){
            let { selectModalVisible } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    selectModalVisible : !selectModalVisible
                }
            })
        },

        //点击提交更新校区
        *afterSelectOrgModalSubmit({ payload },{ select , put , call }){
            let { selectOrgs } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    selectOrgs
                }
            })
        },

        //新增活动
        *createActivity({ payload },{ call, put, select }){
            let { wxActivityCreateVisible } = payload;
			window.wActivityTimer = setInterval(function(){
				serviceRequest(
					BASE_URL + '/organController/getTenant', {}
				)
			}, 600000 )
            yield put({
                type : 'updateState',
                payload : {
                    wxActivityCreateVisible : !wxActivityCreateVisible
                }
            })
        },

        //修改活动
        *updateActivity({ payload },{ call, put, select }){
            let { id } = payload;
            let { ret } = yield call( getActivityInfo, ({ id : id }));
            if( ret && ret.errorCode == '9000' ){
                let activityInfo = {
                    name              : ret.name,
                    activityCover     : ret.activityCover,
                    detailPic         : ret.detailPic,
                    sort              : ret.sort,
                    orgIds            : ret.orgIds.join(','),
                    applyStartTime    : ret.applystartTime,
                    applyEndTime      : ret.applyendTime,
                    activityStartTime : ret.activitystartTime,
                    activityEndTime   : ret.activityendTime,
                    activityType      : ret.activityType,
                    applyType         : ret.applyType,
                    classCus          : ret.classCus,
                    materialFee       : ret.materialFee,
                    number            : ret.number,
                    cancelTime        : ret.cancelTime,
                    address           : ret.address,
                    target            : ret.target,
                    courseDetail      : ret.activityContent,
                    vipSet            : ret.vipSet,
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
                        activityInfo,
                        wxActivityCreateVisible : true,
                        id                      : id,
                        selectOrgs              : ret.orgIds,
                        isModify                : true,
                    }
                })
            }
        },

        //查看二维码
        *showActivityUrl({ payload },{ call, put, select }){
			if( !!window._init_data.firstOrg ){
				let { codeId, urlOrgIds } = payload;
                let urlOrgId = urlOrgIds[0];      //window._init_data.firstOrg.key;
				let { ret } = yield call( showActivityUrl, ({ actId : codeId, orgId : urlOrgId }));
				if( ret && ret.errorCode == '9000' ){
					yield put({
						type : 'updateState',
						payload : {
							codeUrlModalVisible  : true,
							url                  : window.compatibleProtocol(ret.address),
							urlOrgId,
							urlOrgIds,
							codeId,
						}
					})
				}
			}
        },
        //改变校区
        *TenantOrgFilterAction({ payload },{ call, put, select }){
            let { urlOrgId } = payload;
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let params = {
                actId    : wxActivityModel.codeId,
                orgId    : urlOrgId,
            }
            let { ret } = yield call( showActivityUrl, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        url: window.compatibleProtocol(ret.address)
                    }
                })
            }
        },

        //确认新增、修改活动
        *confirmAddWxActivity({ payload },{ call, put, select }){
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let { values } = payload;
            let applyStartTime = '',
                applyEndTime = '',
                cancelTime = '',
                activityStartTime = '',
                activityEndTime = '',
                activityContent = '',
                activityCover = '',
                activityDetail = [];
            if( !!values.applyTime && values.applyTime.length > 0 ){
                applyStartTime = values.applyTime[0].format('YYYY-MM-DD HH:mm:00');
                applyEndTime = values.applyTime[1].format('YYYY-MM-DD HH:mm:00');
            }
            if( !!values.activityTime && values.activityTime.length > 0 ){
                activityStartTime = values.activityTime[0].format('YYYY-MM-DD HH:mm:00');
                activityEndTime = values.activityTime[1].format('YYYY-MM-DD HH:mm:00');
            }
            if( !!values.cancelTime ){
                cancelTime = values.cancelTime.format('YYYY-MM-DD HH:mm:00');
            }
            if( !!values.activityContent && values.activityContent.length > 0 ){
                activityContent = JSON.stringify( values.activityContent );
            }
            if ( !!values.activityCover && values.activityCover.length > 0 ){
				let activity_cover_item = values.activityCover[0];
				let activity_cover_item_res = activity_cover_item.response;
				if ( activity_cover_item_res && activity_cover_item_res.errorCode == 9000 ){
					activityCover = activity_cover_item_res.data.url;
				} else {
					activityCover = activity_cover_item.url || '';
				}
			};
            if( !!values.detailPic && values.detailPic.length > 0 ){
                values.detailPic.map(function( item, index ){
                    let detail_pic_item = item;
                    let detail_pic_item_res = detail_pic_item.response;
                    if( detail_pic_item_res && detail_pic_item_res.errorCode == '9000' ){
                        activityDetail.push( detail_pic_item_res.data.url )
                    }else {
                        activityDetail.push( detail_pic_item.url || '' )
                    }
                });
                activityDetail = activityDetail.join(',');
            };

            // var enablePay = value.moneyNumber && parseFloat(value.moneyNumber); 

            let formData = {
                applyStartTime,
                applyEndTime,
                cancelTime     : cancelTime || applyEndTime,
                activityStartTime,
                activityEndTime,
                activityContent,
                activityCover,
                activityDetail,
                orgIds          : values.orgIds,
                name            : values.name,
                sort            : values.sort,
                activityType    : values.activityType,
                applyType       : values.applyType,
                classCus        : values.classCus || 0,
                materialFee     : values.materialFee || 0,
                number          : values.number,
                address         : values.address,
                targetPeople    : values.targetPeople,
				vipSet          : values.vipSet,
                id              : wxActivityModel.id || '',
                enablePay       : values.moneyNumber == undefined ? '0' : '1',
                payAmount       : values.moneyNumber || 0,

            };
            let { ret } = yield call( confirmAddWxActivity, ({ ...formData }));
            if( ret && ret.errorCode == '9000' ){
				clearInterval( window.wActivityTimer );
                yield put({
                    type : 'updateState',
                    payload : {
                        id                      : '',
                        activityInfo            : {},
                        wxActivityCreateVisible : false,
                        selectOrgs              : [],
                    }
                })
                let params = {
                    pageSize   : wxActivityModel.pageSize,
                    pageIndex  : wxActivityModel.pageIndex,
                    orgId      : wxActivityModel.orgId,
                    name       : wxActivityModel.name,
                    status     : wxActivityModel.status,
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

        //报名成功列表
        *applySuccess({ payload },{ call, put, select }){
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let successModalVisible = wxActivityModel.successModalVisible;
            let { id } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    successModalVisible : !successModalVisible,
                    activityId          : id,
                }
            });
            let params = {
                activityId : id,
                orgId      : wxActivityModel.successOrgId,
                status     : wxActivityModel.applyStatus,
                pageIndex  : wxActivityModel.successPageIndex,
                pageSize   : wxActivityModel.successPageSize,
            };
            yield put({
                type : 'getApplyList',
                payload : {
                    params
                }
            })
        },
        //得到报名成功的列表
        *getApplyList({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    successLoading : true,
                }
            })
            let { params } = payload;
            let { ret } = yield call( applySuccessList, ({ ...params }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        successDataSource  : ret.results,
                        successResultCount : ret.data.resultCount,
                        activityId         : params.activityId,
                        successOrgId       : params.orgId,
                        applyStatus        : params.status,
                        successPageSize    : params.pageSize,
                        successPageIndex   : params.pageIndex,
                    }
                })
            };
            yield put({
                type : 'updateState',
                payload : {
                    successLoading : false,
                }
            });
        },

        //报名成功搜索/清除条件
        *successSearchAndClearFunction({ payload },{ call, put, select }){
            let { values } = payload;
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let params = {
                pageIndex  : 0,
                pageSize   : wxActivityModel.successPageSize,
                activityId : wxActivityModel.activityId,
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
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let { ret } = yield call( cancelApply, ({ id : id, activityId : activityId }) );
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    orgId      : wxActivityModel.successOrgId,
                    status     : wxActivityModel.applyStatus,
                    pageIndex  : wxActivityModel.successPageIndex,
                    pageSize   : wxActivityModel.successPageSize,
                    activityId : wxActivityModel.activityId,
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
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let { ret } = yield call( toBeNumberOne, ({ id : id, activityId : activityId }) );
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    orgId      : wxActivityModel.successOrgId,
                    status     : wxActivityModel.applyStatus,
                    pageIndex  : wxActivityModel.successPageIndex,
                    pageSize   : wxActivityModel.successPageSize,
                    activityId : wxActivityModel.activityId,
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
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let params = {
                orgId      : wxActivityModel.successOrgId,
                status     : wxActivityModel.applyStatus,
                activityId : wxActivityModel.activityId,
            }
                    
            window.excelExport('/micNetApplyController/export', { ...params })

            // window.open( `${BASE_URL}/micNetApplyController/export?${qs.stringify(params)}`);
        },

        //报名成功分页
        *successPagination({ payload },{ call, put, select }){
            let { successPageIndex, successPageSize } = payload;
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let params = {
                pageIndex  : successPageIndex - 1,
                pageSize   : successPageSize,
                orgId      : wxActivityModel.successOrgId,
                status     : wxActivityModel.applyStatus,
                activityId : wxActivityModel.activityId,
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
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let remarkModalVisible = wxActivityModel.remarkModalVisible;
            let { id, remark } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    remark             : remark,
                    applyId            : id,
                    remarkModalVisible : !remarkModalVisible,
                }
            })
        },
        //确认添加备注
        *confirmAddRemark({ payload },{ call, put, select }){
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let { value } = payload;
            let remark = value.remark;
            let remarkModalVisible = wxActivityModel.remarkModalVisible;
            let params = {
                remark     : remark,
                id         : wxActivityModel.applyId,
                activityId : wxActivityModel.activityId,
            }
            let { ret } = yield call( confirmAddRemark, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                let obj = {
                    orgId      : wxActivityModel.successOrgId,
                    status     : wxActivityModel.applyStatus,
                    pageIndex  : wxActivityModel.successPageIndex,
                    pageSize   : wxActivityModel.successPageSize,
                    activityId : wxActivityModel.activityId,
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
                        remarkModalVisible : !remarkModalVisible,
                        activityId         : '',
                        remark             : '',
                    }
                })
            }
        },

        //分页
        *pagination({ payload },{ call, put, select }){
            let { pageSize, pageIndex } = payload;
            let wxActivityModel = yield select( state => state.wxActivityModel );
            let params = {
                pageSize     : pageSize,
                pageIndex    : pageIndex - 1,
                orgId        : wxActivityModel.orgId,
                name         : wxActivityModel.name,
                status       : wxActivityModel.status,
            };
            yield put({
                type : 'getActivityList',
                payload : {
                    params
                }
            })
        },
    },
	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
