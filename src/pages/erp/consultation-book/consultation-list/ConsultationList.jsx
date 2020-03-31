import React, { PropTypes } from 'react';
import ConsultingSearch from '../../../../components/erp/consultation-book/consultation-list/ConsultingSearch';
import ConsultingList from '../../../../components/erp/consultation-book/consultation-list/ConsultingList';
import ConsultingModal from '../../../../components/erp/consultation-book/consultation-list/ConsultingModal';

import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';

function ConsultationList({ dispatch, consultationList }) {

    let {
        consultationListLoading,
        consultationListList,
        consultationListSelectedRowKeys,
        consultationListSelectedRows,
        consultationListTotal,
        consultationPageIndex,
        consultationPageSize,
        consultationListFormLoading,
        consultationListFormData,
        consultationListFormVisible,
        consultationListFormType,
        consultationListSearchData ,
        consultationListSearchVisible ,
    } = consultationList;

    //列表选中项变更时事件
    let tableRowSelectChange = function(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'consultationList/updateState',
            payload: {
                consultationListSelectedRowKeys:selectedRowKeys,
                consultationListSelectedRows:selectedRows,
            },
        });
    };

    //列表行是否能选中
    let tableRowCheckProps = function(record) {
        return true;
    };

    //列表分页 变更
    let tableOnChangePage = function(pagination, filters, sorter) {
        dispatch({
            type: 'consultationList/updateState',
            payload: {
                consultationPageIndex : pagination.current-1,
                consultationPageSize : pagination.pageSize,
            },
        });
        dispatch({
            type: 'consultationList/queryForConsultationList',
            payload: {
                pageIndex : pagination.current-1,
                pageSize : pagination.pageSize,
                ...consultationListSearchData,
            },
        });
    };

    //表格点击编辑
    let tableOnEditItem = function(record) {
        dispatch({
            type: 'consultationList/updateState',
            payload: {
                consultationListFormLoading : false,    //表单按钮是否加载中
                consultationListFormVisible : true,    //表单窗口是否显示
                consultationListFormType:'update',
                consultationListFormData:record,
            }
        });
    };


    //表格点击新增
    let tableOnCreate = function(topicType) {
        dispatch({
            type: 'consultationList/updateState',
            payload : {
                consultationListFormLoading : false,    //表单按钮是否加载中
                consultationListFormVisible : true,    //表单窗口是否显示
                consultationListFormType:'create',
                consultationListFormData:{},
            }
        });
    };

    //表格点击筛选
    let tableOnFilter = function() {
        dispatch({
            type: 'consultationList/updateState',
            payload:{
                consultationListSearchVisible:!consultationListSearchVisible,
            }
        });
    };

    //批量删除
    function tableOnDeleteBatch() {
        let id = [];
        if(consultationListSelectedRows && consultationListSelectedRows.length > 0) {
            consultationListSelectedRows.map(function(item) {
                id.push(item.id);
            });
        }
        console.log(id);
        /*if(id != '') {
            dispatch({
                type: 'pinghecairen/batchDelete',
                payload: {
                    id,
                },
            });
        }*/
    };

    //查询框清除条件
    let consultationListSearchReset = function() {
        dispatch({
            type: 'consultationList/updateState',
            payload: {
                consultationListSearchData : {},
                consultationPageIndex:0,
            },
        });
        dispatch({
            type: 'consultationList/queryConsultationList',
            payload:{
                pageIndex:0,
                pageSize:consultationPageSize,
            }
        });
    };

    //查询框点击查询
    let consultationListSearchSubmit = function(data) {
        dispatch({
            type: 'consultationList/updateState',
            payload: {
                consultationListSearchData:data,
                consultationPageIndex:0,
            },
        });
        dispatch({
            type: 'consultationList/query',
            payload: {
                pageIndex:0,
                pageSize:consultationPageSize,
                ...data,
            },
        });
    };

    //表单提交
    let consultationListFormSubmit = function(){

    }

    //表单窗口关闭
    let consultationListFormCancel = function() {
        dispatch({
            type: 'consultationList/updateState',
            payload: {
                consultationListFormLoading : false,    //表单按钮是否加载中
                consultationListFormData : {},       //表单数据
                consultationListFormVisible : false,    //表单窗口是否显示
            },
        });
    };

    //表单窗口提交
    let formSubmit = function(data) {
        /*dispatch({
            type: 'topicMgr/updateState',
            payload: {
                formVisible : false,
            },
        });
        dispatch({
            type: 'topicMgr/addImgTextTopic',
            payload: {
                ...data
            }
        });*/
    };


    let consultingSearchProps = {
        consultationListSearchReset,
        consultationListSearchSubmit,
    };


    let consultingListProps = {
        consultationListLoading,
        consultationListList,
        consultationListSelectedRowKeys,
        consultationListTotal,
        tableRowSelectChange,
        tableRowCheckProps,
        tableOnChangePage,
        tableOnEditItem,
        tableOnDeleteBatch,
        tableOnFilter,
        tableOnCreate,
    };


    let consultingModalProps = {
        consultationListFormLoading,
        consultationListFormData,
        consultationListFormVisible,
        consultationListFormType,
        consultationListFormSubmit,
        consultationListFormCancel,
    };

    return (
        <div>
           <QueueAnim
                type={['top', 'top']}
                ease={['easeOutQuart', 'easeInOutQuart']}
                className="common-search-queue" >
				{consultationListSearchVisible ? [
                   <ConsultingSearch {...consultingSearchProps} key="search_queue"/>
                ]:null}
            </QueueAnim>

            <ConsultingList {...consultingListProps} />
            <ConsultingModal {...consultingModalProps} />
        </div>
  );
}

ConsultationList.propTypes = {
  pinghecairen: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ consultationList }) {
  return { consultationList };
}

export default connect(mapStateToProps)(ConsultationList);
