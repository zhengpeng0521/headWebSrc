import React from 'react';
import { Button ,Table , Icon, Popconfirm, Popover } from 'antd';
import ClassInfoEndClassReason from './ClassInfoEndClassReason';
import ClassInfoWaitForCourse from './ClassInfoWaitForCourse';
import style from './ClassInfoTable.less';

function ClassInfo({
    classInfoDataSource,
    classInfoPageIndex,
    classInfoPageSize,
    classInfoPageIndexChange,
    classInfoPageSizeChange,

    endCourse,        //结束课程

    puaseCourse,      //暂停课程
    classEndReasonModalVisible,

    backPauseCourse,  //复原课程

    waitForCourse,    //分班
    classInfoCourseList,
    classInfoWaitForClassModal,
    waitForCourseSelectedRowKeys,

    chooseCourseTo,
    closeWaitForCourseModal,
    confirmWaitForClass,

    confirmSuspendCourse,
    cancelSuspendCourse,

    toJoinClass,            //报班
    classInfoLoading,
    classInfoLeft,
    classInfoTotal,

}){
    classInfoDataSource && classInfoDataSource.map(function( item, index ){
        item.key = index;
    })
    let columns = [
        {
            dataIndex : 'clsStatus',
            key       : 'clsStatus',
            title     : '',
            width     : '80px',
            render    : ( text , record ) => (
                <div className = { text && text == '0' ? style.waitingForClass : text == '1' ? style.studying : text == '2' ? style.classSuspend : text == '3' ? style.classEnd : null }>
                    <div>
                        { text && text == '0' ? '待分班' : text == '1' ? '在读' : text == '2' ? '停课' : text == '3' ? '结束' : null }
                    </div>
                    { text && text == '2' &&
                        <Popover content = { '停课原因 : ' + record.pauseReason } >
                            <div className = { style.classSuspendTip }>!</div>
                        </Popover>
                    }
                </div>
            )
        },{
            dataIndex : 'className',
            key       : 'className',
            title     : '班级名称',
            width     : '200px',
        },{
            dataIndex : 'courseName',
            key       : 'courseName',
            title     : '所属课程',
            width     : '200px',
        },{
            dataIndex : 'mainTeachers',
            key       : 'mainTeachers',
            title     : '主教',
            width     : '200px',
            render    : ( text, record ) => (
                <span style = {{ marginLeft : '-10px'}} >
                    { record && record.teacherList && record.teacherList.map(function(item, index){
                        return ( <span key = { 'classInfoTeach_1' + index } style = {{ marginLeft : item.prime == '1' ? '10px' : '0' }}>{ item.prime == '1' && item.uname }</span> )
                    })}
                </span>
            )
        },{
            dataIndex : 'assistantTeachers',
            key       : 'assistantTeachers',
            title     : '助教',
            width     : '200px',
            render    : ( text, record ) => (
                <span style = {{ marginLeft : '-10px'}} >
                    { record && record.teacherList && record.teacherList.map(function(item, index){
                        return ( <span key = { 'classInfoTeach_2' + index } style = {{ marginLeft : item.prime == '0' ? '10px' : '0' }}>{ item.prime == '0' && item.uname }</span> )
                    })}
                </span>
            )
        },{
            dataIndex : 'classProgress',
            key       : 'classProgress',
            title     : '班级进度',
            width     : '160px',
            render    : ( text, record ) => (
                <span>
                    { record.classCurProgress || '0' }
                        /
                    { record.classMaxProgress || '0' }
                </span>
            )
        },{
            dataIndex : 'lockClass',
            key       : 'lockClass',
            title     : '锁定课时',
            width     : '160px',
            render    : ( text, record ) => (
                <span>
                    { (record.cTotal - record.cCost) || '0' }
                        /
                    { record.cTotal || '0' }
                </span>
            )
        },{
            dataIndex : 'operation',
            key       : 'operation',
            title     : '操作',
            width     : '200px',
            render    : ( text , record ) => (
                <div>
                    {
                        record && ( record.clsStatus == '1' || record.clsStatus == '2' || record.clsStatus == '0' ) &&
                        <Popconfirm title = "确认要结束课程么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => endCourse( record.id ) } >
                            <a>结束</a>
                        </Popconfirm>
                    }
                    {
                        record && ( record.clsStatus == '1' ) &&
                        <a onClick = { () => puaseCourse( record.id ) } style = {{ marginLeft : '10px' }} >停课</a>
                    }
                    {
                         record && record.clsStatus == '0' &&
                         <a onClick = { () => waitForCourse( record.courseId, record.id ) } style = {{ marginLeft : '10px' }} >
                            分班
                        </a>
                    }
                    {
                        record && record.clsStatus == '2' &&
                         <a onClick = { () => backPauseCourse( record.id ) } style = {{ marginLeft : '10px' }} >
                            复原
                        </a>
                    }
                </div>
            )
        }
    ];

    let pagination = {
        total             : classInfoDataSource.length,
        showTotal         : total => `总共 ${total} 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : classInfoPageIndexChange,
        onShowSizeChange  : classInfoPageSizeChange,
        size              : 'large'
    };

    //停课
    let ClassInfoEndClassReasonProps = {
        classEndReasonModalVisible,
        confirmSuspendCourse,
        cancelSuspendCourse,
    };
    //分班
    let classInfoWaitForCourseProps = {
        classInfoCourseList,
        classInfoWaitForClassModal,
        waitForCourseSelectedRowKeys,

        chooseCourseTo,
        closeWaitForCourseModal,
        confirmWaitForClass,
    }


	return (
        <div className = 'yhwu_table_bg' >
            <div className = { style.yhwu_classInfo_text }>
                <div className = { style.courseCount }>课时 : { classInfoLeft + ' / ' + classInfoTotal }</div>
            </div>
            <div className = { style.yhwu_classInfo_btn }>
                <div onClick = { toJoinClass } className = { style.createClass }>报班</div>
            </div>
            <Table size = { 'middle' } columns = { columns } dataSource = { classInfoDataSource } pagination = { pagination } loading = { classInfoLoading } scroll = {{ x : 1600 }} bordered />
            <ClassInfoEndClassReason { ...ClassInfoEndClassReasonProps } />
            <ClassInfoWaitForCourse { ...classInfoWaitForCourseProps } />
        </div>
	)
};

export default ClassInfo;
