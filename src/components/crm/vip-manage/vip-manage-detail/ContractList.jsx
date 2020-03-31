import React from 'react';
import ContractListComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Popover } from 'antd';

function ContractList({
	contractDataSource,
	contractLoading,
	contractResultCount,
	contractPageIndex,
	contractPageSize,

	/*方法*/
	contractPageSizeChange,
	contractPageIndexChange

}){
	let ContractListProps = {
		table : {
			isInDetail    : true,
            loading       : contractLoading,
            dataSource    : contractDataSource,
			height        : 296,
            columns : [
                {
					dataIndex : 'orderNum',
					key       : 'orderNum',
					title     : '合同编号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'stuOldNew',
					key       : 'stuOldNew',
					title     : '签约类型',
					width     : 96,
					render    : ( text, record ) => (
						<div>
							{ !!text && text == '0' ? '新签约' : text == '1' ? '续约' : '' }
						</div>
					)
				},{
					dataIndex : 'type',
					key       : 'type',
					title     : '购买类型',
					width     : 96,
					render    : ( text, record ) => (
						<div>
							{ !!text && text == '1' ? '充值合同' : text == '2' ? '课时包' : '' }
						</div>
					)
				},{
					dataIndex : 'stuCardId',
					key       : 'stuCardId',
					title     : '会员卡号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'parentName',
					key       : 'parentName',
					title     : '签约家长',
					width     : 96,
				},{
					dataIndex : 'email',
					key       : 'email',
					title     : '合同期限',
					width     : 124,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { !!record.startTime && !!record.endTime && record.startTime + '~' + record.endTime } trigger = 'hover' >
							{ !!record.startTime && !!record.endTime && record.startTime + '~' + record.endTime }
						</Popover>
					)
				},{
					dataIndex : 'oriMoney',
					key       : 'oriMoney',
					title     : '合同金额',
					width     : 96,
				},{
					dataIndex : 'status',
					key       : 'status',
					title     : '审核状态',
					width     : 96,
					render    : ( text, record ) => (
						<StatusFlag type = { !!text && text == '0' ? 'gray' : text == '1' ? 'red' : text == '3' ? 'deep_red' : '' } >
							{ !!text && text == '0' ? '无效' : text == '1' ? '未审核' : text == '3' ? '未通过' : '已审核' }
						</StatusFlag>
					)
				},{
					dataIndex : 'receiptStatus',
					key       : 'receiptStatus',
					title     : '收款状态',
					width     : 96,
					render    : ( text, record ) => (
						<StatusFlag type = { !!text && text == '0' ? 'red' : '' } >
							{ !!text && text == '0' ? '未收款' : '已收款' }
						</StatusFlag>
					)
				}
            ],
         },
		 pagination : {
			 total            : contractResultCount,
			 pageIndex        : contractPageIndex,
			 pageSize         : contractPageSize,
			 showTotal        : total => `总共 ${total} 条`,
//			 showSizeChanger  : true,
			 showQuickJumper  : true,
//			 onShowSizeChange : contractPageSizeChange,
			 onChange         : contractPageIndexChange
		 }
	}

	return (
		<ContractListComponent { ...ContractListProps } />
	)
}

export default ContractList;
