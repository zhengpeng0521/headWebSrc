/**
 * saas租户
 * 机构过滤的下拉框
 * @author yujq
 * @props:
 *        onChange Function(id) 改变机构触发事件(用于获取id)
 *        onSelect Function(value,label) 改变机构触发事件(用于获取id和名称)
 *        defaultValue string 默认选择的机构编号
 *        value  当前的值
 *        width string 宽度 默认300px
 *        disabled 默认 false
 *        headOrg   boolean 是否显示总部校区  默认不显示
 *        itemDisabledFunc   func 机构项目是否可以选择
 *        getPopupContainer : () => document.getElementById( 'super_search_box' )   //高级搜索防止选择是关闭
 */

import React from 'react';
import { TreeSelect } from 'antd';
import styles from './TenantOrgFilter.less';
const TreeNode = TreeSelect.TreeNode;

const TenantOrgFilter = React.createClass({
    getInitialState() {
        return {
            loading: false,             //是否加载中
            selectOrg: this.props.defaultValue || undefined ,
            selectOrgDetail : '',
            all_org_list: [],
            allow_clear : this.props.allow_clear || false,
        }
    },

    componentDidMount() {
        this.init();
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

    init() {
        let me = this;

        //获取缓存的校区列表
        let orgPermissionList = window._init_data.orgPermissionList;
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

     componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
          let value = nextProps.value;
          this.setState({
            selectOrg: value,
          });
        }
    },

    onOrgChange(value) {
        this.setState({
            selectOrg: value,
        });
        this.props.onChange && this.props.onChange(value);
    },

    onOrgSelect(value, node, extra){
        this.setState({
            selectOrgDetail: value,
        });
        this.props.onSelect && this.props.onSelect(value,node.props.title);
    },

    render () {
        let { itemDisabledFunc, getPopupContainer } = this.props;
        //渲染树节点

        //undefined判断
        let newValue = this.props.value == (undefined || 'undefined') ? '' : this.props.value;
        
        let selectOrgNewValue = this.state.selectOrg == (undefined || 'undefined') ? '' : this.state.selectOrg;
        

		if(!(newValue&&String(newValue).length)){
            newValue = undefined;
			selectOrgNewValue = undefined;
		}

        let loopOrgSelectTreeNode = data => data.map(function(item) {

            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode key={item.key} title={item.label} value={item.key}  disabled={item.mark == 'city'}  >
                      {loopOrgSelectTreeNode(item.children)}
                    </TreeNode>
                  );
            } else {
                return <TreeNode key={item.key}
                                 title={item.label}
                                 value={item.key}
                                 disabled={itemDisabledFunc ? itemDisabledFunc(item.key) :
                                newValue == item.key || selectOrgNewValue == item.key ? true
                                : false} />;
            }
        });

        //所有待选择机构列表 树节点
        let org_list_tree_nodes = loopOrgSelectTreeNode(this.state.all_org_list);
                    
        return (
            <div className={styles.tenant_org_filter_content}>
                <TreeSelect
                    showSearch
                    style={{ width: this.props.width || 300 }}
                    value={newValue || selectOrgNewValue}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择校区"
                    allowClear={this.state.allow_clear}
                    treeDefaultExpandAll
                    onChange={this.onOrgChange}
                    disabled={this.props.disabled || false}
                    onSelect={this.onOrgSelect}
                    searchPlaceholder="输入校区名称进行检索"
                    treeNodeFilterProp='title'
                    notFoundContent='没有校区'
					getPopupContainer = { getPopupContainer || document.getElementById('body') }
                  >
                      <TreeNode value="" title="所有校区" key="all_arg" disabled >
                          {org_list_tree_nodes}
                      </TreeNode>
                </TreeSelect>
            </div>
        );
    }

});

export default TenantOrgFilter;
