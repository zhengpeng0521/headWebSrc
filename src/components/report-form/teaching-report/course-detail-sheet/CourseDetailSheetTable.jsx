import React from 'react';
import Media from 'react-media';
import { Popover , Icon } from 'antd';
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

/*销售工作表*/
function SalesWorkSheetTable({
    sTable,                 //小屏下table
    lTable,                 //大屏下table
    pagination,
}){
    let columns = [{
        title : '会员卡号',
        key : 'cardId',
        dataIndex : 'cardId',
        width : 160,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '学员姓名',
        key : 'stuNames',
        dataIndex : 'stuNames',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '课时',
        key : 'periodAll',
        dataIndex : 'periodAll',
        width : 68,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '课时金额',
        key : 'periodMoney',
        dataIndex : 'periodMoney',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '均价',
        key : 'periodAvg',
        dataIndex : 'periodAvg',
        width : 68,
        render : (text,record) => (
            <Popover placement="top" content={ !isNaN(text + '') ? parseFloat(text).toFixed(2) : '' } trigger="hover">
                { !isNaN(text + '') ? parseFloat(text).toFixed(2) : '' }
            </Popover>
        )
    }, {
        title : '已消课时',
        key : 'periodExpend',
        dataIndex : 'periodExpend',
        width : 68,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '已消课时金额',
        key : 'periodExpendMoney',
        dataIndex : 'periodExpendMoney',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '赠课',
        key : 'periodExt',
        dataIndex : 'periodExt',
        width : 68,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '退课',
        key : 'periodRefund',
        dataIndex : 'periodRefund',
        width : 68,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '剩余课时',
        key : 'periodLeft',
        dataIndex : 'periodLeft',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '剩余金额',
        key : 'periodLeftMoney',
        dataIndex : 'periodLeftMoney',
        width : 96,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '此段时间消课',
        key : 'inPeriodCost',
        dataIndex : 'inPeriodCost',
        width : 160,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '此段时间消费金额',
        key : 'inPeriodMoney',
        dataIndex : 'inPeriodMoney',
        width : 160,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }];


    sTable.columns = columns;

    lTable.columns = columns;

    return(
        <Media query="(max-width: 1350px)">
            { matches => matches ?
                (<ManagerList
                    table = { sTable }
                    pagination = { pagination }
                    />)
                :
                (<ManagerList
                    table = { lTable }
                    pagination = { pagination }
                    />)
            }
        </Media>
    );
}

export default SalesWorkSheetTable;
