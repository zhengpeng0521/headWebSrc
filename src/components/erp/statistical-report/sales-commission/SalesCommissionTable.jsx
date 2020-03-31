import React from 'react';
import { Form, Input, Button, Icon, Select, Pagination, DatePicker, message, Spin, Table } from 'antd';

import styles from './SalesCommission.less';

//统计报表 销售提成
function SalesCommissionTable({
    tableOnLoading,         //table是否加载状态
    tableContent,           //table内容
    tableContentTotal,      //table内容数量
    tableOnChange,          //table页码改变操作
    tableOnOpenDetail,      //打开销售详情表单
}) {

    const columns = [{
            width: 240,
            title: '姓名',
            dataIndex: 'sellerName',
            key: 'sellerName',
            render: (text,record) => (
                <a onClick={() => tableOnOpenDetail(record)}>{text}</a>
            )
        }, {
            width: 240,
            title: '销售金额',
            dataIndex: 'payMoney',
            key: 'payMoney',
        }, {
            width: 240,
            title: '占比金额',
            dataIndex: 'perMoney',
            key: 'perMoney',
        }];

    let paginationProps = {
        total : tableContentTotal,
        showQuickJumper : true,
        showTotal(){
            return '总共'+this.total+'条数据';
        }
    }

    return(
        <div className={styles.allTable}>
            <div className='zj_sales_commission' style={{padding:'0 20px 20px 20px'}}>
                <Table
                        columns={columns}
                        dataSource={tableContent}
                        loading={tableOnLoading}
                        pagination={paginationProps}
                        onChange={tableOnChange}
                        bordered
                        rowKey="id"
                        scroll={{ x: 1000 }} />
            </div>
        </div>
    );
}

export default SalesCommissionTable;
