import {
    SearchAllOrganList,     /*请求左边组织架构列表数据*/
    AddSector,              /*新增部门*/
    EditSector,             /*编辑部门*/
    DeleteSector,           /*删除部门*/
    getXiaoquOrganList,     /*校区部门数据*/
    OrgUserDetailQuery,

    ShowStaffTable,             /*员工列表展示*/
    GetRoleSelect,              /*获取搜索栏角色下拉列表数据*/
    GetStaffDetail,             /*员工列表点击编辑获取详情*/
    GetLeaderSelect,            /*点击编辑后查询当前机构下的汇报对象下拉列表内容*/
    CreateStaff,                /*新增表单提交*/
    UpdateStaff,                /*新增表单提交*/
    ChangeStaffFunc,            /*修改员工职能提交*/
    EnableOrFireOrDeleteStaff,  /*停用或删除员工*/
    GetchiefUser,               /*汇报对象列表查询*/

    userSummaryQuery,            /* 员工摘要查询 */
    queryYqCode,                 /* 获取邀请链接 */
    queryMaxEmpNo,               /* 获取最新的员工号 */
} from '../../../../services/campus-management/staff-manage/StaffManage';
import { parse } from 'qs';
import { message } from 'antd';

/*角色管理*/
export default {

    namespace: 'staffManage',

    state: {
        staffManageType : undefined,            //员工类型(总部hq/校区分部org)
        /*是否是系统管理员*/
        wetherSystemMgr : false,                //是否是管理员(如果是管理员，则新增修改员工信息时表单'职能信息'部分不可修改，否则可修改)

        /*组织架构列表*/
        allOrganList : [],                      //左边组织架构数据
        allOrganListLoading : false,            //左边组织架构是否加载中
        secondOrganArray : [],                  //左边组织架构列表默认打开的二级菜单
        initSecondOrganArrayOpenTag : ['all'],  //默认打开的节点
        organItemIndexOnMouseMove : '',         //左边组织架构鼠标放到项目上的索引(用来使对应位置出现'编辑'和'删除')
        organItemIdOnMouseMove : '',            //左边组织架构鼠标放到项目上的id(用来使对应位置出现'编辑'和'删除')
        allOrganSearchContent : {},             //左边组织架构查询条件

        /*员工列表search*/
        staffTableType : '1',                       //表格类型(使用中'1'/已停用'3')
        staffManageRoleSelectContent: [],           //表格搜索栏角色列表下拉数据
        staffManageFastSearchContent : {},          //员工管理查询条件
        staffManageGetchiefUserContent : [],        //汇报对象列表查询
        staffList: [],                              //员工列表查询(总部汇报对象)

        /*员工列表table*/
        staffManagePageIndex : 0,                   //每页条数
        staffManagePageSize : 20,                   //页码
        staffManageTableLoading : false,            //表格加载状态
        staffManageTableTotal : '',                 //表格数据总数
        staffManageTableContent : [],               //表格数据所有内容
        staffManageSearchVisible : false,           //右边table列表搜索栏是否显示
        staffManageTableSelectedRowKeys : [],       //表格多选选中的数组
        staffManageTableSelectedRow : [],           //表格多选中的对象数组

        /*右边列表新增编辑员工*/
        addOrEditStaffModalType : '',                   //新增编辑员工表单类型('add'/'edit'/'modifyFunction')
        addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
        addOrEditStaffModalLoading : false,             //新增编辑员工表单加载状态
        addOrEditStaffModalButtonLoading : false,       //新增编辑员工modal按钮是否在加载状态
        addOrEditStaffModalData : {},                   //编辑员工时回填数据
        addOrEditStaffModalLeaderSelect : [],           //通过摘要查询获取汇报对象下拉列表
        addOrEditStaffModalChooseOrgId : [],            //账号所属选中的校区ID
        addOrEditStaffModalWetherHead : false,          //所属部门如果是总部(true),用来判断管辖校区的显示内容
        addOrEditStaffModalTheCampus : '0',             //新增选中的所属校区
        addOrEditStaFFModalOrgId : '0',
        empNo: '',                                      //员工工号
        mail: '',                                       //员工邮箱

        /*员工修改状态失败的员工会显示在此表单中*/
        changeStatusOperateAllStaffNum : undefined,        //总共有多少个员工被改变了状态
        changeStatusFailedModalVisible : false,         //表单是否显示

        //员工需要交接任务列表
        staffManageChangeStatusPageIndex : 0,           //页码
        staffManageChangeStatusPageSize : 10,           //每页条数
        changeStatusOperateFailStaffNum : undefined,  //列表总数
        staffManageChangeStatusTableContent : [],       //列表内容

        /*新增编辑员工时校区选择modal*/
        selectCampusModalVisible : false,           //选择校区modal是否显示
        selectCampus : [],                          //默认添加的校区选项
        previewVisible                       : false,              //显示预览
        previewImage                         : '',                 //预览图片

        /*表格点击所属机构下方数据时弹出模态框*/
        checkOrgsModalVisible : false,              //查看所属机构模态框是否展示
        checkOrgsModalData : [],                    //查看所属机构机构数据

        checkgxxq : true,

        /* 新增编辑员工时部门选择modal */
        selectDeptModalVisible : false,            //选择部门modal是否显示
        selectDept : [],                           //默认添加的部门选项

        /* 邀请注册登录 */
        registerUrl: 'http://www.baidu.com',       //邀请链接
        isInviteShow: false                        //是否打开邀请弹窗
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/hq_org_hqusers' || location.pathname === '/hq_org_orgusers') {
                    /*请求左边组织架构列表数据。如果是总部，则请求组织架构接口；如果是校区分部，则请求组织架构+校区接口*/
                    dispatch({
                        type: 'SearchAllOrganList',
                        payload : {
                            staffManageType : location.pathname == '/hq_org_hqusers' ? 'hq' : location.pathname == '/hq_org_orgusers' ? 'org' : ''
                        }
                    });
                    dispatch({
                        type: 'ShowStaffTable',
                        payload:{
                            pageIndex : 0,
                            pageSize : 20,
                            status : '1',
                            staffManageType : location.pathname == '/hq_org_hqusers' ? 'hq' : location.pathname == '/hq_org_orgusers' ? 'org' : '',
                            init : true
                        }
                    });
                    dispatch({
                        type : 'updateState',
                        payload : { staffManageType : location.pathname == '/hq_org_hqusers' ? 'hq' : location.pathname == '/hq_org_orgusers' ? 'org' : '', }
                    })
                    /*获取搜索栏角色下拉列表的数据*/
                    if(location.pathname === '/hq_org_hqusers'){
                        dispatch({
                            type : 'GetRoleSelect'
                        });
                        dispatch({
                            type: 'userSummaryQuery'
                        })
                    }

                    /*汇报对象下拉列表数据*/
//                    if(location.pathname === '/hq_org_orgusers'){
//                        dispatch({
//                            type : 'GetchiefUser'
//                        })
//                    }
                }
            });
        },
    },

    effects: {
        /*组织结构*/
            /*请求左边组织架构列表数据*/
            *'SearchAllOrganList'({ payload }, { call, put, select }){
                yield put({ type : 'showLeftOrganListLoading' });
                let res = yield call(SearchAllOrganList,parse(payload));
                if (!!res && res.ret && res.ret.errorCode == '9000') {
                    let staffManage = yield select(state => state.staffManage);
                    let { ret } = res;
                    yield put({
                        type: 'updateState',
                        payload: {
                            allOrganList : ret.results,
                            secondOrganArray : staffManage.initSecondOrganArrayOpenTag,
                        },
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '查询组织架构失败');
                    yield put({ type : 'updateState' , payload : { allOrganList : [] } })
                }
                yield put({ type : 'closeLeftOrganListLoading' });
            },

        /*员工列表*/
            /*获取搜索栏角色下拉列表数据*/
            *'GetRoleSelect'({ payload }, { call, put, select }){
                let res = yield call(GetRoleSelect,parse(payload));
                if (!!res && res.ret && res.ret.errorCode == '9000') {
                    let { ret } = res;
                    yield put({
                        type: 'updateState',
                        payload: {
                            staffManageRoleSelectContent : ret.results,
                        },
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '角色信息查询失败');
                }
            },

            /*汇报对象列表*/
            *'GetchiefUser'({ payload }, { call, put, select }){
//                yield put({ type:'showRightTableLoading' });
                let res = yield call(GetchiefUser,parse(payload));
                if (!!res && res.ret && res.ret.errorCode == '9000') {
                    let { ret } = res;
                    yield put({
                        type: 'updateState',
                        payload: {
                            staffManageGetchiefUserContent : ret.results,
                        },
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '角色信息查询失败');
                }
//                yield put({ type:'closeRightTableLoading' });
            },

            /*员工摘要查询*/
            *'userSummaryQuery'({ payload }, { call, put, select }){
                let res = yield call(userSummaryQuery,parse(payload));
                if (!!res && res.ret && res.ret.errorCode == '9000') {
                    let { ret } = res;
                    yield put({
                        type: 'updateState',
                        payload: {
                            staffList : ret.result,
                        },
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '角色信息查询失败');
                }
            },

            /*员工列表展示*/
            *'ShowStaffTable'({ payload }, { call, put, select }){
                yield put({ type:'showRightTableLoading' });
                let staffManage = yield select(state => state.staffManage);
                let fastSearchContent = payload && !!payload.init ? {} : payload && payload.fastSearchContent ? payload.fastSearchContent : staffManage.staffManageFastSearchContent;
                let allOrganSearchContent = payload && !!payload.init ? {} : payload && payload.allOrganSearchContent ? payload.allOrganSearchContent : staffManage.allOrganSearchContent;
                delete payload.fastSearchContent;
                delete payload.allOrganSearchContent;
                payload.staffManageType = payload && payload.staffManageType ? payload.staffManageType : staffManage.staffManageType;
                let params = { ...payload , ...fastSearchContent , ...allOrganSearchContent };
                let resInit = yield call(ShowStaffTable,parse(params));
                if (!!resInit && resInit.ret && resInit.ret.errorCode == '9000') {
                    let { ret } = resInit;
                    if((ret.results).length == 0 && params.pageIndex > 0){
                        params.pageIndex -= 1;
                        let resAgain = yield call(ShowStaffTable,parse(params));
                        if(!!resAgain && resAgain.ret && resAgain.ret.errorCode == '9000'){
                            let { ret } = resAgain;
                            yield put({
                                type : 'tableFormat' ,
                                payload : {
                                    results : ret.results,
                                    fastSearchContent,
                                    allOrganSearchContent,
                                    status : payload.status,
                                    data : ret.data,
                                }
                            })
                        }else{
                            message.error(!!resAgain && resAgain.ret && resAgain.ret.errorMessage ? resAgain.ret.errorMessage : '员工列表查询失败');
                            yield put({ type : 'failTableFormat' })
                        }
                    }else{
                        yield put({
                            type : 'tableFormat' ,
                            payload : {
                                results : ret.results,
                                fastSearchContent,
                                allOrganSearchContent,
                                status : payload.status,
                                data : ret.data,
                            }
                        })
                    }
                }else{
                    message.error(!!resInit && resInit.ret && resInit.ret.errorMessage ? resInit.ret.errorMessage : '员工列表查询失败');
                    yield put({ type : 'failTableFormat' })
                }
                yield put({ type:'closeRightTableLoading' });
            },

            /*列表点击编辑获取详情用于回填*/
            *'GetStaffDetail'({ payload }, { call, put, select }){
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalLoading : true , addOrEditStaffModalVisible : true } });
                let res = yield call(GetStaffDetail,parse(payload));
                if (!!res && res.ret && (res.ret.errorCode === 9000 || res.ret.errorCode === 0)) {
                    let { ret } = res;
                    yield put({
                        type: 'updateState',
                        payload: payload.staffManageType =='hq' ? {
                            addOrEditStaffModalType : payload.type,
                            addOrEditStaffModalData : ret,
                            selectCampus : !!ret.mgrOrgIds && ret.mgrRange != '1' ? ret.mgrOrgIds.split(',') : [],
                            selectDept : !!ret.permDeptIds && ret.mgrRange == '2' ? ret.permDeptIds.split(',') : [],
                            empNo :  ret && ret.empNo || '',
                            mail : ret && ret.mail || ''
                        } : {
                            addOrEditStaffModalType : payload.type,
                            addOrEditStaffModalData : ret.data,
                            selectCampus : !!ret.mgrOrgIds ? ret.mgrOrgIds.split(',') : [],
                            empNo :  ret.data && ret.data.empNo || '',
                            mail: ret.data && ret.data.mail || ''
                        },
                    });
                    if(ret.mgrOrgIds != null && ret.mgrOrgIds != undefined && ret.mgrOrgIds.split(',').length > 0 && ret.mgrRange == '0'){
                        yield put({
                            type: 'updateState',
                            payload: {
                                checkgxxq : true
                            }
                        });
                    }else if(ret.permDeptIds != null && ret.permDeptIds != undefined && ret.permDeptIds.split(',').length > 0 && ret.mgrRange == '2') {
                        yield put({
                            type: 'updateState',
                            payload: {
                                checkgxxq : true
                            }
                        });
                    }
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '员工信息获取失败');
                    yield put({ type : 'updateState' , payload : { addOrEditStaffModalVisible : false } });
                }
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalLoading : false } });
            },

            /*汇报对象下拉列表内容(包括新增员工时和编辑员工时)*/
            *'GetLeaderSelect'({ payload }, { call, put, select }){
                let res = yield call(GetLeaderSelect,parse(payload));
                if (!!res && res.ret && res.ret.errorCode == '9000'){
                    let { ret } = res;
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalLeaderSelect : ret.results
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '您的网络状况不佳，请检查您的网络');
                }
            },

            /*新增员工表单提交*/
            *'CreateStaff'({ payload }, { call, put, select }){
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalButtonLoading : true }})
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalLoading : true }})
                let res = yield call(CreateStaff,parse(payload));
                if (!!res && res.ret && (res.ret.errorCode == '9000' || res.ret.errorCode == '0')){
                    message.success('新增员工成功');
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
                        }
                    });
                    let staffManage = yield select(state => state.staffManage);
                    let { ret } = res;
                    yield put({
                        type : 'ShowStaffTable',
                        payload : {
                            pageIndex : staffManage.staffManagePageIndex,
                            pageSize : staffManage.staffManagePageSize,
                            status : staffManage.staffTableType,
                            fastSearchContent : staffManage.staffManageFastSearchContent,
                            allOrganSearchContent : staffManage.allOrganSearchContent,
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '新增员工失败');
                }
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalButtonLoading : false }})
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalLoading : false }})
            },

            /*编辑员工表单提交*/
            *'UpdateStaff'({ payload }, { call, put, select }){
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalButtonLoading : true }})
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalLoading : true }})
                let staffManage = yield select(state => state.staffManage);
                if(payload.staffManageType == 'org'){
                    payload.orgId = staffManage.addOrEditStaffModalData.mgrOrgIds;
                }
                let res = yield call(UpdateStaff,parse(payload));
                if (!!res && res.ret && (res.ret.errorCode == '9000' || res.ret.errorCode == '0')){
                    let { ret } = res;
                    message.success('编辑员工成功');
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
                            selectCampus : [],
                            addOrEditStaffModalLeaderSelect : [],
                        }
                    });
                    let staffManage = yield select(state => state.staffManage);
                    yield put({
                        type : 'ShowStaffTable',
                        payload : {
                            pageIndex : staffManage.staffManagePageIndex,
                            pageSize : staffManage.staffManagePageSize,
                            status : staffManage.staffTableType,
                            fastSearchContent : staffManage.staffManageFastSearchContent,
                            allOrganSearchContent : staffManage.allOrganSearchContent
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '编辑员工失败');
                }
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalButtonLoading : false }})
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalLoading : false }})
            },

            /*修改员工职能提交*/
            *'ChangeStaffFunc'({ payload }, { call, put, select }){
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalButtonLoading : true }})
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalLoading : true }})
                let res = yield call(ChangeStaffFunc,parse(payload));
                if (!!res && res.ret && res.ret.errorCode == '9000'){
                    message.success('修改职能成功')
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
                            selectCampus : [],
                            addOrEditStaffModalLeaderSelect : [],
                        }
                    });
                    let staffManage = yield select(state => state.staffManage);
                    let { ret } = res;
                    yield put({
                        type : 'ShowStaffTable',
                        payload : {
                            pageIndex : staffManage.staffManagePageIndex,
                            pageSize : staffManage.staffManagePageSize,
                            status : staffManage.staffTableType,
                            fastSearchContent : staffManage.staffManageFastSearchContent,
                            allOrganSearchContent : staffManage.allOrganSearchContent
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '您的网络状况不佳，请检查您的网络');
                }
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalButtonLoading : false }})
                yield put({ type : 'updateState' , payload : { addOrEditStaffModalLoading : false }})
            },

            /*启用或者停用或者删除员工*/
            *'EnableOrFireOrDeleteStaff'({ payload }, { call, put, select }){
                yield put({ type:'showRightTableLoading' });
                let res = yield call(EnableOrFireOrDeleteStaff,parse(payload));
                if (!!res && res.ret && res.ret.errorCode === 9000){
                    message.success('操作成功')
                    let staffManage = yield select(state => state.staffManage);
                    let { ret } = res;
                    yield put({
                        type : 'ShowStaffTable',
                        payload : {
                            pageIndex : staffManage.staffManagePageIndex,
                            pageSize : staffManage.staffManagePageSize,
                            status : staffManage.staffTableType,
                            fastSearchContent : staffManage.staffManageFastSearchContent,
                            allOrganSearchContent : staffManage.allOrganSearchContent
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '您的网络状况不佳，请检查您的网络');
                }
                yield put({ type:'closeRightTableLoading' });
            },
            //获取邀请链接
            *'queryYqCode'({ payload },{ call, put, select }){
                let baseUrl = `${window.location.protocol}//${window.location.host}/${window.location.port}`;
                let { ret } = yield call( queryYqCode, parse(payload));
                if( ret && ret.errorCode == 0 ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            isInviteShow: true,
                            registerUrl: `${baseUrl}/cas/logout?service=${baseUrl}/cas/login?jwtToken=${ret.data}`
                        }
                    })
                }else{
                    message.error( ret && ret.errorMessage )
                }
            },
            //获取最新员工工号
            *'queryMaxEmpNo'({ payload },{ call, put, select }){
                let { ret } = yield call( queryMaxEmpNo, parse(payload));
                if( ret && ret.errorCode == 0 ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            empNo: ret && ret.data && ret.data.empNo || '',
                            mail: ret && ret.data && ret.data.mail || ''
                        }
                    })
                }else{
                    message.error( ret && ret.errorMessage )
                }
            },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //左边角色列表加载中
        showLeftOrganListLoading(state,action) {
            return { ...state, allOrganListLoading: true };
        },
        //左边角色列表加载消失
        closeLeftOrganListLoading(state,action){
            return { ...state, allOrganListLoading: false };
        },
        //右边功能列表加载中
        showRightTableLoading(state,action) {
            return { ...state, staffManageTableLoading: true };
        },
        //右边功能列表加载消失
        closeRightTableLoading(state,action){
            return { ...state, staffManageTableLoading: false };
        },
        //列表查询后的状态更新
        tableFormat(state,action){
            let { results , fastSearchContent , allOrganSearchContent , status , data } = action.payload;
            //后台所传roles字段个格式化
//            for(let i in results){
//                results[i].formatRoles = '';
//                if(results[i].roles && (results[i].roles).length > 0){
//                    for(let j in results[i].roles){
//                        results[i].formatRoles += (results[i].roles)[j].role_name + '';
//                    }
//                }
//            }
            let obj = {
                staffManageFastSearchContent : fastSearchContent,
                allOrganSearchContent,
                staffTableType : status,
                staffManagePageSize : data.pageSize,                //页码
                staffManagePageIndex : data.pageIndex,              //每页显示条数
                staffManageTableContent : results,
                staffManageTableTotal : data.resultCount,
                staffManageTableSelectedRowKeys : [],               //表格多选选中的数组
                staffManageTableSelectedRow : [],                   //表格多选中的对象数组
            }
            return { ...state , ...obj }
        },
        //列表查询失败
        failTableFormat(state,action){
            let obj = {
                staffManageFastSearchContent : state.staffManageFastSearchContent,
                allOrganSearchContent : state.allOrganSearchContent,
                staffManagePageSize : state.staffManagePageSize,            //页码
                staffManagePageIndex : state.staffManagePageIndex,          //每页显示条数
                staffManageTableContent : [],
                staffManageTableTotal : 0,
                staffManageTableSelectedRowKeys : [],       //表格多选选中的数组
                staffManageTableSelectedRow : [],           //表格多选中的对象数组
            }
            return { ...state , ...obj }
        }
    },
};
