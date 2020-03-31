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
 *        checkStrictly boolean checkable状态下节点选择完全受控（父子节点选中状态不再关联）
 *        no_select_campus 展示未选中的机构
 *        source : 来源（微活动和为游戏来源值不为undefined）
 */

import React from 'react';
import { Modal, Tree, Button, Input } from 'antd';
import styles from './TenantOrgSelect.less';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const TenantOrgSelect = React.createClass({
    getInitialState() {
        return {
            loading          : false,           //是否加载中
            autoExpandParent : false,           //默认展开父节点
            all_org_list     : [],              //所有机构列表
            org_select       : [],              //选中的机构编号列表
            no_select_campus : false,           //展示未选中的机构
            org_obj_select   : [],              //选中的机构对象列表，包含机构编号，机构名称
            tree_expanded    : ['all_org'],     //展开项目
            tree_checked     : [],              //勾选节点(包含非机构节点)
            tree_select      : [],              //选中节点(包含非机构节点)
            filter_key       : '',              //校区过滤的关键字
            source           : undefined,       //来源
        }
    },

    componentDidMount() {
        this.init();
    },

    componentWillReceiveProps(nextProps) {

        let orgPermissionList = window._init_data.orgPermissionList;
        if(this.props.visible != nextProps.visible && nextProps.visible) {
            let init_org_select = nextProps.init_org_select;
            let no_select_campus = nextProps.no_select_campus;
            let org_select = nextProps.org_select;
            let useThisDataSource = nextProps.useThisDataSource;
            let source = nextProps.source;
            this.setState({
                source: source,
                no_select_campus: no_select_campus,
                all_org_list: useThisDataSource || orgPermissionList,
            });
            
            if(init_org_select && init_org_select.length > 0) {
                this.setState({
                    org_select: init_org_select,
                    tree_checked: init_org_select,
                });
            }
        }
    },

    init() {
        let me = this;
        //获取缓存的校区列表
        let orgPermissionList =  window._init_data.orgPermissionList;

        if(orgPermissionList && orgPermissionList.length > 0) {
            if(!this.props.headOrg) {
                let org_list = this.filterMainOrg(orgPermissionList);
                me.setState({
                    all_org_list: org_list,
                });
            } else {
                me.setState({
                    all_org_list: orgPermissionList,
                });
            }
        } else {
            serviceRequest(`${BASE_URL}/tenantOrgController/userPermOrgs`, {},
                function(ret) {
                    let all_org_list = ret.results;
                    //更新缓存机构
                    window._init_data.orgPermissionList = all_org_list;

                    if(!me.props.headOrg) {
                        me.setState({
                            all_org_list: me.filterMainOrg(all_org_list),
                        });
                    } else {
                        me.setState({
                            all_org_list,
                        });
                    }
                }
            );
        }
    },

    //过滤总部机构
    filterMainOrg(all_org_list) {

        let new_org_list = [];
        if(all_org_list && all_org_list.length > 0) {
            for(let i = 0; i < all_org_list.length; i++) {
                let city_item = {};
                Object.assign(city_item, all_org_list[i]);
                let city_org_list = city_item.children;
                let new_city_org_list = [];
                if(city_org_list && city_org_list.length > 0) {
                    for(let j = 0; j < city_org_list.length; j++) {
                        let org_item = city_org_list[j];
                        if(org_item.pid != '0') {
                            new_city_org_list.push(org_item);
                        }
                    }
                }

                if(new_city_org_list.length > 0) {
                    city_item.children = new_city_org_list;
                    new_org_list.push(city_item);
                }
            }
        }

        return new_org_list;
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
				if(item.props.mark == 'shop') {
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
			tree_select: selectedKeys,
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
            filter_key: '',
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

    render() {
        
        let { all_org_list, org_select, autoExpandParent, filter_key, no_select_campus, source} = this.state;

        let isCheckStrictly = this.props.checkStrictly || false;

        //渲染树节点
        let loopOrgSelectTreeNode = (data, show) => data&&data.map(function(item) {
            let node_show = item.label.includes(filter_key);
            if (item.children && item.children.length > 0) {
                let sub_node_show = false;
                for(let i = 0; i < item.children.length; i++) {
                    if(item.children[i].label.includes(filter_key)) {
                        sub_node_show = true;
                    }
                }
                sub_node_show = show || sub_node_show || node_show;
                return (
                    <TreeNode key={item.key} title={item.label +'    '+'（' + item.children.length +'）' } mark={item.mark} className={sub_node_show ? styles.block_tree_node : styles.hidden_tree_node} >
                      {loopOrgSelectTreeNode(item.children)}
                    </TreeNode>
                  );
            } else {

                return <TreeNode key={item.key}
                    disabled={isCheckStrictly ? (item.disabled == undefined ? true : item.disabled) : isCheckStrictly}
                    disableCheckbox={isCheckStrictly ? (item.disabled == undefined ? true : item.disabled) : isCheckStrictly}                    
                    title={`${item.label}${(source !== undefined && item.disabled == undefined) ? '(未开通)' : ''}`}
                    mark={item.mark}
                    className={(show || node_show) ? styles.block_tree_node : styles.hidden_tree_node}
                />;
            }
        });

        //所有待选择机构列表 树节点
        let org_list_tree_nodes = loopOrgSelectTreeNode(all_org_list);

        //已选择的机构列表树节点
        let org_selected_list = [];

        all_org_list && all_org_list.forEach(function(value, index) {
            let newItem = {...value};
            if(newItem.children && newItem.children.length > 0) {
                let newChildren = newItem.children.filter(function(item) {
                    return org_select.findIndex(function(orgItem) {
                        if (orgItem == item.key) {
                            return orgItem == item.key;
                        }
                    }) > -1;
                });

                if(newChildren && newChildren.length > 0) {
                    newItem.children = newChildren;
                    org_selected_list.push(newItem);
                }
            }
        });

        let org_selected_list_tree_nodes = loopOrgSelectTreeNode(org_selected_list, true);

        let footerBtns = [
            <Button key="cancle" type="ghost" size="large" onClick={this.closeModalAction}> 取 消 </Button>,
            <Button key="submit" type="primary" size="large" onClick={this.submitOrgSelect} disabled={this.state.loading} loading={this.state.loading}>保存</Button>
        ];

        let total = 0;

        all_org_list && all_org_list.forEach(function(value, index) {
            let newnewitem = {...value};
            total =total + newnewitem.children.length;
        });

        return (

            <Modal
                title={org_select.length > 0 ? `校区选择（已选择${org_select.length}个校区）`: '校区选择'}
				visible={this.props.visible}
        		maskClosable={false}
				closable={true}
                width={515}
				onCancel={this.closeModalAction}
				className="tenant_org_select_modal"
				footer={footerBtns}>

               <div className={styles.tenant_org_select_content}>
                  <div className={styles.org_select_cont}>
                      <Search
                        placeholder="请输入要查询的校区"
                        className={styles.org_select_input}
                        onChange={this.orgSelectChange}
                      />
                  </div>

                {
                    no_select_campus ?
                    <div className={styles.org_selected_tree}>
                       <div className={styles.tree_content}>
                           <Tree
                                multiple
                                checkable={false}
                                defaultExpandAll={true}
						        autoExpandParent={autoExpandParent}
                                onExpand={this.onOrgTreeExpand} 
                                // expandedKeys={this.state.tree_expanded}
                                onSelect={this.onOrgTreeSelect} 
                                selectedKeys={this.state.tree_select}
						      >
								<TreeNode title={"已选校区" +'    ' +(org_select.length>0 ?'（'+ org_select.length +'）':"") }key="all_org">
					        		{org_selected_list_tree_nodes}
				        		</TreeNode>
				        	</Tree>
                       </div>
                    </div>
                    :
                   <div className={styles.org_to_select_tree}>
                       <div className={styles.tree_content}>
                           <Tree
                                multiple
                                defaultExpandAll={this.props.checkStrictly || false}
                                checkStrictly={this.props.checkStrictly || false}
                                defaultExpandAll={true}
						        checkable={!this.props.disabled}
                                onExpand={this.onOrgTreeExpand}
                                // expandedKeys={this.state.tree_expanded}
                                onCheck={this.onOrgTreeCheck}
                                checkedKeys={this.state.tree_checked}
                                onSelect={this.onOrgTreeSelect}
                                selectedKeys={this.state.tree_select}
						      >
								<TreeNode title={"所有校区" +'    '+'（'+total +'）'} key="all_org">
					        		{org_list_tree_nodes}
				        		</TreeNode>
				        	</Tree>
                       </div>
                   </div>
                }
               </div>
            </Modal>
        );
    },

});

export default TenantOrgSelect;
