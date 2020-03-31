import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Popover, message, Icon } from 'antd';
import { BlockHelp } from '../../../../common/new-component/NewComponent';
import iconData from './icon.json';
import QueueAnim from 'rc-queue-anim';
import styles from './RoleManage.less';
const TreeNode = Tree.TreeNode;

/*角色管理*/
function RoleManageList({
    dp,                             //dispatch方法
    allRoleList,                    //页面左边角色列表内容
    allRoleListLoading ,            //页面左边角色列表是否加载中

    allFunctionList,                //页面右边功能列表内容
    secondFunctionArray,            //页面右边默认打开的二级菜单的菜单列表数组
    roleFunctionArray,              //每个角色所拥有的权限ID数组(选中)
    allFunctionListLoading,         //页面右边功能列表是否加载中
    wetherRoleItemChooseIndex,      //角色被选中查看的索引
    roleClickedName,                //被选中角色名字(用于显示于权限右边)

    roleProperty,                   //角色属性 包括id,name等
    roleListItemIndex,              //角色列表项重命名项索引(遍历时产生,打开重命名输入框)
    createingRoleVisible,           //是否在新建角色名称时(判断是否动态添加一个输入框，false不在新建状态)
    createNameOrRenameContent,      //角色名称新建或重命名已有角色名称时输入框内的值
    saveRoleFuncButtonLoading,          //点击保存权限按钮加载状态
  }) {

    /*右边功能列表节点展开事件*/
    function FunctionListOnExpend(expandedKeys){
        dp('headQuartersSetting/updateState',{ secondFunctionArray : expandedKeys })
    }

    /*右边功能列表节点checkbox选中事件*/
    function FunctionListOnCheck(checkedKeys, e){
        dp('headQuartersSetting/updateState',{ roleFunctionArray : checkedKeys })
    }

    /*点击角色名称所在行查看角色所属权限*/
    function CheckRoleFunction(item,index){
        dp('headQuartersSetting/showRoleFuncs',{ id : item.id , index })
    }

    /*已有角色名称点击重命名和取消重命名*/
    function RenameRoleName(item,index){
        dp('headQuartersSetting/updateState',{
            roleListItemIndex : index || index === 0 ? index : '',
            createNameOrRenameContent : !!item &&　!!item.name ? item.name : ''
        })
    }

    /*已有角色名称重命名提交*/
    function RenameSubmit(item,index){
        let name = createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, "");
        if(name.length > 0 && name.length < 13){
            dp('headQuartersSetting/RenameRole',{ id : item.id , name , resIds : (item.resIds).join(',') , index })
        }else{
            message.warn('请检查角色名是否填写或者过长(不超过12位)');
        }
    }

    /*新增角色或重命名已有角色输入框改变时回调*/
    function CreateOrRenameOnChange(e){
        dp('headQuartersSetting/updateState',{ createNameOrRenameContent : e.target.value })
    }

    /*角色名称下点击复制按钮*/
    function CopyRoleItem(id,name){
        if(name.length > 9){
            message.warn('当前角色名过长超过9位，不允许复制');
        }else{
            dp('headQuartersSetting/CopyRole',{ copyId : id , index : allRoleList.length })
        }
    }

    /*点击角色名称下的删除按钮*/
    function DeleteRoleItem(id){
        dp('headQuartersSetting/DeleteRole',{ id })
    }

    /*角色名称下点击新建按钮或者取消新建角色*/
    function CreateOrCancelRole(boolean){
        dp('headQuartersSetting/updateState',{ createingRoleVisible : boolean })
    }

    /*新建角色名称提交*/
    function CreateRoleSubmit(){
        let name = createNameOrRenameContent.replace(/(^\s*)|(\s*$)/g, "");
        if(name.length > 0 && name.length < 13){
            dp('headQuartersSetting/CreateRole',{ name ,  index : allRoleList.length, })
        }else{
            message.warn('请检查角色名是否为空或者过长');
        }
    }

    /*权限保存*/
    function SaveRoleFunction(){
        if(!createingRoleVisible){
            dp('headQuartersSetting/SaveRoleFunction',{
                name : roleProperty.name,
                id : roleProperty.id,
                index : wetherRoleItemChooseIndex,
            })
        }else{
            message.warn('请角色操作完毕后再修改权限');
        }
    }

    /*左边角色列表数据*/
    let childrenRoleList = [];
    if(allRoleList && allRoleList.length > 0){
        childrenRoleList = allRoleList.map((item,index) => {
            //判断是否管理员(if中是是管理员的条件)
            if('hqAdmin' == item.roleKey || 'hqUser' == item.roleKey){
                //判断是否被选中查看
                return(
                    <div key = { item.id + '' } className = { wetherRoleItemChooseIndex == index ? styles.roleNameCheck : styles.roleNameUnCheck } onClick={() => CheckRoleFunction(item,index)}>
                        <div className = { styles.item_name }>{ 'hqAdmin' == item.roleKey ? item.name + '(系统管理员)' : item.name }</div>
                        <div className = { styles.item_operation }>
                            <Icon type = 'copy' onClick={() => CopyRoleItem(item.id,item.name)}/>
                        </div>
                    </div>
                );
            }else{
                //判断是否被点击重命名(if中是未被查看的条件)
                if(roleListItemIndex === '' || roleListItemIndex !== index){
                    //判断是否被选中查看
                    return(
                        <div key = { item.id + '' } className = { wetherRoleItemChooseIndex == index ? styles.roleNameCheck : styles.roleNameUnCheck } onClick={() => CheckRoleFunction(item,index)}>
                            <div className = { styles.item_name }>{item.name}</div>
                            <div className = { styles.item_operation }>
                                <Icon type = 'edit' onClick = {() => RenameRoleName(item,index)}/>
                                <Icon type = 'copy' onClick={() => CopyRoleItem(item.id,item.name)}/>
                                <Popconfirm placement="top" title={<span>删除将导致该角色不可用，确定要删除<strong style={{color:'red'}}>{ item.name }</strong>吗？</span>} onConfirm={() => DeleteRoleItem(item.id)} okText="是" cancelText="否">
                                    <Icon type = 'delete' />
                                </Popconfirm>
                            </div>
                        </div>
                    );
                }else{
                    return(
                        <div key={item.id}>
                            <QueueAnim
                                type={['left', 'left']}
                                ease={['easeOutQuart', 'easeInOutQuart']}
                                className="common-search-queue" >
                                <div className = { styles.operation_item } key='role_rename'>
                                    <Input autoFocus placeholder = { item.name } defaultValue = { item.name } size = 'default' style = {{ width : 200 }} onChange={CreateOrRenameOnChange} onPressEnter = {() => RenameSubmit(item,index)}/>
                                    <div className = { styles.rename_operation } >
                                        <a onClick={() => RenameSubmit(item,index)}>确定</a>
                                        <a onClick={() => RenameRoleName()}>取消</a>
                                    </div>
                                </div>
                            </QueueAnim>
                        </div>
                    )
                }
            }
        });
    }

    /*右边权限列表数据*/
    const loopAllFunctionList = data => data.map((item) => {
        if(item.list) {
            if(!!item.mainTitle){
                return <TreeNode title={<span style = {{ fontSize : '14px' , color : '#666' }}>{item.name}</span>} key={item.id}>{loopAllFunctionList(item.list)}</TreeNode>;
            }else{
                return <TreeNode title={<span style = {{ fontSize : '12px' , color : '#999' }}>{item.name}</span>} key={item.id}>{loopAllFunctionList(item.list)}</TreeNode>;
            }
        }else{
            return <TreeNode title={<span style = {{ fontSize : '12px' , color : '#999' }}>{item.name}</span>} key={item.id}/>
        }
    });

    return(
        <div className={styles.all}>
            <div className={styles.left_area}>
                <div className={styles.block_title}>
                    <div style = {{ marginRight : 10 }}>角色名称</div>
                    <BlockHelp>
                        <div className = { styles.icon_help } >
                            { iconData && iconData.map((item,index) =>
                                <div className = { styles.icon_help_item } key = { index }>
                                    <Icon type = { item.type }/>
                                    <span>{ item.explain }</span>
                                </div>
                            ) }
                        </div>
                    </BlockHelp>
                </div>
                <div className={styles.left_content}>
                    { childrenRoleList || [] }
                    <QueueAnim
                        type={['top', 'top']}
                        ease={['easeOutQuart', 'easeInOutQuart']}
                        className="common-search-queue" >
                        {createingRoleVisible ?
                            <div className = { styles.operation_item } key='create_new_role'>
                                <Input autoFocus size='default' style = {{ width : 200 }} onChange={CreateOrRenameOnChange} placeholder='新增角色名称(限12字)' onPressEnter = {() => CreateRoleSubmit()}/>
                                <div className = { styles.rename_operation } >
                                    <a onClick={() => CreateRoleSubmit()}>确定</a>
                                    <a onClick={() => CreateOrCancelRole(false)}>取消</a>
                                </div>
                            </div>
                            :
                            <div className = { styles.add_button } onClick={() => CreateOrCancelRole(true)}>
                                <Icon type = 'plus' onClick={() => CreateOrCancelRole(true)}/>
                            </div>
                        }
                    </QueueAnim>
                </div>
            </div>
            <div className={styles.right_area}>
                <div className={styles.block_title}>
                    <div style = {{ marginRight : 10 }}>权限范围</div>
                    { !!roleClickedName ? <div className = { styles.role_name }>（{ roleClickedName }）</div> : null }
                </div>
                <div className = { styles.right_content + ' ' + 'role_manage_function_tree'}>
                    <Tree
                        checkable
                        checkedKeys={roleFunctionArray}
                        expandedKeys={secondFunctionArray}
                        onExpand={FunctionListOnExpend}
                        onCheck={FunctionListOnCheck}
                    >
                        { loopAllFunctionList(allFunctionList) || [] }
                    </Tree>
                </div>
                <Button type='primary' onClick = { SaveRoleFunction } loading = { saveRoleFuncButtonLoading } disabled = { saveRoleFuncButtonLoading }>保存权限</Button>
            </div>
        </div>
    );
}

export default RoleManageList;
