import React from 'react';
import ClassesDetailIntro 		from '../../../components/erp/classes-detail/ClassesDetailIntro';
import ClassesDetailList 		from '../../../components/erp/classes-detail/ClassesDetailList';
import ClassesDetailEditModal 	from '../../../components/erp/classes-detail/ClassesDetailEditModal';
import ClassesSignRecordList 	from '../../../components/erp/classes-detail/ClassesDetailRecordList';
import ClassSchedule 			from '../class-schedule/ClassSchedule';
import styles			 		from './ClassesDetail.less';
import ScheduleSignPage		 	from '../stu-sign/ScheduleSignPage';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs, Icon, message, Button } from 'antd';
const TabPane = Tabs.TabPane;

function ClassesDetail({ dispatch, classesDetail }) {

    let {
		
        pageIndex,
        pageSize,
        searchVisible,  		//搜索框是否显示
        formLoading,     	 	//表单按钮加载
        loading,         	 	//表格加载
        formVisible,      		//编辑表单展示
        classesList,         	//列表数据
        classesListTotal,     	//列表数据总数
        formData,
        searchData,
        topList,
		selectBishopTeacherIds,
		selecttTaTeacherIds,
		teacherListSelectArr,
		signRecordList,
		signRecordPageData,
		selectedRowKeys,
		
		cnum,
		pnum,
		ctype,

    } = classesDetail;

	
	function dp(name, paramter) {
		 dispatch({
            type: `classesDetail/${name}`,
            payload: {
               ...paramter
            },
        });
	}
	
    //学员列表分页变更
    let tablePageChange = function(current, pageSize=classesDetail.pageSize) {
		dp('updateState', {pageIndex : current-1, pageSize});
		dp('query', {pageIndex : current-1, pageSize, ...searchData,});
    };
	
	//当前点击的tabs
	function tableChange(currentTabTag) {
		switch(currentTabTag){
			case "1":
				dp('getStudentlist', {})
			  break;
			case "2":
				dp('getSignList')
			  break;
			default:
		}
	}
	
	//学员列表相关
    //表格分页、排序、筛选变化时触发
    let tableOnChange = function(pagination, filters, sorter) {
        //TODO
    };

    //表格列标题点击事件
    let tableColumnHeadClick = function(columnKey) {
        //TODO
    };
		
    //表格点击姓名进行编辑
    let tableOnEditItem = function(record) {
		dispatch(
            routerRedux.push({
				pathname: 'crm_stu_detail',
				query: {
					studentId 	: record.id,
					orgId		: topList.orgId,
					key 		: 'parentInfo',
				},
			})
        )
    };
	
	//点击单个作品	
	function tableOnEditItemWork(record) {
		dispatch(
			routerRedux.push({
				pathname: 'crm_stu_detail',
				query: {
					key 		: 'studentWorks',
					studentId 	: record.id,
					orgId		: topList.orgId,
				},
			})
		)
	};
		
    //表格点击筛选
    let tableOnFilter = function() {
        dispatch({
            type: 'classesDetail/updateState',
            payload:{
                searchVisible:!searchVisible,
            }
        });
    };

    //查询框清除条件
    let searchReset = function() {

    };

    //查询框点击查询
    let searchSubmit = function(searchData) {

    };

    //表单窗口关闭
    let formCancel = function() {
        dispatch({
            type:'classesDetail/updateState',
            payload:{
                formVisible:false,
                formData:{},
            }
        });
    };

    //表单窗口提交
    let formSubmit = function(data) {
	 	dispatch({
            type:'classesDetail/modify',
            payload:{
                parameters: data,
            }
        });
    };

    let IntroEdit = function(){
        dispatch({
            type:'classesDetail/updateState',
            payload:{
                formVisible:true,
            }
        });
    };
	
	//顶部数据
    let classesDetailIntroProps = {
        searchReset,
        searchSubmit,
        IntroEdit,
        topList,
		classesListTotal,
    };

	//学员列表属性
    let classesDetailListProps = {
        loading,
		classesList, 
		classesListTotal,
        tableOnFilter,
        tablePageChange,
        tableOnChange,
        tableOnEditItem,
		tableOnEditItemWork,
    };

	//编辑框属性
    let classesDetailEditModalProps = {
        formData,
        formLoading,
        formSubmit,
        formCancel,
        formVisible,
        topList,
		dp,
		selectBishopTeacherIds,
		selecttTaTeacherIds,
		teacherListSelectArr,

		cnum,
		pnum,
		ctype,
    };
	
	//课程表属性
	let props = {
		defaultQuery : {
			orgId : topList&&topList.orgId,
			classId : topList&&topList.id,
		}
	}
		
	//签到编辑编辑
	function modifyFunction(cpId) {
		dispatch({
            type: 'scheduleSignModel/showScheduleSign',
            payload: {
                orgId : topList&&topList.orgId,
				cpId,
            }
        });
	}	

	//签到列表属性
	let signRecordProps = {
		signRecordList,
		signRecordPageData,
		pageIndex,
		pageSize,
		selectedRowKeys,
		modifyFunction,
		dp,
	}

    return (
        <div style={{overflow : 'hidden'}}>
            <ClassesDetailIntro {...classesDetailIntroProps}/>
            <div className="tabs" style={{margin:20}}>
                <Tabs 
					defaultActiveKey="1" 
					type='card'
					onChange={tableChange}
				>
                    <TabPane tab={<span>学员</span>} key="1"><ClassesDetailList {...classesDetailListProps} /></TabPane>
                    <TabPane tab={<span>签到记录</span>} key="2"><ClassesSignRecordList {...signRecordProps} /></TabPane>
                    <TabPane tab={<span>课程表</span>} key="3"><ClassSchedule {...props}/></TabPane>
                </Tabs>
            </div>
            <ClassesDetailEditModal {...classesDetailEditModalProps} />
			<ScheduleSignPage />
        </div>
  );
}

function mapStateToProps({ classesDetail }) {
  	return { classesDetail };
}

export default connect(mapStateToProps)(ClassesDetail);
