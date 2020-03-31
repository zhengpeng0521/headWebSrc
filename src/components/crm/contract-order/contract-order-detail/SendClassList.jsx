import React from 'react';
import SendClassListComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Icon, Popover } from 'antd';

function SendClassList({
	sendClassDataSource,
	sendClassResultCount,
	sendClassPageSize,
	sendClassPageIndex,
	sendClassLoading,

	/*方法*/
	sendClassPageSizeChange,
	sendClassPageIndexChange,

}){
	let SendClassListProps = {
		table : {
			isInDetail    : true,
            loading       : sendClassLoading,
            dataSource    : sendClassDataSource,
			xScroll       : 1000,
            columns : [
                {
					dataIndex : 'orderNum',
					key       : 'orderNum',
					title     : '合同编号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'cardId',
					key       : 'cardId',
					title     : '会员卡号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'periodNum',
					key       : 'periodNum',
					title     : '课时数量',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'extPeriodMoney',
					key       : 'extPeriodMoney',
					title     : '赠课成本',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'extPeriodReason',
					key       : 'extPeriodReason',
					title     : '赠课原因',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'status',
					key       : 'status',
					title     : '状态',
					width     : 96,
					render    : ( text, record ) => (
						<StatusFlag type = { !!text && text == '0' ? 'red' : text == '2' ? 'deep_red' : '' } >
							{ !!text &&  text == '0' ? '未审核' : text == '2' ? '未通过' : text == '1' ? '已审核' : '--' }
						</StatusFlag>
					)
				},{
					dataIndex : 'creatorName',
					key       : 'creatorName',
					title     : '创建人',
					width     : 96,
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
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
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
//			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : sendClassPageSizeChange,
			onChange         : sendClassPageIndexChange
		}
	}

	return (
		<SendClassListComponent { ...SendClassListProps } />
	)
}

export default SendClassList;
