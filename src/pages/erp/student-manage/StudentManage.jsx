import React , { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import StudentManageTable from '../../../components/erp/student-manage/StudentManageTable';
import StudentManageSearch  from '../../../components/erp/student-manage/StudentManageSearch';

function StudentManagePage({ dispatch , studentManageModel, mainLayoutModel }){
	let {
        searchVisible,
        salesManOptions,
        teacherOptions,
        orgOptions,
        classOptions,
        selectedRowKeys,
        selectedRows,
        selectedRecordIds,
        studentWxcodeModalVisible,
		dataSource,
        resultCount,
        pageSize,
        pageIndex,

        menuList
	} = studentManageModel;

    let indexx = 1;
    if( JSON.stringify(menuList) == '{}' && indexx == '1' ){
        let allMenuList = mainLayoutModel.allMenuList;
        indexx++;
        allMenuList && allMenuList.map(function( item, index ){
            if( item.menu_key == 'crm' || item.menu_key == 'erp' ){
                let childMenuList = item.children['0'];
                childMenuList.map(function( item, index ){
                    menuList[item.menu_key] = item.menu_key
                })
            }
            dispatch({
                type : 'studentdetailModel/updateState',
                payload : {
                    menuList
                }
            })
        });
    };

    //选择校区得到班级信息
    function changeOrgId( value ){
        dispatch({
            type : 'studentManageModel/changeOrgId',
            payload : {
                value
            }
        })
    };

    //点击筛选按钮,搜索框是否可见
    function searchStudent(){
        dispatch({
            type : 'studentManageModel/searchStudent',
            payload : {
                searchVisible
            }
        })
    };

    //点击搜索按钮
    function onStudentSearch( values ){
        dispatch({
            type : 'studentManageModel/onStudentSearch',
            payload : {
                values
            }
        })
    };

    //点击重置按钮
    function onStudentReset(){
        dispatch({
            type : 'studentManageModel/onStudentReset',
            payload : {
                values : {
                    name      : '',
                    sex       : '',
                    teacherId : '',
                    orgId     : '',
                    attention : '',
                    mobile    : '',
                    clsId     : '',
                    status    : '',
                }
            }
        })
    };

    //选中表格项进行批量操作
    function rowSelectChangeAction( selectedRowKeys,selectedRows ){
        dispatch({
            type : 'studentManageModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
    };

    //点击分页
    function pageIndexChange(pageIndex){
        dispatch({
            type : 'studentManageModel/paginationChange',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };
    //改变pageSize
    function pageSizeChange(pageIndex,pageSize){
        dispatch({
            type : 'studentManageModel/paginationChange',
            payload : {
                pageIndex, pageSize
            }
        })
    };

    //点击跳到学员详情
    function studentInfoDetail( id, orgId ){
        dispatch({
            type : 'studentManageModel/studentInfoDetail',
            payload : {
                id,orgId
            }
        })
    };


	let studentManageTableProps = {
		dataSource,
        resultCount,
        selectedRows,
		searchStudent,
        studentInfoDetail,
        rowSelectChangeAction,
        pageIndexChange,
        pageSizeChange,
	};

	let studentManageSearchProps = {
        onStudentSearch,
        onStudentReset,
        salesManOptions,
        teacherOptions,
        orgOptions,
        classOptions,

        changeOrgId,
	};

	return (
		<div className = 'yhwu_content_bg' >
            <QueueAnim
				type = {[ 'top', 'top' ]}
                ease = {[ 'easeOutQuart', 'easeInOutQuart' ]}
                style = {{ width : '100%' }} >
					{ !!searchVisible && <StudentManageSearch { ...studentManageSearchProps } key = "student_manage_search" /> }
			</QueueAnim>
			<StudentManageTable { ...studentManageTableProps } />
		</div>
	)
};

function mapStateToProps ({ studentManageModel, mainLayoutModel }){
	return { studentManageModel, mainLayoutModel };
};

export default connect(mapStateToProps)(StudentManagePage);

