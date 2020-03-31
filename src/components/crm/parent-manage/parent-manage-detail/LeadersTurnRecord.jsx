import React from 'react';
import LeadersTurnRecordComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Icon, Popover, Modal, Button, Pagination } from 'antd';

function LeadersTurnRecord({
	leaderTurnRecordDataSource,
	leaderTurnRecordLoading,
	leaderTurnRecordPageSize,
	leaderTurnRecordPageIndex,
	leaderTurnRecordResultCount,


	leaderTurnRecordPageSizeChange,
	leaderTurnRecordPageIndexChange,


	leadersTurnRecordVisible,
	closeLeadersTurnRecord

}){
	let leadersTurnRecordComponentProps = {
		table : {
            loading       : leaderTurnRecordLoading,
            dataSource    : leaderTurnRecordDataSource,
            columns : [
                {
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
					dataIndex : 'sex',
					key       : 'sex',
					title     : '性别',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ text == '1' ?
								<Icon type = 'boy' style = {{ color : '#5d9cec' }} />
								:
								<Icon type = 'girl' style = {{ color : '#ff7f75' }} />
							}
						</span>
					)
				},{
					dataIndex : 'birthday',
					key       : 'birthday',
					title     : '生日',
					width     : 112,
				},{
					dataIndex : 'month',
					key       : 'month',
					title     : '月龄',
					width     : 96,
				},{
					dataIndex : 'relation',
					key       : 'relation',
					title     : '关系',
					width     : 96
				}
            ],
         }
	}

	let pagination = {
		total            : leaderTurnRecordResultCount,
		pageIndex        : leaderTurnRecordPageIndex,
		pageSize         : leaderTurnRecordPageSize,
		showTotal        : total => `总共 ${total} 条`,
		showQuickJumper  : true,
		onShowSizeChange : leaderTurnRecordPageSizeChange,
		onChange         : leaderTurnRecordPageIndexChange
	}

	return (
		<Modal
            visible = { leadersTurnRecordVisible }
            title = '家长信息'
            maskClosable = { false }
            width = '1000px'
            onCancel = { closeLeadersTurnRecord }
            footer = {[
				<Button key = "confirmAddParent" type = "primary" onClick = { closeLeadersTurnRecord } >确认</Button>
			]}
		>
			<LeadersTurnRecordComponent { ...leadersTurnRecordComponentProps } />
			<Pagination { ...pagination } />
		</Modal>
	)
}

export default LeadersTurnRecord;
