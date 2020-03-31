import React from 'react';
import { Popconfirm , Spin , Button , Input , Icon , Table , Popover , Pagination } from 'antd';
import { StatusFlag , ProgressBar , NullData } from '../../common/new-component/NewComponent';
import RightTable from '../../common/new-component/right-table/RightTable';
import QueueAnim from 'rc-queue-anim';
import styles from './StaffManageRightTable.less';

/*员工管理右边table*/
function StaffManageRightTable({
    staffManageType,                        //员工类型(总部hq/校区分部org)
    /*员工列表search*/
    staffTableType,                         //表格类型(使用中'1'/已停用'3')
    staffManageRoleSelectContent,           //表格搜索栏角色列表下拉数据
    staffManageFastSearchContent,           //员工管理查询条件
    staffManagePageSize,                    //页码
    staffManagePageIndex,                   //每页条数

    /*员工列表table*/
    staffManageTableLoading,                //表格加载状态
    staffManageTableTotal,                  //表格数据总数
    staffManageTableContent,                //表格数据所有内容
    staffManageSearchVisible,               //右边table列表搜索栏是否显示
    staffManageTableSelectedRowKeys,        //表格多选选中的数组
    staffManageTableSelectedRow,            //表格多选中的对象数组

    StaffManageTableOnCreateStaff,          //表格点击新增员工
    StaffManageTableOnEditStaff,            //表格点击编辑员工
    StaffManageTableOnFiredStaff,           //表格点击停用
    StaffManageTableOnDeleteStaff,          //表格点击删除
    StaffManageTableOnEnableStaff,          //表格点击启用
    StaffManageTableOnChangePage,           //表格分页改变
    StaffManageTableRowSelectChange,        //多选框选择方法
    StaffManageCheckOrgs,                   //表格点击所属机构下方数据时弹出并查看
    StaffManageSearchSubmit,                //员工管理点击查询
    StaffManageChangeTabsSelect,            //tab的onChange事件
    StaffManageTableInvitation,             //员工邀请

    subordinates,                           //当前登陆用户的下属编号
    selectSubordinate,                      //当前选中的下属
    subordinateChange,                      //下属选择变更事件
  }) {

    const columnsHq = [{
        width: 140,
        title: '工号',
        dataIndex: 'empNo',
        key: 'empNo',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    },{
        width: 140,
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    },
    // {
    //     width: 120,
    //     title: '状态',
    //     dataIndex: 'activeStatus',
    //     key: 'activeStatus',
    //     render:(text,record) => (
    //         <div>
    //             { '1' == text ? <StatusFlag type = 'green'>已激活</StatusFlag> :
    //               '0' == text ? <StatusFlag type = 'gray'>未激活</StatusFlag> : '' }
    //         </div>
    //     )
    // },
    {
        width: 140,
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    }, {
        width: 140,
        title: '邮箱',
        dataIndex: 'mail',
        key: 'mail',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    },{
        width: 112,
        title: '头像',
        dataIndex: 'headImgurl',
        key: 'headImgurl',
        render: (text, record) =>
             (<div style={{cursor:'pointer'}}>
                {!!text ?
                    <Popover placement="right" content={<img src={text} height='120px' width='80px' style={{paddingTop:5}}/>} >
                        <a>查看</a>
                    </Popover>
                    :
                    '无'
                }
             </div>),
    }, {
        width: 120,
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    }, {
        width: 120,
        title: '管辖校区',
        dataIndex: 'mgrOrgIds',
        key: 'mgrOrgIds',
        render:(text,record) => (
            <div>
                { !!text ? <a onClick={() => StaffManageCheckOrgs(!!text ? text.split(',') : [])}>{ !!text ? text.split(',').length + '家' : '无' }</a> : '无' }
            </div>
        ),
    }, {
        title: '所属部门',
        dataIndex: 'deptName',
        key: 'deptName',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
    }];

    const columnsOrg = [{
        width: 140,
        title: '工号',
        dataIndex: 'empNo',
        key: 'empNo',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    },{
        width: 140,
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    },
    // {
    //     width: 120,
    //     title: '状态',
    //     dataIndex: 'activeStatus',
    //     key: 'activeStatus',
    //     render:(text,record) => (
    //         <div>
    //             { '1' == text ? <StatusFlag type = 'green'>已激活</StatusFlag> :
    //               '0' == text ? <StatusFlag type = 'gray'>未激活</StatusFlag> : '' }
    //         </div>
    //     )
    // },
    {
        width: 140,
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    }, {
        width: 140,
        title: '邮箱',
        dataIndex: 'mail',
        key: 'mail',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    },{
        width: 112,
        title: '头像',
        dataIndex: 'headImgurl',
        key: 'headImgurl',
        render: (text, record) =>
             (<div style={{cursor:'pointer'}}>
                {!!text ?
                    <Popover placement="right" content={<img src={text} height='120px' width='80px' style={{paddingTop:5}}/>} >
                        <a>查看</a>
                    </Popover>
                    :
                    '无'
                }
             </div>),
    }, {
        width: 120,
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
    }, {
        width: 120,
        title: '汇报对象',
        dataIndex: 'leaderName',
        key: 'leaderName',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
    },{
        width: 150,
        title: '所属校区',
        dataIndex: 'belongOrg',
        key: 'belongOrg',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
    }, {
        title: '所属部门',
        dataIndex: 'deptName',
        key: 'deptName',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
    }]

    let rowSelection = {
        selectedRowKeys : staffManageTableSelectedRowKeys,
        onChange : StaffManageTableRowSelectChange
	};

    //搜索条件菜单划分
    let searchFields = [{
                type : 'input',
                key : 'name',
                placeholder : '员工姓名'
            },{
                type : 'input',
                key : 'mobile',
                placeholder : '员工手机号'
            }];

    //操作按钮菜单划分
    let rightOperationBtns = [
        { type : 'tab' ,
          key : staffManageType,
          value : staffTableType,
          options : [{ label : '使用中' , value : '1' },{ label : '已停用' , value : '3' }] ,
          handle : StaffManageChangeTabsSelect
        },
    ]
//    if(staffManageType == 'hq'){
        rightOperationBtns.splice(0,0,{ label : '新增员工' , handle : () => StaffManageTableOnCreateStaff() })
//    }

    return(
        <RightTable
            search = {{
                onSearch : StaffManageSearchSubmit,
                fields : searchFields
            }}
            rightOperation = {{
                btns : rightOperationBtns
            }}
            selectBar = {{
                label : '已选',
                num : staffManageTableSelectedRowKeys.length,
                btns : [
                    { label : '编辑' , handle : () => StaffManageTableOnEditStaff(staffManageTableSelectedRow[0],'edit') , confirm : false },
                    { confirm : true,
                      label : staffTableType == '1' ? '停用' : '启用' ,
                      handle : staffTableType == '1' ?
                            () => StaffManageTableOnFiredStaff(staffManageTableSelectedRow) :
                            () => StaffManageTableOnEnableStaff(staffManageTableSelectedRow)
                    },
                    { label : '删除' , handle : () => StaffManageTableOnDeleteStaff(staffManageTableSelectedRow) , confirm : true },
                    { label : '修改职能' , handle : () => StaffManageTableOnEditStaff(staffManageTableSelectedRow[0],'modifyFunction') , confirm : false },
                    { label : '邀请' , handle : () =>   StaffManageTableInvitation(staffManageTableSelectedRowKeys) , confirm : false }
                ]
            }}
            table = {{
                columns : staffManageType == 'hq' ? columnsHq : staffManageType == 'org' ? columnsOrg : [],
                loading : staffManageTableLoading,
                dataSource : staffManageTableContent,
                rowSelection : rowSelection ,
            }}
            pagination = {{
                pageIndex : staffManagePageIndex,
                pageSize : staffManagePageSize,
                total : staffManageTableTotal,
                onChange : StaffManageTableOnChangePage
            }}
        />
    );
}

export default StaffManageRightTable;
