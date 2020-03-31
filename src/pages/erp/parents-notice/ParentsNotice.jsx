import React from 'react';
import { connect } from 'dva';
import ParentsNoticeComponent from '../../../components/erp/parents-notice/ParentsNoticeComponent';

function ParentsNotice({dispatch, parentsNoticeModel}) {

	let {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,

        employComList,
        showSearch,

        readInfoVisible,
        readInfoList,
    } = parentsNoticeModel;

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'parentsNoticeModel/queryNoticeList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'parentsNoticeModel/queryNoticeList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'parentsNoticeModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'parentsNoticeModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'parentsNoticeModel/queryNoticeList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize,
            }
        });
    }

    /*点击批量删除*/
    function onBatchDelete() {
        if(!(selectedRowKeys &&  selectedRowKeys.length > 0)) {
            message.error('请先选择家长通知');
            return;
        }
        dispatch({
            type: 'parentsNoticeModel/deleteNotice',
            payload: {
                ids: selectedRowKeys.join(',')
            }
        });
    }

    /*点击新增*/
    function onCreateClick() {
        dispatch({
            type: 'parentsNoticeFormModel/showParentsNoticeForm',
        });
    }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'parentsNoticeModel/queryNoticeList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    /*显示通知的阅读情况*/
    function showReadInfo(noticeId) {
        dispatch({
            type: 'parentsNoticeModel/showReadInfo',
            payload: {
                noticeId,
            }
        });
    }

    /*打开编辑界面*/
    function onEditClick(id) {
        dispatch({
            type: 'parentsNoticeFormModel/showParentsNoticeForm',
            payload: {
                noticeId: id,
            }
        });
    }

    /*关闭阅读情况*/
    function closeReadInfo() {
        dispatch({
            type: 'parentsNoticeModel/updateState',
            payload: {
                readInfoVisible: false,
            }
        });
    }

    let parentNoticeTableProps = {
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
            employComList,
        },
        onBatchDelete,
        onCreateClick,

        showReadInfo,closeReadInfo,
        readInfoVisible,
        readInfoList,
        onEditClick,
    };

    return (
        <ParentsNoticeComponent {...parentNoticeTableProps} />
    );
}

function mapStateToProps({ parentsNoticeModel }) {
  	return { parentsNoticeModel };
}

export default connect(mapStateToProps)(ParentsNotice);
