import React from 'react';
import TryStudentComponent from '../../../common/new-component/manager-list/ManagerList';
import { Icon, Popover, Checkbox, Popconfirm } from 'antd';

function TryStudent({
	tryStuDataSource,
	tryStuLoading,

	cancelTryOrderClass

}){
	let tryStudentProps = {
		table : {
			isInDetail    : true,
			height        : 363,
            loading       : tryStuLoading,
            dataSource    : tryStuDataSource,
			xScroll       : 1132,
            columns : [
                {
					dataIndex : 'operation',
					key       : 'operation',
					title     : '操作',
					render    : ( text, record ) => (
						<span>
							{ !!record && record.sign_type == '1' &&
								<Popconfirm title = "确认取消么?" onConfirm = { () => cancelTryOrderClass( record.audition_id ) } okText = "确定" cancelText = "取消">
									<a>取消</a>
								</Popconfirm>
							}
						</span>
					)
				},{
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
					width     : 82
				},{
					dataIndex : 'birthday',
					key       : 'birthday',
					title     : '出生日期',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'mobile',
					key       : 'mobile',
					title     : '联系方式',
					width     : 112,
				},{
					dataIndex : 'monthAge',
					key       : 'monthAge',
					title     : '月龄',
					width     : 82,
				},{
					dataIndex : 'yearAge',
					key       : 'yearAge',
					title     : '年龄',
					width     : 82,
				},{
					dataIndex : 'sellerName',
					key       : 'sellerName',
					title     : '负责销售',
					width     : 96,
				},{
					dataIndex : 'counselorName',
					key       : 'counselorName',
					title     : '负责顾问',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'periodLeft',
					key       : 'periodLeft',
					title     : '剩余课时',
					width     : 82,
					render    : ( text, record ) => (
						<span>{ text || '--' }</span>
					)
				},{
					dataIndex : 'sex',
					key       : 'sex',
					title     : '性别',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ text == '1' ? '男' : text == '2' ? '女' : '' }</span>
					)
				},{
					dataIndex : 'sign_type',
					key       : 'sign_type',
					title     : '状态',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '0' ? '已取消' : text == '1' ? '已预约' : text == '2' ? '已试听' : text == '3' ? '旷课' : '' }
						</span>
					)
				}
            ],
            emptyText : '暂时没有数据',
         }
	}

	return (
		<TryStudentComponent { ...tryStudentProps } />
	)
}

export default TryStudent;
