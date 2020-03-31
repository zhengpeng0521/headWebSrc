import {
    searchAllRoleList,      /*请求左边角色总览列表数据*/
    searchAllFunction,      /*请求右边所有功能列表数据*/
    RenameRole,             /*左边角色列表重命名角色*/
    CopyRole,               /*左边角色列表复制角色*/
    DeleteRole,             /*左边角色列表删除角色*/
    CreateRole,             /*左边角色列表新增角色*/
    SaveRoleFunction        /*权限保存*/
} from '../../../services/system/role-manage/RoleManage';
import { parse } from 'qs';
import { message } from 'antd';

/*角色管理*/
export default {

    namespace: 'roleManage',

    state: {

        allRoleList : [],                       //页面左边角色列表内容
        allRoleListLoading : false,             //页面左边角色列表是否加载中

        allFunctionList : [],                   //页面右边功能列表内容
        secondFunctionArray : [],               //页面右边默认打开的二级菜单的菜单列表数组
        roleFunctionArray : [],                 //每个角色所拥有的权限ID数组(选中)
        allFunctionListLoading : false,         //页面右边功能列表是否加载中
        wetherRoleItemChooseIndex : '',         //角色被选中查看的索引
        clickedName : '',                       //被选中角色名字(用于显示于权限右边)

        roleProperty : {},                      //角色属性 包括id,name等
        roleListItemIndex : '',                 //角色列表项重命名项索引
        createingRoleVisible : false,           //是否在新建角色名称时(判断是否动态添加一个输入框，false不在新建状态)
        createNameOrRenameContent : '',         //角色名称新建或重命名已有角色名称时输入框内的值
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_scfg_role_list') {
                    dispatch({
                        type: 'searchAllRoleList'
                    });
                }
            });
        },
    },

    effects: {
        /*默认请求左边角色总览列表数据并展示管理员权限*/
        *'searchAllRoleList'({ payload }, { call, put, select }){
            yield put({ type:'showLeftRoleListLoading' });
            let { ret } = yield call(searchAllRoleList);
            if (ret && ret.errorCode === 9000) {
                let array = (ret.results)[0].resIds;        //默认展示管理员的权限
                yield put({
                    type: 'updateState',
                    payload: {
                        allRoleList : ret.results,
                        roleProperty : (ret.results)[0],                    //选择管理员的角色属性
                        wetherRoleItemChooseIndex : 0,                      //光标跳回管理员
                        clickedName : (ret.results)[0].name                 //管理员名称
                    },
                });
                yield put({
                    type:'searchAllFunction',
                    payload:{
                        array : array,              //保存默认打勾的选项ID，等右边渲染完毕之后赋值
                        roleProperty: (ret.results)[0],
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeLeftRoleListLoading' });
        },

        /*默认请求右边所有功能列表数据(显示管理员权限)*/
        *'searchAllFunction'({ payload }, { call, put, select }){
            yield put({ type:'showRightFunctionListLoading' });
            let { ret } = yield call(searchAllFunction);
            if (ret && ret.errorCode === 9000) {
                let array = [];
                for(let i in (ret.results)){
                    array.push(((ret.results)[i].id)+'');
                }
                yield put({
                    type: 'updateState',
                    payload: {
                        allFunctionList : ret.results,
                        secondFunctionArray : array,            //默认打开二级树结构
                    },
                });

                yield put({
                    type: 'showRoleFuncs',
                    payload: {
                        id: payload.roleProperty.id,
                        index : 0,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeRightFunctionListLoading' });
        },

        /*操作之后的查询角色列表*/
        *'AfterOperationSearchAllRoleList'({ payload }, { call, put, select }){
            yield put({ type:'showLeftRoleListLoading' });
            let { ret } = yield call(searchAllRoleList);
            if (ret && ret.errorCode === 9000) {
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
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeLeftRoleListLoading' });
        },

        /*操作之后请求右边所有功能列表数据(显示当前权限)*/
        *'AfterOperationSearchAllFunction'({ payload }, { call, put, select }){
            yield put({ type:'showRightFunctionListLoading' });
            let { ret } = yield call(searchAllFunction);
            if (ret && ret.errorCode === 9000) {
                let array = [];
                for(let i in (ret.results)){
                    array.push(((ret.results)[i].id)+'');
                }

                yield put({
                    type: 'updateState',
                    payload: {
                        allFunctionList : ret.results,
                        secondFunctionArray : array,                                        //默认打开二级树结构
                        roleProperty : payload.roleProperty,                                //赋值当前选项的全部属性
                        //roleFunctionArray :  treeFunctionList,                              //将选中项转成数组并赋值
                        wetherRoleItemChooseIndex :  payload.wetherRoleItemChooseIndex,     //光标位置为当前位置
                        clickedName : payload.clickedName,                                  //显示在权限右边的角色名称
                    },
                });

                yield put({
                    type: 'showRoleFuncs',
                    payload: {
                        id: payload.roleProperty.id,
                        index:payload.wetherRoleItemChooseIndex,     //光标位置为当前位置
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeRightFunctionListLoading' });
        },

        /*左边角色列表重命名角色*/
        *'RenameRole'({ payload }, { call, put, select }){
            yield put({ type:'showLeftRoleListLoading' });
            let { ret } = yield call(RenameRole,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success(ret.errorMessage);
                yield put({
                    type:'updateState',
                    payload:{
                        roleListItemIndex : '',                         //取消重命名输入框显示
                        createNameOrRenameContent : '',                 //清空输入框内容，包括新增输入框和重命名输入框
                    }
                });
                if((ret.data).resIds && ((ret.data).resIds).length > 0){
                    yield put({
                        type:'AfterOperationSearchAllRoleList',
                        payload:{
                            roleProperty : ret.data,                                //赋值当前选项的全部属性
                            roleFunctionArray : ((ret.data).resIds).split(","),     //将选中项转成数组并赋值
                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                            clickedName : payload.name                              //显示在权限右边的角色名称
                        }
                    });
                }else{
                    yield put({
                        type:'AfterOperationSearchAllRoleList',
                        payload:{
                            roleProperty : ret.data,                                //赋值当前选项的全部属性
                            roleFunctionArray : [],                                 //将选中项转成数组并赋值
                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                            clickedName : payload.name                              //显示在权限右边的角色名称
                        }
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeLeftRoleListLoading' });
        },

        /*左边角色列表复制角色*/
        *'CopyRole'({ payload }, { call, put, select }){
            yield put({ type:'showLeftRoleListLoading' });
            let { ret } = yield call(CopyRole,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success(ret.errorMessage);
                //角色列表检索(跳到复制产生者的权限)
                if((ret.data).resIds && ((ret.data).resIds).length > 0){
                    yield put({
                        type:'AfterOperationSearchAllRoleList',
                        payload:{
                            roleProperty : ret.data,                                //赋值当前选项的全部属性
                            roleFunctionArray : ((ret.data).resIds).split(","),     //将新增项转成数组并赋值
                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                            clickedName : (ret.data).name
                        }
                    });
                }else{
                    yield put({
                        type:'AfterOperationSearchAllRoleList',
                        payload:{
                            roleProperty : ret.data,                                //赋值当前选项的全部属性
                            roleFunctionArray : [],                                 //将新增项转成数组并赋值
                            wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                            clickedName : (ret.data).name
                        }
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeLeftRoleListLoading' });
        },

        /*左边角色列表删除角色*/
        *'DeleteRole'({ payload }, { call, put, select }){
            yield put({ type:'showLeftRoleListLoading' });
            let { ret } = yield call(DeleteRole,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success(ret.errorMessage);
                //光标跳回管理员那项
                yield put({
                    type:'updateState',
                    payload:{
                        wetherRoleItemChooseIndex : 0,                      //光标跳回管理员
                    }
                });
                //角色列表检索(跳会管理员权限)
                yield put({
                    type:'searchAllRoleList',
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeLeftRoleListLoading' });
        },

        /*左边角色列表新增角色*/
        *'CreateRole'({ payload }, { call, put, select }){
            yield put({ type:'showLeftRoleListLoading' });
            let { ret } = yield call(CreateRole,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success(ret.errorMessage);
                //关闭新增输入框
                yield put({
                    type:'updateState',
                    payload:{
                        createingRoleVisible : false,
                    }
                });
                //角色列表检索(跳到新增角色的权限)
                yield put({
                    type:'AfterOperationSearchAllRoleList',
                    payload:{
                        roleProperty : ret.data,                                //赋值当前选项的全部属性
                        roleFunctionArray : [],                                 //将新增项转成数组并赋值(新增必然是没有权限)
                        wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                        clickedName : (ret.data).name,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeLeftRoleListLoading' });
        },

        /*权限保存*/
        *'SaveRoleFunction'({ payload }, { call, put, select }){
            yield put({ type:'showLeftRoleListLoading' });

            let roleManage = yield select(state => state.roleManage);

            let {allFunctionList,roleFunctionArray,} = roleManage;
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

            let { ret } = yield call(SaveRoleFunction,parse(payload));
            if(ret && ret.errorCode === 9000){
                message.success(ret.errorMessage);
                yield put({
                    type:'AfterOperationSearchAllRoleList',
                    payload:{
                        roleProperty : ret.data,                                //赋值当前选项的全部属性
                        roleFunctionArray : ((ret.data).resIds).split(","),     //讲选中项转成数组并赋值
                        wetherRoleItemChooseIndex : payload.index,              //光标位置为当前位置
                        clickedName : ret.data.name,
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type:'closeLeftRoleListLoading' });
        }
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //左边角色列表加载中
        showLeftRoleListLoading(state,action) {
            return { ...state, ...action.payload, allRoleListLoading: true };
        },
        //左边角色列表加载消失
        closeLeftRoleListLoading(state,action){
            return { ...state, ...action.payload, allRoleListLoading: false };
        },
        //右边功能列表加载中
        showLeftRoleListLoading(state,action) {
            return { ...state, ...action.payload, allFunctionListLoading: true };
        },
        //右边功能列表加载消失
        closeLeftRoleListLoading(state,action){
            return { ...state, ...action.payload, allFunctionListLoading: false };
        },

        //根据角色编号渲染角色拥有的菜单项
        showRoleFuncs(state,action) {
            let {allFunctionList,allRoleList,} = state;
            let {id,index} = action.payload;

            let roleFunctionArray = [];
            let clickedName = '';
            let roleProperty = {};

            allRoleList && allRoleList.length > 0 && allRoleList.map(function(roleItem) {
                if(roleItem.id == id) {
                    roleFunctionArray = roleItem.resIds;
                    clickedName = roleItem.name;
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

            return { ...state, roleFunctionArray: treeFunctionList, wetherRoleItemChooseIndex: index, clickedName, roleProperty};
        },
    },
};
