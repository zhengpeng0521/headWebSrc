import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm, message, Popover } from 'antd';
import QueueAnim from 'rc-queue-anim';
//import styles from '../../../components/cerp/classroom/Classroom.less';
import ClassManageComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';
import ClassCreateFormPage from './ClassCreateFormPage';
import ClassManageDetailPage from './ClassManageDetailPage';

function ClassManagePage({ dispatch, classManageModel }) {

	let {
		orgId,

		searchVisible,

		loading,
		dataSource,
		newColumns,
		resultCount,
		pageIndex,
		pageSize,
		selectedRowKeys,
		selectedRows,

		commonSearchContent,
		superSearchContent,
		userList,
		courseList,
		stuList,
		roomList

    } = classManageModel;

	/*常用搜索*/
	function onSearch( values ){
		dispatch({
			type : 'classManageModel/onSearch',
			payload : {
				commonSearchContent : values,
				superSearchContent
			}
		})
	}

	function onClear(){
		dispatch({
			type : 'classManageModel/onSearch',
			payload : {
				commonSearchContent : {},
				superSearchContent
			}
		})
	}

	/*点击高级搜索按钮*/
	function superSearchClick(){
		dispatch({
			type : 'classManageModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values ){
		dispatch({
			type : 'classManageModel/onSearch',
			payload : {
				commonSearchContent,
				superSearchContent : values
			}
		})
	}

	/*高级搜索重置*/
	function onSuperClear(){
		dispatch({
			type : 'classManageModel/onSearch',
			payload : {
				commonSearchContent,
				superSearchContent : {}
			}
		})
	}

	/*删除班级*/
	function deleteClass(){
		if( selectedRows.length > 1 ){
			message.error( '一次只能删除一个班级' )
			return;
		}
		let clsId = selectedRows[0].clsId;
		dispatch({
			type : 'classManageModel/deleteClass',
			payload : {
				clsId
			}
		})
	}

	/*新增班级*/
	function createClass(){
		dispatch({
			type : 'classCreateFormModel/openCreateClassModal',
			payload : {
				userList,           //员工下拉列表
				courseList,	  		//课程下拉列表
				orgId
			}
		})
	}

	/*改变列表项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'classManageModel/updateState',
			payload : {
				newColumns
			}
		})
	}

	/*选中列表项*/
	function rowSelectChange( selectedRowKeys, selectedRows ){
		dispatch({
			type : 'classManageModel/updateState',
			payload : {
				selectedRowKeys,
				selectedRows
			}
		})
	}

	/*分页*/
	function paginationChange( pageIndex, pageSize ){
		dispatch({
			type : 'classManageModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}

	/*显示班级详情*/
	function showClassDetail( record ){
		dispatch({
			type : 'classManageDetailModel/showDetail',
			payload : {
				record,
				userList,           //员工下拉列表
				stuList,            //学员下拉列表
				roomList,           //教室下拉列表
				courseList          //课程下拉列表
			}
		})
	}

	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'mainTeacherName',
				type        : 'input',
				label       : '主教',
				placeholder : '主教',
			},{
				key         : 'assistantTeacherName',
				type        : 'input',
				label       : '助教',
				placeholder : '助教',
			}
		]
	}

    let ClassManageComponentProps = {
        search : {
                onSearch : onSearch,
                onClear  : onClear,
                fields   : [
                    {
                        key         : 'name',
                        type        : 'input',
                        placeholder : '班级名称',
                    },{
                        key         : 'courseName',
                        type        : 'input',
                        placeholder : '课程名称',
                    },{
                        key         : 'fullClass',
                        type        : 'select',
                        placeholder : '是否满班',
						options     : [
							{ key : '1', label : '满班' },
							{ key : '2', label : '未满班' }
						]
                    },
                ],
        },
		leftBars : {
            label    : '已选',
			labelNum : selectedRowKeys.length,
            btns : [
                {
                    label    : '删除',
                    handle   : deleteClass,
                    confirm  : true,
                }
            ]
        },
        rightBars : {
            btns : [
                {
                    label    : '新增班级',
                    handle   : createClass,
                }
            ],
			isSuperSearch      : true,
			superSearch        : superSearchClick,
			superSearchVisible : searchVisible,
        },
        table : {
            loading       : loading,
			dataSource    : dataSource,
            newColumns    : newColumns,
			changeColumns : changeColumns,
            rowKey        : 'clsId',
            columns       : [
				{
					title      : '班级名称',
					dataIndex  : 'name',
					key        : 'name',
					width      : 160,
					render     : ( text, record )  => (
						<a onClick = { () => showClassDetail( record )} >{ text }</a>
					)
				},{
					title      : '所属课程',
					dataIndex  : 'courseName',
					key        : 'courseName',
					width      : 96,
					render     : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title      : '班级人数',
					dataIndex  : 'num',
					key        : 'num',
					width      : 96,
					render     : ( text, record ) => (
						<span>{ ( record.classStuNum + '/' + record.maxNum ) || '--' }</span>
					)
				},{
					title     : '班级进度',
					key       : 'progress',
					dataIndex : 'progress',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ ( record.overdueCpdNum + '/' + record.totalCpdNum ) || '--' }</span>
					)
				},{
					title     : '主教',
					key       : 'mainTeacherNames',
					dataIndex : 'mainTeacherNames',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '助教',
					key       : 'assistanTeacherNames',
					dataIndex : 'assistanTeacherNames',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '所属校区',
					key       : 'orgName',
					dataIndex : 'orgName',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},
			],
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : rowSelectChange,
            },
        },
        pagination : {
             total             : resultCount,
             pageIndex         : pageIndex,
             pageSize          : pageSize,
             showTotal         : total => `总共 ${total} 条` ,
             showSizeChanger   : true,
             showQuickJumper   : true,
             onChange          : paginationChange,
             onShowSizeChange  : paginationChange,
        }
    }

    return (
        <div style = {{ overflowX : 'hidden', height : '100%' }}>
            <ClassManageComponent { ...ClassManageComponentProps } />
			<SuperSearch { ...superSearchProps } />
			<ClassCreateFormPage />
			<ClassManageDetailPage />
        </div>
    );

}

function mapStateToProps({ classManageModel }) {
  	return { classManageModel };
}

export default connect(mapStateToProps)(ClassManagePage);
