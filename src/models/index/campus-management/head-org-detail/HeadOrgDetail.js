import {
    GetLeftOrganList,               //获取校区信息左侧组织架构
    GetPackage,                     //获取总部套餐信息
    GetRightTableList,              //获取右侧校区数据
    GetOrgDetailMessage,            //获取校区详情
    GetOrgPackageMessage,           //获取校区套餐
    GetOrgServiceManageMessage,     //获取校区服务管理
    ServiceSwitchOnChange,          //校区服务管理开关onChange事件
    EditModalSubmit,                //校区编辑
    PackageModalSubmit ,             //套餐分配提交
    orgUserQuery,                    //校区可见人列表
    CourseSetPersonUpdate,          //校区可见人设置保存

} from '../../../../services/campus-management/head-org-detail/HeadOrgDetail';
import { parse } from 'qs';
import { message } from 'antd';

/*校区信息管理*/
export default {

    namespace: 'headOrgDetail',

    state: {
        /*左侧组织架构*/
        leftFrameworkData : [],                 //组织架构数据
        leftFrameworkLoading : false,           //加载状态
        leftFrameworkOpenTag : [],              //打开的节点，默认打开架构二级菜单数组['a','b']
        leftFrameworkInitOpenTag : ['all'],     //默认打开的节点
        leftFrameworkSearchContent : {},        //组织架构搜索条件

        /*右侧列表*/
            /*搜索内容*/
            rightFastSearchContent : {},        //快捷搜索内容

            /*列表内容*/
            rightTablePageIndex : 0,            //页码
            rightTablePageSize : 10,            //每页条数
            rightTableLoading : false,          //表格加载状态
            rightTableTotal : 0,                //表格数据总数
            rightTableData : [],                //表格数据所有内容
            rightTableOrgType : [{ name : '直营' , id : '1' } , { name : '加盟' , id : '2' } , { name : '代理' , id : '3' }],     //校区类型

        /*套餐modal*/
        packageModalData : [{ id : '1' , name : '1' },{ id : '2' , name : '2' }],                  //套餐数据
        packageModalVisible : false,            //是否显示
        packageModalType : 'check',             //表单类型(查看check/编辑edit)
        packageModalLoading : false,            //表单加载
        packageModalButtonLoading : false,      //表单按钮加载

        /*详情侧滑框*/
        detailModalVisible : false,             //是否显示
        detailModalTabLoading : false,          //加载状态
        detailModalContent : {},                //单条数据信息
        /*编辑modal*/
        editModalVisible : false,               //modal是否显示
        editModalLoading : false,               //modal加载状态
        editModalButtonLoading : false,         //modal按钮加载状态

        /*基本信息tab页*/
        baseInformationData : {},               //基本信息数据

        /*套餐信息tab页*/
        packageInfoData : [],                   //列表内容

        /*服务管理tab页*/
        serviceInfoData : [{ status : '成功' , name : '1' , checked : false },{ status : '失败' , name : '2' , checked : true }],       //服务管理列表数据

        courseSetPersonList : [],   //课件可见人列表
        courseSetPersonModalLoading :false,
        courseSetPersonVisible : false, //是否可见
        courseSetPersonLoading : false, //按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/hq_org_list') {
                    //获取校区信息左侧组织架构
                   dispatch({
                       type : 'GetLeftOrganList'
                   });
                    //获取总部套餐信息
                    dispatch({
                        type : 'GetPackage'
                    })
                    //获取校区信息右侧校区数据
                    dispatch({
                        type : 'GetRightTableList',
                        payload : {
                            pageIndex : 0,
                            pageSize : 20,
                            init : true
                        }
                    })
                }
            });
        },
    },

    effects: {
        //获取校区信息左侧组织架构
        *'GetLeftOrganList'({ payload },{ call , select , put }){
            yield put({ type : 'showLeftLoading' });
            let res = yield call(GetLeftOrganList,parse(payload));
            let headOrgDetail = yield select(state => state.headOrgDetail);
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        leftFrameworkData : ret.results || [],
                        leftFrameworkOpenTag : headOrgDetail.leftFrameworkInitOpenTag
                    }
                })
            }else{
                yield put({
                    type : 'updateState',
                    payload : {
                        leftFrameworkData : [],
                        leftFrameworkOpenTag : headOrgDetail.leftFrameworkInitOpenTag
                    }
                })
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取组织架构失败')
            }
            yield put({ type : 'closeLeftLoading' });
        },

        //获取总部套餐信息
        *'GetPackage'({ payload },{ call , select , put }){
            yield put({ type : 'updateState' , payload : { packageModalLoading : true } })
            let res = yield call(GetPackage,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : { packageModalData : ret.results }
                })
            }else{
                yield put({
                    type : 'updateState',
                    payload : { packageModalData : [] }
                })
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取套餐信息失败')
            }
            yield put({ type : 'updateState' , payload : { packageModalLoading : false } })
        },

        //获取校区信息右侧校区数据
        *'GetRightTableList'({ payload },{ call , select , put }){
            yield put({ type : 'showRightTableLoading' });
            let headOrgDetail = yield select(state => state.headOrgDetail);
            let leftFrameworkSearchContent = payload && !!payload.init ? {} : payload && payload.leftFrameworkSearchContent ? payload.leftFrameworkSearchContent : headOrgDetail.leftFrameworkSearchContent;
            let rightFastSearchContent = payload && !!payload.init ? {} : payload && payload.rightFastSearchContent ? payload.rightFastSearchContent : headOrgDetail.rightFastSearchContent;
            delete payload.leftFrameworkSearchContent;
            delete payload.rightFastSearchContent;
            let parmas = { ...payload , ...leftFrameworkSearchContent , ...rightFastSearchContent };
            let res = yield call(GetRightTableList,parse(parmas));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        rightTablePageIndex : ret.data && ret.data.pageIndex || 0,
                        rightTablePageSize : ret.data && ret.data.pageSize || 20,
                        rightTableTotal : ret.data && ret.data.resultCount || 0,
                        rightTableData : ret.results || [],
                        leftFrameworkSearchContent,
                        rightFastSearchContent,
                    }
                })
            }else{
                yield put({
                    type : 'updateState',
                    payload : {
                        rightTablePageIndex : 0,
                        rightTablePageSize : 20,
                        rightTableTotal : 0,
                        rightTableData : [],
                        leftFrameworkSearchContent : {},
                        rightFastSearchContent : {},
                    }
                })
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取校区信息失败')
            }
            yield put({ type : 'updateState' , payload : { detailModalVisible : (payload && payload.detailModalVisible) || false } })
            yield put({ type : 'closeRightTableLoading' });
        },

        //点击校区名称获取详情并且打开左划框(请求三个接口，详情，套餐，服务管理)
        *'RightTableOpenDetail'({ payload },{ call , select , put }){
            yield put({ type : 'showDetailModalLoading' });
            yield put({ type : 'updateState' , payload : { detailModalVisible : true } });      //打开详情框
            //校区详情
            yield put({ type : 'GetOrgDetailMessage' , payload })
            //校区拥有套餐
            yield put({ type : 'GetOrgPackageMessage' , payload })
            //校区服务管理
            yield put({ type : 'GetOrgServiceManageMessage' , payload })
            yield put({ type : 'closeDetailModalLoading' });
        },

        //校区详情
        *'GetOrgDetailMessage'({ payload },{ call , select , put }){
            let res = yield call(GetOrgDetailMessage,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : { baseInformationData : ret }
                })
            }else{
                yield put({
                    type : 'updateState',
                    payload : { baseInformationData : {} }
                })
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取校区信息失败')
            }
        },

        //校区拥有套餐
        *'GetOrgPackageMessage'({ payload },{ call , select , put }){
            let res = yield call(GetOrgPackageMessage,parse({ ...payload , pageIndex : 0 , pageSize : 99999 }));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : { packageInfoData : ret.results }
                })
            }else{
                yield put({
                    type : 'updateState',
                    payload : { packageInfoData : [] }
                })
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取校区套餐失败')
            }
        },

        //查询校区服务管理
        *'GetOrgServiceManageMessage'({ payload },{ call , select , put }){
            let res = yield call(GetOrgServiceManageMessage,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : { serviceInfoData : ret.results }
                })
            }else{
                yield put({
                    type : 'updateState',
                    payload : { serviceInfoData : [] }
                })
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取校区服务信息失败')
            }
        },

        //校区服务管理开关onChange事件
        *'ServiceSwitchOnChange'({ payload },{ call , select , put }){
            yield put({ type : 'showDetailModalLoading' });
            let res = yield call(ServiceSwitchOnChange,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                message.success('成功')
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '设置失败')
            }
            yield put({
                type : 'GetOrgServiceManageMessage' , payload : { tenantId : payload.tenantId , orgId : payload.orgId }
            })
            yield put({ type : 'closeDetailModalLoading' });
        },

        //校区编辑提交
        *'EditModalSubmit'({ payload },{ call , select , put }){
            yield put({ type : 'updateState' , payload : { editModalLoading : true , editModalButtonLoading : true } })
            let res = yield call(EditModalSubmit,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('校区编辑成功');
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        editModalVisible : false
                    }
                });
                //更新详情
                yield put({
                    type : 'RightTableOpenDetail',
                    payload : { tenantId : payload.tenantId , orgId : payload.orgId }
                });
                let headOrgDetail = yield select(state => state.headOrgDetail);
                let pageIndex = headOrgDetail.rightTablePageIndex;
                let pageSize = headOrgDetail.rightTablePageSize;
                let leftFrameworkSearchContent = headOrgDetail.leftFrameworkSearchContent;
                let rightFastSearchContent = headOrgDetail.rightFastSearchContent;
                //更新列表(并且不关闭详情侧滑框)
                yield put({
                    type : 'GetRightTableList',
                    payload : {
                        pageIndex , pageSize , leftFrameworkSearchContent , rightFastSearchContent , detailModalVisible : payload.detailModalVisible
                    }
                })
                //更新左边组织架构(因为可能编辑所属部门)
                yield put({
                    type : 'GetLeftOrganList'
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '校区编辑失败')
            }
            yield put({ type : 'updateState' , payload : { editModalLoading : false , editModalButtonLoading : false } })
        },

        //分配套餐提交
        *'PackageModalSubmit'({ payload },{ call , select , put }){
            yield put({ type : 'updateState' , payload : { packageModalLoading : true , packageModalButtonLoading : true } })
            let res = yield call(PackageModalSubmit,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('套餐分配成功');
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        packageModalVisible : false
                    }
                })
                //更新当前校区的套餐列表
                yield put({
                    type : 'GetOrgPackageMessage',
                    payload : {
                        tenantId : payload.tenantId,
                        orgId : payload.orgId,
                        pageIndex : 0,
                        pageSize : 99999
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '套餐分配失败')
            }
            yield put({ type : 'updateState' , payload : { packageModalLoading : false , packageModalButtonLoading : false } })
        },
        //校区可见人列表
        *'orgUserQuery'({ payload },{ call , select , put }){
            let res = yield call(orgUserQuery,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                console.log('courseSetPersonModalLoading')
                yield put({
                    type : 'updateState',
                    payload : {
                        courseSetPersonList : res.ret.results,
                        courseSetPersonModalLoading :false,
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '服务状态设置失败')
            }

        },
        //校区可见人设置保存
        *'CourseSetPersonUpdate'({ payload },{ call , select , put }){
            let res = yield call(CourseSetPersonUpdate,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('设置成功');
                yield put({
                    type : 'updateState',
                    payload : {
                        courseSetPersonList :[],
                        courseSetPersonVisible : false,
                        courseSetPersonLoading : false,
                    }
                })
                //调取服务管理接口
                yield put({
                    type : 'GetOrgServiceManageMessage' ,
                    payload : {
                        tenantId : payload.tenantId ,
                        orgId : payload.orgId
                    }
                })
            }else{
                yield put({
                    type : 'updateState',
                    payload : {
                        courseSetPersonLoading : false,
                    }
                })
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '服务状态设置失败')
            }

        },
    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showLeftLoading(state, action){
            return { ...state , leftFrameworkLoading : true }
        },
        closeLeftLoading(state, action){
            return { ...state , leftFrameworkLoading : false }
        },
        showRightTableLoading(state, action){
            return { ...state , rightTableLoading : true }
        },
        closeRightTableLoading(state, action){
            return { ...state , rightTableLoading : false }
        },
        showDetailModalLoading(state, action){
            return { ...state , detailModalTabLoading : true }
        },
        closeDetailModalLoading(state, action){
            return { ...state , detailModalTabLoading : false }
        }
    },
};
