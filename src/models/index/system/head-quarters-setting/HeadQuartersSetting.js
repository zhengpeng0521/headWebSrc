import {
    HeadDetailQuery,                    //总部信息查询
    HeadDetailSubmit                    //总部信息保存
} from '../../../../services/system/head-quarters-setting/HeadDetail';
import {
    DomainGetApplyStatus,               //获取当前租户申请状态
    DomainFirstStepApplyForSubmit,      //第一步申请使用点击提交
    DomainForthStepSetSubmit            //第四步保存设置事件
} from '../../../../services/system/head-quarters-setting/DomainNameSetting';
import {
    BrandGetStatus,             //获取品牌状态
    BrandSubmit                 //品牌信息提交
} from '../../../../services/system/head-quarters-setting/Brand';
import {
    SearchAllRoleList,      /*请求左边角色总览列表数据*/
    SearchAllFunction,      /*请求右边所有功能列表数据*/
    RenameRole,             /*左边角色列表重命名角色*/
    CopyRole,               /*左边角色列表复制角色*/
    DeleteRole,             /*左边角色列表删除角色*/
    CreateRole,             /*左边角色列表新增角色*/
    SaveRoleFunction        /*权限保存*/
} from '../../../../services/system/head-quarters-setting/RoleManage';
import {
    GetTreeStuOrCou,            //获取组织架构数据
    AddOrEditTreeModalSubmit    //新增编辑组织架构提交
} from '../../../../services/system/head-quarters-setting/TreeStrOrCou';
import {
    getLeadsDup,
    saveLeadsDup,
} from '../../../../services/system/head-quarters-setting/leadsDup'
import {
    getSourceList,
    addSource,
    deleteSource,
    updateSource,
} from '../../../../services/system/head-quarters-setting/source'
import {
    getFinanceList,
    addFinance,
    updateFinance,
    addProject,
    updateProject,
    getFinanceSet,
    saveFinanceSet,
} from '../../../../services/system/head-quarters-setting/finance'
import { expenseOrgAndDept } from "../../../../services/financial-center/expenses/expensesService"
// import { filelogTabe } from '../../../../services/system/file-log/filelog'
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import stylesMenu from './menu.json';
import stylesMenuTms from './menuTms.json';
import courseware from './courseware.json';
//是否是番茄田系统
let isTomato = window.runAs=='tomato' ? true : false;
let menu = !isTomato ? stylesMenu : stylesMenuTms;

