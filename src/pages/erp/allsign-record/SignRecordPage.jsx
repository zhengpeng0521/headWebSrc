import React from 'react';
import { connect } from 'dva';
import SignRecordPageComponent from '../../../components/erp/allsign-record/SignRecordPageComponent';

function SignRecordPage({dispatch, signRecordModel}) {

	let {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        showSearch,
        initQuery,
    } = signRecordModel;

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'signRecordModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'signRecordModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'signRecordModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'signRecordModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'signRecordModel/queryList',
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
        dispatch({
            type: 'signRecordModel/deleteBatch',
            payload: {
                ids: selectedRowKeys.join(',')
            }
        });
    }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'signRecordModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    /*打开编辑界面*/
    function onEditClick(orgId, cpId) {
        dispatch({
            type: 'scheduleSignModel/showScheduleSign',
            payload: {
                orgId, cpId
            }
        });
    }

    /*列表点击打印*/
    function SignRecordTableItemPrint(record){
        dispatch({
            type:'signRecordModel/SignRecordTableItemPrint',
            payload:{
                ...record
            }
        });
    }

    function cancleSign(orgId, stuSignId) {
        dispatch({
            type: 'signRecordModel/cancleSign',
            payload: {
                orgId, stuSignId
            }
        });
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
            initQuery,
        },
        onBatchDelete,
        onEditClick,
        SignRecordTableItemPrint,
        cancleSign,
    };

    return (
        <SignRecordPageComponent {...componProps} />
    );
}

function mapStateToProps({ signRecordModel }) {
  	return { signRecordModel };
}

export default connect(mapStateToProps)(SignRecordPage);
