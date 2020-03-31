import React from 'react';
import styles from './TeachingMaterialComponent.less';
import {Modal, Button, Popover } from 'antd';
import ManagerListMgr from '../../../components/common/new-component/manager-list/ManagerList';
import TeachingMaterialForm from '../../../pages/crm/teaching-material/TeachingMaterialForm';
import { StatusFlag } from '../../../components/common/new-component/NewComponent';
function TeachingMaterialComponent ({
    table: {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        onRowSelectChange,
        onShowSizeChange,
        pageChange,
    },
    search: {
        showSearch,
        onSearch,
        onClear,
        onFilterClick,
    },
    onBatchDelete,
    onCreateClick,
    statusActive,
    onStatusTabChange,

    onEditClick,
	newColumns,
	changeColumns,
}) {

    let managerListProps = {
        search: {
            searchAble: true,
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
            fields: [
                {
                    key: 'orgId',
                    type: 'orgSelect',
                    placeholder: '请选择校区',
                    width: '240px',
                },
                {
                    key: 'name',
                    type: 'input',
                    placeholder: '物资名称',
                    width: '120px',
                },
                {
                    key: 'status',
                    type: 'select',
                    placeholder: '状态',
                    width: '120px',
                    options     : [
						{ 'key' : '1', 'label' : '上架' },
						{ 'key' : '2', 'label' : '下架' }
					],
                },
            ],
            initSearchValues: [],
        },
        table: {
            loading,
            rowKey: 'id',
			newColumns : newColumns,
			changeColumns : changeColumns,
            columns: [
                {
                    key       : 'name',
                    title     : '物资名称',
                    dataIndex : 'name',
                    width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
                        	<a onClick = { ()=>onEditClick(record.id, record.orgId) } >{ text }</a>
						</Popover>
                    )
                },

                {
                    key       : 'price',
                    title     : '销售价格',
                    dataIndex : 'price',
                    width     : 96,
                    render: function(text, record, index) {
                        let priceValue = parseFloat( record.price + '' );
                        return (
							<Popover placement = 'top' content = { <span className = { styles.table_cell_item }>{ priceValue + '元/' + (record.unit || '') }</span> } trigger = 'hover' >
                            	<span className = { styles.table_cell_item }>{ priceValue + '元/' + (record.unit || '') }</span>
							</Popover>
                        );
                    },
                },
                {
                    key       : 'sell',
                    title     : '销量',
                    dataIndex : 'sell',
                    width     : 68,
                },
                {
                    key       : 'unit',
                    title     : '销售单位',
                    dataIndex : 'unit',
                    width     : 96,
                },
                {
                    key       : 'stock',
                    title     : '库存',
                    dataIndex : 'stock',
                    width     : 68,
                },{
                    key       : 'status',
                    dataIndex : 'status',
                    title     : '物资状态',
                    width     : 96,
                    render    : ( text, record ) => (
							<StatusFlag type = { text == '2' ? 'gray' : ''}>{ text == '1' ? '已上架' : text == '2' ? '已下架' : '删除' }</StatusFlag>
                    )
                },{
                    key       : 'createTime',
                    title     : '创建日期',
                    dataIndex : 'createTime',
                    width     : 160,
                },{
                    key       : 'orgName',
                    title     : '所属校区',
                    dataIndex : 'orgName',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
                        	<span>{ text }</span>
						</Popover>
                    )
                }
            ],
            dataSource,
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : onRowSelectChange,
            },
        },
		pagination: {
			total,
			pageIndex,
			pageSize,
			onShowSizeChange,
			onChange : pageChange,
			showTotal        : total => `总共 ${total} 条`,
			showSizeChanger  : true,
		},
        leftBars : {
            label : '已选',
			labelNum : selectedRowKeys.length,
            btns : [
                {
                    label    : '删除',
                    handle   : onBatchDelete,
                    confirm  : true,
                }
            ]
        },

        rightBars : {
            btns : [
                {
                    label    : '新增物资',
                    handle   : onCreateClick
                }
            ],
			isSuperSearch : false,
        },
    };

    return (
        <div className={styles.teaching_material_manage_cont} style = {{ overflowX : 'hidden' }}>
            <ManagerListMgr { ...managerListProps } />
            <TeachingMaterialForm />
        </div>
    );
}


export default TeachingMaterialComponent;