/*校区logo*/
export default {

    namespace: 'headQuartersSetting',

    state: {
        /*左边菜单*/
        leftMenu : menu,                            //左边菜单项
        chooseMenuItem : menu[0],                   //选中的菜单项

        /*右侧内容*/
        rightLoading : false,                       //所有右侧项公用加载状态

        /*总部角色*/
        allRoleList : [],                           //页面左边角色列表内容
        allRoleListLoading : false,                 //页面左边角色列表是否加载中

        allFunctionList : [],                       //页面右边功能列表内容
        secondFunctionArray : [],                   //页面右边默认打开的二级菜单的菜单列表数组
        roleFunctionArray : [],                     //每个角色所拥有的权限ID数组(选中)
        allFunctionListLoading : false,             //页面右边功能列表是否加载中
        wetherRoleItemChooseIndex : '',             //角色被选中查看的索引
        roleClickedName : '',                       //被选中角色名字(用于显示于权限右边)

        roleProperty : {},                          //角色属性 包括id,name等
        roleListItemIndex : '',                     //角色列表项重命名项索引
        createingRoleVisible : false,               //是否在新建角色名称时(判断是否动态添加一个输入框，false不在新建状态)
        createNameOrRenameContent : '',             //角色名称新建或重命名已有角色名称时输入框内的值
        saveRoleFuncButtonLoading : false,          //点击保存权限按钮加载状态

        /*总部信息*/
        headDetailData : {},                        //总部信息数据
        headDetailSubmitButtonLoading : false,      //总部信息提交按钮加载状态

        /*品牌信息*/
        wetherGetBrandStatus : true,                //是否获取到品牌状态
        brandStep : 0,                              //品牌信息状态步数(必须是num,0,1,2)
        brandData : {},                             //品牌审核和成功后的回显品牌信息
        brandSubmitButtonLoading : false,           //提交审核按钮加载状态

        /*域名设置*/
        domainStep : 0,                                 //步骤条步数(必须是num)
        wetherGetDomainStatus : false,                  //获取租户申请状态是否成功(失败则使页面变为空页面)
        domainName : undefined,                         //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
            /*域名设置 第一步 申请*/
            domainFirstStepSubmitButtonLoading : false, //申请使用按钮加载状态

            /*域名设置 第四步 各种设置*/
            domainForthStepBackgroundImg : [],          //用户选择或回填的背景图
            domainForthStepLogoImg : [],                //用户选择或回填的logo图片
            domainForthStepName : undefined,            //用户输入或回填的商户姓名
			domainForthStepTitle : undefined,            //用户输入或回填的商户标语
            domainForthStepSubmitButtonLoading : false, //保存设置按钮加载状态

        /*课件分类和组织架构*/
        treeData : [],                                  //数据
        treeLimit : 0,                                  //限制层数
        treeType : undefined,                           //类型('structure'/'courseware')

        /*新增编辑状状结构(课件分类，组织架构)modal*/
        addOrEditTreeModalType : undefined,             //modal类型create/create_son/update/delete
        addOrEditTreeModalVisible : false,              //modal是否显示
        addOrEditTreeModalLoading : false,              //modal加载状态
        addOrEditTreeModalButtonLoading : false,        //modal按钮加载状态
        addOrEditTreeModalData : {},                    //modal编辑时回填数据

        // 查重规则
        confArr: [],
        dupValue: undefined,
        allConf: {},

        // 来源类别
        deptList: [],               // 部门下拉
        deptId: undefined,          // 默认部门
        secondList: [],             // 来源类别列表
        secondLoading: false,

        // 市场渠道
        firstList: [],              // 市场渠道列表
        firstLoading: false,
        deptIdFirst: undefined,
        firstCurrentRow: {},        // 当前行
        firstCurrentIndex: 0,
        // 二级渠道
        firstSubList: [],          // 二级渠道列表
        firstSubLoading: false,
        hasAction: true,          // 操作权限

        // 财务设置
        projectCurrentRow: {},        // 当前行
        projectCurrentIndex: 0,
        // 支出类别
        projectList: [],              // 支出类别列表
        projectLoading: false,
        // 支出项目
        projectSubList: [],          // 支出项目列表
        projectSubLoading: false,

        financeLoading: false,
        financeSwitch: '1',
        financeDate: 5,
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/hq_setup_hqset') {
                    dispatch({
						type : 'initMenu',
                    });
                    let leftMenu = window._init_data.language && window._init_data.language == 'dsf' ? [
                        { "name" : "总部角色" , "id" : "role" , "choose" : true },
                        { "name" : "总部信息" , "id" : "head_detail" , "choose" : false },
                        { "name" : "品牌信息" , "id" : "brand" , "choose" : false },
                        { "name" : "安全设置" , "id" : "security_setting" , "choose" : false },
                        { "name" : "个性化域名" , "id" : "domain" , "choose" : false },
                        { "name" : "课件分类" , "id" : "courseware" , "choose" : false },
                        { "name" : "组织架构" , "id" : "structure" , "choose" : false },
                        { "name" : "收付款账号" , "id" : "accounts" , "choose" : false },
                        { "name" : "名单回收" , "id" : "leadRecycle" , "choose" : false },
                        { "name" : "名单查重" , "id" : "leadDup" , "choose" : false },
                        { "name" : "来源类别" , "id" : "secondSource" , "choose" : false },
                        { "name" : "市场渠道" , "id" : "firstSource" , "choose" : false },
                        { "name" : "财务设置" , "id" : "finance" , "choose" : false },
                        { "name" : "操作日志" , "id" : "filelog" , "choose" : false },
                    ] : [
                        { "name" : "总部角色" , "id" : "role" , "choose" : true },
                        { "name" : "总部信息" , "id" : "head_detail" , "choose" : false },
                        { "name" : "品牌信息" , "id" : "brand" , "choose" : false },
                        { "name" : "安全设置" , "id" : "security_setting" , "choose" : false },
                        { "name" : "个性化域名" , "id" : "domain" , "choose" : false },
                        { "name" : "课件分类" , "id" : "courseware" , "choose" : false },
                        { "name" : "组织架构" , "id" : "structure" , "choose" : false },
                        { "name" : "收付款账号" , "id" : "accounts" , "choose" : false },
                        { "name" : "名单回收" , "id" : "leadRecycle" , "choose" : false },
                        { "name" : "名单查重" , "id" : "leadDup" , "choose" : false },
                        { "name" : "操作日志" , "id" : "filelog" , "choose" : false },
                        { "name" : "财务设置" , "id" : "finance" , "choose" : false },
                    ]

					dispatch({
						type : 'updateState',
						payload : {
							leftMenu,
							chooseMenuItem : { "name" : "总部角色" , "id" : "role" , "choose" : true },
						}
					})
                }
            });
        },
    },

    effects: {
        /*根据菜单请求对应接口*/
        *'initMenu'({ payload },{ call , select , put }){
            let headQuartersSetting = yield select(state => state.headQuartersSetting);
            //默认是菜单第一个，接下来就是选到哪个请求哪个
			let chooseMenuItem = headQuartersSetting.chooseMenuItem || menu[0];
            switch(chooseMenuItem.id){
                case 'role' : yield put({ type : 'SearchAllRoleList' }) ; break ;
                case 'head_detail' : yield put({ type : 'HeadDetailQuery' }) ; break ;
                case 'brand' : yield put({ type : 'BrandGetStatus' }) ; break ;
                case 'security_setting' : yield put({ type : 'securitySettingsModel/getCheckPhoneNum' }) ; break ;
                case 'domain' : yield put({ type : 'DomainGetApplyStatus' }) ; break ;
                case 'structure' : yield put({ type : 'GetTreeStuOrCou' , payload : { treeType : chooseMenuItem.id , treeLimit : 5 } }) ; break ;
                case 'courseware' : yield put({ type : 'GetTreeStuOrCou' , payload : { treeType : chooseMenuItem.id , treeLimit : 2 }}) ; break ;
                // case 'filelog' : yield put ({type : 'filelogTabe'});break;
            }
        },

        //总部信息查询
        *'HeadDetailQuery'({ payload },{ call , select , put }){
            yield put({ type : 'showRightLoading' });
            let res = yield call(HeadDetailQuery,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        headDetailData : ret
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取总部信息失败');
                yield put({
                    type : 'updateState',
                    payload : {
                        headDetailData : {}
                    }
                })
            }
            yield put({ type : 'closeRightLoading' });
        },

        //总部信息提交审核
        *'HeadDetailSubmit'({ payload },{ call , select , put }){
            yield put({ type : 'showRightLoading' });
            yield put({ type : 'updateState' , payload : { headDetailSubmitButtonLoading : true } });
            let res = yield call(HeadDetailSubmit,parse(payload.data));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('总部信息设置成功');
                console.info('payload',payload)
                let { ret } = res;
                yield put({
                    type : 'indexMainLayoutModel/updateState',
                    payload : {
                        orgInfo : payload.data
                    }
                })
            }else{
                //提交失败回到提交前的内容状态
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '总部信息设置失败');
                payload && payload.clear();
            }
            yield put({ type : 'closeRightLoading' });
            yield put({ type : 'updateState' , payload : { headDetailSubmitButtonLoading : false } });
        },

        /*品牌*/
            //获取品牌状态
            *'BrandGetStatus'({ payload },{ call , select , put }){
                yield put({ type : 'showRightLoading' });
                let res = yield call(BrandGetStatus,parse(payload));
                if(!!res && res.ret && res.ret.errorCode == '9000'){
                    let { ret } = res;
                    let brandStep = !isNaN(ret.status + '') ? parseFloat(ret.status) : 0;
                    yield put({
                        type : 'updateState',
                        payload : {
                            wetherGetBrandStatus : true,
                            brandStep,
                            //brandStep : 0,
                            brandData : ret
                        }
                    })
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取品牌状态失败');
                    yield put({
                        type : 'updateState',
                        payload : {
                            wetherGetBrandStatus : false,
                        }
                    })
                }
                yield put({ type : 'closeRightLoading' });
            },

            //品牌信息提交审核(提交的对象，清空表单方法,请求成功后调用清空方法)
            *'BrandSubmit'({ payload },{ call , select , put }){
                yield put({ type : 'showRightLoading' });
                yield put({ type : 'updateState' , payload : { brandSubmitButtonLoading : true } });
                let res = yield call(BrandSubmit,parse(payload));
                if(!!res && res.ret && res.ret.errorCode == '9000'){
                    let { ret } = res;
                    message.success('品牌信息提交审核成功');
                    //新增成功，清空表单(resetFields)；编辑成功，不清空表单
                    if(payload.type == 'create'){
                        payload.clear && payload.clear();
                    }
                    yield put({
                        type : 'BrandGetStatus'
                    })
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '品牌信息提交审核失败');
                    //编辑失败，清空表单，回到回填时的数据(resetFields)
                    if(payload.type == 'update'){
                        payload.clear && payload.clear();
                    }
                }
                yield put({ type : 'closeRightLoading' });
                yield put({ type : 'updateState' , payload : { brandSubmitButtonLoading : false } });
            },

        /*域名设置*/
            //域名设置获取当前租户申请状态
            *'DomainGetApplyStatus'({ payload } , { call , put , select }){
                yield put({ type : 'showRightLoading' });
                let res = yield call(DomainGetApplyStatus,parse(payload));
                if(!!res && res.ret && res.ret.errorCode == '9000'){
                    let { ret } = res;
                    let domainStep = !isNaN(ret.status + '') ? parseFloat(ret.status) : 0;
                    yield put({
                        type:'updateState',
                        payload:{
                            wetherGetDomainStatus : true,     //获取租户申请状态是否成功(失败则使页面变为空页面)
                            domainStep
                            //domainStep : 0        //调试用
                        }
                    });
                    if(domainStep != 0){
                        yield put({
                            type : 'updateState',
                            payload : {
                                domainName : ret.hostName || '***(unknown)'
                            }
                        })
                    }
                    if(domainStep == 3){
                        let backgroundImg  = [{
                            uid : -1 ,
                            url : !!ret.bgimg ? ret.bgimg : 'https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5',
                            name : '背景图',
                            thumbUrl : !!ret.bgimg ? ret.bgimg : 'https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5',
                        }];
                        let logoImg = [{
                            uid : -2 ,
                            url : ret.logoimg ? ret.logoimg : 'https://img.ishanshan.com/gimg/img/f204fd8affff8cdb30b68554143ef4f5',
                            name : 'logo图',
                            thumbUrl : ret.logoimg ? ret.logoimg : 'https://img.ishanshan.com/gimg/img/f204fd8affff8cdb30b68554143ef4f5',
                        }]
                        yield put({
                            type:'updateState',
                            payload:{
                                domainForthStepBackgroundImg : backgroundImg,
                                domainForthStepLogoImg : logoImg,
                                domainForthStepName : !!ret.brandName ? ret.brandName : undefined,
								domainForthStepTitle : !!ret.brandNameTitle ? ret.brandNameTitle : undefined
                            }
                        })
                    }
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取租户申请状态失败');
                    yield put({
                        type : 'updateState' ,
                        payload : {
                            wetherGetDomainStatus : false     //获取租户申请状态是否成功(失败则使页面变为空页面)
                        }
                    })
                }
                yield put({ type : 'closeRightLoading' });
            },

            //域名设置第一步申请使用点击提交
            *'DomainFirstStepApplyForSubmit'({ payload } , { call , put , select }){
                yield put({ type : 'showRightLoading' });
                yield put({ type : 'updateState' , payload : { domainFirstStepSubmitButtonLoading : true } });
                let res = yield call(DomainFirstStepApplyForSubmit,parse(payload));
                if(!!res && res.ret && res.ret.errorCode == '9000'){
                    message.success('提交申请成功');
                    yield put({ type : 'DomainGetApplyStatus' })
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '提交申请失败');
                }
                yield put({ type : 'closeRightLoading' });
                yield put({ type : 'updateState' , payload : { domainFirstStepSubmitButtonLoading : false } });
            },

            //域名设置第四步保存设置事件
            *'DomainForthStepSetSubmit'({ payload } , { call , put , select }){
                yield put({ type : 'showRightLoading' });
                yield put({ type : 'updateState' , payload : { domainForthStepSubmitButtonLoading : true } });
                let res = yield call(DomainForthStepSetSubmit,parse(payload));
                if(!!res && res.ret && res.ret.errorCode == '9000'){
                    message.success('域名背景图，logo图与品牌名称设置成功');
                    yield put({ type : 'DomainGetApplyStatus' })
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '设置失败，请重新保存');
                }
                yield put({ type : 'closeRightLoading' });
                yield put({ type : 'updateState' , payload : { domainForthStepSubmitButtonLoading : false } });
            },

        /*角色管理*/
            //默认请求左边角色总览列表数据并展示管理员权限
            *'SearchAllRoleList'({ payload }, { call, put, select }){
                yield put({ type : 'showRightLoading' });
                let res = yield call(SearchAllRoleList);
                if (!!res && res.ret && res.ret.errorCode === 9000) {
                    let { ret } = res;
                    let array = ret.results && ret.results[0] && (ret.results)[0].resIds;        //默认展示管理员的权限
                    yield put({
                        type: 'updateState',
                        payload: {
                            allRoleList : ret.results || [],
                            roleProperty : ret.results && (ret.results)[0],                    //选择管理员的角色属性
                            wetherRoleItemChooseIndex : 0,                      //光标跳回管理员
                            roleClickedName :ret.results && ret.results[0] && (ret.results)[0].name             //管理员名称
                        },
                    });
                    yield put({
                        type:'SearchAllFunction',
                        payload:{
                            array : array,              //保存默认打勾的选项ID，等右边渲染完毕之后赋值
                            roleProperty: ret.results && (ret.results)[0],
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取角色失败');
                }
                yield put({ type : 'closeRightLoading' });
            },

            /*默认请求右边所有功能列表数据(显示管理员权限)*/
            *'SearchAllFunction'({ payload }, { call, put, select }){
                yield put({ type : 'showRightLoading' });
                let res = yield call(SearchAllFunction);
                if (!!res && res.ret && res.ret.errorCode === 9000) {
                    let { ret } = res;
                    let array = [];
                    for(let i in (ret.results)){
                        array.push(((ret.results)[i].id)+'');
                    }
                    yield put({
                        type: 'updateState',
                        payload: {
                            allFunctionList : ret.results || [],
                            secondFunctionArray : array,            //默认打开二级树结构
                        },
                    });
                    yield put({
                        type: 'showRoleFuncs',
                        payload: {
                            id : payload.roleProperty && payload.roleProperty.id,
                            index : 0,
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取权限失败');
                }
                yield put({ type : 'closeRightLoading' });
            },

            /*操作之后的查询角色列表*/
            *'AfterOperationSearchAllRoleList'({ payload }, { call, put, select }){
                yield put({ type : 'showRightLoading' });
                let res = yield call(SearchAllRoleList);
                if (res && res.ret && res.ret.errorCode === 9000) {
                    let { ret } = res;
                    yield put({
                        type: 'updateState',
                        payload: {
                            allRoleList : ret.results,
                        },
                    });
                    /*操作之后请求右边所有功能列表数据(显示当前权限)*/
                    yield put({
                        type:'AfterOperationSearchAllFunction',
                        payload:{
                            ...payload
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取角色失败');
                }
                yield put({ type : 'closeRightLoading' });
            },

            /*操作之后请求右边所有功能列表数据(显示当前权限)*/
            *'AfterOperationSearchAllFunction'({ payload }, { call, put, select }){
                yield put({ type : 'showRightLoading' });
                let res = yield call(SearchAllFunction);
                if (!!res && res.ret && res.ret.errorCode === 9000) {
                    let { ret } = res;
                    let array = [];
                    for(let i in (ret.results)){
                        array.push(((ret.results)[i].id)+'');
                    }
                    yield put({
                        type: 'updateState',
                        payload: {
                            allFunctionList : ret.results || [],
                            secondFunctionArray : array,                                        //默认打开二级树结构
                            roleProperty : payload.roleProperty,                                //赋值当前选项的全部属性
                            //roleFunctionArray :  treeFunctionList,                            //将选中项转成数组并赋值
                            wetherRoleItemChooseIndex :  payload.wetherRoleItemChooseIndex,     //光标位置为当前位置
                            roleClickedName : payload.roleClickedName,                          //显示在权限右边的角色名称
                        },
                    });
                    yield put({
                        type: 'showRoleFuncs',
                        payload: {
                            id : payload.roleProperty.id,
                            index : payload.wetherRoleItemChooseIndex,     //光标位置为当前位置
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取权限失败');
                }
                yield put({ type : 'closeRightLoading' });
            },

            /*左边角色列表重命名角色*/
            *'RenameRole'({ payload }, { call, put, select }){
                let res = yield call(RenameRole,parse(payload));
                if(!!res && res.ret && res.ret.errorCode === 9000){
                    let { ret } = res;
                    message.success('重命名角色成功');
                    yield put({
                        type:'updateState',
                        payload:{
                            roleListItemIndex : '',                         //取消重命名输入框显示
                            createNameOrRenameContent : '',                 //清空输入框内容，包括新增输入框和重命名输入框
                        }
                    });
                    yield put({
                        type:'AfterOperationSearchAllRoleList',
                        payload:{
                            roleProperty : ret.data,                                //赋值当前选项的全部属性
                            roleFunctionArray : (ret.data).resIds && ((ret.data).resIds).length > 0 ? ((ret.data).resIds).split(",") : [],     //将选中项转成数组并赋值
                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                            roleClickedName : payload.name                          //显示在权限右边的角色名称
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '重命名角色失败');
                }
            },

            /*左边角色列表复制角色*/
            *'CopyRole'({ payload }, { call, put, select }){
                let res = yield call(CopyRole,parse(payload));
                if(!!res && res.ret && res.ret.errorCode === 9000){
                    message.success('复制角色成功');
                    let { ret } = res;
                    //角色列表检索(跳到复制产生者的权限)
                    yield put({
                        type:'AfterOperationSearchAllRoleList',
                        payload:{
                            roleProperty : ret.data,                                //赋值当前选项的全部属性
                            roleFunctionArray : (ret.data).resIds && ((ret.data).resIds).length > 0 ? ((ret.data).resIds).split(",") : [], //将新增项转成数组并赋值
                            wetherRoleItemChooseIndex : payload.index,              //光标位置为被复制角色的位置
                            roleClickedName : ret.data.name,
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '复制角色失败');
                }
            },

            /*左边角色列表删除角色*/
            *'DeleteRole'({ payload }, { call, put, select }){
                let res = yield call(DeleteRole,parse(payload));
                if(!!res && res.ret && res.ret.errorCode === 9000){
                    message.success('删除角色成功');
                    let { ret } = res;
                    //光标跳回管理员那项
                    yield put({
                        type : 'updateState',
                        payload : {
                            wetherRoleItemChooseIndex : 0,                      //光标跳回管理员
                        }
                    });
                    //角色列表检索(跳回管理员权限)
                    yield put({
                        type : 'SearchAllRoleList',
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '删除角色失败');
                }
            },

            /*左边角色列表新增角色*/
            *'CreateRole'({ payload }, { call, put, select }){
                let res = yield call(CreateRole,parse(payload));
                if(!!res && res.ret && res.ret.errorCode === 9000){
                    message.success('新增角色成功');
                    let { ret } = res;
                    //关闭新增输入框
                    yield put({
                        type : 'updateState',
                        payload : { createingRoleVisible : false }
                    });
                    //角色列表检索(跳到新增角色的权限)
                    yield put({
                        type:'AfterOperationSearchAllRoleList',
                        payload:{
                            roleProperty : ret.data,                                //赋值当前选项的全部属性
                            roleFunctionArray : [],                                 //将新增项转成数组并赋值(新增必然是没有权限)
                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                            roleClickedName : (ret.data).name,
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '新增角色失败');
                }
            },

            /*权限保存*/
            *'SaveRoleFunction'({ payload }, { call, put, select }){
                yield put({ type : 'updateState', payload : { saveRoleFuncButtonLoading : true } });
                let headQuartersSetting = yield select(state => state.headQuartersSetting);
                let { allFunctionList , roleFunctionArray } = headQuartersSetting;
                let dataFuncList = [];//往后台传递的菜单项
                function isCheck(item) {
                    let resultFlg = false;
                    //判断当前节点是否选中
                    if(roleFunctionArray.findIndex((x)=> {return x == item.id}) > -1) {
                        resultFlg = true;
                    }
                    //是否有子节点
                    if(item.list && item.list.length > 0) {
                        let children = item.list;
                        let flg_none = true;
                        children && children.map(function(childItem) {
                              if(isCheck(childItem)) {
                                  flg_none = false;
                              }
                        });
                      resultFlg = (!flg_none) || resultFlg;
                    }
                    if(resultFlg) {
                        dataFuncList.push(item.id + '');
                    }
                    return resultFlg;
                }
                allFunctionList && allFunctionList.length > 0 && allFunctionList.map(function(allItem) {
                    isCheck(allItem);
                });
                payload.resIds = dataFuncList.join(',');
                let res = yield call(SaveRoleFunction,parse(payload));
                if(!!res && res.ret && res.ret.errorCode === 9000){
                    message.success('权限保存成功');
                    let { ret } = res;
                    yield put({
                        type:'AfterOperationSearchAllRoleList',
                        payload:{
                            roleProperty : ret.data,                                //赋值当前选项的全部属性
                            roleFunctionArray : ((ret.data).resIds).split(","),     //讲选中项转成数组并赋值
                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                            roleClickedName : ret.data.name,
                        }
                    });
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '权限保存失败');
                }
                yield put({ type : 'updateState', payload : { saveRoleFuncButtonLoading : false } });
            },

        /*组织架构和课件分类*/
            //组织架构和课件分类查询
            *'GetTreeStuOrCou'({ payload }, { call, put, select }){
                yield put({ type : 'showRightLoading' });
                let headQuartersSetting = yield select(state => state.headQuartersSetting);
                let treeType = (payload && payload.treeType) || headQuartersSetting.treeType;
                let treeLimit = (payload && payload.treeLimit) || headQuartersSetting.treeLimit;
                //更新树状结构的类型和限制层数
                yield put({ type : 'updateState' , payload : { treeType , treeLimit } });
                let res = yield call(GetTreeStuOrCou,parse({ treeType }));
                if (!!res && res.ret && res.ret.errorCode === 9000) {
                    let { ret } = res;
                    yield put({
                        type: 'updateState',
                        payload: { treeData : ret.results || [] },
                    });
                }else{
                    let defaultValue = treeType == 'structure' ? '组织架构' : treeType == 'courseware' ? '课件分类' : ''
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : `获取${defaultValue}失败`);
                    yield put({
                        type: 'updateState',
                        payload: { treeData : [] },
                    });
                }
                yield put({ type : 'closeRightLoading' });
            },

            //组织架构和课件分类新增编辑删除
            *'AddOrEditTreeModalSubmit'({ payload }, { call, put, select }){
                yield put({ type : 'updateState' , payload : { addOrEditTreeModalLoading : true , addOrEditTreeModalButtonLoading : true } });
                let defaultMessage = payload.addOrEditTreeModalType == 'create' ? '新增' :
                                     payload.addOrEditTreeModalType == 'update' ? '编辑' :
                                     payload.addOrEditTreeModalType == 'delete' ? '删除' : '';
                let res = yield call(AddOrEditTreeModalSubmit,parse(payload));
                if (!!res && res.ret && res.ret.errorCode === 9000) {
                    message.success(defaultMessage + '成功');
                    let { ret } = res;
                    yield put({
                        type: 'updateState',
                        payload: {
                            addOrEditTreeModalVisible : false,
                            addOrEditTreeModalType : undefined,
                            addOrEditTreeModalData : {}
                        },
                    });
                    yield put({ type : 'GetTreeStuOrCou' })
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : defaultMessage + '失败');
                }
                yield put({ type : 'updateState' , payload : { addOrEditTreeModalLoading : false , addOrEditTreeModalButtonLoading : false } });
            },

            // 获取查重规则
            *getLeadsDup({ payload }, { call, put, select }){
                yield put({type: 'showRightLoading'})
                let {ret} = yield call(getLeadsDup, parse(payload))
                if (ret && ret.errorCode === 0) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            confArr: ret.single.confArray,
                            dupValue: ret.single.checkedConfArray,
                            allConf: ret
                        },
                    })
                }else{
                    message.error(ret && ret.errorMessage ? ret.errorMessage : '获取查重规则失败');
                }
                yield put({type: 'closeRightLoading'})
            },

            // 保存查重规则
            *saveLeadsDup({ payload }, { call, put, select }){
                yield put({type: 'showRightLoading'})
                let {ret} = yield call(saveLeadsDup, parse(payload))
                if (ret && ret.errorCode === 0) {
                    message.success('保存成功')
                    yield put({
                        type: 'getLeadsDup'
                    })
                }else{
                    message.error(ret && ret.errorMessage ? ret.errorMessage : '保存失败');
                }
                yield put({type: 'closeRightLoading'})
            },

        /*********************************业务参数******************************/
            /** 获取部门下拉 */
            *getDeptList({ payload }, { put, call, select }){
                if(payload.key == 'second'){
                    yield put({
                        type: 'getSecondList',
                        payload: {
                            dictKey: 'firstChannel',
                            // deptId: ret.deptList ? ret.deptList[0].id : undefined
                            deptId: '0'
                        }
                    })
                    return
                }
                const { ret } = yield call(expenseOrgAndDept)
                if (ret && ret.errorCode === 0) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            deptList: ret.deptList || [],
                            deptId: ret.deptList ? ret.deptList[0].id : undefined,
                            deptIdFirst: ret.deptList ? ret.deptList[0].id : undefined,
                        },
                    })

                    if(payload.key == 'first'){
                        yield put({
                            type: 'getFirstList',
                            payload: {
                                dictKey: 'secondChannel',
                                deptId: ret.deptList ? ret.deptList[0].id : undefined ,
                                isInit: true
                            }
                        })
                    }
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "获取部门失败")
                }
            },

            /** 获取来源类别 */
            *getSecondList({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {secondLoading: true}})
                const { ret } = yield call(getSourceList, parse(payload))
                if (ret && ret.errorCode === 0) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            secondList: ret.results || [],
                            hasAction: ret.tmkPermission && ret.tmkPermission == 'hq'
                        }
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "获取来源类别失败")
                }
                yield put({type: 'updateState', payload: {secondLoading: false}})
            },

            /** 新增来源类别 */
            *addSource({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {secondLoading: true}})
                const {
                    deptId,
                    type,
                    text,
                    value,
                    callback
                } = payload
                const params = {
                    code: 'firstChannel',
                    deptId,
                    type,
                    text,
                    value
                }
                const state = yield select(state => state.headQuartersSetting)
                const { ret } = yield call(addSource, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success('新增成功')
                    // callback && callback()
                    yield put({
                        type: 'getSecondList',
                        payload: {
                            dictKey: 'firstChannel',
                            deptId: '0'
                        }
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "新增失败")
                }
                callback && callback()
                yield put({type: 'updateState', payload: {secondLoading: false}})
            },

            /** 删除来源类别 */
            *deleteSource({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {secondLoading: true}})
                const {
                    deptId,
                    id,
                    type,
                    callback
                } = payload
                const params = {
                    deptId,
                    id,
                    type,
                }
                const state = yield select(state => state.headQuartersSetting)
                const { ret } = yield call(deleteSource, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success('删除成功')
                    // callback && callback()
                    yield put({
                        type: 'getSecondList',
                        payload: {
                            dictKey: 'firstChannel',
                            deptId: '0'
                        }
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "删除失败")
                }
                callback && callback()
                yield put({type: 'updateState', payload: {secondLoading: false}})
            },

            /** 编辑来源类别 */
            *editSource({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {secondLoading: true}})
                const {
                    deptId,
                    type,
                    text,
                    value,
                    id,
                    callback
                } = payload
                const params = {
                    code: 'firstChannel',
                    deptId,
                    type,
                    text,
                    value,
                    id
                }
                const state = yield select(state => state.headQuartersSetting)
                const { ret } = yield call(updateSource, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success('编辑成功')
                    // callback && callback()
                    yield put({
                        type: 'getSecondList',
                        payload: {
                            dictKey: 'firstChannel',
                            deptId: '0'
                        }
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "编辑失败")
                }
                callback && callback()
                yield put({type: 'updateState', payload: {secondLoading: false}})
            },

        /**************************市场渠道**************************/
            /** 获取市场渠道 */
            *getFirstList({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {firstLoading: true, firstSubLoading: true}})
                const { dictKey, deptId, isInit, callback } = payload
                const params = {
                    dictKey,
                    deptId
                }
                const state = yield select(state => state.headQuartersSetting)
                const { ret } = yield call(getSourceList, parse(params))
                if (ret && ret.errorCode === 0) {
                    let subList = ret.results && ret.results[0] && ret.results[0].subList ? ret.results[0].subList : []
                    if(!isInit){
                        ret.results && ret.results.forEach(item => {
                            if(item.id === state.firstCurrentRow.id){
                                subList = item.subList || []
                            }
                        })
                    } else {
                        // 第一次进入页面
                        yield put({
                            type: 'updateState',
                            payload: {
                                firstCurrentRow: (ret.results && ret.results[0]) || {}
                            }
                        })
                    }
                    yield put({
                        type: 'updateState',
                        payload: {
                            firstList: ret.results || [],
                            firstSubList: subList,
                            hasAction: ret.tmkPermission && ret.tmkPermission == 'hq'
                        }
                    })
                    callback && callback()
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "获取市场渠道失败")
                }
                yield put({type: 'updateState', payload: {firstLoading: false, firstSubLoading: false}})
            },

            /** 新增市场渠道 */
            *addFirstSource({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {firstLoading: true, firstSubLoading: true}})
                const {
                    deptId,
                    type,
                    text,
                    value,
                    dictItemId,
                    callback
                } = payload
                const params = {
                    code: 'secondChannel',
                    deptId,
                    type,
                    text,
                    value,
                    dictItemId
                }
                const state = yield select(state => state.headQuartersSetting)
                const { ret } = yield call(addSource, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success('新增成功')
                    // callback && callback()
                    yield put({
                        type: 'getFirstList',
                        payload: {
                            dictKey: 'secondChannel',
                            deptId: state.deptIdFirst
                        }
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "新增失败")
                }
                callback && callback()
                yield put({type: 'updateState', payload: {firstLoading: false, firstSubLoading: false}})
            },

            /** 编辑市场渠道 */
            *editFirstSource({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {firstLoading: true, firstSubLoading: true}})
                const {
                    deptId,
                    type,
                    text,
                    value,
                    id,
                    callback
                } = payload
                const params = {
                    code: 'secondChannel',
                    deptId,
                    type,
                    text,
                    value,
                    id
                }
                const state = yield select(state => state.headQuartersSetting)
                const { ret } = yield call(updateSource, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success('编辑成功')
                    yield put({
                        type: 'getFirstList',
                        payload: {
                            dictKey: 'secondChannel',
                            deptId: state.deptIdFirst
                        }
                    })
                    // callback && callback()
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "编辑失败")
                }
                callback && callback()
                yield put({type: 'updateState', payload: {firstLoading: false, firstSubLoading: false}})
            },

            /** 删除市场渠道 */
            *deleteFirst({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {firstLoading: true, firstSubLoading: true}})
                const {
                    deptId,
                    id,
                    type,
                    callback
                } = payload
                const params = {
                    deptId,
                    id,
                    type,
                }
                const state = yield select(state => state.headQuartersSetting)
                const { ret } = yield call(deleteSource, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success('删除成功')
                    yield put({
                        type: 'getFirstList',
                        payload: {
                            dictKey: 'secondChannel',
                            deptId: state.deptId,
                            callback
                        }
                    })
                } else {
                    callback && callback()
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "删除失败")
                }
                yield put({type: 'updateState', payload: {firstLoading: false, firstSubLoading: false}})
            },

            /**************************************财务设置***********************************/
            // 获取财务设置列表
            *getFinance({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {projectLoading: true, projectSubLoading: true}})
                const { isInit, callback } = payload
                const params = {
                    projectType: '1'
                }
                const state = yield select(state => state.headQuartersSetting)
                const { ret } = yield call(getFinanceList, parse(params))
                if (ret && ret.errorCode === 0) {
                    let newList = []
                    ret.results && ret.results.forEach(item => {
                        item.items && item.items.map(child => {
                            child.value = child.name
                        })
                        newList.push({...item, value: item.name})
                    })

                    let subList = newList.length > 0 && newList[0] && newList[0].items ? newList[0].items : []
                    if(!isInit){
                        newList && newList.forEach(item => {
                            if(item.id === state.projectCurrentRow.id){
                                subList = item.items || []
                            }
                        })
                    } else {
                        // 第一次进入页面
                        yield put({
                            type: 'updateState',
                            payload: {
                                projectCurrentRow: (newList && newList[0]) || {}
                            }
                        })
                    }
                    yield put({
                        type: 'updateState',
                        payload: {
                            projectList: newList || [],
                            projectSubList: subList
                        }
                    })
                    callback && callback()
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "获取财务设置失败")
                }
                yield put({type: 'updateState', payload: {projectLoading: false, projectSubLoading: false}})
            },

            /** 新增支出类别 */
            *addFinanceSet({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {projectLoading: true, projectSubLoading: true}})
                const {
                    name,
                    projectType,
                    callback
                } = payload
                const params = {
                    name,
                    projectType,
                }
                const { ret } = yield call(addFinance, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success('新增成功')
                    // callback && callback()
                    yield put({
                        type: 'getFinance',
                        payload: {}
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "新增失败")
                }
                callback && callback()
                yield put({type: 'updateState', payload: {projectLoading: false, projectSubLoading: false}})
            },

            /** 编辑/删除支出类别 */
            *editFinanceSet({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {projectLoading: true, projectSubLoading: true}})
                const {
                    status, // 1编辑，0删除
                    name,
                    id,
                    callback
                } = payload
                let text = status == '1' ? '编辑' : '删除'
                const params = {
                    status, // 1编辑，0删除
                    name,
                    id,
                }
                const { ret } = yield call(updateFinance, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success(`${text}成功`)
                    yield put({
                        type: 'getFinance',
                        payload: {}
                    })
                    // callback && callback()
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : `${text}失败`)
                }
                callback && callback()
                yield put({type: 'updateState', payload: {projectLoading: false, projectSubLoading: false}})
            },

            /** 新增支出项目 */
            *addItem({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {projectLoading: true, projectSubLoading: true}})
                const {
                    name,
                    projectId,
                    callback
                } = payload
                const params = {
                    name,
                    projectId,
                }
                const { ret } = yield call(addProject, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success('新增成功')
                    // callback && callback()
                    yield put({
                        type: 'getFinance',
                        payload: {}
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : "新增失败")
                }
                callback && callback()
                yield put({type: 'updateState', payload: {projectLoading: false, projectSubLoading: false}})
            },

            /** 编辑/删除支出项目 */
            *editItem({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {projectLoading: true, projectSubLoading: true}})
                const {
                    status, // 1编辑，0删除
                    name,
                    id,
                    callback
                } = payload
                let text = status == '1' ? '编辑' : '删除'
                const params = {
                    status, // 1编辑，0删除
                    name,
                    id,
                }
                const { ret } = yield call(updateProject, parse(params))
                if (ret && ret.errorCode === 0) {
                    message.success(`${text}成功`)
                    yield put({
                        type: 'getFinance',
                        payload: {}
                    })
                    // callback && callback()
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : `${text}失败`)
                }
                callback && callback()
                yield put({type: 'updateState', payload: {projectLoading: false, projectSubLoading: false}})
            },

            /** 财务设置 */
            *getFinanceSet({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {financeLoading: true}})
                const params = { confKey: 'spendTimeCheck', orgId: '0' }
                const { ret } = yield call(getFinanceSet, parse(params))
                if (ret && ret.errorCode === 0) {
                    let financeDate = ret.data && ret.data.results ? Number(ret.data.results[0].key) : undefined
                    let financeSwitch = ret.data && ret.data.results[0].status
                    yield put({
                        type: 'updateState',
                        payload: {
                            financeDate,
                            financeSwitch
                        }
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : '获取设置失败')
                }
                yield put({type: 'updateState', payload: {financeLoading: false}})
            },

            /** 保存财务设置 */
            *saveFinanceSet({ payload }, { put, call, select }){
                yield put({type: 'updateState', payload: {financeLoading: true}})
                const { ret } = yield call(saveFinanceSet, parse(payload))
                if (ret && ret.errorCode === 0) {
                    message.success('保存成功')
                    yield put({
                        type: 'getFinanceSet'
                    })
                } else {
                    message.error(ret && ret.errorMessage ? ret.errorMessage : `保存失败`)
                }
                yield put({type: 'updateState', payload: {financeLoading: false}})
            },
    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showRightLoading(state, action){
            return { ...state , rightLoading : true };
        },
        closeRightLoading(state, action){
            return { ...state , rightLoading : false };
        },
        //根据角色编号渲染角色拥有的菜单项
        showRoleFuncs(state,action) {
            let { allFunctionList , allRoleList } = state;
            let { id , index} = action.payload;

            let roleFunctionArray = [];
            let roleClickedName = '';
            let roleProperty = {};

            allRoleList && allRoleList.length > 0 && allRoleList.map(function(roleItem) {
                if(roleItem.id == id) {
                    roleFunctionArray = roleItem.resIds;
                    roleClickedName = roleItem.name;
                    roleProperty = roleItem;
                }
            });

            let treeFunctionList = [];                              //tree勾选的菜单选项

            let isCheck = function(specialMenu){
                let resultFlg = false;
                //判断当前节点有没有被选中
                if(roleFunctionArray.findIndex(function(x) {
                    return x == specialMenu.id;
                }) > -1) {
                    //判断是否有子节点
                    if(specialMenu.list){
                        let flg_all = true;     //是否所有子节点都被选中
                        let flg_none = true;    //是否子节点一个都没有选中

                        let children = specialMenu.list;

                        children && children.length > 0 && children.map(function(childItem) {
                            if(isCheck(childItem)) {
                                flg_none = false;
                            } else {
                                flg_all = false;
                            }
                        });
                        resultFlg = flg_all;
                    } else {
                        resultFlg = true;
                    }
                }

                if(resultFlg) {
                    treeFunctionList.push(specialMenu.id+'');
                }
                return resultFlg;
            }

            for(let i in allFunctionList){
                isCheck(allFunctionList[i]);
            }

            return { ...state, roleFunctionArray: treeFunctionList, wetherRoleItemChooseIndex: index, roleClickedName, roleProperty};
        },
    },
};
