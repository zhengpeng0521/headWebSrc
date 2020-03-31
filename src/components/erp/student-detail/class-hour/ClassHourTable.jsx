import React from 'react';
import { Button ,Table , Icon } from 'antd';
import style from './ClassHourTable.less';

function ClassHourTable({
    classHourDataSource,
    classHourResultCount,
    classHourPageIndex,
    classHourPageSize,
    classHourTotal,
    classHourLeft,

    classHourPageIndexChange,
    classHourPageSizeChange,

    classHourLoading

}){
    classHourDataSource && classHourDataSource.map(function( item, index){
        item.key = index;
    })
   let columns = [
        {
            dataIndex : 'createTime',
            key       : 'createTime',
            title     : '时间',
            width     : '220px',
        },{
            dataIndex : 'tradeDesc',
            key       : 'tradeDesc',
            title     : '名称',
            width     : '180px',
        },{
            dataIndex : 'tradeType',
            key       : 'tradeType',
            title     : '类型',
            width     : '200px',
            render    : ( text, record ) => (
                <span>
                    { text && text == '1' ? '课时购买' : text == '2' ? '报课' : text == '3' ? '课时退回' : text == '4' ? '课时转余额' : text == '5' ? '课时消耗' : text == '6' ? '课时还原' : null }
                </span>
            )
        },{
            dataIndex : 'id',
            key       : 'id',
            title     : '交易号',
            width     : '250px'
        },{
            dataIndex : 'amount',
            key       : 'amount',
            title     : '数量',
            width     : '100px',
        }
    ];

    let pagination = {
        total             : classHourResultCount,
        showTotal         : total => `总共 ${ total } 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : classHourPageIndexChange,
        onShowSizeChange  : classHourPageSizeChange,
        size              : 'large'
    };

   return (
       <div className = 'yhwu_table_bg' >
            <div className = { style.class_hour_balance }>
                { '课时余额 : ' + classHourLeft + '/' + classHourTotal }
            </div>
            <Table size = { 'middle' } columns = { columns } dataSource = { classHourDataSource } pagination = { pagination } loading = { classHourLoading } scroll = {{ x : 1200 }} bordered />
       </div>
   )
};

export default ClassHourTable;
