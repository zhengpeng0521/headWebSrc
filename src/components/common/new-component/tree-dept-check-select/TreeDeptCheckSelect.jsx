/**
 * saas租户
 * 选择机构窗口
 * @author yujq
 * @props:
 *        visible Boolean 机构选择窗口是否显示
 *        onClose Function 关闭窗口触发事件
 *        afterSubmit Function 提交提交后触发事件
 *        disabled Boolean 是否可以编辑修改， 默认false
 *        init_org_select Array 初始选中的机构编号列表
 *        headOrg   boolean 是否显示总部校区  默认不显示
 */

import React from 'react';
import { Modal, Tree, Button, Input, Icon } from 'antd';
import styles from './TreeDeptCheckSelect.less';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const TreeDeptCheckSelect = React.createClass({
    getInitialState() {
        return {
            loading: false,             //是否加载中
            autoExpandParent: false,    //默认展开父节点

            all_org_list : [],          //所有机构列表
            all_org_num : 0,            //部门下所有机构数

            org_select: [],             //选中的机构编号列表
            org_obj_select: [],         //选中的机构对象列表，包含机构编号，机构名称

            tree_expanded: ['all_org'], //展开项目
            tree_checked: [],           //勾选节点(包含非机构节点)
            tree_select: [],            //选中节点(包含非机构节点)

            filter_key: '',             //校区过滤的关键字
        }
    },

    componentDidMount() {
        this.init();
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.visible != nextProps.visible && nextProps.visible) {
            let init_org_select = nextProps.init_org_select;
            if(init_org_select && init_org_select.length > 0) {
                this.setState({
                    org_select: init_org_select,
                    tree_checked: init_org_select,
                });
            }
        }
    },

    init() {
        let self = this;
        serviceRequest(`${BASE_URL}/crm/hq/org/orgDeptTreeQuery`, { condition : 'all' },
            function(ret) {
              self.setState({
                  all_org_list : ret.results || [],
                  all_org_num : ret.orgNum || 0
              });
            },
        );
    },


    //更新在线门店
    refreshCurrentOrg() {

    },

    //展开树节点
    onOrgTreeExpand(expandedKeys) {
        this.setState({
			    tree_expanded : expandedKeys
	    });
    },

    //勾选树节点
    onOrgTreeCheck(checkedKeys, e) {
        let org_select = [];
		if(e && e.checkedNodes && e.checkedNodes.length > 0 ) {
			e.checkedNodes.map(function(item){
				if(item.props.mark == 'dept') {
					org_select.push(item.key);
				}
			});
		}
		this.setState({
			tree_checked : checkedKeys,
			org_select,
	    });
    },

    //选择树节点
    onOrgTreeSelect(selectedKeys) {
        this.setState({
			tree_select : selectedKeys,
	    });
    },

    //提交选择的门店
    submitOrgSelect() {
        this.props.afterSubmit && this.props.afterSubmit(this.state.org_select);
        this.closeModalAction();
    },

    //提交选择的门店窗口
    closeModalAction() {
        this.props.onClose && this.props.onClose();
        this.setState({
            init_org_select: [],
            org_select: [],
            org_obj_select: [],
            tree_expanded: ['all_org'],
            tree_checked: [],
            tree_select: [],
            autoExpandParent: false,
            //filter_key: undefined,
        });
    },

    //过滤校区
    orgSelectChange(e) {
        let value = e.target.value;
        this.setState({
            autoExpandParent: true,
            filter_key: value,
        });
    },

    treeToLevel(data,arr){
        if(data && data.length > 0){
            data.map((item,index) => {
                if(item && item.children && item.children.length > 0){
                    this.treeToLevel(item.children,arr);
                }
                arr.push(item)
            })
        }
        return arr;
    },

    /*递归判断子元素是否包含过滤的key*/
    subNodeFilter(list, filterKey) {
        let me = this;
        let flg = false;
        if(list && list.length > 0) {
            list && list.map(function(item, index) {
              if(item.type === 'dept') {
                if(item.label.includes(filterKey)) {
                  flg = true;
                } else if(item.children && item.children.length > 0) {
                    flg = me.subNodeFilter(item.children, filterKey);
                }
              }else {
                list.splice(item,1)
              }
            });
        }

        return flg;
    },

    render() {
        let me = this;
        let { all_org_list, all_org_num, org_select, autoExpandParent, filter_key } = this.state;

        //渲染树节点
        let leftLoopOrgSelectTreeNode = (data, show) => data.map(function(item) {
            let node_show = item.label.includes(filter_key);

            if (item.children && item.children.length > 0) {
                let sub_node_show = me.subNodeFilter(item.children, filter_key);
                sub_node_show = show || sub_node_show || node_show;
                return (
                    <TreeNode key = { item.key + '' } title = { item.type == 'org' ? <span><Icon type = 'xiaoquguanli' className={styles.icon}/>{ item.label }</span> : <span>{ item.label  + (!!filter_key ? '' : `（${item.orgNum || 0}）`) }</span> } mark = { item.type } className={sub_node_show ? styles.block_tree_node : styles.hidden_tree_node} >
                      { leftLoopOrgSelectTreeNode(item.children) }
                    </TreeNode>
                  );
            } else {
                return <TreeNode key = { item.key + '' } title={ item.type == 'org' ? <span><Icon type = 'xiaoquguanli' className={styles.icon}/>{ item.label }</span> : <span>{ item.label  + (!!filter_key ? '' : `（${item.orgNum || 0}）`) }</span> } mark = { item.type } className={(show || node_show) ? styles.block_tree_node : styles.hidden_tree_node} />;
            }
        });

        let rightLoopOrgSelectTreeNode = (data) => data.map(function(item) {
            return <TreeNode key = { item.key + '' } title={ item.type == 'org' ? <span><Icon type = 'xiaoquguanli' className={styles.icon}/>{ item.label }</span> : item.label } mark = { item.type } className={ item.type == 'org' && org_select.indexOf(item.key) > -1 ? styles.block_tree_node : styles.hidden_tree_node } />;
        });

        //所有待选择机构列表 树节点
        let org_list_tree_nodes = leftLoopOrgSelectTreeNode(all_org_list);

        //已选择的机构列表树节点
        let org_selected_list_tree_nodes = rightLoopOrgSelectTreeNode(this.treeToLevel(all_org_list,[]));
//
//        all_org_list.forEach(function(value, index) {
//            let newItem = {...value};
//            if(newItem.children && newItem.children.length > 0) {
//                let newChildren = newItem.children.filter(function(item) {
//                    return org_select.findIndex(function(orgItem) {
//                        return orgItem == item.key;
//                    }) > -1;
//                });
//                if(newChildren && newChildren.length > 0) {
//                    newItem.children = newChildren;
//                    org_selected_list.push(newItem);
//                }
//            }
//        });

        let footerBtns = this.props.disabled ? [<Button key="cancle" type="primary" onClick={this.closeModalAction}>我知道了</Button>] : [
            <Button key="cancle" type="ghost" onClick={this.closeModalAction} style = {{ marginRight : 10 }}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.submitOrgSelect} disabled={this.state.loading} loading={this.state.loading} style = {{ marginRight : 0 }}>确定</Button>
        ];

        let total = all_org_list && all_org_list.length > 0 ? all_org_list.length : 0;
//        let newnewitem = undefined;
//        all_org_list && all_org_list.map((value, index) => {
//            newnewitem = { ...value };
//            total = total + newnewitem.children.length;
//        });

        return (
            <Modal
                title="选择分部"
                visible={this.props.visible}
                maskClosable={false}
                closable={true}
                width={750}
                onCancel={this.closeModalAction}
                className='tree_org_check_select'
                footer={footerBtns}>
                <div className={styles.tenant_org_select_content}>
                    <div className={styles.org_select_cont}>
                        <Search
                            placeholder="请输入要查询的校区"
                            className={styles.org_select_input}
                            onChange={this.orgSelectChange}
                        />
                    </div>
                    <div className={styles.org_to_select_tree}>
                        <div className={styles.tree_content}>
                            <Tree
                                multiple
                                checkable={!this.props.disabled}
                                onExpand={this.onOrgTreeExpand} expandedKeys={this.state.tree_expanded}
                                onCheck={this.onOrgTreeCheck} checkedKeys={this.state.tree_checked}
                                onSelect={this.onOrgTreeSelect} selectedKeys={this.state.tree_select}
                              >
                                <TreeNode title = {`所有校区（${all_org_num}）`} key="all_org">
                                    { org_list_tree_nodes }
                                </TreeNode>
                            </Tree>
                        </div>
                        {/* <div className={styles.tree_content}>
                            <Tree
                                multiple
                                checkable={false}
                                autoExpandParent={autoExpandParent}
                                onExpand={this.onOrgTreeExpand} expandedKeys={this.state.tree_expanded}
                                onSelect={this.onOrgTreeSelect} selectedKeys={this.state.tree_select}
                              >
                                <TreeNode title = {`已选校区（${!!org_select && org_select.length > 0 ? org_select.length : 0}）`} key="all_org">
                                    { org_selected_list_tree_nodes }
                                </TreeNode>
                            </Tree>
                        </div> */}
                    </div>
                </div>
            </Modal>
        );
    },
});

export default TreeDeptCheckSelect;
