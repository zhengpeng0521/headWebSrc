import React from 'react';
import { Popover , Icon } from 'antd';
import { StatusFlag } from '../../../../common/new-component/NewComponent'
import ManagerList from '../../../../common/new-component/manager-list/ManagerList';

/*订金管理*/
function DepositManageTable({
    paymentMethod,              //收款方式
    search,
    table,
    pagination,
    leftBars,
    rightBars,
}){

    let columns = [{
        title : '订金编号',
        key : 'id',
        dataIndex : 'id',
        width : 112,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '状态',
        key : 'status',
        dataIndex : 'status',
        width : 96,
        render : (text,record) => (
            <div>
                { text == '0' ? <StatusFlag type = 'gray'>无效</StatusFlag> :
                  text == '1' ? <StatusFlag type = 'blue'>待确认</StatusFlag> :
                  text == '2' ? <StatusFlag type = 'green'>已确认</StatusFlag> :
                  text == '3' ? <StatusFlag type = 'deep_red'>已退款</StatusFlag> : ''
                }
            </div>
        )
    }, {
        title : '合同编号',
        key : 'orderNum',
        dataIndex : 'orderNum',
        width : 112,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '所属学员',
        key : 'stuName',
        dataIndex : 'stuName',
        width : 140,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '订金金额',
        key : 'money',
        dataIndex : 'money',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '收款方式',
        key : 'paId',
        dataIndex : 'paId',
        width : 96,
        render : (text,record) => {
            let name;
            for(let i in paymentMethod){
                if(paymentMethod[i].key == text){
                    name = paymentMethod[i].label;
                }
            }
            return(
                <Popover placement="top" content={name} trigger="hover">
                    { name }
                </Popover>
            )
        }
    }, {
        title : '收款账号',
        key : 'paAcct',
        dataIndex : 'paAcct',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '对应流水号',
        key : 'realSerialNumber',
        dataIndex : 'realSerialNumber',
        width : 112,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '实际到账',
        key : 'realMoney',
        dataIndex : 'realMoney',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '备注',
        key : 'remarks',
        dataIndex : 'remarks',
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '收款日期',
        key : 'createTime',
        dataIndex : 'createTime',
        width : 160,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '收款人',
        key : 'receiverName',
        dataIndex : 'receiverName',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '所属校区',
        key : 'orgName',
        dataIndex : 'orgName',
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }];

    table.columns = columns;
    table.xScroll = 1600;

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

export default DepositManageTable;
