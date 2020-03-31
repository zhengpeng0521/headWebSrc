/*
* @author yhwu
* 教室利用表
*/
import React from 'react';
import Media from 'react-media';
import { Popover, Icon } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent';
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

function ClassRoomRatioSheetTable({
	tableLoading,
	tablePageSize,
	tablePageIndex,
	tableTotal,
	tableDataSource,

	paginationChange
}){
	let managerListProps = {
		table : {
            loading       : tableLoading,
            dataSource    : tableDataSource,
            height        : 253,
            rowKey        : 'roomId',
            columns : [
                {
					title     : '教室名称',
					dataIndex : 'roomName',
					key       : 'roomName',
					width     : 150,
					render    : (text,record) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '所属校区',
					key       : 'orgName',
					dataIndex : 'orgName',
					width     : 150,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '排课量',
					key       : 'count',
					dataIndex : 'count',
					width     : 150,
				}
            ],
         },
		pagination : {
			total            : tableTotal,
			pageIndex        : tablePageIndex,
			pageSize         : tablePageSize,
			showTotal        : total => `总共 ${ total } 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : paginationChange,
			onChange         : paginationChange
		}
	}

	let managerListProps1 = {
		table : {
            loading       : tableLoading,
            dataSource    : tableDataSource,
			height        : 297,
            rowKey        : 'roomId',
            columns : [
                {
					title     : '教室名称',
					dataIndex : 'roomName',
					key       : 'roomName',
					width     : 150,
					render    : (text,record) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '所属校区',
					key       : 'orgName',
					dataIndex : 'orgName',
					width     : 150,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '排课量',
					key       : 'count',
					dataIndex : 'count',
					width     : 150,
				}
            ],
         },
		pagination : {
			total            : tableTotal,
			pageIndex        : tablePageIndex,
			pageSize         : tablePageSize,
			showTotal        : total => `总共 ${ total } 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : paginationChange,
			onChange         : paginationChange
		}
	}

    return(
		<Media query = "(max-width: 1350px)" >
			 { matches => matches ?
				<ManagerList { ...managerListProps1 } />
				: <ManagerList { ...managerListProps } />
			}
		</Media>
    );
}

export default ClassRoomRatioSheetTable;
