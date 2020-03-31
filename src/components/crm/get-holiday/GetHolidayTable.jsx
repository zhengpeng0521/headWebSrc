import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Icon, Table, Select, Dropdown, Menu } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './GetHoliday.less';
const SubMenu = Menu.SubMenu;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

/*请假table*/
function GetHolidayTable({
    getHolidayTableLoading,                 //表格加载状态
    getHolidayTableContent,                 //表格数据
    getHolidayTableTotal,                   //表格数据总数
    getHolidayTableSelectedRowKeys,         //表格多选选中的数组
    getHolidayTableSelectedRow,             //表格多选中的对象数组
    getHolidayPageSize,                     //表格一页多少数据
    getHolidayPageIndex,                    //表格页码

    GetHolidayTableRowSelectChange,         //表格多选状态改变时方法
    GetHolidayTableOnChangePage,            //表格分页等改变时方法
    ShowOrHideSearchBar,                    //表格点击筛选
    OpenDealModal,                          //表格点击确认处理
    DeleteRequest,                          //批量删除请假申请
  }) {

    const columns = [{
        width: 150,
        title: '姓名',
        dataIndex: 'stuName',
        key: 'stuName',
      }, {
        width: 150,
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        width: 150,
        title: '校区',
        dataIndex: 'orgName',
        key: 'orgName',
      }, {
        width: 150,
        title: '请假原因',
        dataIndex: 'reason',
        key: 'reason',
      }, {
        width: 150,
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:(text,record) => (
            <div>{ text == '0' ? '无效(已删除)' :
                   text == '1' ? <span style={{color:'#ff0000'}}>未处理</span> :
                   text == '2' ? '已销假' :
                   text == '3' ? <span style={{color:'#69b439'}}>已处理</span> :
                   text == '4' ? <span style={{color:'#69b439'}}>已处理</span> : ''}</div>
        )
      }, {
        width: 150,
        title: '处理结果',
        dataIndex: 'status1',
        key: 'status1',
        render:(text,record) => (
            <div style={{position:'relative'}}>{ record.status == '0' ? '' :
                   record.status == '1' ? '' :
                   record.status == '2' ? '' :
                   record.status == '3' ? <span>同意<Icon type="check" style={{color:'#69b439',position:'absolute',top:'2px',marginLeft:'6px'}}/></span> :
                   record.status == '4' ? <span>不同意<Icon type="close-circle-o" style={{color:'#999999',position:'absolute',top:'2px',marginLeft:'6px'}}/></span> : ''}</div>
        )
      }, {
        width: 150,
        title: '申请时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr',
      }, {
        width: 150,
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      }, ];

    let rowSelection = {
        selectedRowKeys : getHolidayTableSelectedRowKeys,
        onChange : GetHolidayTableRowSelectChange,
	};

    let paginationProps = {
        size : 'large',
        total: getHolidayTableTotal,
        current : getHolidayPageIndex+1,
        pageSize : getHolidayPageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal(){
            return '共'+this.total+'条';
        }
    };

    return(
        <div style={{width:'100%',padding:'20px'}}>
            <div className={styles.tableBtn}>
                <span>操作：</span>
                <a style={{marginLeft:'5px'}} onClick={() => OpenDealModal()}>确认处理</a>
                <Popconfirm placement="top" title={<span>确定要<span style={{color:'red'}}>删除</span>{getHolidayTableSelectedRow.length > 1 ? '这些' : '此'}记录吗</span>} onConfirm={() => DeleteRequest()}>
                    <a style={{marginLeft:'10px'}}>删除</a>
                </Popconfirm>
                <Button type="primary" onClick={() => ShowOrHideSearchBar()} style={{float:'right',marginLeft:'10px'}}><Icon type="filter" />筛选</Button>
            </div>
            <div style={{margin:'20px 0 20px 0'}}>
                <Table
                    columns={columns}
                    dataSource={getHolidayTableContent}
                    loading={getHolidayTableLoading}
                    pagination={paginationProps}
                    rowSelection={rowSelection}
                    onChange={GetHolidayTableOnChangePage}
                    bordered
                    rowKey="id"
                    size='middle'
                    scroll={{ x : 600 }} />
            </div>
        </div>
    );
}

export default GetHolidayTable;
