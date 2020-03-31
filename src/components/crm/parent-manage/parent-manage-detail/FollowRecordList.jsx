import React from 'react';
import FollowRecordListComponent from '../../../common/new-component/manager-list/ManagerList';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';
import { Icon, Popover } from 'antd';

function FollowRecordList({
	followRecordDataSource,
	followRecordResultCount,
	followRecordPageSize,
	followRecordPageIndex,
	followRecordLoading,

	/*方法*/
	followRecordPageSizeChange,
	followRecordPageIndexChange

}){
	let followRecordListComponentProps = {
		table : {
			isInDetail    : true,
            loading       : followRecordLoading,
            dataSource    : followRecordDataSource,
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
					width     : 96,
				}
            ],
         },
		pagination : {
			total            : followRecordResultCount,
			pageIndex        : followRecordPageIndex,
			pageSize         : followRecordPageSize,
			showTotal        : total => `总共 ${total} 条`,
			showQuickJumper  : true,
			onShowSizeChange : followRecordPageSizeChange,
			onChange         : followRecordPageIndexChange
		}
	}

	return (
		<FollowRecordListComponent { ...followRecordListComponentProps } />
	)
}

export default FollowRecordList;
