import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './StaffManageLeftList.less';
const TreeNode = Tree.TreeNode;

/*员工管理左边组织架构*/
function StaffLeftList({
    allOrganList,                           //左边组织架构数据
    allOrganListLoading,                    //左边组织架构是否加载中
    secondOrganArray,                       //左边组织架构列表默认打开的二级菜单
    initSecondOrganArrayOpenTag,            //默认打开的节点

    OrganListOnExpend,                      //左边组织架构列表节点展开事件
    OrganListClickTreeName,                 //左边组织架构点击名称查询事件
  }) {

    /*右边组织架构列表数据*/
    function loopAllOrganList(data){
        return data.map((item,index) => {
            if (item.children && (item.children).length > 0){
                return (
                    <TreeNode
                        key = { item.key }
                        type = { item.type }
                        title = {
                            <div className = { styles.item }>
                                { item.type == 'org' ? <Icon type = "xiaoquguanli" className = { styles.icon }/> : null }
                                <div style = {{ fontSize : '12px' , color : '#666' }} className = { styles.deptName } style = { item.type == 'org' ? { cursor : 'pointer' } : null }>{ item.label }</div>
                            </div>
                        }>
                        { loopAllOrganList(item.children) }
                    </TreeNode>
                );
            }else{
                return (
                    <TreeNode
                        key = { item.key }
                        type = { item.type }
                        title = {
                            <div className = { styles.item }>
                                { item.type == 'org' ? <Icon type = "xiaoquguanli" className = { styles.icon }/> : null }
                                <div style = {{ fontSize : '12px' , color : '#666' }} className = { styles.deptName } style = { item.type == 'org' ? { cursor : 'pointer' } : null }>{ item.label }</div>
                            </div>
                        }/>
                );
            }
        });
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.block_title }>组织架构</div>
            <div className = 'staff_manage_org_list'>
                <Spin spinning = { allOrganListLoading }>
                    <Tree
                        autoExpandParent = { false }
                        expandedKeys = { secondOrganArray }
                        onExpand = { OrganListOnExpend }
                        onSelect = { OrganListClickTreeName }
                        >
                        <TreeNode title = {
                                        <div style = {{ fontSize : '14px' , lineHeight : '14px' , color : '#666' }}>全校区</div>
                                    }
                                  key = { initSecondOrganArrayOpenTag[0] }>
                            { loopAllOrganList(allOrganList) || [] }
                        </TreeNode>
                    </Tree>
                </Spin>
            </div>
        </div>
    );
}

export default StaffLeftList;
