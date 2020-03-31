import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Popover } from 'antd';
import { BlockTitle } from '../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import styles from './RoleManage.less';
const TreeNode = Tree.TreeNode;

/*角色管理*/
function RoleManageList({
    allRoleList,                        //页面左边所有角色列表内容
    allRoleListLoading,                 //页面左边所有角色列表内容是否加载中
    allFunctionList ,                   //页面右边功能列表内容
    secondFunctionArray ,               //页面右边默认打开的二级菜单的菜单列表数组
    roleFunctionArray,                  //每个角色所拥有的权限ID数组
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
  }) {

    /*左边角色列表数据*/
    let childrenRoleList = [];
    if(allRoleList && allRoleList.length > 0){
        childrenRoleList = allRoleList.map((item,index) => {
            //判断是否管理员(if中是是管理员的条件)
            if('admin' == item.roleKey){
                //判断是否被选中查看
                return(
                    <div key={item.id} className={wetherRoleItemChooseIndex == index ? styles.roleNameCheck : styles.roleNameUnCheck} onClick={() => CheckRoleFunction(item,index)}>
                        <span style={{marginLeft:'5px'}}>{item.name}(系统管理员)</span>
                        <a onClick={() => CopyRoleItem(item.id,item.name)} style={{float:'right',fontSize:'1.16rem',marginRight:'5px'}}>复制</a>
                    </div>
                );
            }else if('kbAdmin' == item.roleKey){
                //判断是否被选中查看
                return(
                    <div key={item.id} className={wetherRoleItemChooseIndex == index ? styles.roleNameCheck : styles.roleNameUnCheck} onClick={() => CheckRoleFunction(item,index)}>
                        <span style={{marginLeft:'5px'}}>{item.name}(口碑管理员)</span>
                        <a onClick={() => CopyRoleItem(item.id,item.name)} style={{float:'right',fontSize:'1.16rem',marginRight:'5px'}}>复制</a>
                    </div>
                );
            }else{
                //判断是否被点击重命名(if中是未被查看的条件)
                if(roleListItemIndex == '' || roleListItemIndex != index){
                    //判断是否被选中查看
                    return(
                        <div key={item.id} className={wetherRoleItemChooseIndex == index ? styles.roleNameCheck : styles.roleNameUnCheck} onClick={() => CheckRoleFunction(item,index)}>
                            <span style={{marginLeft:'5px'}}>{item.name}</span>
                            <Popconfirm placement="top" title={<span>删除将导致该角色不可用，确定要删除<strong style={{color:'red'}}>{item.name}</strong>吗？</span>} onConfirm={() => DeleteRoleItem(item.id)} okText="是" cancelText="否">
                                <a style={{float:'right',marginLeft:'20px',color:'#4e9ff8',fontSize:'1.16rem',marginRight:'5px'}}>删除</a>
                            </Popconfirm>
                            <a onClick={() => CopyRoleItem(item.id,item.name)} style={{float:'right',marginLeft:'20px',fontSize:'1.16rem'}}>复制</a>
                            <a onClick={() => RenameRoleName(item,index)} style={{float:'right',marginLeft:'20px',fontSize:'1.16rem'}}>重命名</a>
                        </div>
                    );
                }else{
                    return(
                        <div key={item.id}>
                            <QueueAnim
                                type={['left', 'left']}
                                ease={['easeOutQuart', 'easeInOutQuart']}
                                className="common-search-queue" >
                                <div style={{height:'50px',lineHeight:'50px',borderBottom:'1px solid #f8f8f8'}} key='role_rename'>
                                    <Input type='text' placeholder={item.name} defaultValue={item.name} size='large' style={{width:'200px',top:'-1px',fontSize:'1.33rem'}} onChange={CreateOrRenameOnChange}/>
                                    <a onClick={() => CancelRename()} style={{float:'right',marginLeft:'20px',fontSize:'1.16rem',marginRight:'5px'}}>取消</a>
                                    <a onClick={() => RenameSubmit(item,index)} style={{float:'right',marginLeft:'20px',fontSize:'1.16rem'}}>确定</a>
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
        if (item.list) {
            if(item.mainTitle == true){
                return <TreeNode title={<span style={{fontSize:'1.33rem',color:'#666',lineHeight:'20px'}}>{item.name}</span>} key={item.id} >{loopAllFunctionList(item.list)}</TreeNode>;
            }else{
                return <TreeNode title={<span style={{fontSize:'1.16rem',color:'#999',lineHeight:'18px'}}>{item.name}</span>} key={item.id} >{loopAllFunctionList(item.list)}</TreeNode>;
            }
        }else{
            return <TreeNode title={<span style={{fontSize:'1.16rem',color:'#999'}}>{item.name}</span>} key={item.id} />
        }
    });

    return(
        <div className={styles.all}>
            <div className={styles.left_area}>
                <div className={styles.block_title}>角色名称</div>
                <div className={styles.content}>
                    <Spin title='Loading' spinning={ allRoleListLoading }>
                        { childrenRoleList || [] }
                        <QueueAnim
                            type={['top', 'top']}
                            ease={['easeOutQuart', 'easeInOutQuart']}
                            className="common-search-queue" >
                            {createingRoleVisible ? [
                                <div className = {styles.createNewRole} key='create_new_role'>
                                    <Input type='text' size='large' style={{width:'200px',fontSize:'1.33rem'}} onChange={CreateOrRenameOnChange} placeholder='请输入新增角色名称' autoFocus/>
                                    <div style = {{ fontSize : '1.16rem' }}>
                                        <a onClick={() => CreateSubmit()}>确定</a>
                                        <a onClick={() => CancelCreate()} style={{margin:'0 5px 0 20px'}}>取消</a>
                                    </div>
                                </div>
                            ]:null}
                        </QueueAnim>
                    </Spin>
                </div>
                <Button type='primary' onClick={CreateRole} disabled={ !!createingRoleVisible ? true : false } style = {{ float:'right' }}>新增</Button>
            </div>
            <div className={styles.right_area}>
                <div className={styles.block_title}>权限范围
                    { clickedName != ''?
                        <span className={styles.showRoleFunction}>(<span style={{ margin:'0 4px' }}>{clickedName}</span>)</span>
                        :
                        ''
                    }
                </div>
                <div className={styles.content}>
                    <Spin title='Loading' spinning={allFunctionListLoading}>
                        <Tree
                            checkable
                            checkedKeys={roleFunctionArray}
                            expandedKeys={secondFunctionArray}
                            onExpand={FunctionListOnExpend}
                            onCheck={FunctionListOnCheck}
                        >
                            { loopAllFunctionList(allFunctionList) || [] }
                        </Tree>
                    </Spin>
                </div>
                <Button type='primary' onClick={SaveRoleFunction} style={{float:'right'}}>保存</Button>
            </div>
        </div>
    );
}

export default RoleManageList;
