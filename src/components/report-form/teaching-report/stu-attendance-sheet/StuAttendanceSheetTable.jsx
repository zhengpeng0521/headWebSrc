import React from 'react';
import Media from 'react-media';
import { Popover , Icon } from 'antd';
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

/*学员考勤表*/
function StuAttendanceSheetTable({
    tabKey,
    sTable,                 //小屏下table
    lTable,                 //大屏下table
    pagination,
}){
    let columns = tabKey == 'Plan' ?
    [
        {
            title : '课程名称' ,
            key :'courseName',
            dataIndex : 'courseName',
            width : 100,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },
        {
            title : '课程标题' ,
            key :'title',
            dataIndex : 'title',
            width : 100,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },
        {
            title : '上课主题' ,
            key :'courseTheme',
            dataIndex : 'courseTheme',
            width : 100,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text || '--'}
                </Popover>
            )
        },
        {
            title : '日期' ,
            key :'studyDate',
            dataIndex : 'studyDate',
            width : 100,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },
        {
            title : '时间段' ,
            key :'studyTime',
            dataIndex : 'studyTime',
            width : 100,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },
        {
            title : '教室' ,
            key :'room',
            dataIndex : 'room',
            width : 100,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },
         {
            title : '班级' ,
            key :'classes',
            dataIndex : 'classes',
            width : 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },
        {
            title : '主教' ,
            key :'mtName',
            dataIndex : 'mtName',
            width : 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },
        {
            title : '助教' ,
            key :'atName',
            dataIndex : 'atName',
            width : 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },
        {
            title : '消耗课时' ,
            key :'cost',
            dataIndex : 'cost',
            width : 80,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                    { text || '0' }
                </Popover>
            )
        },
        {
            title : '预约上课会员' ,
            key :'attend',
            dataIndex : 'attend',
            width : 150,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                    { text || '0' }
                </Popover>
            )
        },
        {
            title : '实际上课会员' ,
            key :'realAttend',
            dataIndex : 'realAttend',
            width : 150,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                    { text || '0' }
                </Popover>
            )
        },
        {
            title : '预约补课会员' ,
            key :'makeUp',
            dataIndex : 'makeUp',
            width : 150,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                    { text || '0' }
                </Popover>
            )
        },
         {
            title : '实际补课会员' ,
            key :'realMakeUp',
            dataIndex : 'realMakeUp',
            width : 150,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                    { text || '0' }
                </Popover>
            )
        },
        {
            title : '预约试听' ,
            key :'audition',
            dataIndex : 'audition',
            width : 80,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                    { text || '0' }
                </Popover>
            )
        },
        {
            title : '实际试听' ,
            key :'realAudition',
            dataIndex : 'realAudition',
            width : 80,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                    { text || '0' }
                </Popover>
            )
        },
        {
            title : '请假',
            key : 'vacate',
            dataIndex : 'vacate',
            width : 80,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                     { text || '0' }
                </Popover>
            )
        }, {
            title : '旷课',
            key :'truant' ,
            dataIndex : 'truant',
            width : 80,
            render : (text,record) => (
                <Popover placement="top" content={text || '0'} trigger="hover">
                     { text || '0' }
                </Popover>
            )
        }
    ]
    :
    [{
        title : tabKey == 'Course' ? '课程名称' : tabKey == 'Mteacher' ? '主教名称' : tabKey == 'Ateacher' ? '助教名称' : '未知',
        key : tabKey == 'Course' ? 'courseName' : 'userName',
        dataIndex : tabKey == 'Course' ? 'courseName' : 'userName',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '预约报读',
        key : tabKey == 'Course' ? 'studyMaa' : tabKey == 'Mteacher' ? 'mstudyMaa' : tabKey == 'Ateacher' ? 'astudyMaa' : 'maa',
        dataIndex : tabKey == 'Course' ? 'studyMaa' : tabKey == 'Mteacher' ? 'mstudyMaa' : tabKey == 'Ateacher' ? 'astudyMaa' : 'maa',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '出勤',
        key : tabKey == 'Course' ? 'studyAttend' : tabKey == 'Mteacher' ? 'mstudyAttend' : tabKey == 'Ateacher' ? 'astudyAttend' : 'attend',
        dataIndex : tabKey == 'Course' ? 'studyAttend' : tabKey == 'Mteacher' ? 'mstudyAttend' : tabKey == 'Ateacher' ? 'astudyAttend' : 'attend',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '请假',
        key : tabKey == 'Course' ? 'studyLeave' : tabKey == 'Mteacher' ? 'mstudyLeave' : tabKey == 'Ateacher' ? 'astudyLeave' : 'leave',
        dataIndex : tabKey == 'Course' ? 'studyLeave' : tabKey == 'Mteacher' ? 'mstudyLeave' : tabKey == 'Ateacher' ? 'astudyLeave' : 'leave',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '旷课',
        key : tabKey == 'Course' ? 'studyAbsent' : tabKey == 'Mteacher' ? 'mstudyAbsent' : tabKey == 'Ateacher' ? 'astudyAbsent' : 'absent',
        dataIndex : tabKey == 'Course' ? 'studyAbsent' : tabKey == 'Mteacher' ? 'mstudyAbsent' : tabKey == 'Ateacher' ? 'astudyAbsent' : 'absent',
        width : 150,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '出勤率',
        key : 'rate',
        dataIndex : 'rate',
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

export default StuAttendanceSheetTable;
