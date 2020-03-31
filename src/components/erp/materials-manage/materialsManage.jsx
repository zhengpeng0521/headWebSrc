import React from 'react';
import { Table, Popconfirm, Button, Icon } from 'antd';
import styles from './materialsManage.less';

function materialsManageList({
    loading,
    lists,
    listTotal,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
    tableRowSelectChange,
    tableRowCheckProps,
    tablePageChange,
    tableOnChange,
    tableOnFilter,
    tableOnCreate,
    tableOnAdd,
    rowClick,
    deleteMaterialList,
    editMaterialManageList,
    tenantId,
  }) {
  const columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
        <span>
            <a onClick={ () => editMaterialManageList(record)} >{text}</a>
        </span>
    )
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => <span>{text == '2' ? '已下架' :
                                     text == '1' ? '上架中' : '未指定'}</span>,
  }, {
    title: '标准价格',
    dataIndex: 'price',
    key: 'price',
  }, {
    title: '销售单位',
    dataIndex: 'unit',
    key: 'unit',
  }, {
    title: '销量',
    dataIndex: 'sell',
    key: 'sell',
  }, {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
  }, {
    title: '所属校区',
    dataIndex: 'orgName',
    key: 'orgName',

  }, {
    title: '创建日期',
    dataIndex: 'createTime',
    key: 'createTime',
  }];

    let hasSelected = selectedRowKeys.length>0;

    let rowSelection = {
        selectedRowKeys,
        onChange : tableRowSelectChange,
        getCheckboxProps : tableRowCheckProps,
	};

	let paginationProps = {
        total: listTotal,
        showSizeChanger: true,               //是否可以改变每页条数
        showQuickJumper :true,               //是否可以快速跳转到某页
        onShowSizeChange : tablePageChange,  //每页条数改变的回调
        onChange : tablePageChange,          //页码改变的回调，参数是改变后的页码以及每页条数
        showTotal(){                         //用于显示数据总量和当前数据顺序
            return '总共'+this.total+'条数据';
        }
    };

  return (
    <div className={styles.table_bg}>
	    <div className={styles.common_over}>
             <div className={styles.common_left}>
                <p className={styles.operate}>操作</p>
                <Popconfirm title="确定要删除吗?" onConfirm = { deleteMaterialList }>
                    <a className={styles.delete} style={{color:'#0000FF'}}>删除</a>
                </Popconfirm>
             </div>
             <div className={styles.operation_right}>
                <Button type="primary" onClick={tableOnFilter} style={{padding:'0 24px'}}><Icon type="filter" />筛选</Button>
                <Button type="primary" onClick={tableOnAdd}  className={styles.addMoreCon} style={{padding:'0 24px',margin_right:'10px'}}><Icon type="plus" />新增产品</Button>
             </div>
        </div>

        <Table
            columns={columns}
            dataSource={lists}
            loading={loading}
            rowSelection={rowSelection}
            pagination={paginationProps}
            onChange={tableOnChange}
            onRowClick={rowClick}
            bordered
            rowKey="id"
           />
      </div>
  );
}

export default materialsManageList;
