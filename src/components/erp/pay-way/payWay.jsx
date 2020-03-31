import React from 'react';
import { Table, Popconfirm, Button, Icon } from 'antd';
import styles from './payWay.less';


function payWay({
    loading,
    lists,
    listTotal,
    pageIndex,
    pageSize,
    selectedRowKeys,
    tableRowSelectChange,
    tableRowCheckProps,
    tablePageChange,
    tableOnChange,
    tableOnFilter,
    tableOnAdd,  //点击添加弹出新增框
    deletePayWay,  //删除事件
    editPayWay,    //点击修改
  }) {
  const columns = [{
    title: '支付方式名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '账号/卡号',
    dataIndex: 'acctNo',
    key: 'acctNo',
  }, {
    title: '费率',
    dataIndex: 'rate',
    key: 'rate',
  }, {
    title: '覆盖校区',
    dataIndex: 'orgNum',
    key: 'orgNum',
    render: (text, record) => (
            <span>
                <a onClick={ () => editPayWay(record.id)}>{text}</a>
            </span>
        )
  }];

    let hasSelected = selectedRowKeys.length>0;

    let rowSelection = {
        selectedRowKeys,
        onChange : tableRowSelectChange,
        getCheckboxProps : tableRowCheckProps,
	};

	let paginationProps = {
        total: listTotal,
        showSizeChanger: true,  //是否可以改变每页条数
        showQuickJumper :true,   //是否可以快速跳转到某页
        onShowSizeChange : tablePageChange,  //每页条数改变的回调
        onChange : tablePageChange,  //页码改变的回调，参数是改变后的页码以及每页条数
        showTotal(){   //	用于显示数据总量和当前数据顺序
            return '总共'+this.total+'条数据';
        }
    };

  return (
    <div className={styles.table_bg}>
	    <div className={styles.common_style}>
            <div className={styles.operation_left}>
                <p className={styles.operate}>操作</p>
                <Popconfirm title="确定要删除吗?" onConfirm = { deletePayWay } >
                    <a className={styles.delete} style={{color:'#0000FF'}}>删除</a>
                </Popconfirm>
            </div>

            <div className={styles.operation_right}>
                <Button type="primary" onClick={tableOnFilter} style={{padding:'0 24px'}}><Icon type="filter" />筛选</Button>
                <Button type="primary" onClick={tableOnAdd}  className={styles.addMoreCon} style={{padding:'0 24px',margin_right:'10px'}}><Icon type="plus" />添加</Button>
            </div>

        </div>

        <Table
            columns={columns}
            dataSource={lists}
            loading={loading}
            rowSelection={rowSelection}
            pagination={paginationProps}
            onChange={tableOnChange}
            bordered
            rowKey="id"
            />
      </div>
  );
}

export default payWay;
