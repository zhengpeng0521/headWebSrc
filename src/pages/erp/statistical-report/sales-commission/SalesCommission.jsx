import React, { PropTypes } from 'react';
import { message } from 'antd';
import SalesCommissionSearch from '../../../../components/erp/statistical-report/sales-commission/SalesCommissionSearch';
import SalesCommissionTable from '../../../../components/erp/statistical-report/sales-commission/SalesCommissionTable';
import SalesCommissionDetailModal from '../../../../components/erp/statistical-report/sales-commission/SalesCommissionDetailModal';

import { connect } from 'dva';

import styles from './SalesCommission.less';

function SalesCommission({ dispatch, salesCommission }) {

    let {
        pageIndex,
        pageSize,

        searchData,             //查询的数据(时间范围)
        orgCount,               //查询包含机构的数量

        tableOnLoading,         //table是否加载状态
        tableContentTotal,      //table内容数量
        tableContent,           //table内容

        salesDetailVisible,     //销售详情表单是否显示
        salesDetailContent,     //销售详情数据
        salesDetailSpining,     //销售详情数据是否加载完成
        salesDetailName,        //销售详情姓名
        salesDetailNameHeight,  //销售详情名字高度(css用)
        salesDetailTotal,       //销售详情总计
    } = salesCommission;

    //查询框输入时间范围后
    let searchSubmit = function(data) {
        dispatch({
            type:'salesCommission/SearchSalesCommission',
            payload:{
                pageIndex,
                pageSize,
                ...data
            }
        });
        dispatch({
            type:'salesCommission/updateState',
            payload:{
                searchData : data,
            }
        });
    };

    //table分页改变
    let tableOnChange = function(pagination, filters, sorter){
        dispatch({
            type: 'salesCommission/updateState',
            payload: {
                pageIndex : pagination.current-1,
                pageSize : pagination.pageSize,
            },
        });
        dispatch({
            type: 'salesCommission/SearchSalesCommission',
            payload: {
                pageIndex : pagination.current-1,
                pageSize : pagination.pageSize,
                ...searchData
            },
        });
    }

    //打开销售详情modal
    let tableOnOpenDetail = function(data){
        let id = data.uid;
        dispatch({
            type:'salesCommission/updateState',
            payload:{
                salesDetailVisible : true,
                salesDetailSpining : true,
            }
        });
        dispatch({
            type:'salesCommission/OpenSalesDetail',
            payload:{
                id,
                pageSize : 99999,
                pageIndex : 0,
            }
        });
    }

    //关闭销售详情modal
    let salesDetailModalCancel = function(){
        dispatch({
            type:'salesCommission/updateState',
            payload:{
                salesDetailVisible : false,
            }
        });
    }

    //导出数据
    let HandleExport = function(type){
        dispatch({
            type:'salesCommission/ExportSalesCommission',
            payload:{
                flag : type,
                ...searchData
            }
        });
    }


    let salesCommissionSearchProps = {
        searchData,
        orgCount,               //查询包含机构的数量
        searchSubmit,
        HandleExport,           //导出数据
    };

    let salesCommissionTableProps = {
        tableOnLoading,         //table是否加载状态
        tableContent,           //table内容
        tableContentTotal,      //table内容数量
        tableOnChange,          //table页码改变操作
        tableOnOpenDetail,      //打开销售详情表单
    }

    let salesCommissionDetailModalProps = {
        salesDetailVisible,     //销售详情表单是否显示
        salesDetailContent,     //销售详情数据
        salesDetailSpining,     //销售详情数据是否加载完成
        salesDetailName,        //销售详情姓名
        salesDetailNameHeight,  //销售详情名字高度(css用)
        salesDetailTotal,       //销售详情总计
        salesDetailModalCancel
    }

    return (
        <div>
            <SalesCommissionSearch {...salesCommissionSearchProps}/>
            <SalesCommissionTable {...salesCommissionTableProps}/>
            <SalesCommissionDetailModal {...salesCommissionDetailModalProps}/>
        </div>
  );
}

function mapStateToProps({ salesCommission }) {
  return { salesCommission };
}

export default connect(mapStateToProps)(SalesCommission);
