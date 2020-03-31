import {
    getCourseIntroduceList,           //得到课程列表
    batchOperation,                   //批量操作
    getSingleCourseInfo,              //得到单个课程信息
    confirmAddCourse,                 //确认新增
    tableOnUpdateHtmldetailItem,      //富文本编辑器
    confirmAddCourseEditor,           //确认课程详情
} from '../../../../services/scrm/course-introduce/courseIntroduceService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'courseIntroduceModel',

    state : {
        searchVisible                      : false,              //搜索框是否可见

        courseId                           : '',
        courseName                         : '',
        status                             : '',

        pageIndex                          : 0,
        pageSize                           : 10,
        dataSource                         : [],
        loading                            : false,
        resultCount                        : '',
        selectedRowKeys                    : [],
        selectedRows                       : [],
        selectedRecordIds                  : [],

        //新增修改框
        createCourseIntroduceVisible       : false,
        updateCourseId                           : '',          //修改是的课程ID
        singleCourseInfo                   : {},                //修改获得的数据
        selectModalVisible                 : false,             //校区选择框是否可见
        selectOrgs                         : [],                //机构选择- 选择的机构列表

        //富文本编辑器
        courseIntroduceEditorVisible       : false,
        htmlDetail                         : '',                //富文本编辑器内容
        htmlCourseId                       : '',


        //已选适用门店
        selectedOrgIds                     : [],
        selectedOrgModalVisible            : false,

    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/scrm_kb_cintro_list' ){
                    dispatch({
                        type : 'getCourseIntroduceParams',
                        payload : {

                        }
                    });
                }
            })
        }
    },

    effects : {
        //得到传参
        *getCourseIntroduceParams({ payload },{ call, put, select }){
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let params = {
                pageIndex     : courseIntroduceModel.pageIndex,
                pageSize      : courseIntroduceModel.pageSize,
                courseId      : courseIntroduceModel.courseId,
                courseName    : courseIntroduceModel.courseName,
                status        : courseIntroduceModel.status,
            };
            yield put({
                type : 'getCourseIntroduceList',
                payload : {
                    params
                }
            })
        },

        //得到列表
        *getCourseIntroduceList({ payload },{ call, put, select }){
            let { params } = payload;
            let { ret  } = yield call( getCourseIntroduceList, ({ ...params }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource         : ret.data.results,
                        resultCount        : ret.data.resultCount,
                        selectedRecordIds  : [],
                        selectedRows       : [],
                        selectedRowKeys    : [],
                        ...params,
                    }
                })
            }else {
                message.error( ret && ret.errorMessage || '列表加载失败' )
            }
        },

        //搜索与重置
        *searchFunction({ payload },{ call, put, select }){
            let { values } = payload;
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let params = {
                pageIndex     : 0,
                pageSize      : courseIntroduceModel.pageSize,
                ...values,
            };
            yield put({
                type : 'getCourseIntroduceList',
                payload : {
                    params
                }
            })
        },

        //批量操作
        *batchOperation({ payload },{ call, put, select }){
            let { selectedRecordIds, status } = payload;
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let cids = '';
            if( !!selectedRecordIds ){
                cids = selectedRecordIds.join(',');
            };
            let values = {
                cids   : cids,
                status : status,
            };
            let { ret } = yield call( batchOperation, ({ ...values }));
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    pageIndex     : courseIntroduceModel.pageIndex,
                    pageSize      : courseIntroduceModel.pageSize,
                    courseId      : courseIntroduceModel.courseId,
                    courseName    : courseIntroduceModel.courseName,
                    status        : courseIntroduceModel.status,
                };
                yield put({
                    type : 'getCourseIntroduceList',
                    payload : {
                        params
                    }
                })
            } else {
                message.error( ret && ret.errorMessage || '操作失败' )
            }
        },
        //删除、上下架
        *deleteAndUpdateCourse({ payload },{ call, put, select }){
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let { cids, status } = payload;
            let values = {
                cids   : cids,
                status : status,
            };
            let { ret } = yield call( batchOperation, ({ ...values }));
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    pageIndex     : courseIntroduceModel.pageIndex,
                    pageSize      : courseIntroduceModel.pageSize,
                    courseId      : courseIntroduceModel.courseId,
                    courseName    : courseIntroduceModel.courseName,
                    status        : courseIntroduceModel.status,
                };
                yield put({
                    type : 'getCourseIntroduceList',
                    payload : {
                        params
                    }
                })
            } else {
                message.error( ret && ret.errorMessage || '操作失败' )
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

        //点击修改课程
        *updateCourse({ payload },{ call, put, select }){
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let createCourseIntroduceVisible = courseIntroduceModel.createCourseIntroduceVisible
            let { id } = payload;
            let { ret } = yield call( getSingleCourseInfo, ({ course_id : id }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        createCourseIntroduceVisible : !createCourseIntroduceVisible,
                        updateCourseId               : id,
                        singleCourseInfo             : ret.data.course,
                        selectOrgs                   : ret.data.orgs,
                    }
                })
            }
        },

        //确认新增修改
        *confirmAddCourse({ payload },{ call, put, select }){
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let updateCourseId = courseIntroduceModel.updateCourseId;
            let { values, selectOrgs } = payload;
            console.log('aa',values);
            let couse_cover = '';
            let adageStr = '';
            if( !!values.adage ){
                adageStr = values.adage.join(',');
            }
            if ( values.couse_cover && values.couse_cover.length > 0){
				let couse_cover_item = values.couse_cover[0];
				let couse_cover_item_res = couse_cover_item.response;
				if ( couse_cover_item_res && couse_cover_item_res.errorCode == 9000 ){
					couse_cover = couse_cover_item_res.data.url;
				} else {
					couse_cover = couse_cover_item.url || "";
				}
			};
            let obj = {};
            if( !!updateCourseId ){
                obj = {
                    course_id   : updateCourseId,
					belongOrg   : values.belongOrg,
					course_name : values.course_name,
					sort        : values.sort,
                }
            } else {
                obj = {
					belongOrg   : values.belongOrg,
					course_name : values.course_name,
					sort        : values.sort,
                }
            }
            let { ret } = yield call( confirmAddCourse, ({ ...obj, couse_cover : couse_cover, adage : adageStr }));
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    pageSize      : courseIntroduceModel.pageSize,
                    pageIndex     : courseIntroduceModel.pageIndex,
                    courseId      : courseIntroduceModel.courseId,
                    courseName    : courseIntroduceModel.courseName,
                    status        : courseIntroduceModel.status,
                }
                yield put({
                    type : 'getCourseIntroduceList',
                    payload : {
                        params
                    }
                });
                yield put({
                    type : 'updateState',
                    payload : {
                        createCourseIntroduceVisible : !courseIntroduceModel.createCourseIntroduceVisible,
                        selectOrgs                   : [],
                        singleCourseInfo             : {},
                        updateCourseId               : '',

                    }
                })
            }
        },

        //课程详情
        *tableOnUpdateHtmldetailItem({ payload },{ call, put ,select }){
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let courseIntroduceEditorVisible = courseIntroduceModel.courseIntroduceEditorVisible;
            let { id } = payload;
            let { ret } = yield call( tableOnUpdateHtmldetailItem, ({ course_id : id }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        courseIntroduceEditorVisible : !courseIntroduceEditorVisible,
                        htmlCourseId                 : id,
                        htmlDetail                   : ret.course_detail || '',
                    }
                });
            }
        },

        //确认课程详情
        *confirmAddCourseEditor({ payload },{ call, put, select }){
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let courseIntroduceEditorVisible = courseIntroduceModel.courseIntroduceEditorVisible;
            let id = courseIntroduceModel.htmlCourseId;
            let { values } = payload;

            let { ret } = yield call( confirmAddCourseEditor, ({ ...values, course_id : id }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        courseIntroduceEditorVisible : !courseIntroduceEditorVisible,
                        htmlCourseId                 : '',
                        htmlDetail                   : '',
                    }
                })
            }
        },

        //查看适用门店
        *showSelectedOrgModal({ payload },{ call, put, select }){
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let selectedOrgModalVisible = courseIntroduceModel.selectedOrgModalVisible
            let { id } = payload;
            let { ret } = yield call( getSingleCourseInfo, ({ course_id : id }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        selectedOrgIds          : ret.data.orgs,
                        selectedOrgModalVisible : !selectedOrgModalVisible
                    }
                })
            }
        },

        //分页
        *pagination({ payload },{ call, put, select }){
            let { pageSize, pageIndex } = payload;
            let courseIntroduceModel = yield select( state => state.courseIntroduceModel );
            let params = {
                pageSize      : pageSize,
                pageIndex     : pageIndex - 1,
                courseId      : courseIntroduceModel.courseId,
                courseName    : courseIntroduceModel.courseName,
                status        : courseIntroduceModel.status,
            };
            yield put({
                type : 'getCourseIntroduceList',
                payload : {
                    params
                }
            })
        },
    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
