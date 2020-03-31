import React from 'react';
import { Button ,Table, Icon } from 'antd';

function RefundRecordTable({
    refundRecordInfoDataSource,
    refundRecordInfoResultCount,
    refundRecordInfoPageSize,
    refundRecordInfoPageIndex,

    refundRecordInfoPageIndexChange,
    refundRecordInfoPageSizeChange,

    refundRecordInfoLoading
}){
    refundRecordInfoDataSource && refundRecordInfoDataSource.map(function( item, index ){
        item.key = index;
    })
    let columns = [
        {
            dataIndex : 'id',
            key       : 'id',
            title     : '退款编号',
            width     : '250px',
        },{
            dataIndex : 'refundType',
            key       : 'refundType',
            title     : '退款类型',
            width     : '150px',
            render    : ( text, record ) => (
                <span>
                    { text == '1' ? '退款 : ' : text == '2' ? '退课时 : ' : null }
                    { text == '1' ? record.money + ' 元' : text == '2' ? record.periodNum : null }
                </span>
            )
        },{
            dataIndex : 'status',
            key       : 'status',
            title     : '退款状态',
            width     : '150px',
            render    : ( text, record ) => (
                <span>
                    { text == '1' ? '待退款' : text == '2' ? '已退款' : text == '3' ? '已驳回' : null }
                </span>
            )
        },{
            dataIndex : 'refundWay',
            key       : 'refundWay',
            title     : '处理说明',
            width     : '180px',
        },{
            dataIndex : 'orgName',
            key       : 'orgName',
            title     : '所属校区',
            width     : '250px',
        },{
            dataIndex : 'createTime',
            key       : 'createTime',
            title     : '创建时间',
            width     : '250px',
        }
    ];

    let pagination = {
        total             : refundRecordInfoResultCount,
        showTotal         : total => `总共 ${ total } 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : refundRecordInfoPageIndexChange,
        onShowSizeChange  : refundRecordInfoPageSizeChange,
        size              : 'large'
    };

    return (
        <div className = 'yhwu_table_bg' >
            <Table size = { 'middle' } columns = { columns } dataSource = { refundRecordInfoDataSource } pagination = { pagination } loading = { refundRecordInfoLoading } scroll = {{ x : 1590 }} bordered />
        </div>
   )
};

export default RefundRecordTable;
