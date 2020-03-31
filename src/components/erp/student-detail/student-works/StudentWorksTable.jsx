import React from 'react';
import { Table ,Button , Popconfirm ,Icon } from 'antd';
import style from './StudentWorksTable.less';

function StudentWorksTable({
	studentWorksDataSource,
    studentWorksResultCount,
    studentWorksPageSize,
    studentWorksPageIndex,

    studentWorksIndexChange,
    studentWorksSizeChange,

    deleteWork,
    updateStudentWork,

    studentWorksLoading,

    uploadWorks

}){

    studentWorksDataSource && studentWorksDataSource.map(function(item,index){
        item.key = index;
    })
	let columns = [
		{
			dataIndex : 'operation',
			key       : 'operation',
			title     : '操作',
			fixed     : 'left',
			width     : '200px',
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
            width     : '220px',
		},{
			dataIndex : 'tagName',
			key       : 'tagName',
			title     : '作品类型',
            width     : '180px',
		},{
			dataIndex : 'createTime',
			key       : 'createTime',
			title     : '上传时间',
            width     : '220px',
		}
	];

    //分页属性
    let pagination = {
        total             : studentWorksResultCount,
        showTotal         : total => `总共 ${total} 条` ,
        showSizeChanger   : true,
        showQuickJumper   : true,
        onChange          : studentWorksIndexChange,
        onShowSizeChange  : studentWorksSizeChange,
        size              : 'large'

    };

	return (
		<div className = 'yhwu_table_bg' >
            <div className = { style.yhwu_studentWorks_btn }>
                <Button type = 'primary' style = {{ marginLeft : '10px' }} onClick = { uploadWorks } >
                    <Icon type = "cloud-upload-o" />上传作品
                </Button>
            </div>
			<Table size = { 'middle' } columns = { columns } dataSource = { studentWorksDataSource } pagination = { pagination } loading = { studentWorksLoading } scroll = {{ x : 1100 }} bordered />
		</div>
	)
}

export default StudentWorksTable;
