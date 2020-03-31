import {
    GetTenantOrg,               /*页面加载获取校区*/
    GetClassRoomList,           /*教室列表*/
    CreateClassRoom,            /*新增教室*/
    UpdateClassRoom,            /*编辑教室*/
    DeleteClassroom,            /*删除教室*/
} from '../../../../services/erp/classRoom/classRoom';
import { message } from 'antd';
import { parse } from 'qs';
export default {

  namespace: 'classroomModel',

  state: {
      //教室列表
      classRoomDataSource   : [],       //教室数据数组
      classRoomDataCount    : '',       //教师数据总数
      classRomeTableLoading : false,    //教师列表加载状态
      selectedRowKeys       : [],       //选中数据数组
      selectedRows          : [],
      selectedListId        : [],       //批量删除所选的

          //分页
      pageIndex:0,
      pageSize:10,

      //筛选教室
      showSearch            : false,


      //新增教室
      classRomeSelectOrgId  : '',       //默认选中的校区
      modalType             : '',       //新增或者编辑modal类型('create'/'update')
      showAdd               : false,
      classroomInfo         : {},       //教室信息
      formButtonLoading     : false,    //新增编辑教室按钮加载状态



      searchData:{},                //搜索栏数据
      classroomList:[],
      classroomTotal:0,


  },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/erp_clsroom_list') {
                    dispatch({
                        type : 'GetTenantOrg'
                    });
                    dispatch({
                        type: 'GetClassRoomList',
                        payload: {
                            pageSize : 10,
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
            yield put ({ type : 'showTableLoding' });
            let { ret } = yield call(GetClassRoomList,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                /*取到第一个校区(默认校区)ID*/
                let orgId;
                if(window._init_data.firstOrg != undefined){
                    orgId = (window._init_data.firstOrg).key;               //获取选择校区下的第一间校区
                    yield put({
                        type:'updateState',
                        payload:{
                            classRomeSelectOrgId : orgId
                        }
                    });
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        classRoomDataSource : ret.results,
                        classRoomDataCount : ret.data.resultCount,
                    }
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
            yield put ({ type : 'closeTableLoding' });
        },

        /*新增编辑之后的列表查询*/
        *'AfterOperationGetList'({ payload } , { put , call , select }){
            let classroomModel = yield select(state => state.classroomModel);
            let searchData = classroomModel.searchData || {};
            let pageIndex = classroomModel.pageIndex;
            let pageSize = classroomModel.pageSize;
            let params = { pageIndex , pageSize , ...searchData }
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
                                pageIndex : params.pageIndex,
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
                        }
                    })
                }
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
        },

        /*新增教室*/
        *'CreateClassRoom'({ payload } , { put , call , select }){
            yield put ({ type : 'showTableLoding' });
            let { ret } = yield call(CreateClassRoom,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationGetList',
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
            yield put ({ type : 'closeTableLoding' });
        },

        /*编辑教室*/
        *'UpdateClassRoom'({ payload } , { put , call , select }){
            yield put ({ type : 'showTableLoding' });
            let { ret } = yield call(UpdateClassRoom,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationGetList',
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
            yield put ({ type : 'closeTableLoding' });
        },

        /*删除教室*/
        *'DeleteClassroom'({ payload } , { put , call , select }){
            yield put ({ type : 'showTableLoding' });
            let { ret } = yield call(DeleteClassroom,parse(payload));
            if( ret && ret.errorCode == 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationGetList',
                })
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage)
            }
            yield put ({ type : 'closeTableLoding' });
        },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload}
        },
        showTableLoding(state, action){
            return {...state, ...action.payload, classRomeTableLoading : true}
        },
        closeTableLoding(state, action){
            return {...state, ...action.payload, classRomeTableLoading : false}
        },
    }
}
