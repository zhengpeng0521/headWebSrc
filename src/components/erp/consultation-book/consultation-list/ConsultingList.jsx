import React from 'react';
import { Table, Popconfirm, Button, Icon } from 'antd';
import styles from './Cousulting.less';

//咨询列表
function ConsultingList({
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
  }) {
  const columns = [{
    width: 80,
    title: '姓名',
    dataIndex: 'id',
    key: 'id',
    render:(text,record) => (
        <a onClick={() => tableOnEditItem(record)}>{text}</a>
    ),
  }, {
    width: 60,
    title: '联系电话',
    dataIndex: 'title',
    key: 'title',
  }, {
    width: 100,
    title: '意向度',
    dataIndex: 'tit',
    key: 'tit',
  }, {
    width: 60,
    title: '意向课程',
    dataIndex: 'status',
    key: 'status',
  }, {
    width: 100,
    title: '关键词',
    dataIndex: 'shortIntro',
    key: 'shortIntro',
  }, {
    width: 70,
    title: '来源',
    dataIndex: 'cover',
    key: 'cover',
  }, {
    width: 120,
    title: '销售',
    dataIndex: 'createTime',
    key: 'createTime',
  }, {
    width: 100,
    title: '最新跟进时间',
    dataIndex: 'link',
    key: 'link',
  }, {
    width: 60,
    title: '所在校区',
    dataIndex: 'commentCnt',
    key: 'commentCnt',
  }];

    //当前是否有选中项
    let hasSelected = consultationListSelectedRowKeys.length > 0;

    let rowSelection = {
        consultationListSelectedRowKeys,
        onChange : tableRowSelectChange,
        getCheckboxProps : tableRowCheckProps,
	};

	let paginationProps = {
        total: consultationListTotal,
        showSizeChanger: true,
        showQuickJumper :true,
        showTotal(){
            return '总共'+this.total+'条数据';
        }
    };
    return (
        <div className="zj_Table">
            <div className="common-over">
                <div className={styles.tableBtn}>
                    <div >
                        <span>操作:</span>
                            <Popconfirm placement="top" title="确认要批量删除吗?" onConfirm={tableOnDeleteBatch}>
                                <Button style={{ marginLeft: 8 }} type={hasSelected?'primary':'ghost'} disabled={!hasSelected}>删除</Button>
                            </Popconfirm>
                            <span style={{ marginLeft: 8 }}>{hasSelected ? `选择了 ${consultationListSelectedRowKeys.length} 个对象` : ''}</span>
                            <Button type="primary" onClick={tableOnFilter} style={{float:'right',marginLeft:'10px'}}><Icon type="filter" />筛选</Button>
                            <Button type="primary" onClick={tableOnCreate} style={{float:'right'}}><Icon type="plus" />新增咨询</Button>
                    </div>
                </div>
            </div>
            <div className={styles.table}>
                <Table
                    columns={columns}
                    dataSource={consultationListList}
                    loading={consultationListLoading}
                    rowSelection={rowSelection}
                    pagination={paginationProps}
                    onChange={tableOnChangePage}
                    bordered
                    rowKey="id"
                    scroll={{ x : 1500 }} />
            </div>
        </div>
  );
}


export default ConsultingList;
