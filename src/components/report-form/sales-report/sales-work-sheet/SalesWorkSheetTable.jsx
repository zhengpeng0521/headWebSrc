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
        title : '姓名',
        key : 'userName',
        dataIndex : 'userName',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '跟进名单',
        key : 'followLeadsNum',
        dataIndex : 'followLeadsNum',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '新增名单',
        key : 'newLeadsNum',
        dataIndex : 'newLeadsNum',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '跟进记录',
        key : 'followRecordsNum',
        dataIndex : 'followRecordsNum',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '到访记录预约数',
        key : 'visitMaa',
        dataIndex : 'visitMaa',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '到访记录到访数',
        key : 'visitedNum',
        dataIndex : 'visitedNum',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '预约试听预约数',
        key : 'audition',
        dataIndex : 'audition',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '预约试听确认数',
        key : 'auditionAttend',
        dataIndex : 'auditionAttend',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '通话总量',
        key : 'callTotal',
        dataIndex : 'callTotal',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '通话接通量',
        key : 'callConn',
        dataIndex : 'callConn',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '通话时长',
        key : 'callTimeLengthStr',
        dataIndex : 'callTimeLengthStr',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }];


    sTable.columns = columns;

    lTable.columns = columns;

    return(
        <Media query="(max-width: 1800px)">
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
