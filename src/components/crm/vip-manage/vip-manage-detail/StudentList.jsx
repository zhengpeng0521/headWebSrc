import React from 'react';
import StudentListComponent from '../../../common/new-component/manager-list/ManagerList';
import { Icon, Popconfirm } from 'antd';

function StudentList({
	studentDataSource,
	studentLoading,

	/*方法*/
	removeStudent,

}){
	let StudentListProps = {
		table : {
            loading       : studentLoading,
            dataSource    : studentDataSource,
			isInDetail    : true,
			height        : 286,
            columns : [
                {
					dataIndex : 'name',
					key       : 'name',
					title     : '学员姓名',
					width     : 96,
				},{
					dataIndex : 'sex',
					key       : 'sex',
					title     : '性别',
					width     : 68,
					render    : ( text, record ) => (
						<div>
							{
								text == '男' ? <Icon type = "boy" style = {{ color : '#5d9cec' }} /> :
								text == '女' ? <Icon type = "girl" style = {{ color:'#ff7f75' }}/> : ''
							}
						</div>
					)
				},{
					dataIndex : 'birthday',
					key       : 'birthday',
					title     : '生日',
					width     : 102,
					render    : ( text, record ) => (
						<div>
							{ !!text && text.substr( 0, 10 ) }
						</div>
					)
				},{
					dataIndex : 'operation',
					key       : 'operation',
					title     : '操作',
					render    : ( text, record ) => (
						<Popconfirm title = "确认移除学员?" onConfirm = { () => removeStudent( record ) } okText = "确认" cancelText = "取消">
							<a>移除</a>
						</Popconfirm>
					)
				}
            ],
         },
	}

//	{
//		dataIndex : 'periodForward',
//		key       : 'periodForward',
//		title     : '已预约课时',
//		width     : 110,
//	},{
//		dataIndex : 'periodExpend',
//		key       : 'periodExpend',
//		title     : '已消耗课时',
//		width     : 110,
//	},
	return (
		<StudentListComponent { ...StudentListProps } />
	)
}

export default StudentList;
