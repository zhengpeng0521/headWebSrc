import React from 'react';
import { Popover , Icon } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent'
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

/*排课列表*/
function HomeSchoolCommentTable({
    search,
    table,
    pagination,
    OpenDetailModal,            //打开详情modal
}){

    let columns = [{
        title : '课程名称',
        key : 'courseName',
        dataIndex : 'courseName',
        width : 140,
        render : (text,record) => (
            <Popover placement = "top" content = { text } trigger = "hover">
                <a onClick = {() => OpenDetailModal(record)}>{ text }</a>
            </Popover>
        )
    }, {
        title : '排课标题',
        key : 'title',
        dataIndex : 'title',
        width : 140,
        render : (text,record) => (
            <Popover placement = "top" content = { text } trigger = "hover">
                { text }
            </Popover>
        )
    }, {
        title : '上课时间',
        key : 'process',
        dataIndex : 'process',
        width : 180,
        render : (text,record) => (
            <Popover placement = "top" content = { record.studyDate + ' ' + record.startTime + '~' + record.endTime } trigger = "hover">
                { record.studyDate + ' ' +record.startTime + '~' +record.endTime }
            </Popover>
        )
    }, {
        title : '主教',
        key : 'mtNames',
        dataIndex : 'mtNames',
        width : 110,
        render : (text,record) => (
            <Popover placement = "top" content = { text } trigger = "hover">
                { text }
            </Popover>
        )
    }, {
        title : '学员总数',
        key : 'stuNum',
        dataIndex : 'stuNum',
        width : 110,
        render : (text,record) => (
            <Popover placement = "top" content = { text } trigger = "hover">
                { text }
            </Popover>
        )
    }, {
        title : '老师已点评',
        key : 'tcrCommNum',
        dataIndex : 'tcrCommNum',
        width : 140,
        render : (text,record) => (
            <Popover placement = "top" content = { text } trigger = "hover">
                { text }
            </Popover>
        )
    }, {
        title : '家长已评价',
        key : 'homeCommNum',
        dataIndex : 'homeCommNum',
        width : 140,
        render : (text,record) => (
            <Popover placement = "top" content = { text } trigger = "hover">
                { text }
            </Popover>
        )
    }, {
        title : '所属校区',
        key : 'orgName',
        dataIndex : 'orgName',
        render : (text,record) => (
            <Popover placement = "top" content = { text } trigger = "hover">
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
        />
    );
}

export default HomeSchoolCommentTable;
