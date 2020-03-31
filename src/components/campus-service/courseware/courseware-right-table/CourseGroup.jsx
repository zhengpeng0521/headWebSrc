import React from 'react';
import { Modal, Icon, Tree, Spin, Button, Input, Popconfirm } from 'antd';
import styles from './CourseGroup.less';

const TreeNode = Tree.TreeNode;

function CourseGroup({
    groupingVisible,            //显示
    groupList,
    groupKey,                   //当前分组
    addStutas,                  //正在新增
    orgList,                    //机构列表
    groupLoading,
    selectedKeys,
    groupName,                  //组名
    editKey,                    //当前编辑index

    cancelGroup,                //关闭
    saveGroup,                  //确定
    groupSelect,                //校区选择
    addGroup,                   //新增分组
    groupNameChange,            //分组名change
    cancelName,                 //取消姓名改变
    saveName,                   //确定分组名
    copyGroup,                  //复制分组
    changeKey,                  //选中分组
    delGroup,                   //删除分组
}){

    return (
        <Modal
            visible = { groupingVisible }
            wrapClassName = {styles.course_grouping}
            title = "课件分组"
            width = '800px'
            onCancel = { cancelGroup }
            maskClosable = { false }
            footer={[
                <Button key="cancel" onClick={cancelGroup}>取消</Button>,
                <Button key="confirm" type="primary" onClick={saveGroup}>确定</Button>
            ]}
        >
            <Spin tip="加载中..." spinning={groupLoading}>
                <div className={styles.group_left}>
                    <h3 className={styles.group_title}>分组名称</h3>
                    <ul className={styles.group_list}>
                        {groupList && groupList.map((item, index) => {
                            let newClass = `${styles.left_item} ${styles.left_item_btn}`
                            if(groupKey == index){
                                newClass = `${styles.left_item} ${styles.left_item_btn} ${styles.left_item_seleted}`
                            }
                            if((!!editKey || editKey === 0) && editKey == index){
                                return (
                                    <li  key={`group_${index}`} className={styles.left_item}>
                                        <Input className={styles.item_input}
                                            placeholder="请输入分组名称"
                                            onChange={groupNameChange}
                                            value={groupName} />
                                        <a className={styles.input_btn} onClick={saveName}>确定</a>
                                        <a className={styles.input_btn} onClick={cancelName}>取消</a>
                                    </li>
                                )
                            }

                            return (
                                <li key={`group_${index}`} className={newClass} onClick={changeKey.bind(this, index)}>
                                    <span className={styles.group_name}>{item.name}</span>
                                    <div>
                                        <a className={styles.item_btn} onClick={addGroup.bind(this, { id: item.groupId, name: item.name, index })}>编辑</a>
                                        <a className={styles.item_btn} onClick={copyGroup.bind(this, item.groupId)}>复制</a>
                                        <Popconfirm title="确定要删除分组吗？" onConfirm={delGroup.bind(this, item.groupId, item.name )}>
                                            <a className={styles.item_btn}>删除</a>
                                        </Popconfirm>
                                    </div>
                                </li>
                            )
                        })}
                        {addStutas ? <li className={styles.left_item}>
                            <Input className={styles.item_input}
                                placeholder="请输入分组名称"
                                onChange={groupNameChange}
                                value={groupName} />
                            <a className={styles.input_btn} onClick={saveName}>确定</a>
                            <a className={styles.input_btn} onClick={cancelName}>取消</a>
                        </li>
                        : (!editKey && editKey != 0) ? <li className={styles.plus_item}>
                            {groupList.length < 1 ? <span className={styles.null_data}>暂无分组，请新增</span> : null}
                            <a onClick={addGroup}><Icon type="plus" style={{ verticalAlign: 'middle' }} /></a>
                        </li> : null}
                    </ul>
                </div>

                <div className={styles.group_right}>
                    <h3 className={styles.group_title}>选择校区</h3>
                    <div className={styles.group_list}>
                        <Tree
                            checkable
                            defaultExpandAll
                            checkedKeys={selectedKeys}
                            onSelect={groupSelect.bind(this, 'select')}
                            onCheck={groupSelect.bind(this, 'check')}
                        >
                            <TreeNode title={`所有校区（${orgList.length}）`} key="all">
                                {orgList && orgList.map((org) => {
                                    return (
                                        <TreeNode title={org.label} key={org.value + ''} />
                                    )
                                })}
                            </TreeNode>
                        </Tree>
                    </div>
                </div>
            </Spin>
        </Modal>
    )
}

export default CourseGroup
