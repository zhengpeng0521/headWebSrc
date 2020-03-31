import React from 'react';
import styles from './MarketMyOfflineLeafletsComponent.less';
import {Button, Modal, Input, Select, Tabs, Radio, Form, Table, Col, Popover, Popconfirm} from 'antd';
import moment from 'moment';
import TableComponent from '../../../common/manager-list/ManagerListMgr';
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

function MarketMyOfflineLeafletsComponent ({

	dp, 
	attrSelectedRowKeys,
	attrPaginationSource,
	attrPageIndex,
	attrPageSize,
	attrDataSource,
	attrShowSearch,
	attrOrgId,
	attrActivityList,
	funcpushMarkeyActivity,
	funcpushMarkeyOfflineLeaflets,
	funcPushMarketDownloadOfflineLeaflets,

	form: {
 		getFieldDecorator,
        getFieldValue,
		getFieldsValue,
        setFieldsValue,
		getFieldProps,
        validateFields,
        resetFields,
        setFields,
        getFieldError,
        validateFieldsAndScroll,
	}

}) {

	//活动列表数据处理
	let newAttrActivityList = [];
	attrActivityList&&attrActivityList.map((item, index) => {
		newAttrActivityList.push({
			key : item.id,
			label : item.name,
		})
	})

	//处理原始数据添加key
	let newAttrDataSource = [];
	attrDataSource&&attrDataSource.map((item, index) => {
		item.key = String(index);
		newAttrDataSource.push(item);
	})

	function onFilterClick() {
		dp('getActivityList', { attrOrgId: attrOrgId, attrShowSearch: !attrShowSearch});
	}

	//搜索条件
	function onSearch(value) {
		dp('getList', {attrOrgId : value.orgId || attrOrgId, value : value});
	}

	function searchClear() {
		dp('getList', {});
	}

	function editItemData(record) {
		funcpushMarkeyOfflineLeaflets(record);
	}

	function downloadLeaflets(record) {
		funcPushMarketDownloadOfflineLeaflets(record);
	}

	function reviewDetail(record) {
		funcpushMarkeyActivity(record);
	}

	function selectRowChange(row) {
		dp('updateState', {attrSelectedRowKeys : row});
	}

	//批量删除
	function delectSelcetItem(record) {

		let idArr = [];
		if(record&&record.id != undefined) {
			dp('getInstDelect', {ids : String(record.id)});
		} else {
			attrSelectedRowKeys.map((item, index) => {
				idArr.push(newAttrDataSource[item].id);
			})
			dp('getInstDelect', {ids : idArr.join(',')});
		}
	}

	//单条删除
	function delectActivity(record) {
		dp('getInstDelect', {id : record.id});
	}

	//分页改变
	function pageChange(page, pageSize) {
		dp('getLoadPageData', {pageIndex : page-1});
	}

	//改变分页触发
	function showSizeChange(page, pageSize) {
		dp('getLoadPageData', {pageIndex : page-1, pageSize : pageSize});
	}

	//列表属性
	let tableProps = {
		search : {
			searchAble : true,
			showSearch : attrShowSearch,
			onFilterClick : onFilterClick,
			onSearch : onSearch,
			onClear : searchClear,
			wetherClear : false,
			fields : [
				{
					key : 'orgId',
					type : 'orgSelect',
					options : {
						width : 170,
					}
				},
				{
					key : 'name',
					type : 'text',
					placeholder : '传单名称',
				},
				{
					key : 'actId',
					type : 'select',
					placeholder : '关联活动',
					options : newAttrActivityList || [],
				},
			]
		},

		table : {
			dataSource : newAttrDataSource,
            columns : [
                {
					dataIndex : 'name',
					key       : 'name',
					width 	  : '160px',
					title     : '传单名称',
					render    : ( text, record ) => (
						<a onClick={() => editItemData(record)}>{ record.name }</a>
					)
				},{
					dataIndex : 'actName',
					key       : 'actName',
					width 	  : '180px',
					title     : '关联活动',
					render    : ( text, record ) => (
						<span>{ record.actName&&record.actName.length > 0 ? record.actName : '活动未关联' }</span>
					)
				},{
					dataIndex : 'count',
					key       : 'count',
					width 	  : '120px',
					title     : '数据分析',
					render    : ( text, record ) => (
						<div>
							<div>有效用户:{ record.count > 0 ? record.count : 0 }</div>
							<a onClick={() => reviewDetail(record)}>查看详情</a>
						</div>
					)
				},{
					dataIndex : 'orgName',
					key       : 'orgName',
					width 	  : '120px',
					title     : '校区',
					render    : ( text, record ) => (
						<span>{ record.orgName }</span>
					)
				},{
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '创建时间',
					width 	  : '160px',
					render    : ( text, record ) => (
						<span>{ record.createTime }</span>
					)
				},{
					dataIndex : 'tryNum',
					key       : 'tryNum',
					title     : '操作',
					width 	  : '120px',
					render    : ( text, record ) => (
						<div>
							<a onClick={() => editItemData(record)}>编辑&nbsp;</a>
							<Popconfirm title="确定删除?" okText="是" cancelText="否" onConfirm={() => delectSelcetItem(record)}>
								<a href="#">删除&nbsp;</a>
							</Popconfirm>
							<a onClick={() => downloadLeaflets(record)}>下载&nbsp;</a>
						</div>
					)
				},
            ],
            emptyText : '暂时没有数据',
			rowSelection : {
				type : 'checkbox',
				onChange : selectRowChange,
				selectedRowKeys : attrSelectedRowKeys,
			},
			pagination : {
				total : attrPaginationSource&&attrPaginationSource.resultCount,
				pageIndex : attrPageIndex || 0,
				pageSize : attrPageSize || 10,
				showSizeChanger : true,
				showQuickJumper : true,
				onChange : pageChange,
				onShowSizeChange : showSizeChange,
			},
        },
		leftBars : {
			label : '操作',
       		btns:    [
				{
					type : 'text',
					label :  '删除',
					confirm : true,
					disabled : !attrSelectedRowKeys.length,
					handle : delectSelcetItem,
				}
			],
		},
		rightBars: {},
	}

	return (
		<div className="marketMyOfflineLeaflets">
			<TableComponent {...tableProps} />
		</div>
	);
}

export default Form.create()(MarketMyOfflineLeafletsComponent);