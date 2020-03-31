import React from 'react';
import { Button ,Table , Icon } from 'antd';
import style from './AccountInfoTable.less';

function AccountInfoTable({
    accountInfoLoading,
    accountInfoDataSource,
    accountInfoResultCount,
    accountInfoPageIndex,
    accountInfoPageSize,
    accountInfoBalacne,

    accountInfoPageIndexChange,
    accountInfoPageSizeChange

}){

    accountInfoDataSource && accountInfoDataSource.map(function( item, index ){
        item.key = index;
    });
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
            width     : '200px',
        },{
            dataIndex : 'tradeType',
            key       : 'tradeType',
            title     : '类型',
            width     : '200px',
            render    : ( text, record ) => (
                <span>
                    { text && text == '1' ? '预充值' : text == '2' ? '课时购买' : text == '3' ? '课时转余额' : text == '4' ? '退费' : null }
                </span>
            )
        },{
            dataIndex : 'id',
            key       : 'id',
            title     : '交易号',
            width     : '250px',
        },{
            dataIndex : 'amount',
            key       : 'amount',
            title     : '金额',
            width     : '150px',
        }
    ];

    let pagination = {
        total             : accountInfoResultCount,
        showTotal         : total => `总共 ${ total } 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : accountInfoPageIndexChange,
        onShowSizeChange  : accountInfoPageSizeChange,
        size              : 'large'
    };

   return (
       <div className = 'yhwu_table_bg' >
            <div className = { style.account_balance }>
                { '账户余额 : ' + ( accountInfoBalacne || '0' ) + ' 元' }
            </div>
            <Table size = { 'middle' } columns = { columns } dataSource = { accountInfoDataSource } pagination = { pagination } loading = { accountInfoLoading } scroll = {{ x : 1200 }} bordered />
       </div>
   )
};

export default AccountInfoTable;
