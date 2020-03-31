/*
 * treeSelect城市分类下拉列表查询
 */

import React from 'react';
import { TreeSelect } from 'antd';
import Media from 'react-media';
const TreeNode = TreeSelect.TreeNode;

class TreeSelectDept extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dept : undefined,             //显示值
            loading : false,                    //是否加载中
            listContent : [],
            allow_clear : true,
        }
    }

    componentWillReceiveProps(nextProps) {
        let value = nextProps && nextProps.value ? nextProps.value : undefined;
        this.setState({ dept : value });
    }

    componentDidMount(){
        let me = this;
        serviceRequestDept(`${BASE_URL}/crm/hq/spend/deptOrgQuery`, {},
            function(ret) {
                me.setState({ listContent : ret.deptList || [] })
            }
        );
    }

    onChange(value){
        this.setState({ dept : value });
        this.props.onChange && this.props.onChange(value)
    }

    onSelect(value, node, extra){
        this.setState({ dept : value });
        this.props.onSelect && this.props.onSelect(value,node.props.title)
    }

    formatData(data){
        let dept = this.state.dept;
        return(
            data && data.map((item,index) => {
                if(item.children && item.children.length > 0) {
                    return (
                        <TreeNode key = { item.id + '' } title = { item.name } value = { item.id + '' } disabled = { dept == item.id + '' || this.props.value == item.id + '' }>
                            { this.formatData(item.children) }
                        </TreeNode>
                    );
                }else{
                    return <TreeNode key = { item.id + '' } title = { item.name } value = { item.id + '' } disabled = { dept == item.id + '' || this.props.value == item.id + '' }/>
                }
            })
        )
    }

    render(){
        let { listContent , dept , allow_clear } = this.state;
        let renderListContent = this.formatData(listContent);
        return(
            <Media query="(max-width: 1350px)">
                { matches => matches ?
                    (<TreeSelect
                        showSearch
                        treeDefaultExpandAll
                        style = {{ width: this.props.width || 200 }}
                        dropdownStyle = {{ maxHeight: 400, overflow: 'auto' }}
                        value = { dept || this.props.value || undefined }
                        placeholder = "请选择城市"
                        allowClear = { allow_clear }
                        onChange = {(value) => this.onChange(value)}
                        onSelect = {(value, node, extra) => this.onSelect(value, node, extra)}
                        disabled = { this.props.disabled || false }
                        searchPlaceholder = "查询城市分类"
                        treeNodeFilterProp = 'title'
                        notFoundContent = '没有分类'
                        getPopupContainer = { this.props.getPopupContainer || document.getElementById('body') }
                      >
                          <TreeNode value = "all_dept" title = "所有分类" key = "all_dept" disabled>
                              { renderListContent }
                          </TreeNode>
                    </TreeSelect>)
                    :
                    (<TreeSelect
                        showSearch
                        treeDefaultExpandAll
                        style = {{ width: this.props.width || 200 }}
                        dropdownStyle = {{ maxHeight: 400, overflow: 'auto' }}
                        value = { dept || this.props.value || undefined }
                        placeholder = "请选择城市"
                        allowClear = { allow_clear }
                        onChange = {(value) => this.onChange(value)}
                        onSelect = {(value, node, extra) => this.onSelect(value, node, extra)}
                        disabled = { this.props.disabled || false }
                        searchPlaceholder = "查询城市分类"
                        treeNodeFilterProp = 'title'
                        notFoundContent = '没有分类'
                        getPopupContainer = { this.props.getPopupContainer || document.getElementById('body') }
                      >
                          <TreeNode value = "all_dept" title = "所有分类" key = "all_dept" disabled>
                              { renderListContent }
                          </TreeNode>
                    </TreeSelect>)}
            </Media>
        )
    }
}

export default TreeSelectDept;
