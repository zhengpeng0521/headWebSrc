import React from 'react';
import AttendClassListComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Icon, Popover, Popconfirm } from 'antd';

function AttendClassList({
	attendClassDataSource,
	attendClassResultCount,
	attendClassPageSize,
	attendClassPageIndex,
	attendClassLoading,

	/*方法*/
	attendClassPageIndexChange,

	deleteClassRecord,         //删除班级
	editClassInfo,             //修改信息
	checkAppointClassStuNum,   //查看班级成员约课情况


}){

	let ToolTip = ( num ) => {
		if( num == 0 ){
			return ( <span>确认删除日程?</span> )
		}else{
			return (
				<div>
					<span>{ '班级里还有' + num + '名学员预约了这次上课日程' }</span>
					<span style = {{ display : 'block', marginTop : '2px' }} >删除日程会自动取消这些学员的预约</span>
				</div>
			)
		}
	}

	let AttendClassListComponentProps = {
		table : {
			isWidth       : true,
            loading       : attendClassLoading,
            dataSource    : attendClassDataSource,
			height        : 352,
            columns : [
                {
					dataIndex : 'seqNo',
					key       : 'seqNo',
					title     : '序号',
					width     : 68,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'cpTitle',
					key       : 'cpTitle',
					title     : '标题',
					width     : 68,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'studyDate',
					key       : 'studyDate',
					title     : '上课时间',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { ( !!record.studyDate && !!record.endTime && !!record.startTime && record.studyDate + ' ' + record.startTime + '~' + record.endTime ) || '--' } trigger = 'hover' >
							{ ( !!record.studyDate && !!record.endTime && !!record.startTime && record.studyDate + ' ' + record.startTime + '~' + record.endTime ) || '--' }
						</Popover>
					)
				},{
					dataIndex : 'mtNames',
					key       : 'mtNames',
					title     : '主教',
					width     : 68,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'atNames',
					key       : 'atNames',
					title     : '助教',
					width     : 68,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'roomName',
					key       : 'roomName',
					title     : '教室',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'status',
					key       : 'status',
					title     : '状态',
					width     : 68,
				},{
					dataIndex : 'stuNum',
					key       : 'stuNum',
					title     : '已预约班级成员',
					width     : 112,
					render    : ( text, record ) => (
						<a onClick = { () => checkAppointClassStuNum( record ) }>{ text }</a>
					)
				},{
					dataIndex : 'checkRate',
					key       : 'checkRate',
					title     : '出勤率',
					width     : 68,
				},{
					dataIndex : 'operation',
					key       : 'operation',
					title     : '操作',
					width     : 140,
					render    : ( text, record ) => (
						<div>
							<a style = {{ marginRight : '10px' }} onClick = { () => editClassInfo( record ) } >修改信息</a>
							<Popconfirm
								title = { ToolTip( record.stuNum ) }
								onConfirm = { () => deleteClassRecord( record.orgId, record.cpmId, record.cpdId ) }
								okText = '确认删除' cancelText = '取消'
							>
								<a>删除日程</a>
							</Popconfirm>
						</div>
					)
				}
            ],
         },
		pagination : {
			total            : attendClassResultCount,
			pageIndex        : attendClassPageIndex,
			pageSize         : attendClassPageSize,
			showTotal        : total => `总共 ${total} 条`,
			showQuickJumper  : true,
			onChange         : attendClassPageIndexChange
		}
	}

	return (
		<AttendClassListComponent { ...AttendClassListComponentProps } />
	)
}

export default AttendClassList;
