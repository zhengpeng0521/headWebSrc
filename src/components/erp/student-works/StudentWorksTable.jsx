import React from 'react';
import style from './StudentWorksTable.less';
import { Table ,Button , Popconfirm ,Icon } from 'antd';

function StudentWorksTable({
	dataSource,
    resultCount,
    loading,
    selectedRowKeys,

    allSize,
    usedSize,

	filterWorks,
    rowSelectChangeAction,
    pageIndexChange,
    pageSizeChange,
    manageWorksType,
    uploadWorks,
    updateStudentWork,
    deleteWorks,
    deleteWork,

	pageSize,
	pageIndex

}){
    dataSource && dataSource.map(function(item, index){
        item.key = index;
    })

    function sizeChange ( size ){
        if( size < 1024 ){
            return size + ' B '
        } else if( size < 1024*1024 ){
            return size/1024 + ' KB '
        } else if( size < 1024*1024*1024 ){
            return size/1024/1024 + ' M '
        } else if( size < 1024*1024*1024*1024 ){
            return size/(1024*1024*1024) + ' G '
        }
    }
	let columns = [
		{
			dataIndex : 'operation',
			key       : 'operation',
			title     : '操作',
			width     : '120px',
			render    : ( text , record ) => (
				<div>
					<a href = { record.imgurl } target = '_blank' >查看</a>
					<a onClick = { () => updateStudentWork( record.id, record.imgurl ) } style = {{ marginLeft : '10px' }} >修改</a>
					<Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => deleteWork( record.id ) } >
						<a style = {{ marginLeft : '10px' }} >删除</a>
					</Popconfirm>
				</div>
			)
		},{
			dataIndex : 'id',
			key       : 'id',
			title     : '作品编号',
            width     : '220px',
		},{
			dataIndex : 'title',
			key       : 'title',
			title     : '作品名称',
            width     : '100px',
		},{
			dataIndex : 'tagName',
			key       : 'tagName',
			title     : '作品类型',
            width     : '120px',
            render    : ( text, record ) => (
                <span>
                    { text == null ? '未分类' : text }
                </span>
            )
		},{
			dataIndex : 'stuName',
			key       : 'stuName',
			title     : '所属学员',
            width     : '100px'
		},{
			dataIndex : 'orgName',
			key       : 'orgName',
			title     : '所属校区',
            width     : '180px',
		},{
			dataIndex : 'createTime',
			key       : 'createTime',
			title     : '上传时间',
            width     : '150px',
		}
	];

    let rowSelection = {
		onChange        : rowSelectChangeAction,
        selectedRowKeys : selectedRowKeys,
	};

	let pagination = {
        total             : resultCount,
        showTotal         : total => `总共 ${total} 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : pageIndexChange,
        onShowSizeChange  : pageSizeChange,
        size              : 'large',
		pageIndex         : pageIndex,
		pageSize          : pageSize,
	};

	return (
		<div className = 'yhwu_table_bg' >
			<div className = 'yhwu_operation' >
				<div className = 'yhwu_operation_left' >
					<span>操作 :</span>
					<Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { deleteWorks } >
						<a style = {{ marginLeft : '10px' }} >删除</a>
					</Popconfirm>
				</div>
				<div  className = 'yhwu_operation_right' >
                    <span className = { style.use_space }>
                        { '已用空间 : ' + sizeChange(usedSize) + ' 剩余空间 : ' +  sizeChange( allSize - usedSize )  }
                    </span>
					<Button onClick = { manageWorksType } style = {{ marginLeft : '10px' }} >
						<Icon type = "appstore-o" />管理分类
					</Button>
					<Button type = 'primary' style = {{ marginLeft : '10px' }} onClick = { uploadWorks } >
						<Icon type = "cloud-upload-o" />上传作品
					</Button>
					<Button type = 'primary' style = {{ marginLeft : '10px' }} onClick = { filterWorks } >
						<Icon type = "filter" />筛选
					</Button>
				</div>
			</div>
			<Table size = { 'middle' } columns = { columns } dataSource = { dataSource } bordered rowSelection = { rowSelection } pagination = { pagination } loading = { loading } scroll = {{ x : 990 }} />
		</div>
	)
}

export default StudentWorksTable;
