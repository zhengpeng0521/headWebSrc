import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import { StatusFlag, NewModal } from '../../../components/common/new-component/NewComponent';
import styles from './ClassesManageDetailPage.less';
import DetailHeader from '../../../components/erp/classes-management/classes-detail/DetailHeader';
import StudentList from '../../../components/erp/classes-management/classes-detail/StudentList';
import SignUpList from '../../../components/erp/classes-management/classes-detail/SignUpList';
//import ClassSchedulePage from '../../../pages/erp/schedule/SchedulePage';                 //课程表
import ClassSchedule from '../class-schedule/ClassSchedule';
import ClassesDetailEditModal from '../../../components/erp/classes-detail/ClassesDetailEditModal';

const TabPane = Tabs.TabPane;

function ClassesManageDetailPage({ dispatch, classesDetailModel }){
    let {
		detailVisible,

		activeKey,         //当前激活的tab
		currentItem,

		/*学员*/
		studentDataSource,
		studentResultCount,
		studentPageIndex,
		studentPageSize,
		studentLoading,
		/*学员*/

		/*签到记录*/
		signUpDataSource,
		signUpResultCount,
		signUpPageIndex,
		signUpPageSize,
		signUpLoading,
		/*签到记录*/

		topList,
		formVisible,
		formLoading,     	 	//表单按钮加载
		formData,
		selectBishopTeacherIds,
		selecttTaTeacherIds,
		teacherListSelectArr,

    } = classesDetailModel;

	/*关闭详情*/
	function closeDetail(){
		dispatch({
			type : 'classesDetailModel/updateState',
			payload : {
				detailVisible : false
			}
		})
	}

	function changeTab( activeKey ){
		dispatch({
			type : 'classesDetailModel/changeTab',
			payload : {
				activeKey
			}
		})
	}

	/*学员tab分页*/
	function studentPageIndexChange( pageIndex ){
		dispatch({
			type : 'classesDetailModel/studentPagination',
			payload : {
				studentPageIndex : pageIndex,
				studentPageSize
			}
		})
	}

	/*签到记录分页*/
	function signUpPageIndexChange( pageIndex ){
		dispatch({
			type : 'classesDetailModel/signUpPagination',
			payload : {
				signUpPageIndex : pageIndex,
				signUpPageSize
			}
		})
	}

	/*修改班级*/
	function updateClasses(){
		dispatch({
            type : 'classesDetailModel/updateState',
            payload : {
                formVisible : true,
            }
        });
	}

	//签到编辑编辑
	function modifyFunction( cpId ) {
		dispatch({
            type: 'scheduleSignModel/showScheduleSign',
            payload: {
                orgId : currentItem && currentItem.orgId,
				cpId,
            }
        });
	}

	let detailHeaderProps = {
		currentItem,

		closeDetail,
		updateClasses,
	}

	let studentListProps = {
		studentDataSource,
		studentResultCount,
		studentPageIndex,
		studentPageSize,
		studentLoading,

		/*方法*/
		studentPageIndexChange,
//		tableOnEditItemWork
	}

	let signUpListProps = {
		signUpDataSource,
		signUpResultCount,
		signUpPageIndex,
		signUpPageSize,
		signUpLoading,

		/*方法*/
		signUpPageIndexChange,
		modifyFunction
	}

	let scheduleProps = {
		defaultQuery : {
			orgId   : currentItem && currentItem.orgId,
			classId : currentItem && currentItem.id,
		}
	}


	function dp(name, paramter) {
		 dispatch({
            type: `classesDetailModel/${name}`,
            payload: {
               ...paramter
            },
        });
	}

	//表单窗口提交
    function formSubmit(data) {
	 	dispatch({
            type : 'classesDetailModel/modify',
            payload : {
                parameters: data,
            }
        });
    };

	//表单窗口关闭
    function formCancel() {
        dispatch({
            type:'classesDetailModel/updateState',
            payload:{
                formVisible : false,
                formData    : {},
            }
        });
    };

	//编辑框属性
    let classesDetailEditModalProps = {
        topList,
        formData,
        formLoading,
        formVisible,
		selectBishopTeacherIds,
		selecttTaTeacherIds,
		teacherListSelectArr,

        formSubmit,
        formCancel,
		dp
    };

    return (
		<div className = 'common_detail' >
			<NewModal
				visible = { detailVisible }
				width = '900px'
				headVisible = { false }
				footer = '' >
				<DetailHeader { ...detailHeaderProps } />
				<Tabs onChange = { changeTab } size = "small" activeKey = { activeKey } >
					<TabPane tab = '学员' key = "1">
						<div className = 'vip_detail_content_item' >
							<StudentList { ...studentListProps } />
						</div>
					</TabPane>
					<TabPane tab = '签到记录' key = "2">
						<div className = 'vip_detail_content_item' >
							<SignUpList { ...signUpListProps } />
						</div>
					</TabPane>
					<TabPane tab = '课程表' key = "3">
						<div className = 'vip_detail_content_item' >
							<ClassSchedule { ...scheduleProps } />
						</div>
					</TabPane>
				  </Tabs>
			</NewModal>
			<ClassesDetailEditModal { ...classesDetailEditModalProps } />
		</div>
    )
};

function mapStateToProps ({ classesDetailModel }){
	return { classesDetailModel };
};

export default connect( mapStateToProps )( ClassesManageDetailPage );
