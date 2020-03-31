import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './HeadOrgDetailLeftFramework.less';
const TreeNode = Tree.TreeNode;

/*员工管理左边组织架构*/
function HeadOrgDetailLeftFramework({
    leftFrameworkData,                      //组织架构数据
    leftFrameworkLoading,                   //加载状态
    leftFrameworkOpenTag,                   //打开的节点，默认打开架构二级菜单数组['a','b']
    leftFrameworkInitOpenTag,               //默认打开的节点

    LeftFrameworkOnExpend,                  //树状结构节点展开事件
    LeftFrameworkClickTreeName,             //点击树节点名称事件
  }) {

    /*右边组织架构列表数据*/
    function loopAllOrganList(data){
        return data.map((item,index) => {
            if (item.children && (item.children).length > 0){
                return (
                    <TreeNode
                        key = { item.key + '' }
                        title = {
                            <div className = { styles.item }>
                                { item.type == 'org' ? <Icon type = "xiaoquguanli" className = { styles.icon }/> : null }
                                <div style = {{ fontSize : '12px' , color : '#666' }} className = { styles.deptName }>{item.label}</div>
                            </div>
                        }>
                        { loopAllOrganList(item.children) }
                    </TreeNode>
                )
            }else{
                return (
                    <TreeNode
                        key = { item.key + '' }
                        title = {
                            <div className = { styles.item }>
                                { item.type == 'org' ? <Icon type = "xiaoquguanli" className = { styles.icon }/> : null }
                                <div style = {{ fontSize : '12px' , color : '#666' }} className = { styles.deptName }>{item.label}</div>
                            </div>
                        }/>
                );
            }
        });
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.block_title }>组织架构</div>
            <div className = 'head_org_detail_left_framework'>
                <Spin spinning = { leftFrameworkLoading }>
                    <Tree
                        autoExpandParent = { false }
                        expandedKeys = { leftFrameworkOpenTag }
                        onExpand = { LeftFrameworkOnExpend }
                        onSelect = { LeftFrameworkClickTreeName }
                        >
                        <TreeNode title={
                                        <div style = {{ fontSize : '14px' , lineHeight : '14px' , color : '#666' }}>全校区</div>
                                    }
                                  key = { leftFrameworkInitOpenTag[0] }>
                            { loopAllOrganList(leftFrameworkData) || [] }
                        </TreeNode>
                    </Tree>
                </Spin>
            </div>
        </div>
    );
}

export default HeadOrgDetailLeftFramework;
