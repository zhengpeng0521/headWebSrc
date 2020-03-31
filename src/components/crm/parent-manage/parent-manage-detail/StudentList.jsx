import React from 'react';
import StudentListComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Icon, Popover, Popconfirm } from 'antd';

function StudentList({
	studentDataSource,
	studentLoading,

	cancelBindParent

}){
	let studentListComponentProps = {
		table : {
			isInDetail    : true,
			height        : 325,
            loading       : studentLoading,
            dataSource    : studentDataSource,
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
					dataIndex : 'sex',
					key       : 'sex',
					title     : '性别',
					width     : 68,
					render    : ( text, record ) => (
						<span>
							{ text == '1' ?
								<Icon type = 'boy' style = {{ color : '#5d9cec' }} />
								:
								<Icon type = 'girl' style = {{ color : '#ff7f75' }} />
							}
						</span>
					)
				},{
					dataIndex : 'birthday',
					key       : 'birthday',
					title     : '生日',
					width     : 112,
				},{
					dataIndex : 'month',
					key       : 'month',
					title     : '月龄',
					width     : 68,
					render    : ( text, record ) => (
						<span>{ text + ' 月' }</span>
					)
				},{
					dataIndex : 'relation',
					key       : 'relation',
					title     : '关系',
					width     : 68,
				},{
					dataIndex : 'operation',
					key       : 'operation',
					title     : '操作',
					render    : ( text, record ) => (
						<Popconfirm title = "确认解除关联么?" onConfirm = { () => cancelBindParent( record.stuId ) } okText = "确认" cancelText = "取消" >
							<a>解除关联</a>
						</Popconfirm>
					)
				}
            ],
         }
	}

	return (
		<StudentListComponent { ...studentListComponentProps } />
	)
}

export default StudentList;
