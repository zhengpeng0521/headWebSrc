import React from 'react';
import StudentListComponent from '../../../common/new-component/manager-list/ManagerList';
import styles from './StudentList.less';
import { Icon, Popover } from 'antd';

function StudentList({
	studentDataSource,
	studentResultCount,
	studentPageIndex,
	studentPageSize,
	studentLoading,

	/*方法*/
	studentPageIndexChange,
//	tableOnEditItemWork

}){
	let StudentListProps = {
		table : {
			isInDetail    : true,
            loading       : studentLoading,
            dataSource    : studentDataSource,
			height        : 312,
            columns : [
                {
					dataIndex : 'id',
					key       : 'id',
					width     : 96,
					title     : '学员信息',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { record.name + '/' + (record.sex == '1' ? '男' : record.sex == '2' ? '女' : '')  } trigger = 'hover' >
							<span>{ record.name } / { record.sex == '1' ? '男' : record.sex == '2' ? '女' : '' }</span>
						</Popover>
					),
				}, {
					dataIndex : 'age',
					key       : 'age',
					width     : 68,
					title     : '年龄',
					render    : ( text, record ) => (
						<div>
							<p>{( record.age != null && record.age != 'null' && record.age != undefined) ? `${record.age}岁` : '' }</p>
							<p>{( record.birthdayStr != null && record.birthdayStr != 'null' && record.birthdayStr != undefined) ? `${record.birthdayStr}` : '' }</p>
						</div>
					),
				}, {
					dataIndex : 'parentsInfo',
					key       : 'parentsInfo',
					width     : 112,
					title     : '家长信息',
					render    : (text, record) => (
						<div>
							<p>
								{(record.parentName != null && record.parentName != 'null' && record.parentName != undefined) ? record.parentName : ''}
								/
								{(record.parentRelation != null && record.parentRelation != 'null' && record.parentRelation != undefined) ? record.parentRelation : ''}
							</p>
							<p>{(record.mobile != null && record.mobile != 'null' && record.mobile != undefined) ? record.mobile : ''}</p>
						</div>
					),
				}, {
					dataIndex : 'numWorks',
					key       : 'numWorks',
					width     : 68,
					title     : '作品',
					render    : (text, record) => (
						<span>
							{ ( record.numWorks != "null" && record.numWorks ) ? record.numWorks : 0 }
						</span>
					),
				}, {
					dataIndex : 'about',
					key       : 'about',
					title     : '微信关注',
					render    : (text, record) => (
						<Icon type = "guanzhuweixin" className = { record.attention == '1' ? styles.yiguanzhu : styles.noguanzhu } />
					),
				}
            ],
            emptyText : '暂时没有数据',
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
		<StudentListComponent { ...StudentListProps } />
	)
}

export default StudentList;
