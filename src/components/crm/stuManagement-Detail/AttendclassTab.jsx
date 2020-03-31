import React from 'react';

import { Modal, Button, Rate, Popconfirm, Popover } from 'antd';
import moment from 'moment';
import style from './AttendclassTab.less';
import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';

function ReservedsessionTab ({

    AttendclassTabList,

    toJoinClass,            //报班
    classInfoLeft,
    classInfoTotal,
    AttendclassNum,
    AttendclassPageIndex,
    AttendclassPageSize,
    AttendclasspageSizeChange,
    AttendclasspageIndexChange,
    endCourse,//结束
    puaseCourse,//停课
    waitForCourse,//分班
    backPauseCourse,//复原

}) {

    AttendclassTabList && AttendclassTabList.map(function( item, index ){
        item.key = index;
    })

    let StumagegeComponentProps = {
        table : {
            //loading,
            dataSource : AttendclassTabList,
			height     : 401,
			isWidth    : true,
            columns:[
                {
                    dataIndex : 'clsStatus',
                    key       : 'clsStatus',
                    title     : '',
                    width     : 82,
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
                    width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'courseName',
                    key       : 'courseName',
                    title     : '所属课程',
                    width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'mainTeachers',
                    key       : 'mainTeachers',
                    title     : '主教',
                    width     : 112,
                    render    : ( text, record ) => (
						<Popover placement = 'top' content = { record && record.teacherList && record.teacherList.map(function(item, index){
									return ( <span key = { 'classInfoTeach_1' + index } style = {{ marginLeft : item.prime == '1' ? '10px' : '0' }}>{ item.prime == '1' && item.uname }</span> )
								}) } trigger = 'hover' >
							<span>
								{ record && record.teacherList && record.teacherList.map(function(item, index){
									return ( <span key = { 'classInfoTeach_1' + index } style = {{ marginLeft : (item.prime == '1' && index != 0) ? '10px' : '0' }}>{ item.prime == '1' && item.uname }</span> )
								})}
							</span>
						</Popover>
                    )
                },{
                    dataIndex : 'assistantTeachers',
                    key       : 'assistantTeachers',
                    title     : '助教',
                    width     : 112,
                    render    : ( text, record ) => (
						<Popover placement = 'top' content = { record && record.teacherList && record.teacherList.map(function(item, index){
									return ( <span key = { 'classInfoTeach_2' + index } style = {{ marginLeft : item.prime == '0' ? '10px' : '0' }}>{ item.prime == '0' && item.uname }</span> )
								}) } trigger = 'hover' >
							<span>
								{ record && record.teacherList && record.teacherList.map(function(item, index){
									return ( <span key = { 'classInfoTeach_2' + index } style = {{ marginLeft : (item.prime == '0' && index != 0) ? '10px' : '0' }}>{ item.prime == '0' && item.uname }</span> )
								})}
							</span>
						</Popover>
                    )
                },{
                    dataIndex : 'classProgress',
                    key       : 'classProgress',
                    title     : '班级进度',
                    width     : 96,
                    render    : ( text, record ) => (
						<p>
							{ record.courseType == '1' ?
								<span>无</span>
								: <span>
									{ record.classCurProgress || '0' }
										/
									{ record.classMaxProgress || '0' }
								</span>
							}
						</p>
                    )
                },{
                    dataIndex : 'lockClass',
                    key       : 'lockClass',
                    title     : '锁定课时',
                    width     : 96,
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

                        </div>
                    )
                 }
            ],
        },
        pagination : {
            total            : AttendclassNum,
            pageIndex        :  AttendclassPageIndex,
            pageSize         : AttendclassPageSize,
            showTotal        : total => `总共 ${total} 条`,
            showSizeChanger  : true,
            showQuickJumper  : true,
            onShowSizeChange : AttendclasspageSizeChange,
            onChange         : AttendclasspageIndexChange,
        }
    };

    return(

        <div className = 'vip_detail_content_item'  >
			<div className = { style.Attendclass } >
                <Button className = { style.coursebtn } type='primary' style={{ width : 80 ,marginLeft: 30 }} onClick = {() =>  toJoinClass('add')}>报班</Button>
                <div className = { style.courseCount }>课时 : { classInfoLeft + ' / ' + classInfoTotal }</div>
            </div>
            <ClassPackageComponent {...StumagegeComponentProps} />

        </div>

    );
}


export default ReservedsessionTab;



