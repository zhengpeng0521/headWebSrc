import React from 'react';
import style from './StudentManageTable.less';
import { Table ,Popconfirm , Button , Icon} from 'antd';

function StudentManageTable({
    searchStudent,
    studentInfoDetail,
    dataSource,
    resultCount,
    pageIndexChange,
    pageSizeChange,
    rowSelectChangeAction,
    selectedRows,

}){
    dataSource && dataSource.map(function(item, index){
        item.key = index;
    })

	let columns = [
		{
			dataIndex : 'name',
			key       : 'name',
			title     : '学生姓名',
			width     : '100px',
			render    : (text , record) => (
				<div>
					<div><a onClick = { () => studentInfoDetail( record.id, record.orgId ) }>{ text }</a></div>
				</div>
			)
		},{
            dataIndex : 'sex',
            key       : 'sex',
            title     : '性别',
            width     : '50px',
            render    : ( text , record) => (
                <span>{ text && text == '1' ? '男' : text == '2' ? '女' : null }</span>
            )
        },{
            dataIndex : 'birthday',
            key       : 'birthday',
            title     : '生日',
            width     : '100px',
        },{
			dataIndex : 'mobile',
			key       : 'mobile',
			title     : '联系信息',
            width     : '100px',
		},{
			dataIndex : 'attention',
			key       : 'attention',
			title     : '微信关注',
            width     : '100px',
			render    : (text, record) => (
                <div>
                    <Icon type="guanzhuweixin" className={ record.attention == '1' ? style.yiguanzhu : style.noguanzhu } />
                </div>
            )
		},{
			dataIndex : 'balance',
			key       : 'balance',
			title     : '课时余额',
            width     : '100px',
        },{
			dataIndex : 'clsMsg',
			key       : 'clsMsg',
			title     : '报读信息',
            width     : '300px',
			render    : (text , record) =>(
				<div>
                    {
                        !!record.enrollNum &&
                        <div>
                            <span>{ text }</span>
                            <span style = {{ marginLeft : '20px' }} className = { record && record.clsStatus == '0' ? style.waitingForClass : record.clsStatus == '1' ? style.studying : record.clsStatus == '2' ? style.classSuspend : record.clsStatus == '3' ? style.classEnd : null }>
                                <span>
                                    { record.clsStatus && record.clsStatus == '0' ? '待分班' : record.clsStatus == '1' ? '在读' : record.clsStatus == '2' ? '停课' : record.clsStatus == '3' ? '结束' : null }
                                </span>
                                { record.clsStatus && record.clsStatus == '3' && <div className = { style.classSuspendTip }>!</div> }
                            </span>
                            <span style = {{ marginLeft : '20px' }} >
                                { record.clsNum }
                            </span>
                        </div>
                    }
                    <div>
                        { '共 ' + ( record.enrollNum || '0' ) + ' 个报班信息' }
                    </div>
				</div>


			)
		},{
            dataIndex : 'orgName',
            key       : 'orgName',
            title     : '所在校区',
            width     : '150px',
        }
	];

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
				</div>
				<div className = 'yhwu_operation_right'>
					<Button style = {{ marginLeft : '10px' }} type = "primary" onClick = { searchStudent }>
                        <Icon type = "filter" />筛选
                    </Button>
				</div>
			</div>
			<Table size = { 'middle' } columns = { columns } dataSource = { dataSource } pagination = { pagination } scroll = {{ x: 1000 }} bordered />
		</div>

	)
};

export default StudentManageTable;
