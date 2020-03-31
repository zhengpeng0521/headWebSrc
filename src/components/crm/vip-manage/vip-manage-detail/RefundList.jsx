import React from 'react';
import RefundListComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Popover } from 'antd';

function RefundList({
	refundDataSource,
	refundResultCount,
	refundPageSize,
	refundPageIndex,
	refundLoading,

	/*方法*/
	refundPageSizeChange,
	refundPageIndexChange

}){
	let RefundListProps = {
		table : {
			isInDetail    : true,
            loading       : refundLoading,
            dataSource    : refundDataSource,
			height        : 296,
            columns : [
                {
					dataIndex : 'id',
					key       : 'id',
					title     : '退款单号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'orderNum',
					key       : 'orderNum',
					title     : '合同号',
					width     : 82,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'refundType',
					key       : 'refundType',
					title     : '退款类型',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ text == '1' ? '退款 : ' + ( record.money || 0 ) : '退课时 : ' + ( record.periodNum || 0 ) }
						</span>
					)
				},{
					dataIndex : 'refundWay',
					key       : 'refundWay',
					title     : '退款说明',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'status',
					key       : 'status',
					title     : '退款状态',
					width     : 96,
					render    : ( text, record ) => (
						<StatusFlag type = { !!text && text == '1' ? 'red' : text == '3' ? 'deep_red' : '' } >
							{ !!text && text == '1' ? '未退款' : text == '3' ? '未通过' : text == '2' ? '已审核' : '' }
						</StatusFlag>
					)
				},{
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '退款日期',
					width     : 160,
				},{
					dataIndex : 'creatorName',
					key       : 'creatorName',
					title     : '创建人',
					width     : 82,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
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
			total            : refundResultCount,
			pageIndex        : refundPageIndex,
			pageSize         : refundPageSize,
			showTotal        : total => `总共 ${total} 条`,
			showQuickJumper  : true,
			onShowSizeChange : refundPageSizeChange,
			onChange         : refundPageIndexChange
		}
	}

	return (
		<RefundListComponent { ...RefundListProps } />
	)
}

export default RefundList;
