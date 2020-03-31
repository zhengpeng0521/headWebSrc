import {
    GetTeacherMsg,          //获取教师数据渲染搜索栏下拉列表
    GetCourseMsg,           //获取课程数据渲染搜索栏下拉列表
    GetTableList,           //获取列表数据，列表数据不存在删除功能，无须做非第一页空数据则请求前一页数据的功能
    GetDetail,              //获取详情老师评价和家长评价列表数据、
    SubmitCommentEditModal, //老师评价编辑modal提交
    SubmitContentEditModal  //上课内容编辑modal提交
} from '../../../../services/cerp/home-school-comment/HomeSchoolComment';
import { message } from 'antd';
import { parse } from 'qs';
export default {

	namespace : 'homeSchoolComment',

	state: {
        orgId : undefined,                          //cerp选中的校区
        /*table*/
        newColumns : [],                            //列表控制显示行数组
        tablePageIndex : 0,                         //列表页码
        tablePageSize : 20,                         //列表每页条数
        tableDataSource : [],                       //列表数据
        tableDataTotal : 0,                         //列表数据条数
        tableLoading : false,                       //列表加载状态

        /*快捷搜索*/
        courseMsg : [],                             //课程下拉列表内容
        teacherMsg : [],                            //主教下拉列表内容
        fastSearchContent : {},                     //快捷搜索内容

        /*详情modal*/
        detailModalVisible : false,                 //详情modal是否显示
        detailModalKey : '0',                       //详情modalkey
        detailModalMsg : {},                        //详情需要渲染的数据(列表中当前项的数据，详情头部和上课内容tab页的数据从此取，老师评价和家长评价数据从接口中取)

        /*老师评价tab页*/
        teacherCommentLoading : false,              //老师评价tab页是否是加载状态
        teacherCommentMsg : [],                     //老师评价列表数据

        teacherCommentEditModalVisible : false,     //老师评价编辑modal是否显示
        teacherCommentEditModalLoading : false,     //老师评价编辑modal加载状态
        teacherCommentEditModalData : {},           //老师评价编辑modal回填数据

        /*家长评价tab页*/
        parentCommentLoading : false,               //家长评价tab页是否是加载状态
        parentCommentMsg : [],                      //家长评价列表数据

        /*上课内容tab页*/
        courseContentMsg : {},                      //上课内容渲染数据(与detailModalMsg一毛一样)

        /*上课内容编辑modal*/
        courseContentEditModalVisible : false,      //上課內容编辑modal是否显示
        courseContentEditModalLoading : false,      //上課內容编辑modal加载状态
        courseContentEditModalData : {},            //上課內容编辑modal回填数据
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname, query }) => {
                if(pathname === '/cerp_homeschool_comm'){
                    //更新当前选中的校区ID，并请求教师数据渲染搜索栏下拉列表和列表数据
                    dispatch({
                        type : 'UpdateOrgId',
                    })
                }
            });
        },
    },

    effects: {
        //更新当前选中的校区ID，并获取教师数据渲染搜索栏下拉列表
        *'UpdateOrgId'({ payload } , { put , select ,call }){
            if(window._init_data && !isNaN(window._init_data.cerp_orgId + '')){
                let orgId = window._init_data.cerp_orgId;
                yield put({
                    type : 'updateState',
                    payload : {
                        orgId
                    }
                });
                yield put({ type : 'GetTeacherMsg' , payload : { orgId } });
                yield put({ type : 'GetCourseMsg' , payload : { orgId } });
                yield put({
                    type : 'GetTableList',
                    payload : {
                        pageIndex : 0,
                        pageSize : 20
                    }
                })
            }else{
                message.error('当前校区信息获取失败，请重新选择');
            }
        },

        //获取教师下拉列表
        *'GetTeacherMsg'({ payload } , { put , select ,call }){
            let { ret } = yield call(GetTeacherMsg,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type : 'updateState',
                    payload : {
                        teacherMsg : ret.results
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '教师数据获取失败');
            }
        },

        //获取课程下拉列表
        *'GetCourseMsg'({ payload } , { put , select ,call }){
            let { ret } = yield call(GetCourseMsg,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type : 'updateState',
                    payload : {
                        courseMsg : ret.results
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '课程数据获取失败');
            }
        },

        //获取列表数据，列表数据不存在删除功能，无须做非第一页空数据则请求前一页数据的功能
        *'GetTableList'({ payload } , { put , select , call }){
            yield put({ type : 'showTableLoading' });
            let homeSchoolComment = yield select(state => state.homeSchoolComment);
            let orgId = homeSchoolComment.orgId;
            let fastSearchContent = payload.fastSearchContent || {};
            let zj_type = payload.zj_type || undefined;                 //用处处理编辑和其他操作是否需要关闭详情modal
            delete payload.fastSearchContent;
            let params = { ...payload , ...fastSearchContent , orgId };
            let { ret } = yield call(GetTableList,parse(params));
            if(ret && ret.errorCode == '9000'){
                //格式化图片数据，以便表单回填项从列表中取时不需要在格式化
                let results = ret.results;
                if(ret.results && ret.results.length > 0){
                    ret.results.map((result_item,result_index) => {
                        if(result_item.picList && result_item.picList.length > 0){
                            for(let i in result_item.picList){
                                result_item.picList[i] = { uid : - i - 1 , url : result_item.picList[i] }
                            }
                        }
                    })
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        tablePageIndex : ret.data.pageIndex || 0,
                        tablePageSize : ret.data.pageSize || 20,
                        tableDataSource : results || [],
                        tableDataTotal : ret.data.resultCount || 0,
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取家校互评列表失败')
            }
            //编辑完成后列表查询不关闭详情modal
            if(zj_type != 'edit'){
                yield put({ type : 'updateState' , payload : { detailModalVisible : false } })
            }
            yield put({ type : 'closeTableLoading' });
        },

        //获取详情老师评价和家长评价列表数据
        *'GetDetail'({ payload } , { put , select , call }){
            yield put({ type : 'showModalDetailLoading' });
            let { ret } = yield call(GetDetail,parse(payload));
            if(ret && ret.errorCode == '9000'){
                //格式化老师评价数据中的图片数据(家长评价无图)，以便表单回填项从列表中取时不需要在格式化
                function formatMsg(array){
                    if(array.length > 0){
                        array.map((array_item,array_index) => {
                            if(array_item.picList && array_item.picList.length > 0){
                                for(let i in array_item.picList){
                                    array_item.picList[i] = { uid : - i - 1 , url : array_item.picList[i] }
                                }
                            }
                        })
                    };
                    return array;
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        teacherCommentMsg : formatMsg(ret.tcrCommList) || [],
                        parentCommentMsg : ret.homeCommList || []
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取家校互评列表失败')
            }
            yield put({ type : 'closeModalDetailLoading' });
        },

        //老师评价编辑modal提交
        *'SubmitCommentEditModal'({ payload } , { put , select , call }){
            yield put({ type : 'showCommentEditModalLoading' });
            let { ret } = yield call(SubmitCommentEditModal,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('老师评价修改成功');
                yield put({
                    type : 'updateState',
                    payload : {
                        teacherCommentEditModalVisible : false
                    }
                })
                //请求并刷新评价列表
                yield put({
                    type : 'GetDetail',
                    payload : {
                        orgId : payload.orgId,
                        cpmId : payload.cpmId,
                        cpdId : payload.cpdId
                    }
                })
                //获取列表查询数据
                let homeSchoolComment = yield select(state => state.homeSchoolComment);
                let pageIndex = homeSchoolComment.tablePageIndex;
                let pageSize = homeSchoolComment.tablePageSize;
                let fastSearchContent = homeSchoolComment.fastSearchContent;
                yield put({
                    type : 'GetTableList',
                    payload : {
                        pageIndex,
                        pageSize,
                        fastSearchContent,
                        zj_type : 'edit'
                    }
                });
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '老师评价修改失败')
            }
            yield put({ type : 'closeCommentEditModalLoading' });
        },

        //上课内容编辑modal提交
        *'SubmitContentEditModal'({ payload } , { put , select , call }){
            yield put({ type : 'showCourseContentModalLoading' });
            let { ret } = yield call(SubmitContentEditModal,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('上课内容修改成功');
                //获取列表查询数据
                let homeSchoolComment = yield select(state => state.homeSchoolComment);
                let pageIndex = homeSchoolComment.tablePageIndex;
                let pageSize = homeSchoolComment.tablePageSize;
                let fastSearchContent = homeSchoolComment.fastSearchContent;
                //更新上课内容数据以修改详情modal中上课内容tab页中的数据
                let obj = { ...payload };
                obj.picList = JSON.parse(obj.pictures);
                if(obj.picList && obj.picList.length > 0){
                    for(let i in obj.picList){
                        obj.picList[i] = { uid : - i - 1 , url : obj.picList[i] }
                    }
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        courseContentEditModalVisible : false,
                        courseContentEditModalData : {},
                        courseContentMsg : obj
                    }
                });
                yield put({
                    type : 'GetTableList',
                    payload : {
                        pageIndex,
                        pageSize,
                        fastSearchContent,
                        zj_type : 'edit'
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '上课内容修改失败')
            }
            yield put({ type : 'closeCourseContentModalLoading' });
        },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload }
        },
        showTableLoading(state, action) {
            return {...state, tableLoading : true }
        },
        closeTableLoading(state, action) {
            return {...state, tableLoading : false }
        },
        showModalDetailLoading(state, action) {
            return {...state, teacherCommentLoading : true , parentCommentLoading : true }
        },
        closeModalDetailLoading(state, action) {
            return {...state, teacherCommentLoading : false , parentCommentLoading : false }
        },
        showCommentEditModalLoading(state, action) {
            return {...state, teacherCommentEditModalLoading : true }
        },
        closeCommentEditModalLoading(state, action) {
            return {...state, teacherCommentEditModalLoading : false }
        },
        showCourseContentModalLoading(state, action) {
            return {...state, courseContentEditModalLoading : true }
        },
        closeCourseContentModalLoading(state, action) {
            return {...state, courseContentEditModalLoading : false }
        },
    }
}
