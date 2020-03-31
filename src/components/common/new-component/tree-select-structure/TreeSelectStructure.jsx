/* treeSelect课件分类下拉列表查询
 * @author 赵健
 */

import React from 'react';
import { TreeSelect } from 'antd';
import Media from 'react-media';
import styles from './TreeSelectStructure.less';
const TreeNode = TreeSelect.TreeNode;

class TreeSelectStructure extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            structure : '',             //显示值
            loading : false,                    //是否加载中
            listContent : [],
            allow_clear : false,
        }
    }

    componentWillReceiveProps(nextProps) {
        let me = this;
        let value = nextProps && nextProps.value ? nextProps.value : '';
        this.setState({ structure : value });

        if(this.props.addOrEditStaFFModalOrgId != nextProps.addOrEditStaFFModalOrgId) {
            let addOrEditStaFFModalOrgId = nextProps && nextProps.addOrEditStaFFModalOrgId ? nextProps.addOrEditStaFFModalOrgId : '';
            if(me.props.isHq == 0){
                if(!!addOrEditStaFFModalOrgId){
                    serviceRequest1(`${BASE_URL}/crm/hq/org/orgDepartQuery`, {orgId : addOrEditStaFFModalOrgId},
                        function(ret) {
                            me.setState({ listContent : ret.results })
                        }
                    );
                }
            }else{
                if(!!addOrEditStaFFModalOrgId){
                    serviceRequest1(`${BASE_URL}/crm/hq/dept/departTreeQuery`, {orgId : addOrEditStaFFModalOrgId},
                        function(ret) {
                            me.setState({ listContent : ret.results })
                        }
                    );
                }
            }
        }

    }

    componentDidMount(){
        let me = this;
        if(me.props.isHq == 0){
            if(me.props.addOrEditStaFFModalOrgId != '0' && me.props.addOrEditStaFFModalOrgId != null && me.props.addOrEditStaFFModalOrgId != undefined ){
                serviceRequest1(`${BASE_URL}/crm/hq/org/orgDepartQuery`, {orgId : me.props.addOrEditStaFFModalOrgId},
                    function(ret) {
                        me.setState({ listContent : ret.results })
                    }
                );
            }
        }else{
            serviceRequest(`${BASE_URL}/crm/hq/dept/departTreeQuery`, {},
                function(ret) {
                    me.setState({ listContent : ret.results })
                }
            );
        }
    }

    onChange(value){
        this.setState({ structure : value });
        this.props.onChange && this.props.onChange(value)
    }

    onSelect(value, node, extra){
        this.setState({ structure : value });
        this.props.onSelect && this.props.onSelect(value,node.props.title)
    }

    formatData(data){
        let structure = this.state.structure;
        return(
            data && data.map((item,index) => {
                if(item.children && item.children.length > 0) {
                    return (
                        <TreeNode key = { item.id } title = { item.name } value = { item.id } disabled = { structure == item.id || this.props.value == item.id }>
                            { this.formatData(item.children) }
                        </TreeNode>
                    );
                }else{
                    return <TreeNode key = { item.id } title = { item.name } value = { item.id } disabled = { structure == item.id || this.props.value == item.id }/>;
                }
            })
        )
    }

    render(){
        let { listContent , structure , allow_clear } = this.state;
        let renderListContent = this.formatData(listContent);
        return(
            <Media query="(max-width: 1350px)">
                { matches => matches ?
                    (<TreeSelect
                        showSearch
                        treeDefaultExpandAll
                        style = {{ width: this.props.width || 200 }}
                        dropdownStyle = {{ maxHeight: 400, overflow: 'auto' }}
                        value = { structure + '' || this.props.value + '' || '' }
                        placeholder = "请选择部门"
                        allowClear = { allow_clear }
                        onChange = {(value) => this.onChange(value)}
                        onSelect = {(value, node, extra) => this.onSelect(value, node, extra)}
                        disabled = { this.props.disabled || false }
                        searchPlaceholder = "查询部门"
                        treeNodeFilterProp = 'title'
                        notFoundContent = '没有部门'
                        getPopupContainer = { this.props.getPopupContainer || document.getElementById('body') }
                        isHq = { this.props.isHq || 1}
                        addOrEditStaFFModalOrgId = { this.props.addOrEditStaFFModalOrgId || ''}
                      >
                          <TreeNode value = "all_structure" title = "所有部门" key = "all_structure" disabled>
                              { renderListContent }
                          </TreeNode>
                    </TreeSelect>) :
                    (<TreeSelect
                        showSearch
                        treeDefaultExpandAll
                        style = {{ width: this.props.width || 300 }}
                        dropdownStyle = {{ maxHeight: 400, overflow: 'auto' }}
                        value = { structure + '' || this.props.value + '' || '' }
                        placeholder = "请选择部门"
                        allowClear = { allow_clear }
                        onChange = {(value) => this.onChange(value)}
                        onSelect = {(value, node, extra) => this.onSelect(value, node, extra)}
                        disabled = { this.props.disabled || false }
                        searchPlaceholder = "查询部门"
                        treeNodeFilterProp = 'title'
                        notFoundContent = '没有部门'
                        getPopupContainer = { this.props.getPopupContainer || document.getElementById('body') }
                      >
                          <TreeNode value = "all_structure" title = "所有部门" key = "all_structure" disabled>
                              { renderListContent }
                          </TreeNode>
                    </TreeSelect>)
                }
            </Media>

        )
    }
}

export default TreeSelectStructure;
