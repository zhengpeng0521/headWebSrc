import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import style from './CourseManage.less';
import CourseManageTable  from '../../../components/erp/courseManage/CourseManageTable';
import CourseManageSearch from '../../../components/erp/courseManage/CourseManageSearch';
import CourseManageCreate from '../../../components/erp/courseManage/CourseManageCreate';

function CourseManagePage ({ dispatch , courseManageModel }){
	let {
        searchVisible,
        orgOptionsList,
        createFormVisible,
        dataSource,
        selectedRecordIds,
        selectedRowKeys,
        selectedRows,
        courseInfo,
        selectOrgs,
        selectModalVisible,
        pageIndex,
        pageSize,
        resultCount,

        //开课校区查看
        selectedOrgIds,
        selectedOrgModalVisible,

        modalSubmitModalButtonLoading,      //新增编辑表单按钮加载状态

    } = courseManageModel;

    //有关校区选择框
    function onOpenSelectOrgModal() {
        dispatch({
            type: 'courseManageModel/onOpenSelectOrgModal',
            payload : {
                selectModalVisible
            }
        });
    };

    function onSelectOrgModalClose() {
        dispatch({
            type: 'courseManageModel/onSelectOrgModalClose',
            payload : {
                selectModalVisible
            }
        });
    }

    function afterSelectOrgModal(org_select) {
        dispatch({
            type: 'courseManageModel/afterSelectOrgModalSubmit',
            payload : {
                selectOrgs: org_select,
            }
        });
    };

    //选择表格项
	function rowSelectChangeAction( selectedRowKeys,selectedRows ){
		dispatch({
            type : 'courseManageModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
	};

    //搜索框是否可见
	function searchCourse(){
		dispatch({
			type : 'courseManageModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	};

    //点击搜索按钮查询
	function onCourseSearch( values ){
		dispatch({
            type : 'courseManageModel/onCourseSearch',
            payload : {
                values
            }
        })
	};

    //点击重置按钮清空查询条件
	function onCourseReset(){
		dispatch({
            type : 'courseManageModel/onCourseReset',
            payload : {
                id         : '',
                courseType : '',
                title      : '',
                orgId      : '',

            }
        });
	};

    //新增课程
	function createCourse (){
		dispatch({
			type : 'courseManageModel/createCourse',
			payload : {
				createFormVisible
			}
		})
	};

    //修改课程
    function updateCourse( id ){
        let courseId = id;
        dispatch({
           type : 'courseManageModel/updateCourse',
			payload : {
				createFormVisible,
                courseId
			}
        })
    };

    //批量操作删除
	function deleteCourse(){
		selectedRecordIds = [];
		selectedRows.map(function(item){
            selectedRecordIds.push(item.id);
        });
        dispatch({
            type : 'courseManageModel/deleteCourse',
            payload : {
                selectedRecordIds
            }
        })
	};

    //选择校区
    function onOpenSelectOrgModal(){
        dispatch({
            type : 'courseManageModel/onOpenSelectOrgModal',
            payload : {
                selectModalVisible
            }
        })
    };
    //确认新增
	function confirmCreateForm( params ){

		dispatch({
			type : 'courseManageModel/confirmCreateForm',
			payload : {
				createFormVisible,
                params,
                selectOrgs : [],
			}
		})
	};
    //取消新增
	function cancelCreateForm(){
		dispatch({
			type : 'courseManageModel/cancelCreateForm',
			payload : {
				createFormVisible
			}
		})
	};

    //点击分页
    function pageIndexChange(pageIndex){
        dispatch({
            type : 'courseManageModel/paginationChange',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };
    //改变pageSize
    function pageSizeChange(pageIndex,pageSize){
        dispatch({
            type : 'courseManageModel/paginationChange',
            payload : {
                pageIndex, pageSize
            }
        })
    };

    //点击查看开课的校区
    function checkOrgInfo( orgIds ){
        dispatch({
            type : 'courseManageModel/updateState',
            payload : {
                selectedOrgIds : orgIds,
                selectedOrgModalVisible : !selectedOrgModalVisible
            }
        })
    };

    //关闭开课校区框
    function selectedOrgModalClose(){
        dispatch({
            type : 'courseManageModel/updateState',
            payload : {
                selectedOrgModalVisible : !selectedOrgModalVisible,
                selectedOrgIds : [],
            }
        })
    }

	let courseManageTableProps = {
		createCourse,
        searchCourse,
        deleteCourse,
        rowSelectChangeAction,
        updateCourse,
        pageIndexChange,
        pageSizeChange,
		dataSource,
        pageIndex,
        pageSize,
        resultCount,
        selectedRows,
        selectedRowKeys,

        selectedOrgIds,
        selectedOrgModalVisible,
        checkOrgInfo,
        selectedOrgModalClose,
	};
	let courseManageSearchProps = {
		onCourseSearch,
        onCourseReset,
        orgOptionsList
	};
	let courseManageCreateProps = {
		createFormVisible,
		confirmCreateForm,
        cancelCreateForm,
        courseInfo,
        onOpenSelectOrgModal,
        onSelectOrgModalClose,
        afterSelectOrgModal,
        selectModalVisible,
        selectOrgs,
        modalSubmitModalButtonLoading,      //新增编辑表单按钮加载状态
	};
	return (
		<div className = 'yhwu_content_bg' >
			<QueueAnim
				type = {[ 'top', 'top' ]}
                ease = {[ 'easeOutQuart', 'easeInOutQuart' ]}
                style = {{ width : '100%' }} >
					{ !!searchVisible && <CourseManageSearch { ...courseManageSearchProps } key = "course_manage_search" /> }
			</QueueAnim>
			<CourseManageTable { ...courseManageTableProps } />
			<CourseManageCreate { ... courseManageCreateProps } />
		</div>
	)
};

function mapStateToProps ({ courseManageModel }){
	return { courseManageModel };
};

export default connect(mapStateToProps)(CourseManagePage);
