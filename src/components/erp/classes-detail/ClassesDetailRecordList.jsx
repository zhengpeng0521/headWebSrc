import React from 'react';
import {Table} from 'antd';
import moment from 'moment';
import styles from './ClassesDetail.less';
import ClassesRecordListComponent from '../../../components/common/manager-list/ManagerListMgr';

const ClassesRecordList = ({
  
	signRecordList,
	signRecordPageData,
	pageIndex,
	pageSize,
	selectedRowKeys,
	modifyFunction,
	dp,
	
}) => {
	
	//原始数据处理
	if(signRecordList&&signRecordList.length>0) {
		for(let idx in signRecordList) {
			signRecordList[idx].key = idx
		}
	}
	
	//表格选中单行
	function tableRowChangeFunction(selectedRowKeys) {
		dp('updateState', {selectedRowKeys : selectedRowKeys});
	}
	
	//分页变化的回调
	function changePage(pagination) {
		dp('getSignList', {pageIndex : pagination - 1});
	}
		
	//多少条数量
	function sizePage(selectedRowKeys, selectedRows) {	
		dp('getSignList', {pageSize : selectedRows});
	}
	
	let salesOrderProps = {		
		cssEditor : {
			clearPadding : true,
		},
		table 		: {
			loading : false,
			columns : [
				{
					title: '操作',
					key : 'operation',
					dataIndex: 'operation',
					render: (text, record) => {
                        let createTime = record.createTime;
                        let flg = false;
                        if(createTime && createTime!= '') {
                            flg = moment(createTime, 'YYYY-MM-DD').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD');
                        }
                        return (
						<span>
							{/*<a disabled={!(selectedRowKeys.length>0&&record.key==selectedRowKeys[0])} onClick={() => modifyFunction()}>修改</a>*/}
							<a className={styles.table_cell_href_item} disabled={!flg} onClick={() => modifyFunction(record.cpId)}>修改</a>
						</span>
					)},
				}, {
					title: '签到时间',
					key : 'signTime',
					dataIndex: 'signTime',
				}, {
					title: '上课',
					key : 'num1',
					dataIndex: 'num1',
				},{
					title: '请假',
					key : 'num2',
					dataIndex: 'num2',
				},{
					title: '补课',
					key : 'num3',
					dataIndex: 'num3',

				},{
					title: '旷课',
					key : 'num4',
					dataIndex: 'num4',

				},{
					title: '上课内容',
					key : 'content',
					dataIndex: 'content',

				},{
					title: '课后作业',
					key : 'homework',
					dataIndex: 'homework',

				},{
					title: '备注',
					key : 'remark',
					dataIndex: 'remark',
				}
			],
			dataSource : signRecordList,
//			rowSelection: {
//				disabled 	: true,
//				type 		: 'checkbox',
//			    selectedRowKeys : selectedRowKeys,
//				onChange 	: tableRowChangeFunction,
//			},
			pagination : {
				total 		: signRecordPageData&&signRecordPageData.resultCount,
				pageIndex 	: pageIndex,
				pageSize 	: pageSize,
				showTotal 	: function(total){return `共${total}条`},
				onShowSizeChange : sizePage,
				showQuickJumper : true,
				onChange 	: changePage
			},
		},
	}

  	return (
    	<div>
			<ClassesRecordListComponent {...salesOrderProps} />
    	</div>
  	);
};

export default ClassesRecordList;
