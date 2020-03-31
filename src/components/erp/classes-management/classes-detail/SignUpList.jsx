import React from 'react';
import SignUpListComponent from '../../../common/new-component/manager-list/ManagerList';
import styles from './StudentList.less';
import { Icon, Popover } from 'antd';
import moment from 'moment';

function SignUpList({
	signUpDataSource,
	signUpResultCount,
	signUpPageIndex,
	signUpPageSize,
	signUpLoading,

	/*方法*/
	signUpPageIndexChange,
	modifyFunction

}){
	let SignUpListProps = {
		table : {
			isInDetail    : true,
            loading       : signUpLoading,
            dataSource    : signUpDataSource,
			height        : 312,
            columns : [
                {
					title     : '操作',
					key       : 'operation',
					dataIndex : 'operation',
					width     : 68,
					render    : (text, record) => {
                        let createTime = record.createTime;
                        let flg = false;
                        if( createTime && createTime!= '' ) {
                            flg = moment(createTime, 'YYYY-MM-DD').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD');
                        }
                        return (
							<a className = { styles.table_cell_href_item } disabled = { !flg } onClick = { () => modifyFunction( record.cpId ) }>修改</a>
						)}
				},{
					key       : 'signTime',
					dataIndex : 'signTime',
					title     : '签到时间',
					width     : 96
				},{
					key       : 'num1',
					dataIndex : 'num1',
					title     : '上课',
					width     : 68,
				},{
					key       : 'num2',
					dataIndex : 'num2',
					title     : '请假',
					width     : 68,
				},{
					key       : 'num3',
					dataIndex : 'num3',
					title     : '补课',
					width     : 68,
				},{
					key       : 'num4',
					dataIndex : 'num4',
					title     : '旷课',
					width     : 68,
				},{
					key       : 'content',
					dataIndex : 'content',
					title     : '上课内容',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					),
				},{
					key       : 'homework',
					dataIndex : 'homework',
					title     : '课后作业',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					),
				},{
					key       : 'remark',
					dataIndex : 'remark',
					title     : '备注',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					),
				}
            ],
            emptyText : '暂时没有数据',
         },
		pagination : {
			total            : signUpResultCount,
			pageIndex        : signUpPageIndex,
			pageSize         : signUpPageSize,
			showTotal        : total => `总共 ${total} 条`,
			showQuickJumper  : true,
			onChange         : signUpPageIndexChange
		}
	}

	return (
		<SignUpListComponent { ...SignUpListProps } />
	)
}

export default SignUpList;
