import React from 'react';
import { Button ,Table , Icon } from 'antd';

function ContractOrderTable({
    contractOrderDataSource,
    contractOrderResultCount,
    contractOrderPageSize,
    contractOrderPageIndex,

    contractOrderPageIndexChange,
    contractOrderPageSizeChange,

    contractOrderLoading
}){
    contractOrderDataSource && contractOrderDataSource.map(function( item, index ){
        item.key = index;
    })
    let columns = [
        {
            dataIndex : 'orderNumber',
            key       : 'orderNumber',
            title     : '订单编号',
            width     : '250px',
        },{
            dataIndex : 'orderType',
            key       : 'orderType',
            title     : '订单类型',
            width     : '150px',
            render    : ( text, record ) => (
                <div>
                    { text == '1' ? '预充值' : text == '2' ? '课时售卖' : null }
                </div>
            )
        },{
            dataIndex : 'orderStuName',
            key       : 'orderStuName',
            title     : '学员名称',
            width     : '150px',
        },{
            dataIndex : 'orderTotal',
            key       : 'orderTotal',
            title     : '产品合计',
            width     : '160px',
        },{
            dataIndex : 'orderDiscount',
            key       : 'orderDiscount',
            title     : '优惠折扣',
            width     : '220px',
        },{
            dataIndex : 'orderMoney',
            key       : 'orderMoney',
            title     : '订单金额',
            width     : '140px',
        },{
            dataIndex : 'orderState',
            key       : 'orderState',
            title     : '订单状态',
            width     : '160px',
            render    : ( text, record ) => (
                <div>
                    { text == '0' ? '无效' : text == '1' ? '待支付' : text == '2' ? '已支付' : text == '3' ? '已驳回' : null }
                </div>
            )
        },{
            dataIndex : 'orderNewOldstu',
            key       : 'orderNewOldstu',
            title     : '新老学员',
            width     : '120px',
            render    : ( text, record ) => (
                <div>
                    { text == '0' ? '新学员' : text == '1' ? '老学员' : null }
                </div>
            )
        },{
            dataIndex : 'orderSubordinateCampus',
            key       : 'orderSubordinateCampus',
            title     : '所属校区',
            width     : '220px',
        },{
            dataIndex : 'orderCreateTime',
            key       : 'orderCreateTime',
            title     : '创建时间',
            width     : ' 200px',
        },{
            dataIndex : 'orderCreatePerson',
            key       : 'orderCreatePerson',
            title     : '创建人',
            width     : '150px',
        },
    ];

    let pagination = {
        total             : contractOrderResultCount,
        showTotal         : total => `总共 ${ total } 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : contractOrderPageIndexChange,
        onShowSizeChange  : contractOrderPageSizeChange,
        size              : 'large'
    };

   return (
       <div className = 'yhwu_table_bg' >
            <Table size = { 'middle' } columns = { columns } dataSource = { contractOrderDataSource } pagination = { pagination } loading = { contractOrderLoading } scroll = {{ x : 1650 }} bordered />
       </div>
   )
};

export default ContractOrderTable;
