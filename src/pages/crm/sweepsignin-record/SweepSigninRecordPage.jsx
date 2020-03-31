import React from 'react';
import { connect } from 'dva';
import SweepSigninRecordComponent from '../../../components/crm/sweepsignin-record/SweepSigninRecordComponent';

function SweepSigninRecordPage({dispatch, sweepSigninRecordModel}) {

    let {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        showSearch,
        initQuery,
    } = sweepSigninRecordModel;

    /*点击搜索时*/
    function onSearch(query) {

        dispatch({
            type: 'sweepSigninRecordModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'sweepSigninRecordModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'sweepSigninRecordModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'sweepSigninRecordModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'sweepSigninRecordModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize,
            }
        });
    }

    // /*点击批量删除*/
    // function onBatchDelete() {
    //     if(!(selectedRowKeys &&  selectedRowKeys.length > 0)) {
    //         message.error('请先选择账号');
    //         return;
    //     }
    //     dispatch({
    //         type: 'signRecordModel/deleteBatch',
    //         payload: {
    //             ids: selectedRowKeys.join(',')
    //         }
    //     });
    // }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'sweepSigninRecordModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    function onEditClick(orgId, cpId) {
        // console.log("orgIdorgIdorgIdorgIdorgId",orgId);
        //
        // console.log("cpIdcpIdcpIdcpId",cpId);



    }

      /*打开编辑界面*/
    // function onEditClick(orgId, cpId) {
    //     dispatch({
    //         type: 'scheduleSignModel/showScheduleSign',
    //         payload: {
    //             orgId, cpId
    //         }
    //     });
    // }

     function cancleSign(orgId, stuSignId) {
         dispatch({
             type: 'sweepSigninRecordModel/cancleSign',
             payload: {
                 orgId, id: stuSignId,
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

        onEditClick,
        cancleSign,
    };

    return (
        <SweepSigninRecordComponent {...componProps} />
    );
}

function mapStateToProps({sweepSigninRecordModel }) {
    return { sweepSigninRecordModel };
}

export default connect(mapStateToProps)(SweepSigninRecordPage);
