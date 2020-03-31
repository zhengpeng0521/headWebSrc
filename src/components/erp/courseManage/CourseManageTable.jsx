import React from 'react';
import style from './CourseManageTable.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import { Table ,Popconfirm , Button , Icon} from 'antd';

function CourseManageTable ({
    rowSelectChangeAction,
    setCourseNormal,
    setCourseSuspend,
    deleteCourse,
	createCourse,
    searchCourse,
    updateCourse,

    checkClassInfo,
    checkOrgInfo,

    pageIndexChange,
    pageSizeChange,

	dataSource,
    pageIndex,
    pageSize,
    resultCount,
    selectedRows,
    selectedRowKeys,


    //开设校区
    selectedOrgIds,
    selectedOrgModalVisible,
    selectedOrgModalClose,

}){
    dataSource && dataSource.map(function(item, index){
        item.key = index;
    })

    //校区选择框属性
    let tenantOrgSelectProps = {
        visible    : selectedOrgModalVisible,
        onClose    : selectedOrgModalClose,
        disabled   : true,
        init_org_select: selectedOrgIds,
    };

	let columns = [
		{
			title     : '课程名称',
			dataIndex : 'title',
			key       : 'title',
			width     : '150px',
			render    : ( text , record ) => (
				<div>
					<a onClick = { () => updateCourse( record.id ) }>{ text }</a>
				</div>
			)
		},{
			title     : '课程类型',
			dataIndex : 'courseType',
			key       : 'courseType',
            width     : '100px',
            render    : ( text, record) => (
                <span>{ !!text && text == '1' ? '主题式' : text == '2' ? '渐进式' : null }</span>
            )
		},{
            title     : '课时节数',
            dateIndex : 'cnum',
            key       : 'cnum',
            width     : '100px',
            render    : ( text , record ) => (
                <span>{ record && record.courseType && record.courseType == '2' ? record.cnum : '/' }</span>
            )
        },{
            title     : '每节消耗',
            dateIndex : 'perNum',
            key       : 'perNum',
            width     : '100px',
            render    : ( text , record ) => (
                <span>{ record && record.perNum }</span>
            )
        },{
			title     : '开设班级',
			dataIndex : 'opCls',
			key       : 'opCls',
            width     : '100px',
		},{
			title     : '开设校区',
			dataIndex : 'opOrg',
			key       : 'opOrg',
            width     : '100px',
            render    :  ( text, record )  => (
                <a onClick = { () => checkOrgInfo( record.orgIds ) } >{ text }</a>
            )
		},{
			title     : '创建时间',
			dataIndex : 'createTime',
			key       : 'createTime',
            width     : '150px',
		}
	];

	let rowSelection = {
        selectedRowKeys : selectedRowKeys,
		onChange : rowSelectChangeAction,

	};
	let pagination = {
        total             : resultCount,
        showTotal         : total => `总共 ${total} 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : pageIndexChange,
        onShowSizeChange  : pageSizeChange,
        size              : 'large'
	};

	return (
		<div className = 'yhwu_table_bg' >
			<div className = 'yhwu_operation' >
				<div className = 'yhwu_operation_left'>
                    <span>操作:</span>
                    { selectedRows && selectedRows.length == 0 && <a disabled style = {{ marginLeft : '10px' }} >删除</a> }
					<Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { deleteCourse } >
                        { selectedRows && selectedRows.length !== 0 && <a style = {{ marginLeft : '10px' }} >删除</a> }
					</Popconfirm>
				</div>
				<div className = 'yhwu_operation_right' >
					<Button type = "primary" onClick = { createCourse }>
                        <Icon type = "plus" />新增课程
                    </Button>
					<Button type = "primary" onClick = { searchCourse } style = {{ marginLeft : '10px' }} >
                        <Icon type = "filter" />筛选
                    </Button>
				</div>
			</div>
			<Table columns = { columns }  size = 'middle'  dataSource = { dataSource } rowSelection = { rowSelection } pagination = { pagination } scroll = {{ x: 800 }} bordered />
            <TenantOrgSelect { ...tenantOrgSelectProps } />

		</div>
	)
}

export default CourseManageTable;
