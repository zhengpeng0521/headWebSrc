import React from 'react';
import ParentListComponent from '../../../common/new-component/manager-list/ManagerList';
import { Popover } from 'antd';

function ParentList({

	parentDataSource,
	parentLoading,

}){
	let ParentListProps = {
		table : {
			isInDetail    : true,
            loading       : parentLoading,
            dataSource    : parentDataSource,
			height        : 248,
            columns : [
                {
					dataIndex : 'name',
					key       : 'name',
					title     : '家长姓名',
					width     : 96,
				},{
					dataIndex : 'mobile',
					key       : 'mobile',
					title     : '联系手机',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'click' >
							<a>查看</a>
						</Popover>
					)
				},{
					dataIndex : 'workUnit',
					key       : 'workUnit',
					title     : '工作单位',
				},{
					dataIndex : 'email',
					key       : 'email',
					title     : '邮箱',
				}
            ],
         },
	}

	return (
		<ParentListComponent { ...ParentListProps } />
	)
}

export default ParentList;
