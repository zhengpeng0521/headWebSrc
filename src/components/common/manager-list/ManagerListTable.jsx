import React from 'react';
import {Table} from 'antd';
import styles from './ManagerListTable.less';

function ManagerListTable ({
    loading,
    rowKey,
    columns,
    dataSource,
    emptyText,
    rowSelection,
    pagination,
}) {

    let tableWidth = 0;
    columns && columns.map(function(columnItem) {
        let colWidth = columnItem.width||0;
        tableWidth += colWidth;
    });

    let tablePageProps = undefined;
    let defaultShowToal = function(total, range) {
        return <div>共 {total} 条</div>
    }
    if(pagination) {
        let {
            total,
            pageIndex,
            pageSize,
            showTotal,
            onChange,
            showSizeChanger,
            pageSizeOptions,
            onShowSizeChange,
            showQuickJumper,
        } = pagination;

        tablePageProps = {
            current: pageIndex+1,
            total,
            pageSize,
            showTotal: showTotal || defaultShowToal,
            onChange,
            showSizeChanger: showSizeChanger || true,
            pageSizeOptions: pageSizeOptions || ['20', '50', '100', '200'],
            size: 'large',
            onShowSizeChange,
            showQuickJumper: showQuickJumper || true,

        };
    }
    return (
        <div className={styles.common_manager_list_table_cont} >
            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                rowSelection={rowSelection}
                pagination={tablePageProps}
                loading={loading}
                rowKey={rowKey || 'id'}
                locale={{emptyText: emptyText||'暂无数据'}}
                size="middle"
                />
        </div>
    );
}

export default ManagerListTable;
