import React from 'react';
import styles from './ClassSign.less';
import {Form, Table, Button} from 'antd';

const FormItem = Form.Item;

function ClassSignComponent ({
	
	dispatch,
	loading,
	selectedRowKeys,
	operationText,
	showAnimSearch,
	
 }) {
	
	function callDisoatch(type, parameter) {
		dispatch({
			type : type,
			payload : {
				...parameter,
			}
		});
	}
	
	const columns = [
		{
			title: '操作',
			dataIndex: 'operation',
			render: (text, record) => (
				<span>
					<a onClick={()=>modifyOrMakeUpAmissedLesson(record, text)}>{operationText}</a>
				</span>
			),
		}, {
			title: '签到时间',
			dataIndex: 'signtime',
		}, {
			title: '上课',
			dataIndex: 'haveaclass',
		}, {
			title: '请假',
			dataIndex: 'askforleave',
		}, {
			title: '旷课',
			dataIndex: 'truancy',
		}, {
			title: '补课',
			dataIndex: 'makeupamissedlesson',
		}, {
			title: '上课内容',
			dataIndex: 'classcontent',
		}, {
			title: '课后作业',
			dataIndex: 'classhomework',
		}, {
			title: '备注',
			dataIndex: 'note',
		}
	];

	const data = [];

	for (let i = 0; i < 146; i++) {
		data.push({
			key: i,
			operation: `${i}`,
			signtime: `1029-10-08 ${i}`,
			haveaclass: ` ${i}`,
			askforleave : ` ${i}`,
			truancy : ` ${i}`,
			makeupamissedlesson : ` ${i}`,
			classcontent : `上课内容 ${i}`,
			classhomework : `课后作业 ${i}`,
			note : `重写 ${i}`,
		});
	}
	
	//补课或者修改
	function modifyOrMakeUpAmissedLesson(text, record) {
		callDisoatch('classRecordModel/updateState', {selectedRowKeys : selectedRowKeys});
	}
	
	//选中的行数
	function onSelectChange(selectedRowKeys) {
		callDisoatch('classRecordModel/updateState', {selectedRowKeys : selectedRowKeys});
		
  	}
	
	//删除
	function delect() {
		callDisoatch('classRecordModel/updateState', {loading : true});
		setTimeout(() => {
			callDisoatch('classRecordModel/updateState', {selectedRowKeys: [], loading: false});
		}, 1000);
	}
		
	//签到
	function signEvent() {

	}
	
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
	
	const pagination = {
		showQuickJumper : true,
		showSizeChanger : true,
		total : data.length,
		showTotal : function(total){return `共${total}条`},
	};
	
	const hasSelected = selectedRowKeys.length > 0;
	
	return (
		<div className="class-tables-base">
			<Button icon="search" type="primary" onClick={signEvent} style={{float : 'right' }}>签到</Button>

			<div style={{marginBottom : 16}}>
				<Button type="primary" onClick={delect} disabled={!hasSelected} loading={loading}>删除</Button>
			  	<span style={{ marginLeft: 8, color : '#666'}}>{hasSelected ? `选中 ${selectedRowKeys.length} 条数据` : ''}</span>
			</div>
			<Table 
				rowSelection={rowSelection}
				columns={columns}
				dataSource={data} 
				bordered={true}
				pagination={pagination}
			/>
		</div>
    );
}

export default ClassSignComponent;
