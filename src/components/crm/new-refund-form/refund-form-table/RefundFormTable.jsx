import React from 'react';
import { Popover , Icon } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent'
import ManagerList from '../../../common/new-component/manager-list/ManagerList';


function RefundFormTable({
    search,
    table,
    pagination,
    leftBars,
    rightBars,
}){

    function refundMonth(record){
        let month = undefined;
        let day = undefined;
        if(record.months != undefined && record.months != null && record.months != 0){
            month = record.months + '个月';
        }
        if(record.days != undefined && record.days != null && record.days != 0){
            day = record.days + '天';
        }

        let refundText = `${month || ''}${day || ''}`;

        return refundText;
    }

    let columns = [{
        title : '退款单编号',
        key : 'id',
        dataIndex : 'id',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '合同编号',
        key : 'orderNum',
        dataIndex : 'orderNum',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '退款类型',
        key : 'refundType',
        dataIndex : 'refundType',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text == '1' ? '退款：' +  record.money :
                                              text == '2' ? '退课时：' +  record.periodNum :
                                              text == '3' ? '退时长：' +  refundMonth(record) : ''} trigger="hover">
                { text == '1' ? '退款：' +  record.money :
                  text == '2' ? '退课时：' +  record.periodNum :
                  text == '3' ? '退时长：' +  refundMonth(record) : '' }
            </Popover>
        )
    }, {
        title : '审核说明',
        key : 'refundWay',
        dataIndex : 'refundWay',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '状态',
        key : 'status',
        dataIndex : 'status',
        width : 82,
        render : (text,record) => (
            <div>
                { text == '1' ? <StatusFlag type = 'blue'>待退款</StatusFlag> :
                  text == '2' ? <StatusFlag type = 'green'>已退款</StatusFlag> :
                  text == '3' ? <StatusFlag type = 'deep_red'>已驳回</StatusFlag> : ''
                }
            </div>
        )
    }, {
        title : '退款日期',
        key : 'createTime',
        dataIndex : 'createTime',
        width : 160,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '创建人',
        key : 'createName',
        dataIndex : 'createName',
        width : 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '退款备注',
        key : 'reason',
        dataIndex : 'reason',
        width : 112,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '所属校区',
        key : 'orgName',
        dataIndex : 'orgName',
        width : 120,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }];

    table.columns = columns;
    table.xScroll = 1100;

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

export default RefundFormTable;
