import React from 'react';
import { Popover , Icon } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent'
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

/*工资设置列表*/
function SalarySetTable({
    SetSalary,              //点击姓名进入工资设置详情modal
    search,
    table,
    pagination,
    leftBars
}){

    let columns = [{
        title : '姓名',
        key : 'userName',
        dataIndex : 'userName',
        width : 200,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                <a onClick = {() => SetSalary({ orgId : record.orgId , userId : record.userId })}>{ text }</a>
            </Popover>
        )
    }, {
        title : '角色',
        key : 'roleNames',
        dataIndex : 'roleNames',
        width : 200,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '所属机构',
        key : 'orgName',
        dataIndex : 'orgName',
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '基本工资',
        key : 'baseSalary',
        dataIndex : 'baseSalary',
        width : 200,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '补贴',
        key : 'subsidy',
        dataIndex : 'subsidy',
        width : 200,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }];

    table.columns = columns;
    table.xScroll = 1200;

    return(
        <ManagerList
            search = { search }
            table = { table }
            pagination = { pagination }
            leftBars = { leftBars }
            />
    );
}

export default SalarySetTable;
