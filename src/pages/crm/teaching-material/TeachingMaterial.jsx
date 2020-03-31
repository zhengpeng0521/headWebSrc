import React from 'react';
import { connect } from 'dva';
import TeachingMaterialComponent from '../../../components/crm/teaching-material/TeachingMaterialComponent';

function TeachingMaterial({dispatch, teachingMaterialModel}) {

	let {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        selectedRows,
        selectedRecordIds,

        showSearch,

		newColumns,
    } = teachingMaterialModel;

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'teachingMaterialModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'teachingMaterialModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'teachingMaterialModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'teachingMaterialModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
                selectedRows : selectedRows,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'teachingMaterialModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize,
            }
        });
    }

    /*点击批量删除*/
    function onBatchDelete() {
        if(!(selectedRowKeys &&  selectedRowKeys.length > 0)) {
            message.error('请先选择账号');
            return;
        }
        let ids = [];
        for(let i in selectedRows){
            ids.push(selectedRows[i].id);
        }
        dispatch({
            type: 'teachingMaterialModel/deleteBatch',
            payload: {
                ids : ids.join(','),
            }

        });

    }

    /*点击新增*/
    function onCreateClick() {

        let org;
        /*取到第一个校区(默认校区)ID*/
        if(window._init_data.firstOrg != undefined){
            org = window._init_data.firstOrg;                //获取选择校区下的第一间校区

            dispatch({
                type: 'teachingMaterialFormModel/updateState',
                payload:{
                    createOrgId : org.key,

                }
            });

        }


        dispatch({
            type: 'teachingMaterialFormModel/show',
        });
    }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'teachingMaterialModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    /*打开编辑界面*/
    function onEditClick(id, orgId) {
        dispatch({
            type: 'teachingMaterialFormModel/show',
            payload: {
                id,orgId,
            }
        });
    }

	function changeColumns( newColumns ){
		dispatch({
			type : 'teachingMaterialModel/updateState',
			payload : {
				newColumns
			}
		})
	}

    let componProps = {
        table: {
            pageIndex,
            pageSize,
            total,
            loading,
            dataSource,
            selectedRowKeys,
            onRowSelectChange,
            onShowSizeChange,
            pageChange,
        },
        search: {
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
        },
        onBatchDelete,
        onCreateClick,
        onEditClick,
		newColumns,
		changeColumns
    };

    return (
		<TeachingMaterialComponent {...componProps} />
    );
}

function mapStateToProps({ teachingMaterialModel }) {
  	return { teachingMaterialModel };
}

export default connect(mapStateToProps)(TeachingMaterial);
