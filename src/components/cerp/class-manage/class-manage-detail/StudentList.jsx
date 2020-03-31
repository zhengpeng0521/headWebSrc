import React from 'react';
import StudentListComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Icon, Popover, Popconfirm } from 'antd';

function StudentList({
	studentDataSource,
	studentResultCount,
	studentPageSize,
	studentPageIndex,
	studentLoading,

	studentNoClassNum,

	/*方法*/
	studentPageIndexChange,

	getClassNum,                   //得到学员未上课程节数
	removeStudent,                 //移除学员

}){

	let ToolTip = ( name ) => {
		if( studentNoClassNum == 0 ){
			return ( <span>确认移除学员?</span> )
		}else{
			return (
				<div>
					<span>{ '【' + name + '】' }在该班级里还有</span>
					<span style = {{ color : 'red' }} >{ studentNoClassNum }</span>
					<span>节未上的预约课程, </span>
					<span style = {{ display : 'block', marginTop : '2px' }} >如果移除将会自动取消这些预约课程</span>
				</div>
			)
		}
	}

	let StudentListComponentProps = {
		table : {
			isInDetail    : true,
            loading       : studentLoading,
            dataSource    : studentDataSource,
			height        : 384,
            columns : [
                {
					dataIndex : 'name',
					key       : 'name',
					title     : '学员姓名',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'nickname',
					key       : 'nickname',
					title     : '昵称',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'sex',
					key       : 'sex',
					title     : '性别',
					width     : 96,
					render    : (text,record) => (
                        <div>
                            { text == 1 ? <Icon type = "boy" style = {{ color:'#5d9cec' }} /> :
							text == 2 ? <Icon type = "girl" style = {{ color:'#ff7f75' }} /> : '' }
                        </div>
                    )
				},{
					dataIndex : 'birthday',
					key       : 'birthday',
					title     : '生日',
					width     : 112,
				},{
					dataIndex : 'sellerName',
					key       : 'sellerName',
					title     : '负责销售',
					width     : 96,
				},{
					dataIndex : 'counselorName',
					key       : 'counselorName',
					title     : '负责老师',
					width     : 160,
				},{
					dataIndex : 'operation',
					key       : 'operation',
					title     : '操作',
					render    : ( text, record ) => (
						<Popconfirm
							title = { ToolTip( record.name ) }
							onConfirm = { () => removeStudent( record.stuId ) }
							okText = '确认移除' cancelText = '取消'
						>
							<a onClick = { () => getClassNum( record.stuId ) }>移除</a>
						</Popconfirm>
					)
				}
            ],
         },
		pagination : {
			total            : studentResultCount,
			pageIndex        : studentPageIndex,
			pageSize         : studentPageSize,
			showTotal        : total => `总共 ${total} 条`,
			showQuickJumper  : true,
			onChange         : studentPageIndexChange
		}
	}

	return (
		<StudentListComponent { ...StudentListComponentProps } />
	)
}

export default StudentList;
