import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Icon, Table, Popover } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import styles from './OrgManage.less';
const TreeNode = Tree.TreeNode;

/*校区管理table*/
function OrgManageTable({
    orgManageTableType,                     //表格类型(营业中1/已停业2)
    orgManageTableLoading,                  //表格加载状态
    orgManageTableTotal,                    //表格数据总数
    orgManageTableContent,                  //表格数据所有内容
    orgManageTableSelectedRowKeys,          //表格多选选中的数组
    orgManageTableSelectedRow,              //表格多选中的对象数组
    orgManagePageIndexUseing,               //营业中table页码
    orgManagePageSizeUseing,                //营业中表格每页显示数量
    orgManagePageIndexDisabled,             //已停业table页码
    orgManagePageSizeDisabled,              //已停业表格每页显示数量

    OrgManageTableOnFilter,                 //表格点击筛选
    OrgManageTableOnAddOrg,                 //表格点击新增校区
    OrgManageTableOnEditOrg,                //表格点击编辑校区
    OrgManageTableOnChangeOrgStatus,        //表格点击启用或停用或删除
    OrgManageTableOnChangePageUseing,       //营业中分页改变
    OrgManageTableOnChangePageDisabled,     //已停业分页改变
    OrgManageTableRowCheckProps,            //多选框是否可被选中
    OrgManageTableRowSelectChange,          //多选框选择方法
  }) {

    const columns = [{
        width: 160,
        title: '校区编号',
        dataIndex: 'id',
        key: 'id',
        render: (text,record) => (
            <a onClick={() =>OrgManageTableOnEditOrg(record,'table')}>{text}</a>
        )
      }, {
        width: 240,
        title: '校区名称',
        dataIndex: 'organName',
        key: 'organName',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
      }, {
        width: 160,
        title: '审核状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        render:(text,record) => (
            <div>{ '1' == text ? <StatusFlag type = 'yellow'>审核中</StatusFlag> :
                   '2' == text ? <StatusFlag type = 'deep_red'>审核失败</StatusFlag> :
                   '3' == text ? <StatusFlag type = 'green'>审核成功</StatusFlag> : ''}</div>
        )
      }, {
        width: 160,
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:(text,record) => (
            <div>{ '0' == text ? <StatusFlag type = 'gray'>无效</StatusFlag> :
                   '1' == text ? <StatusFlag type = 'green'>有效</StatusFlag> :
                   '2' == text ? <StatusFlag type = 'deep_red'>停用</StatusFlag> : ''}</div>
        )
      }, {
        width: 160,
        title: '营业类型',
        dataIndex: 'organType',
        key: 'organType',
        render:(text,record) => (
            <div>
                { '1' == text ? '直营' :
                  '2' == text ? '加盟' : ''}
            </div>
        )
      }, {
        width: 300,
        title: '校区地址',
        dataIndex: 'address',
        key: 'address',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
      }];

    let rowSelection = {
        selectedRowKeys : orgManageTableSelectedRowKeys,
        onChange : OrgManageTableRowSelectChange,
        getCheckboxProps : OrgManageTableRowCheckProps,
	};

    let paginationProps = {
        size : 'large',
        total: orgManageTableTotal,
        current : orgManageTableType == '1' ? orgManagePageIndexUseing+1 : orgManagePageIndexDisabled+1,
        pageSize : orgManageTableType == '1' ? orgManagePageSizeUseing : orgManagePageSizeDisabled,
        showSizeChanger : true,
        showQuickJumper :true,
        showTotal(){
            return '共'+this.total+'条';
        }
    };

    return(
        <div style={{width:'100%'}}>
            <div>
                <div className={styles.tableBtn}>
                    <span>操作：</span>
                    <a style={{ marginLeft: 5 }} onClick={() => OrgManageTableOnEditOrg(orgManageTableSelectedRow[0],'batch')}>编辑</a>

                    { orgManageTableType == '1' ?
                        <Popconfirm placement="top" title={<span>停业将导致该校区的功能不可用，是否继续？</span>} onConfirm={() =>OrgManageTableOnChangeOrgStatus(orgManageTableSelectedRow,'2')}>
                            <a style={{ marginLeft: 10 }}>停用</a>
                        </Popconfirm>
                        :
                        null
                    }

                    { orgManageTableType == '2' ?
                        <Popconfirm placement="top" title={<span>确定启用该校区吗？</span>} onConfirm={() =>OrgManageTableOnChangeOrgStatus(orgManageTableSelectedRow,'1')}>
                            <a style={{ marginLeft: 10 }}>启用</a>
                        </Popconfirm>
                        :
                        null
                    }

                    { true == true ? null :
                        <Popconfirm placement="top" title={<span>删除不可恢复，将导致该校区功能不可用，是否继续？</span>} onConfirm={() =>OrgManageTableOnChangeOrgStatus(orgManageTableSelectedRow,'0')}>
                                <a style={{ marginLeft: 10 }}>删除</a>
                        </Popconfirm>
                    }


                    <Button type="primary" onClick={OrgManageTableOnFilter} style={{position:'absolute',right:'0'}}>筛选</Button>

                    { true == true ? null :
                        ( orgManageTableType == '1' ?
                            <Button type="primary" onClick={OrgManageTableOnAddOrg} style={{float:'right',marginLeft:'10px'}} ><Icon type="plus" />新增校区</Button>
                            :
                            null
                        )
                    }

                </div>
                <div style={{marginBottom:'20px'}} className='zj_sys_org_manage_table'>
                    <Table
                        columns={columns}
                        dataSource={orgManageTableContent}
                        loading={orgManageTableLoading}
                        pagination={paginationProps}
                        rowSelection={rowSelection}
                        onChange={ orgManageTableType == '1' ?  OrgManageTableOnChangePageUseing : OrgManageTableOnChangePageDisabled }
                        bordered
                        rowKey="id"
                        size='middle'
                        scroll={{ x : 800 }}/>
                </div>
            </div>
        </div>
    );
}

export default OrgManageTable;
