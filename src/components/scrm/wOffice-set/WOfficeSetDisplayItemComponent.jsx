import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Button, Modal, Icon, Table, Popconfirm } from 'antd';
import style from './WOfficeSetDisplayItemComponent.less';

function WOfficeSetDisplayItemComponent({
	dataSource,
	selectedRowKeys,
	selectedRows,

	rowSelectChange,
	showItem,
	hideItem,
	editItem,

}){

	let columns = [
		{
			dataIndex : 'title',
			key       : 'title',
			title     : '显示项名称',
			width     : 180,
		},{
			dataIndex : 'show',
			key       : 'show',
			title     : '状态',
			width     : 60,
			render    : ( text, record ) => (
				<div>
					{ text == 1 ? '已显示' : text == 0 ? '已隐藏' : null }
				</div>
			)
		},{
			dataIndex : 'type',
			key       : 'type',
			title     : '类型',
			width     : 100,
			render    : ( text, record ) => (
				<div>
					{ text == 0 ? '默认菜单' : text == 1 ? '自定义菜单' : text == 2 ? '主页显示项' : null }
				</div>
			)
		},{
			dataIndex : 'url',
			key       : 'url',
			title     : '外链地址',
			width     : 240,
			render    : ( text, record ) => (
				<div>
					{ !!record && ( record.type == 0 || record.type == 2 ) ? '不可编辑' : record.type == 1 ? text : null }
				</div>
			)
		}
	];

	let rowSelection = {
		selectedRowKeys: selectedRowKeys,
		onChange       : rowSelectChange,
	};

	return (
		<div className = 'yhwu_table_bg' style = {{ display : 'inline-block' }} >
			<div className = 'yhwu_operation' >
				<div className = 'yhwu_operation_left'>
                    <span>操作:</span>
                    { selectedRows && selectedRows.length == 0 && <a disabled style = {{ marginLeft : '10px' }} >显示</a> }
					<Popconfirm title = "确认要显示么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { showItem } >
                        { selectedRows && selectedRows.length !== 0 && <a style = {{ marginLeft : '10px' }} >显示</a> }
					</Popconfirm>
					{ selectedRows && selectedRows.length == 0 && <a disabled style = {{ marginLeft : '10px' }} >隐藏</a> }
					<Popconfirm title = "确认要隐藏么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { hideItem } >
                        { selectedRows && selectedRows.length !== 0 && <a style = {{ marginLeft : '10px' }} >隐藏</a> }
					</Popconfirm>
					{ <a disabled = { selectedRows && selectedRows.length != 1 } style = {{ marginLeft : '10px' }} onClick = { editItem }>编辑</a> }
				</div>
				<div className = 'yhwu_operation_right' >
				</div>
			</div>
			<Table
                columns = { columns }
                dataSource = { dataSource }
                pagination = { false }
                rowSelection = { rowSelection }
                bordered
                scroll = {{ x : 580 }}
                size='middle'/>
		</div>
	)
}

export default WOfficeSetDisplayItemComponent;
