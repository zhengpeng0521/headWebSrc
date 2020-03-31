import React from 'react';
import SendClassListComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Popover } from 'antd';

function SendClassList({
	sendClassDataSource,
	sendClassResultCount,
	sendClassPageIndex,
	sendClassPageSize,
	sendClassLoading,

	/*方法*/
	sendClassPageSizeChange,
	sendClassPageIndexChange

}){
	let SendClassListProps = {
		table : {
			isInDetail    : true,
            loading       : sendClassLoading,
            dataSource    : sendClassDataSource,
			height        : 334,
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
					dataIndex : 'cardId',
					key       : 'cardId',
					title     : '会员卡号',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'periodNum',
					key       : 'periodNum',
					title     : '课时数量',
					width     : 96
				},{
					dataIndex : 'extPeriodMoney',
					key       : 'extPeriodMoney',
					title     : '赠课成本',
					width     : 96
				},{
					dataIndex : 'extPeriodReason',
					key       : 'extPeriodReason',
					title     : '赠课原因',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'status',
					key       : 'status',
					title     : '状态',
					width     : 96,
					render    : ( text, record ) => (
						<StatusFlag type = { !!text && text == '0' ? 'gray' : text == '2' ? 'red' : '' } >
							{ !!text && text == '0' ? '待审核' : text == '1' ? '已通过' : '未通过' }
						</StatusFlag>
					)
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
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '创建时间',
					width     : 160
				},{
					dataIndex : 'orgName',
					key       : 'orgName',
					title     : '所属校区',
					render    : ( text, record ) =>  (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				}
            ],
         },
		pagination : {
			total            : sendClassResultCount,
			pageIndex        : sendClassPageIndex,
			pageSize         : sendClassPageSize,
			showTotal        : total => `总共 ${total} 条`,
//				showSizeChanger  : true,
			showQuickJumper  : true,
//				onShowSizeChange : sendClassPageSizeChange,
			onChange         : sendClassPageIndexChange
		}
	}

	return (
		<SendClassListComponent { ...SendClassListProps } />
	)
}

export default SendClassList;
