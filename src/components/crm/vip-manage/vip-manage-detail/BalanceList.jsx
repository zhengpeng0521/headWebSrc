import React from 'react';
import BalanceListComponent from '../../../common/new-component/manager-list/ManagerList';
import { Popover } from 'antd';

function BalanceList({
	balanceDataSource,
	balanceResultCount,
	balancePageIndex,
	balancePageSize,
	balanceLoading,

	/*方法*/
	balancePageSizeChange,
	balancePageIndexChange

}){
	let BalanceListProps = {
		table : {
			isInDetail    : true,
            loading       : balanceLoading,
            dataSource    : balanceDataSource,
			height        : 296,
            columns : [
                {
					dataIndex : 'id',
					key       : 'id',
					title     : '余额变动',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { !!record.tradeType && ( record.tradeType == '1' || record.tradeType == '3' ) ? '+' + record.debit : '-' + record.credit } trigger = 'hover' >
							{ !!record.tradeType && ( record.tradeType == '1' || record.tradeType == '3' ) ? '+' + record.debit : '-' + record.credit }
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
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '1' ? '充值'
							            : text == '2' ? '课时购买'
							            : text == '3' ? '退课时'
										: text == '4' ? '退费' : ''
							}
						</span>
					)
				},{
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '添加时间',
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
			total            : balanceResultCount,
			pageIndex        : balancePageIndex,
			pageSize         : balancePageSize,
			showTotal        : total => `总共 ${total} 条`,
//			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : balancePageSizeChange,
			onChange         : balancePageIndexChange
		}
	}

	return (
		<BalanceListComponent { ...BalanceListProps } />
	)
}

export default BalanceList;
