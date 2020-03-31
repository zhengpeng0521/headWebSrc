import React from 'react';
import { message } from 'antd';

import RoleManageList from '../../../components/system/role-manage/RoleManageList';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';

function RoleManage({ dispatch, roleManage }) {

    let {
        allRoleList,                    //页面左边角色列表内容
        allRoleListLoading,             //页面左边角色列表是否加载中

        allFunctionList,                //页面右边功能列表内容
        secondFunctionArray,            //页面右边默认打开的二级菜单的菜单列表数组
        roleFunctionArray,              //每个角色所拥有的权限ID数组(选中)
        allFunctionListLoading,         //页面右边功能列表是否加载中
        wetherRoleItemChooseIndex,      //角色被选中查看的索引
        clickedName,                    //被选中角色名字(用于显示于权限右边)

        roleProperty,                   //角色属性 包括id,name等
        roleListItemIndex,              //角色列表项重命名项索引(遍历时产生,打开重命名输入框)
        createingRoleVisible,           //是否在新建角色名称时(判断是否动态添加一个输入框，false不在新建状态)
        createNameOrRenameContent,      //角色名称新建或重命名已有角色名称时输入框内的值
	} = roleManage;

    /*右边功能列表节点展开事件*/
    let FunctionListOnExpend = function(expandedKeys){
        //console.info('expandedKeys',expandedKeys);
        dispatch({
            type:'roleManage/updateState',
            payload:{
                secondFunctionArray : expandedKeys,
            }
        });
    }

    /*右边功能列表节点checkbox选中事件*/
    let FunctionListOnCheck = function(checkedKeys, e){
        //console.info('checkedKeys',checkedKeys);
        //console.info('eeeeeeee',e);
        dispatch({
            type:'roleManage/updateState',
            payload:{
                roleFunctionArray : checkedKeys,
            }
        });
    }
    /*点击角色名称所在行查看角色所属权限*/
    let CheckRoleFunction = function(item,index){
        dispatch({
            type:'roleManage/showRoleFuncs',
            payload:{
                id : item.id,
                index,
            }
        })
    }

    /*角色名称下点击新建按钮*/
    let CreateRole = function(){
        dispatch({
            type:'roleManage/updateState',
            payload:{
                createingRoleVisible : true,
            }
        });
    }

    /*角色名称下点击复制按钮*/
    let CopyRoleItem = function(id,name){
        if(name.length > 9){
            message.warn('当前角色名过长，不允许复制');
        }else{
            dispatch({
                type:'roleManage/CopyRole',
                payload:{
                    copyId : id,
                    index : allRoleList.length,
                }
            });
        }
    }

    /*点击角色名称下的删除按钮*/
    let DeleteRoleItem = function(id){
        dispatch({
            type:'roleManage/DeleteRole',
            payload:{
                id,
            }
        });
    }

    /*取消新建角色名称*/
    let CancelCreate = function(){
        dispatch({
            type:'roleManage/updateState',
            payload:{
                createingRoleVisible : false,
            }
        });
    }

    /*新建角色名称提交*/
    let CreateSubmit = function(){
        if((createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, "")).length > 0 && (createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, "")).length < 13){
            dispatch({
                type:'roleManage/CreateRole',
                payload:{
                    name : createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, ""),
                    index : allRoleList.length,
                }
            });
        }else{
            message.warn('请检查角色名是否为空或者过长(不超过12位)');
        }
    }

    /*新增角色或重命名已有角色输入框改变时回调*/
    let CreateOrRenameOnChange = function(e){
        dispatch({
            type:'roleManage/updateState',
            payload:{
                createNameOrRenameContent : e.target.value,
            }
        });
    }

    /*已有角色名称点击重命名*/
    let RenameRoleName = function(item,index){
        dispatch({
            type:'roleManage/updateState',
            payload:{
                roleListItemIndex : index,
                createNameOrRenameContent : item.name,
            }
        });
    }

    /*已有角色名称取消重命名*/
    let CancelRename = function(){
        dispatch({
            type:'roleManage/updateState',
            payload:{
                roleListItemIndex : '',
                createNameOrRenameContent : '',
            }
        });
    }

    /*已有角色名称重命名提交*/
    let RenameSubmit = function(item,index){
        if((createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, "")).length > 0 && (createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, "")).length < 16){
            dispatch({
                type:'roleManage/RenameRole',
                payload:{
                    id : item.id,
                    name : createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, ""),
                    resIds : (item.resIds).join(','),
                    index,
                }
            })
        }else{
            message.warn('请检查角色名是否填写或者过长(不超过15位)');
        }
    }

    /*权限保存*/
    let SaveRoleFunction = function(){
        if( createingRoleVisible == false ){
            dispatch({
                type:'roleManage/SaveRoleFunction',
                payload:{
                    name : roleProperty.name,
                    id : roleProperty.id,
                    index : wetherRoleItemChooseIndex,
                }
            });
        }else{
            message.warn('请角色操作完毕后再修改权限');
        }

    }

    let roleManageListProps = {
        allRoleList,                        //页面左边角色列表内容
        allRoleListLoading,                //页面左边角色列表是否加载中
        allFunctionList,                    //页面右边功能列表内容
        secondFunctionArray,                //页面右边默认打开的二级菜单的菜单列表数组
        roleFunctionArray,                  //每个角色所拥有的权限ID数组(选中)
        allFunctionListLoading,             //页面右边功能列表是否加载中
        wetherRoleItemChooseIndex,          //角色被选中查看的索引
        clickedName,                        //被选中角色名字(用于显示于权限右边)

        FunctionListOnExpend,               //右边功能列表节点展开事件
        FunctionListOnCheck,                //右边功能列表节点选中checkbox事件

        CheckRoleFunction,                  //点击角色名称所在行查看角色所属权限
        RenameRoleName,                     //已有角色名称点击重命名
        roleListItemIndex,                  //角色列表项重命名项索引(遍历时产生,打开重命名输入框)
        CancelRename,                       //取消重命名角色名称
        RenameSubmit,                       //重命名角色名称提交

        CreateOrRenameOnChange,             //新增角色或者重命名已有角色输入框改变时回调

        createingRoleVisible,               //是否在新建角色名称时(判断是否动态添加一个输入框)
        CreateRole,                         //点击角色名称下的新增按钮
        CopyRoleItem,                       //点击角色名称下的复制按钮
        DeleteRoleItem,                     //点击角色名称下的删除按钮
        CancelCreate,                       //取消新建角色名称
        CreateSubmit,                       //新建角色名称提交
        SaveRoleFunction,                   //权限保存
    }

    return(
         <RoleManageList {...roleManageListProps}/>
    );
}

function mapStateToProps({ roleManage }) {
  return { roleManage };
}

export default connect(mapStateToProps)(RoleManage);
