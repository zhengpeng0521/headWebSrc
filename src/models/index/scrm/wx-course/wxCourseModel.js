import {
    getCourseList,                     //得到课程列表
    getCheckBoxOptions,                //得到课程类型和年龄选择项
    getCourseInfo,                     //得到单个课程信息
    confirmAddWxCourse,                //保存课程信息

    updateCourseStatus,                //改变课程状态

    showCourseUrl,                     //查看二维码
} from '../../../../services/scrm/wx-course/wxCourseService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'wxCourseModel',

	state : {
        searchVisible                      : false,           //筛选框是否可见
        modifyCourse                       : false,           //显示选中的机构
        orgId                              : '',
        courseName                         : '',
        status                             : '',

        loading                            : false,
        dataSource                         : [],              //列表数据
        resultCount                        : '',
        pageIndex                          : 0,
        pageSize                           : 20,
        selectedRows                       : [],
        selectedRowKeys                    : [],

        //表单属性
        wxCourseCreateVisible              : false,
        courseInfo                         : {},
        dict                               : {},              //课程类型和年龄选择项
        id                                 : '',

        //选中校区
        selectModalVisible                 : false,
        selectOrgs                         : [],

        //查看所选校区
        selectedOrgModalVisible            : false,
        selectedOrgIds                     : [],

        //二维码
        url                                : '',
        urlOrgId                           : '',
        urlOrgIds                          : [],
        codeUrlModalVisible                : false,
        codeId                             : '',
        tenantId                           : '',

	},

    subscriptions : {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {
                if(pathname == '/scrm_woffice_course') {
                    dispatch({
                        type : 'getCourseParams',
                        payload : {
							pageSize : 20
                        }
                    });
                    dispatch({
                        type : 'getCheckBoxOptions',
                        payload : {

                        }
                    })
                }
            });
        },
    },

	effects : {
        //得到课程类型和年龄选项
        *getCheckBoxOptions({ payload },{ call, put, select }){
            let { ret } = yield call( getCheckBoxOptions );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dict : ret.dict
                    }
                })
            }else {
                message.error( ret && ret.errorMessage || '获取课程类型选项失败')
            }
        },

        //搜索和清除条件
        *searchAndClearFunction({ payload },{ call, put, select }){
            let { values } = payload;
            let wxCourseModel = yield select( state => state.wxCourseModel );
            let params = {
                pageIndex  : 0,
                pageSize   : wxCourseModel.pageSize,
                ...values
            }
            yield put({
                type : 'getCourseList',
                payload : {
                    params
                }
            })
        },

        //进入页面得到传参
        *getCourseParams({ payload },{ call, put, select }){
            let wxCourseModel = yield select( state => state.wxCourseModel );
            let params = {
                pageIndex   : wxCourseModel.pageIndex,
                pageSize    : payload.pageSize,
                // orgId       : wxCourseModel.orgId,
                courseName  : wxCourseModel.courseName,
                status      : wxCourseModel.status,
            };
            yield put({
                type : 'getCourseList',
                payload : {
                    params
                }
            })
        },

        //得到列表数据
        *getCourseList({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true,
                }
            });
            let { params } = payload;
            let { ret } = yield call( getCourseList, ({ ...params }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource       : ret.results,
                        resultCount      : ret.data.resultCount,
                        selectedRows     : [],
                        selectedRowKeys  : [],
                        ...params,
                    }
                });
            }else {
                message.error( ( ret && ret.errorMessage ) || '列表数据加载失败' );
            }
            yield put({
                type : 'updateState',
                payload : {
                    loading : false,
                }
            })
        },
			
        //删除、上架、下架课程
        *updateCourseStatus({ payload },{ call, put, select }){
            let { selectedRows, status } = payload;
            let wxCourseModel = yield select( state => state.wxCourseModel );
            let ids = [];
            selectedRows && selectedRows.map(function( item, index ){
                ids.push( item.id );
            });
            ids = ids.join(',');
            let { ret } = yield call( updateCourseStatus, ({ ids : ids, status : status }) );
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    pageIndex   : wxCourseModel.pageIndex,
                    pageSize    : wxCourseModel.pageSize,
                    orgId       : wxCourseModel.orgId,
                    courseName  : wxCourseModel.courseName,
                    status      : wxCourseModel.status,
                };
                yield put({
                    type : 'getCourseList',
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

        //修改课程
        *updateCourse({ payload },{ call, put, select }){
            let wxCourseModel = yield select( state => state.wxCourseModel );
            let { id } = payload;
            let { ret } = yield call( getCourseInfo, ({ courseId : id }));
            if( ret && ret.errorCode == '9000' ){
				window.wActivityTimer = setInterval(function(){
					serviceRequest(
						BASE_URL + '/organController/getTenant', {}
					)
				}, 600000 )
                yield put({
                    type : 'updateState',
                    payload : {
                        wxCourseCreateVisible : true,
                        courseInfo            : ret.results,
                        selectOrgs            : ret.results.orgIds && ret.results.orgIds.split(','),
                        id                    : id,
                    }
                })
            }
        },

        //查看二维码
        *showCourseUrl({ payload },{ call, put, select }){            
			if( !!window._init_data.firstOrg ){
				let { codeId, urlOrgIds } = payload;
                let urlOrgId = urlOrgIds[0]; // window._init_data.firstOrg.key;                
				let { ret } = yield call( showCourseUrl, ({ courseId : codeId, orgId : urlOrgId }));
				if( ret && ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
                            codeId: codeId,
							codeUrlModalVisible  : true,
							url: window.compatibleProtocol(ret.results.url),
							urlOrgId,
							urlOrgIds,
						}
					})
				}
			}
        },
        //改变校区
        *TenantOrgFilterAction({ payload },{ call, put, select }){
            let { urlOrgId } = payload;
            let wxCourseModel = yield select( state => state.wxCourseModel );
            let params = {
                courseId : wxCourseModel.codeId,
                orgId    : urlOrgId,
            }
            let { ret } = yield call( showCourseUrl, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        url: window.compatibleProtocol(ret.results.url)
                    }
                })
            }
        },

        //新增课程
        *createCourse({ payload },{ call, put, select }){
            let { wxCourseCreateVisible } = payload;
			window.wActivityTimer = setInterval(function(){
				serviceRequest(
					BASE_URL + '/organController/getTenant', {}
				)
			}, 600000 )
            yield put({
                type : 'updateState',
                payload : {
                    wxCourseCreateVisible : !wxCourseCreateVisible
                }
            })
        },

        //确认新增课程
        *confirmAddWxCourse({ payload },{ call, put, select }){
            let wxCourseModel = yield select( state => state.wxCourseModel );
            let wxCourseCreateVisible = wxCourseModel.wxCourseCreateVisible;
            let { values } = payload;
            let adAge = '',
                detailContent = '',
                courseCover = '',
                courseType = '',
                detailPic = [];
            if ( !!values.courseCover && values.courseCover.length > 0 ){
				let course_cover_item = values.courseCover[0];
				let course_cover_item_res = course_cover_item.response;
				if ( course_cover_item_res && course_cover_item_res.errorCode == 9000 ){
					courseCover = course_cover_item_res.data.url;
				} else {
					courseCover = course_cover_item.url || '';
				}
			};
            if( !!values.detailPic && values.detailPic.length > 0 ){
                values.detailPic.map(function( item, index ){
                    let detail_pic_item = item;
                    let detail_pic_item_res = detail_pic_item.response;
                    if( detail_pic_item_res && detail_pic_item_res.errorCode == '9000' ){
                        detailPic.push( detail_pic_item_res.data.url )
                    }else {
                        detailPic.push( detail_pic_item.url || '' )
                    }
                });
                detailPic = detailPic.join(',');
            }
            if( !!values.adAge ){
                adAge = values.adAge;
            };
            if( !!values.courseContent ){
                detailContent = JSON.stringify( values.courseContent );
            };
            if( !!values.courseType ){
                courseType = values.courseType.join(',');
            };
            let params = {
                adAge,
                detailContent,
                courseType,
                detailPic,
                courseCover,
                courseName    : values.name,
                orgIds         : values.orgIds,
                perTime       : values.perTime,
                sort          : values.sort,
                status        : 1,
                id            : wxCourseModel.id || 0,
            }
            let { ret } = yield call( confirmAddWxCourse, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
				clearInterval( window.wActivityTimer );
                yield put({
                    type : 'updateState',
                    payload : {
                        id                    : '',
                        wxCourseCreateVisible : !wxCourseCreateVisible,
                        courseInfo            : {},
                        selectOrgs            : [],
                    }
                })
                let data = {
                    pageSize    : wxCourseModel.pageSize,
                    pageIndex   : wxCourseModel.pageIndex,
                    orgId       : wxCourseModel.orgId,
                    courseName  : wxCourseModel.courseName,
                    status      : wxCourseModel.status,
                };
                yield put({
                    type : 'getCourseList',
                    payload : {
                        params : data
                    }
                });
                message.success( '保存课程成功' );
            }else {
                message.error( ret && ret.errorMessage || '保存失败' );
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

        //分页
        *pagination({ payload },{ call, put, select }){
            let { pageSize, pageIndex } = payload;
            let wxCourseModel = yield select( state => state.wxCourseModel );
            let params = {
                pageSize    : pageSize,
                pageIndex   : pageIndex - 1,
                orgId       : wxCourseModel.orgId,
                courseName  : wxCourseModel.courseName,
                status      : wxCourseModel.status,
            };
            yield put({
                type : 'getCourseList',
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
