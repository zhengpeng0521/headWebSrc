import React from 'react';
import { Popconfirm , Spin , Button , Input , Icon , Table , Popover , Pagination } from 'antd';
import { StatusFlag , ProgressBar , NullData } from '../../../common/new-component/NewComponent';
//import RightTable from '../../../common/new-component/right-table/RightTable';
import RightTable from '../../../common/new-component/manager-list/ManagerList';
import QueueAnim from 'rc-queue-anim';
import styles from './CoursewareRightTable.less';

/*教材课件右侧table*/
function CoursewareRightTable({
    /*搜索内容*/
    RightOnSearch,                      //点击搜索
    nameOrder,
    createOrder,

    /*列表内容*/
    rightTablePageIndex,                //页码
    rightTablePageSize,                 //每页条数
    rightTableLoading,                  //表格加载状态
    rightTableTotal,                    //表格数据总数
    rightTableData,                     //表格数据所有内容
    rightTableSelectedRowKeys,          //选中项的key
    rightTableSelectedRows,             //选中项的数组集合

    RightTableOpenDetail,               //查看课件详情
    RightTablePageOnChange,             //分页onChange事件
    RightTableSelectOnChange,           //checkbox的onChange事件
    RightTableReleaseCourseware,        //发布课件
    RightTableOnDelete,                 //删除课件
    sorterChange,                       //排序

    openOrg,                            //打开已选校区
  }) {

    const columns = [{
        width: 140,
        title: '课件名称',
        sorter: true,
        sortOrder: nameOrder == '1' ? 'descend' : nameOrder == '2' ? 'ascend' : false,
        dataIndex: 'name',
        key: 'name',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                <a onClick = {() => RightTableOpenDetail(record)}>{ text }</a>
            </Popover>
        )
      }, {
        width: 120,
        title: '作者',
        dataIndex: 'author',
        key: 'author',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                { text }
            </Popover>
        )
      }, {
        width: 120,
        title: '类目',
        dataIndex: 'catName',
        key: 'catName',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                { text }
            </Popover>
        )
      }, {
        width: 120,
        title: '文件类型',
        dataIndex: 'type',
        key: 'type',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                { text == '1' ? '文档' : text == '2' ? '图片' : text == '3' ? '视频' : '' }
            </Popover>
        )
      }, {
        width: 120,
        title: '文件大小',
        dataIndex: 'size',
        key: 'size',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                { text }
            </Popover>
        )
      },{
        width: 140,
        title: '有效天数',
        dataIndex: 'timeOut',
        key: 'timeOut',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                { text =='-1' ?
                    <span>永久有效</span>
                :
                    <Popover placement = "top" content = { text }>
                        { text }
                    </Popover>
                }
            </Popover>

        )
      }, {
        width: 140,
        title: '适用范围',
        dataIndex: 'orgIds',
        key: 'orgIds',
        render: (text, record) => (
            <div>
                {record.allVisible == '1' ?
                    <div>全部校区</div>
                    :
                    record.allVisible == '3' ?
                    <div>{ record.depts}</div>
                    :
                    record.allVisible == '2' ?
                    <a onClick = { ()=>openOrg( text,record.allVisible) }>
                        { ( text && text.split(',').length || '--' ) }
                    </a>
                    :
                    '--'
                }

            </div>
        )
      }, {
        title: '发布时间',
        dataIndex: 'publishTime',
        key: 'publishTime',
        sorter: true,
        sortOrder: createOrder == '1' ? 'descend' : createOrder == '2' ? 'ascend' : false,
        render: (text, record) => (
            <Popover placement = "top" content = { text }>
                { text }
            </Popover>
        )
      }];

    let h = document.body.clientHeight - 312;
    let RightTableProps = {
        table : {
            loading       : rightTableLoading,
            dataSource    : rightTableData,
            yScroll : h,
            xScroll : 1100,
            columns : columns,
            onChange : sorterChange,
            rowSelection : {
                selectedRowKeys : rightTableSelectedRowKeys,
                onChange : RightTableSelectOnChange,        //复选框onChange事件
            },
        },
        pagination : {
			total            : rightTableTotal,
			pageIndex        : rightTablePageIndex,
			pageSize         : rightTablePageSize,
			showTotal        : total => `共 ${rightTableTotal} 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : RightTablePageOnChange,
			onChange         : RightTablePageOnChange
		}
    }
    return(
        <div className = 'course_table'>
            <RightTable { ...RightTableProps }/>
        </div>

    );
}

export default CoursewareRightTable;
