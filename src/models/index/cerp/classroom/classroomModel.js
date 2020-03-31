import {
    GetTenantOrg,               /*页面加载获取校区*/
    GetClassRoomList,           /*教室列表*/
    CreateClassRoom,            /*新增教室*/
    UpdateClassRoom,            /*编辑教室*/
    DeleteClassroom,            /*删除教室*/
    classroomDetail             /*教室详情*/
} from '../../../../services/cerp/classroom/classRoom';
import { message } from 'antd';
import { parse } from 'qs';
export default {

	namespace : 'cerpClassroomModel',

	state: {
		//教室列表
		classRoomDataSource   : [],       //教室数据数组
		classRoomDataCount    : 0,       //教师数据总数
		classRomeTableLoading : false,    //教师列表加载状态
		loading               : false ,
		selectedRowKeys       : [],       //选中数据数组
		selectedRows          : [],
		selectedListId        : [],       //批量删除所选的
		newColumns            : [],
		//分页

		pageIndex             : 0,
		pageSize              : 20,

		className             : '',          //教室名称
		orgId                 : '',          //校区
		//筛选教室
		showSearch            : false,

		//新增教室
		classRomeSelectOrgId  : '',       //默认选中的校区
		modalType             : '',       //新增或者编辑modal类型('create'/'update')
		showAdd               : false,
		classroomInfo         : {},       //教室信息
		formButtonLoading     : false,    //新增编辑教室按钮加载状态

		searchData            : {},       //搜索栏数据
		classroomList         : [],

		modalAllDetailContent  : {},      //列表详情数据
		createFormModelVisible : false,
		classroomEditVisible   : false,   //编辑显示

		addSchduleVisible      : false,   //添加排课显示

		/*删除确认modal*/
		removeClsRoomModalAlertVisible : false,          //删除二次确认modal是否显示
		removeClsRoomModalAlertTitle : '',               //删除二次确认modal表单头部
		removeClsRoomModalAlertContent : '',             //删除二次确认modal表单内容
		removeClsRoomModalAlertButtonLoading : false,    //删除二次确认确认按钮加载状态
		removeClsRoomModalAlertMessage : '',             //删除二次确认点击确定需要提交的信息
  },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/cerp_kcjs_room') {
                    dispatch({
                        type : 'GetTenantOrg'
                    });
                    dispatch({
                        type: 'GetClassRoomList',
                        payload: {
                            pageSize : 20,
                            pageIndex : 0
                        },
                    });
                }
            });
        },
    },

    effects: {
        /*教室列表*/
        *'GetClassRoomList'({ payload } , { put , call , select }){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true
                }
            })
             let orgid = window._init_data.cerp_orgId;                 //获取所选校区
             payload.orgId = orgid;

            let { ret } = yield call(GetClassRoomList,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classRoomDataSource : ret.results,
                        classRoomDataCount  : ret.data.resultCount,
                        pageSize            : ret.data.pageSize,
                        pageIndex           : ret.data.pageIndex,
                        orgId               : window._init_data.cerp_orgId,
                        createFormModelVisible : false
                    }
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
            yield put({
                  type : 'updateState',
                  payload : {
                      loading : false
                  }
            })
        },

        //清除条件
        *'onCourseReset'({ payload },{ call, put, select }){
             yield put({
                type : 'updateState',
                payload : {
                    loading : true
                }
            })
            let orgid = window._init_data.cerp_orgId;                 //获取所选校区
            payload.orgId = orgid;
            let { ret } = yield call(GetClassRoomList,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classRoomDataSource : ret.results,
                        classRoomDataCount  : ret.data.resultCount,
                        orgId               : window._init_data.cerp_orgId,
                        className           : '',
                        pageSize            : ret.data.pageSize,
                        pageIndex           : ret.data.pageIndex,
                        createFormModelVisible : false
                    }
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }

            yield put({
                  type : 'updateState',
                  payload : {
                      loading : false
                  }
            })
        },

         //点击搜索按钮进行搜索
        *'onClassSearch'({ payload }, { call, put, select }){
            let { values } = payload;
            let cerpClassroomModel = yield select( state => state.cerpClassroomModel );
            let params = {
                    pageSize   : cerpClassroomModel.pageSize,
                    pageIndex  : 0,
                    orgId      : cerpClassroomModel.orgId,
                    name      :  values.name,
            };
            let classname = values.name;
            let { ret } = yield call(GetClassRoomList,parse(params));
            if( ret && ret.errorCode == 9000 ){
                 yield put({
                    type : 'updateState',
                    payload : {
                        classRoomDataSource : ret.results,
                        classRoomDataCount  : ret.data.resultCount,
                        className           : classname,
                        pageSize            : ret.data.pageSize,
                        pageIndex           : ret.data.pageIndex,
                        createFormModelVisible : false
                    }
                 })
            }
        },

        /*新增编辑之后的列表查询*/
        *'AfterOperationGetList'({ payload } , { put , call , select }){
            let cerpClassroomModel = yield select(state => state.cerpClassroomModel);
            let searchData = cerpClassroomModel.searchData || {};
            let pageIndex = cerpClassroomModel.pageIndex;
            let pageSize = cerpClassroomModel.pageSize;
            let orgId = cerpClassroomModel.orgId;
            let name = cerpClassroomModel.className;
            let params = { pageIndex , pageSize ,orgId,name, ...searchData }
            let { ret } = yield call(GetClassRoomList,parse(params));
            if( ret && ret.errorCode == 9000 ){
                /*如果删除或停用时对当前页全部项目操作，则操作成功后请求前一页的数据(当前页已无数据)*/
                if((ret.results).length == 0 && pageIndex > 0){
                    params.pageIndex = pageIndex-1;     //发送前一页数据请求的页码
                    let { ret } = yield call(GetClassRoomList,parse(params));
                    if( ret && ret.errorCode == 9000 ){
                        yield put({
                            type : 'updateState',
                            payload : {
                                classRoomDataSource : ret.results,
                                classRoomDataCount : ret.data.resultCount,
                                formButtonLoading : false,
                                showAdd : false,
                                selectedRowKeys : [],
                                selectedRows : [],
                                pageIndex : ret.data.pageIndex,
                                pageSize : ret.data.pageSize
                            }
                        })
                    }else{
                        ret && ret.errorMessage && message.error(ret.errorMessage)
                    }
                }else{
                    yield put({
                        type : 'updateState',
                        payload : {
                            classRoomDataSource : ret.results,
                            classRoomDataCount : ret.data.resultCount,
                            formButtonLoading : false,
                            showAdd : false,
                            selectedRowKeys : [],
                            selectedRows : [],
                            pageIndex : ret.data.pageIndex,
                            pageSize : ret.data.pageSize
                        }
                    })
                }
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
        },

        /*新增教室*/
        *'CreateClassRoom'({ payload } , { put , call , select }){
            yield put ({ type : 'showTableLoading' });
            let cerpClassroomModel = yield select( state => state.cerpClassroomModel );
            let params = {
                name  : payload.name,
                intro : payload.intro,
                orgId : cerpClassroomModel.orgId,
            }
            let { ret } = yield call(CreateClassRoom,parse(params));
            if( ret && ret.errorCode == 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type: 'updateState',
                    payload : {
                       showAdd : false,
                       orgId   : cerpClassroomModel.orgId,
                    }
                })
                yield put({
                    type : 'AfterOperationGetList',
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
            yield put ({ type : 'closeTableLoading' });
        },


        /*教室详情*/
        *'classroomDetail'({ payload }, { put, call, select }){
			let { ret } = yield call( classroomDetail,parse( payload ) );
			if ( ret && ret.errorCode === 9000 ) {
				yield put({
					type: 'updateState',
					payload : {
						modalAllDetailContent : ret,
						createFormModelVisible :true,
					}
				})
			}else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取教室详情失败')
			}
        },

        /*编辑教室*/
        *'editClassRoom'({ payload } , { put , call , select }){
            yield put ({ type : 'showTableLoading' });
            let { ret } = yield call(UpdateClassRoom,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                message.success(ret.errorMessage);
                yield put({
					type: 'updateState',
					payload : {
						createFormModelVisible : false,
						classroomEditVisible:false,
					}
				})
                yield put({
                    type : 'AfterOperationGetList',
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
            yield put ({ type : 'closeTableLoading' });
        },

        /*删除教室*/
        *'DeleteClassroom'({ payload } , { put , call , select }){
            yield put ({ type : 'showTableLoading' });
            let { ret } = yield call(DeleteClassroom,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationGetList',
                })
            }else{
                message.error(ret.errorMessage)
            }
            yield put ({ type : 'closeTableLoading' });
        },

         /*删除详情数据教室*/
        *'deleteDetailClass'({ payload } , { put , call , select }){
            yield put ({ type : 'showTableLoading' });
            yield put ({ type : 'showAlertModalButtonLoading' });
            let { ret } = yield call(DeleteClassroom,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                message.success('删除教室成功');
                yield put({
                    type: 'updateState',
                    payload : {
                        createFormModelVisible : false,

                        /*初始化提醒框*/
                        removeClsRoomModalAlertVisible : false,                //删除二次确认modal是否显示
                        removeClsRoomModalAlertTitle : '删除确认',               //删除二次确认modal表单头部
                        removeClsRoomModalAlertContent : '确定删除此教室吗',      //删除二次确认modal表单内容
                        removeClsRoomModalAlertButtonLoading : false,          //删除二次确认确认按钮加载状态
                        removeClsRoomModalAlertMessage : {},
                    }
                })
                yield put({
                    type : 'AfterOperationGetList',
                })
            }else{
                 message.error(ret.errorMessage)
            }
            yield put ({ type : 'closeAlertModalButtonLoading' });
            yield put ({ type : 'closeTableLoading' });
        },


        //分页
        *'paginationChange'({ payload } , { select , put ,call }){
            let { pageSize , pageIndex } = payload;
            let cerpClassroomModel = yield select( state => state.cerpClassroomModel );
            let params = {
                pageSize   : pageSize,
                pageIndex  : pageIndex - 1,
                name       : cerpClassroomModel.className,
                orgId      : cerpClassroomModel.orgId,
            };
            yield put({
                type : 'updateState',
                payload : {
                    loading : true
                }
            })
           let { ret } = yield call(GetClassRoomList,parse(params));
           if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classRoomDataSource : ret.results,
                        classRoomDataCount  : ret.data.resultCount,
                        orgId               : window._init_data.cerp_orgId,
                        pageSize            : ret.data.pageSize,
                        pageIndex           : ret.data.pageIndex,
                        createFormModelVisible :false,
                    }
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
            yield put({
                  type : 'updateState',
                  payload : {
                      loading : false
                  }
            })
        },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload }
        },
        showTableLoading(state, action){
            return {...state, ...action.payload, loading : true }
        },
        closeTableLoading(state, action){
            return {...state, ...action.payload, loading : false }
        },
        showAlertModalButtonLoading(state, action){
            return {...state, ...action.payload, removeClsRoomModalAlertButtonLoading : true }
        },
        closeAlertModalButtonLoading(state, action){
            return {...state, ...action.payload, removeClsRoomModalAlertButtonLoading : false }
        },
    }
}
