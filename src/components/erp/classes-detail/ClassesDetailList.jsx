import React from 'react';
import { Table, Popconfirm, Button, Icon } from 'antd';
import styles from './ClassesDetail.less'

//班级信息界面
function ClassesMgrList({
    loading, classesList, classesListTotal,
    tableOnFilter,
    tablePageChange,
    tableOnChange,
    tableOnEditItem,
	tableOnEditItemWork,
  }) {
	
	const columns = [{
		width: 100,
		title: '学员信息',
		dataIndex: 'id',
		key: 'id',
		render:(text, record) => (
			<div>
				<p>{record.name}/{record.sex == '1' ? '男' : record.sex == '2' ? '女' : ''}</p>
			</div>
		),
	}, {
		width: 100,
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
		render:(text, record) => (
			<div>
				<p>{(record.age != null && record.age != 'null' && record.age != undefined) ? `${record.age}岁` : ''}</p>
				<p>{(record.birthdayStr != null && record.birthdayStr != 'null' && record.birthdayStr != undefined) ? `${record.birthdayStr}` : ''}</p>				
			</div>
		),
	}, {
		width: 100,
		title: '家长信息',
		dataIndex: 'parentsInfo',
		key: 'parentsInfo',
		render:(text, record) => (
			<div>
				<p>
					{(record.parentName != null && record.parentName != 'null' && record.parentName != undefined) ? record.parentName : ''}
					/
					{(record.parentRelation != null && record.parentRelation != 'null' && record.parentRelation != undefined) ? record.parentRelation : ''}
				</p>
				<p>{(record.mobile != null && record.mobile != 'null' && record.mobile != undefined) ? record.mobile : ''}</p>
			</div>
		),
	}/*, {
		width: 50,
		title: '剩余',
		dataIndex: 'remaining',
		key: 'remaining',
		render:(text, record) => (
			<div>
				<p>{(record.numPeriod != null && record.numPeriod != 'null' && record.numPeriod != undefined) ? record.numPeriod : ''}</p>
			</div>
		),
	}*/, {
		width: 50,
		title: '作品',
		dataIndex: 'numWorks',
		key: 'numWorks',
		render:(text, record) => (
			<a className={styles.check} onClick={() => tableOnEditItemWork(record)}>
				{(record.numWorks != "null" && record.numWorks) ? record.numWorks : 0}
			</a>
		),
	}, {
		width: 50,
		title: '微信关注',
		dataIndex: 'about',
		key: 'about',
		render:(text, record) => (
		  	<div >
				<Icon type="guanzhuweixin" className={record.attention == '1' ? styles.yiguanzhu : styles.noguanzhu}/>
		  	</div>
		),
	}, /*{
		width: 50,
		title: '操作',
		dataIndex: 'options',
		key: 'options',
		render: (text, record) => (
			<a className={styles.check} onClick={() => tableOnEditItem(record)}>详情</a>
		),
	  }*/];
	
	let paginationProps = {
        total: classesListTotal,
        showSizeChanger: true,
        showQuickJumper :true,
        onShowSizeChange : tablePageChange,
        onChange : tablePageChange,
		size : 'large',
        showTotal(){
            return '共'+this.total+'条数据';
        }
    };

    return (
        <div className='zj_Table'>
            <Table
                columns={columns}
                dataSource={classesList}
                loading={loading}
                pagination={paginationProps}
                onChange={tableOnChange}
                bordered
                rowKey="id"
				size="middle"
                scroll={{ x : 720 }} />
        </div>
  );
}

export default ClassesMgrList;
