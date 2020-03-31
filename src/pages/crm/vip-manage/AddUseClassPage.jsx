import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, message } from 'antd';
import { StatusFlag } from '../../../components/common/new-component/NewComponent';
import AddUseClassModal from '../../../components/crm/vip-manage/vip-manage-modal/AddUseClassModal';

function AddUseClassPage({ dispatch, addUseClassModel }){
    let {
		orgId,                  //选中第一个校区
		visible,                //新增消课记录 是否显示

		vipCardId,              //所选学员的会员卡号

		stuIdList,              //拥有会员卡的学员下拉列表
		courseList,             //消课课程下拉列表
		selectedCourse,         //选中所需消课的课程
		addUseClassBtnLoading,  //表单提交后 按钮变loading状态

    } = addUseClassModel;

	//确认新增消课记录
	function confirmAddUseClass( values ){
		dispatch({
			type : 'addUseClassModel/confirmAddUseClass',
			payload : {
				values
			}
		})
	}

	//取消新增消课记录
	function cancelAddUseClass(){
		dispatch({
			type : 'addUseClassModel/updateState',
			payload : {
				visible   : false,
				vipCardId : undefined,
				selectedCourse : [],
				courseList     : []
			}
		})
	}

	//选择校区
	function TenantSelectOnSelect( value ){
		dispatch({
			type : 'addUseClassModel/TenantSelectOnSelect',
			payload : {
				value
			}
		})
	}

	//选择消课课程
	function selectCourse( arrs ){
		let selectedCourse = !!courseList && courseList.filter( function( item, index ){
			return arrs.includes( item.courseId )
		})
		dispatch({
			type : 'addUseClassModel/updateState',
			payload : {
				selectedCourse
			}
		})
	}

	//选择拥有会员卡的学员
	function selectStuId( value, props ){
		dispatch({
			type : 'addUseClassModel/updateState',
			payload : {
				vipCardId      : props.props.cardId,
				selectedCourse : [],
			}
		});
		dispatch({
			type : 'addUseClassModel/getCourseList',
			payload : {
				value
			}
		})
	}

	let addUseClassModalProps = {
		orgId,                  //选中第一个校区
		visible,                //新增消课记录 是否显示

		vipCardId,              //所选学员的会员卡号

		stuIdList,              //拥有会员卡的学员下拉列表
		courseList,             //消课课程下拉列表
		selectedCourse,         //选中所需消课的课程
		addUseClassBtnLoading,  //表单提交后 按钮变loading状态

		//方法
		cancelAddUseClass,            //取消新增消课记录
		confirmAddUseClass,           //确认新增消课记录

		TenantSelectOnSelect,         //选择校区
		selectCourse,                 //选择消课课程
		selectStuId,                  //选择有会员卡的学员
	}

	return (
		<AddUseClassModal { ...addUseClassModalProps } />
	)
};

function mapStateToProps ({ addUseClassModel }){
	return { addUseClassModel };
};

export default connect( mapStateToProps )( AddUseClassPage );
