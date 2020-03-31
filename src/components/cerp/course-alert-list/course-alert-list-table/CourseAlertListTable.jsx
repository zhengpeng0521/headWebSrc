import React from 'react';
import { Popover , Icon } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent';
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

/*续费提醒列表*/
function CourseAlertListTable({
    search,
    table,
    pagination,
    leftBars,
    rightBars,
}){

    let columns = [{
        title : '会员卡号',
        key : 'cardId',
        dataIndex : 'cardId',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '适用学员',
        key : 'stuName',
        dataIndex : 'stuName',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '总课时(赠送)',
        key : 'periodAll',
        dataIndex : 'periodAll',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={ text + `（${record.periodExt}）` } trigger="hover">
                { text + `（${record.periodExt}）` }
            </Popover>
        )
    }, {
        title : '剩余课时',
        key : 'periodLeft',
        dataIndex : 'periodLeft',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '可用课时',
        key : 'periodAvailable',
        dataIndex : 'periodAvailable',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '已预约课时',
        key : 'periodFreeze',
        dataIndex : 'periodFreeze',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="click">
                { text }
            </Popover>
        )
    }, {
        title : '已消耗课时',
        key : 'periodExpend',
        dataIndex : 'periodExpend',
        width : 120,
        render : (text,record) => (
            <div>
                { text }
            </div>
        )
    }, {
        title : '余额',
        key : 'balance',
        dataIndex : 'balance',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '创建时间',
        key : 'createTime',
        dataIndex : 'createTime',
        width : 140,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '所属校区',
        key : 'orgName',
        dataIndex : 'orgName',
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }];

    table.columns = columns;
    table.xScroll = 1400;

    return(
        <ManagerList
            search = { search }
            table = { table }
            pagination = { pagination }
            leftBars = { leftBars }
            rightBars = { rightBars }
            />
    );
}

export default CourseAlertListTable;
