import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './CoursewareLeftFramework.less';
const TreeNode = Tree.TreeNode;

/*课件管理左边组织架构*/
function CoursewareLeftFramework({
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
                        key = { item.id + '' }
                        title = {
                            <div className = { styles.deptName }>{ item.name }</div>
                        }>
                        { loopAllOrganList(item.children) }
                    </TreeNode>
                )
            }else{
                return (
                    <TreeNode
                        key = { item.id + '' }
                        title = {
                            <div className = { styles.deptName }>{ item.name }</div>
                        }/>
                );
            }
        });
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.block_title }>课件分类</div>
            <div className = 'courseware_left_framework'>
                <Spin spinning = { leftFrameworkLoading }>
                    <Tree
                        autoExpandParent = { false }
                        expandedKeys = { leftFrameworkOpenTag }
                        onExpand = { LeftFrameworkOnExpend }
                        onSelect = { LeftFrameworkClickTreeName }
                        >
                        <TreeNode title={
                                        <div style = {{ fontSize : '14px' , lineHeight : '14px' , color : '#666' }}>全部课件</div>
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

export default CoursewareLeftFramework;
