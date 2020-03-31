import React from 'react';
import Media from 'react-media';
import { Table , Popover } from 'antd';
import { NullData , ProgressBar } from '../../../common/new-component/NewComponent';
import styles from './TeacherTeaching.less';

//统计报表 老师授课
function TeacherTeachingTable({
    pageIndex,                      //页码
    pageSize,                       //默认永远是20
    tableLoading,                   //table是否在加载状态
    listTopAllContent ,             //table列表上方所有数据
    listBottomTeacherContent,       //table列表下方老师所有数据
    listBottomTeacherCount,         //下方table总数据
    tableOnChange,                  //table分页改变
    tableOnOpenDetail,              //打开授课详情
}) {

    const columnAll = [{
        width:120,
        title:'统计类型',
        dataIndex:'all',
        key:'all'
    }, {
        title: '授课节数',
        width: 320,
        key: 'allshoukejieshu',
        children: [{
            title: '上课',
            dataIndex: 'tAttend',
            key: 'tAttend',
            width: 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },{
            title: '补课',
            dataIndex: 'tMakeup',
            key: 'tMakeup',
            width: 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },{
            title: '试听',
            dataIndex: 'tAudition',
            key: 'tAudition',
            width: 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },{
            title: '合计',
            dataIndex: 'tTotal',
            key: 'tTotal',
            width: 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        }]
    }, {
        title: '教学人次',
        width: 320,
        key: 'alljiaoxuerenci',
		children: [{
            title: '上课',
            dataIndex: 'sAttend',
            key: 'sAttend',
            width: 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },{
            title: '补课',
            dataIndex: 'sMakeup',
            key: 'sMakeup',
            width: 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },{
            title: '试听',
            dataIndex: 'sAudition',
            key: 'sAudition',
            width: 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        },{
            title: '合计',
            dataIndex: 'sTotal',
            key: 'sTotal',
            width: 80,
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        }]
    }];

    const columnDetail = [{
            width: 120,
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: (text,record) => (
                <a onClick={() => tableOnOpenDetail(record)}>{text}</a>
            )
        }, {
            title: '授课节数',
            width: 320,
            key: 'shoukejieshu',
			children: [{
                title: '上课',
                dataIndex: 'tAttend',
                key: 'tAttend',
                width: 80,
                render : (text,record) => (
                <Popover placement="top" content={text + '(' + record.atsAttend + ')' } trigger="hover">
                    { text + '(' + record.attAttend + ')' }
                </Popover>
            )
            },{
                title: '补课',
                dataIndex: 'tMakeup',
                key: 'tMakeup',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={ text + '(' + record.atsMakeup + ')' } trigger="hover">
                        { text + '(' + record.attMakeup + ')' }
                    </Popover>
                )
            },{
                title: '试听',
                dataIndex: 'tAudition',
                key: 'tAudition',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={ text + '(' + record.atsAudition + ')' } trigger="hover">
                        { text + '(' + record.attAudition + ')' }
                    </Popover>
                )
            },{
                title: '合计',
                dataIndex: 'tTotal',
                key: 'tTotal',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={ text + '(' + record.atsTotal + ')' } trigger="hover">
                        { text + '(' + record.attTotal + ')' }
                    </Popover>
                )
            }]
        }, {
            title: '教学人次',
            width: 320,
            key: 'jiaoxuerenci',
			children: [{
                title: '上课',
                dataIndex: 'sAttend',
                key: 'sAttend',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={ text + '(' + record.attAttend + ')' } trigger="hover">
                        { text + '(' + record.atsAttend + ')' }
                    </Popover>
                )
            },{
                title: '补课',
                dataIndex: 'sMakeup',
                key: 'sMakeup',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={ text + '(' + record.attMakeup + ')' } trigger="hover">
                        { text + '(' + record.atsMakeup + ')' }
                    </Popover>
                )
            },{
                title: '试听',
                dataIndex: 'sAudition',
                key: 'sAudition',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={ text + '(' + record.attAudition + ')' } trigger="hover">
                        { text + '(' + record.atsAudition + ')' }
                    </Popover>
                )
            },{
                title: '合计',
                dataIndex: 'sTotal',
                key: 'sTotal',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={ text + '(' + record.attTotal + ')' } trigger="hover">
                        { text + '(' + record.atsTotal + ')' }
                    </Popover>
                )
            }]
        }];

    let paginationProps = {
        total : listBottomTeacherCount,
        current : !isNaN(pageIndex) ? (pageIndex + 1) : 1,
        pageSize : pageSize,
        showQuickJumper : true,
        showTotal(){
            return '总共'+this.total+'条数据';
        }
    }

    return(
        <Media query="(max-width: 1350px)">
            { matches => matches ?
                <div className = {styles.allTable_s}>
                    <div className = 'zj_teacher_teaching_common' style = {{ padding : '0 20px' }}>
                        <Table
                            columns = { columnAll }
                            dataSource = { !!tableLoading ? [] : listTopAllContent }
                            pagination = { false }
                            bordered
                            rowKey = "all"
                            locale = {{ emptyText : !!tableLoading ? <ProgressBar content = '统计中' height = '100px'/> : <NullData content = '暂时没有数据' height = { 100 }/> }}
                            scroll={{ x : 1000 }} />
                    </div>
                    <div className = {styles.textTable}>注：括号内是老师以助教身份授课情况</div>
                    <div className = 'zj_teacher_teaching_common zj_teacher_teaching_table' style = {{ padding : 20 }}>
                        <Table
                            columns = { columnDetail }
                            dataSource = { !!tableLoading ? [] : listBottomTeacherContent }
                            pagination = { paginationProps }
                            onChange = { tableOnChange }
                            bordered
                            rowKey = "uid"
                            locale = {{ emptyText : !!tableLoading ? <ProgressBar content = '统计中' height = '300px'/> : <NullData content = '暂时没有数据' height = { 300 }/> }}
                            scroll = {{ x : 1000 }} />
                    </div>
                </div>
                :
                <div className = {styles.allTable_l}>
                    <div className = 'zj_teacher_teaching_common' style = {{ padding : '0 20px' }}>
                        <Table
                            columns = { columnAll }
                            dataSource = { !!tableLoading ? [] : listTopAllContent }
                            pagination = { false }
                            bordered
                            rowKey = "all"
                            locale = {{ emptyText : !!tableLoading ? <ProgressBar content = '统计中' height = '100px'/> : <NullData content = '暂时没有数据' height = { 100 }/> }}
                            scroll = {{ x : 1000 }} />
                    </div>
                    <div className = {styles.textTable}>注：括号内是老师以助教身份授课情况</div>
                    <div className = 'zj_teacher_teaching_common zj_teacher_teaching_table' style = {{ padding : 20 }}>
                        <Table
                            columns = { columnDetail }
                            dataSource = { !!tableLoading ? [] : listBottomTeacherContent }
                            pagination = { paginationProps }
                            onChange = { tableOnChange }
                            bordered
                            rowKey="uid"
                            locale = {{ emptyText : !!tableLoading ? <ProgressBar content = '统计中' height = '300px'/> : <NullData content = '暂时没有数据' height = { 300 }/> }}
                            scroll = {{ x : 1000 }} />
                    </div>
                </div>
            }
        </Media>
    );
}

export default TeacherTeachingTable;
