import React from 'react';
import ClassChangeListComponent from '../../../common/new-component/manager-list/ManagerList';
import { Popover } from 'antd';

function SendClassList({
	classChangeDataSource,
	classChangeResultCount,
	classChangePageSize,
	classChangePageIndex,
	classChangeLoading,

	/*方法*/
	classChangePageSizeChange,
	classChangePageIndexChange

}){
	let ClassChangeListProps = {
		table : {
			isInDetail    : true,
            loading       : classChangeLoading,
            dataSource    : classChangeDataSource,
			height        : 296,
            columns : [
                {
					dataIndex : 'periodChange',
					key       : 'periodChange',
					title     : '课时变动',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'orderNum',
					key       : 'orderNum',
					title     : '关联合同',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'tradeType',
					key       : 'tradeType',
					title     : '交易类型',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'tradeDesc',
					key       : 'tradeDesc',
					title     : '变动描述',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '创建时间',
					width     : 160,
				},{
					dataIndex : 'orgName',
					key       : 'orgName',
					title     : '所属校区',
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				}
            ],
         },
		pagination : {
			total            : classChangeResultCount,
			pageIndex        : classChangePageIndex,
			pageSize         : classChangePageSize,
			showTotal        : total => `总共 ${total} 条`,
//			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : classChangePageSizeChange,
			onChange         : classChangePageIndexChange
		}
	}

	return (
		<ClassChangeListComponent { ...ClassChangeListProps } />
	)
}

export default SendClassList;
