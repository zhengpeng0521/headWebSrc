import {
    getOrgOptionsList,    //得到校区下拉列表
    getCourseList,        //得到课程列表
    deleteCourse,         //删除课程
    getCourseInfo,        //得到单个课程信息
    confirmCreateForm,    //确认新增
    getCourseOrgIds       //得到已选校区列表

} from '../../../../services/erp/courseManage/courseManageService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'courseManageModel',
	state : {

		searchVisible         : false,       //搜索框是否可见
        orgOptionsList        : [],          //搜索框校区下拉列表
        courseTitle           : '',          //课程名称
        courseType            : '',          //课程类型
        orgId                 : '',          //校区

        id                    : '',          //修改用课程id
		createFormVisible     : false,       //新增框是否可见
        courseInfo            : {},          //课程信息
        selectModalVisible    : false,       //校区选择框是否可见
        selectOrgs            : [],          //机构选择- 选择的机构列表
		dataSource            : [],          //列表数据
        resultCount           : '',          //列表数据总数

        selectedRecordIds     : [],          //批量操作选择的列表项
        selectedRowKeys       : [],
        selectedRows          : [],

        pageIndex             : 0,
        pageSize              : 10,

        selectedOrgIds        : [],
        selectedOrgModalVisible : false,

        modalSubmitModalButtonLoading : false,  //新增编辑表单按钮加载状态
	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/erp_course_list') {
                    dispatch({
                        type : 'getCourseParams',
                        payload : {

                        }
                    });
                    dispatch({
                        type : 'getOrgOptionsList',
                        payload : {

                        }
                    })
                }
            });
        },
    },

	effects : {
        //得到校区下拉列表
        *getOrgOptionsList({ payload },{ select, call, put }){
            let { ret } = yield call( getOrgOptionsList );
            if( ret && ret.errorCode == '9000' ){
                let orgOptionsList = ret.results;
                yield put({
                    type : 'updateState',
                    payload : {
                        orgOptionsList
                    }
                })
            };
        },

        //得到传参
        *getCourseParams({ payload },{ call, put, select }){
            let courseManageModel = yield select( state => state.courseManageModel );
            let pageSize    = courseManageModel.pageSize;
            let pageIndex   = courseManageModel.pageIndex;

            let params = {
                pageSize   : courseManageModel.pageSize,
                pageIndex  : courseManageModel.pageIndex,
                orgId      : courseManageModel.orgId,
                title      : courseManageModel.courseTitle,
                courseType : courseManageModel.courseType,
            };
            yield put({
                type : 'getCourseList',
                payload : {
                    params
                }
            })
        },

        //得到列表数据
        *getCourseList({ payload },{ select , call , put}){
            let { params } = payload;
            let { ret } = yield call( getCourseList, ({ ...params }) );
            if(ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource : ret.results,
                        resultCount : ret.data.resultCount,
                        pageSize   : params.pageSize,
                        pageIndex  : params.pageIndex,
                        orgId      : params.orgId,
                        courseTitle: params.title,
                        courseType : params.courseType
                    }
                })
            } else {
              message.error( (ret && ret.errorMessage) || '查询课程列表出错啦');
          }
        },

        //点击搜索按钮进行搜索
        *onCourseSearch({ payload }, { call, put, select }){
            let { values } = payload;
            let courseManageModel = yield select( state => state.courseManageModel );
            let params = {
                pageSize   : courseManageModel.pageSize,
                pageIndex  : 0,
                id         : values.id,
                orgId      : values.orgId,
                title      : values.title,
                courseType : values.courseType,
            };
            yield put({
                type : 'getCourseList',
                payload : {
                    params
                }
            })
        },

        //清除条件
        *onCourseReset({ payload },{ call, put, select }){
            let { id, orgId, title, courseType } = payload;
            let courseManageModel = yield select( state => state.courseManageModel );
            let params = {
                id : id,
                orgId : orgId,
                title : title,
                courseType : courseType,
                pageSize : courseManageModel.pageSize,
                pageIndex : courseManageModel.pageIndex,
            }
            yield put({
                type : 'getCourseList',
                payload : {
                    params,
                }
            })
        },

        //批量操作删除课程
        *deleteCourse({ payload },{ select, call ,put}){
            let { selectedRecordIds } = payload;
            let courseIds = selectedRecordIds.join(',');
            let courseManageModel = yield select( state => state.courseManageModel );
            let params = {
                pageSize   : courseManageModel.pageSize,
                pageIndex  : courseManageModel.pageIndex,
                title      : courseManageModel.courseTitle,
                courseType : courseManageModel.courseType,
                orgId      : courseManageModel.orgId,
            }
            let { ret } = yield call( deleteCourse , ({ courseIds : courseIds, status : '0' }))
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'getCourseList',
                    payload : {
                        params
                    }
                });
                yield put({
                    type : 'updateState',
                    payload : {
                        selectedRecordIds : [],
                        selectedRows      : [],
                        selectedRowKeys : [],
                    }
                })
                message.success('删除成功');
            }
        },

		//点击新建课程按钮
		*createCourse({ payload },{ select , call ,put }){
			let { createFormVisible } = payload;
			yield put({
				type : 'updateState',
				payload : {
					createFormVisible : !createFormVisible,
                    courseInfo : {},
                    selectOrgs : [],
				}
			});

		},

        //修改课程
        *updateCourse({ payload },{ select , call, put }){
            let { createFormVisible, courseId } = payload;
            let { ret } = yield call( getCourseInfo ,({ id : courseId }));
            let orgIds = yield call( getCourseOrgIds , ({ courseId : courseId }));
            if( orgIds && orgIds.ret && orgIds.ret.errorCode == '9000' ){
                let selectOrgs = orgIds.ret.orgIds;
                yield put({
                    type : 'updateState',
                    payload : {
                        selectOrgs,
                        id : courseId
                    }
                });
            }
            if( ret && ret.errorCode == '9000' ){
                let courseInfo = {
                    cnum       : ret.cnum,
                    costType   : ret.costType,
                    courseType : ret.courseType,
                    id         : ret.id,
                    intro      : ret.intro,
                    perNum     : ret.perNum,
                    status     : ret.status,
                    title      : ret.title
                };
                yield put({
                    type : 'updateState',
                    payload : {
                        createFormVisible : !createFormVisible,
                        courseInfo
                    }
                });
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

		//确认新建课程
		*confirmCreateForm({ payload },{ select , put , call }){
            yield put({ type : 'showModalButtonLoading' })
			let { createFormVisible, params } = payload;
            let courseManageModel = yield select( state => state.courseManageModel );

            let id          = courseManageModel.id;
            let values = {
                pageSize   : courseManageModel.pageSize,
                pageIndex  : courseManageModel.pageIndex,
                title      : courseManageModel.courseTitle,
                courseType : courseManageModel.courseType,
                orgId      : courseManageModel.orgId,
            };
            let obj = {};
            if( id ){
                obj = yield call( confirmCreateForm ,( { ...params, id : id}));
            } else {
                obj = yield call( confirmCreateForm, ({ ...params }));
            }
            if( obj.ret && obj.ret.errorCode == '9000' ){
                message.success(obj.ret.errorMessage || '成功')
                yield put({
                    type : 'getCourseList',
                    payload : {
                        params : values
                    }
                });
                yield put({
                    type : 'updateState',
                    payload : {
                        createFormVisible : !createFormVisible,
                        id : '',
                    }
                })
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessgae || '失败')
            }else{
                message.error('失败')
            }
            yield put({ type : 'closeModalButtonLoading' })
		},

		//取消新建课程
		*cancelCreateForm({ payload } , { select , put ,call }){
			let { createFormVisible } = payload;
			yield put({
				type : 'updateState',
				payload : {
					createFormVisible : !createFormVisible,
                    courseInfo : {},
                    selectOrgs : [],
					id         : ''
				}
			})
		},

        //分页
        *paginationChange({ payload } , { select , put ,call }){
            let { pageSize , pageIndex } = payload;
            let courseManageModel = yield select( state => state.courseManageModel );
            let params = {
                pageSize   : pageSize,
                pageIndex  : pageIndex - 1,
                title      : courseManageModel.courseTitle,
                courseType : courseManageModel.courseType,
                orgId      : courseManageModel.orgId,
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
		},
        //新增编辑modal按钮开启加载
        showModalButtonLoading( state, action ){
			return { ...state, ...action.payload , modalSubmitModalButtonLoading : true }
		},
        //新增编辑modal按钮关闭加载
        closeModalButtonLoading( state, action ){
			return { ...state, ...action.payload , modalSubmitModalButtonLoading : false }
		},
	}
}
