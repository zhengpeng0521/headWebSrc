import React from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm, message, Popover, Tabs } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { StatusFlag, NewModal} from '../../../components/common/new-component/NewComponent';
import DetailHeader from '../../../components/cerp/class-manage/class-manage-detail/DetailHeader';
import StudentList from '../../../components/cerp/class-manage/class-manage-detail/StudentList';
import AttendClassList from '../../../components/cerp/class-manage/class-manage-detail/AttendClassList';
import AppointClassModal from '../../../components/cerp/class-manage/class-manage-detail/AppointClassModal';
import EditClassInfoModal from '../../../components/cerp/class-manage/class-manage-detail/EditClassInfoModal';
import AddStudentModal from '../../../components/cerp/class-manage/class-manage-detail/AddStudentModal';
import { AlertModal } from '../../../components/common/new-component/NewComponent';

const TabPane = Tabs.TabPane;

function ClassManageDetailPage({ dispatch, classManageDetailModel }) {
	let {
		detailVisible,
		activeKey,

		currentItem,
		userList,
		stuList,
		roomList,
		courseList,

		/*班级学员 参数*/
		studentDataSource,
		studentResultCount,
		studentPageSize,
		studentPageIndex,
		studentLoading,

		studentNoClassNum,
		/*班级学员 参数*/

		/*上课记录 参数*/
		attendClassDataSource,
		attendClassResultCount,
		attendClassPageSize,
		attendClassPageIndex,
		attendClassLoading,
		/*上课记录 参数*/

		/*班级成员约课情况 参数*/
		appointClassModalVisible,
		hasAppointList,
		appointClassObj,
		/*班级成员约课情况 参数*/

		/*修改信息*/
		editClassInfoObj,
		editClassInfoVisible,
		/*修改信息*/

		/*添加学员 */
		addStudentVisible,
		/*添加学员 */

		/*详情删除班级 二次确认*/
		AlertVisible,
		AlertTitle,
		AlertContent,
		AlertButtonLoading
		/*详情删除班级 二次确认*/

    } = classManageDetailModel;

	/*改变tab页*/
	function changeTab( activeKey ){
		dispatch({
			type : 'classManageDetailModel/changeTab',
			payload : {
				activeKey
			}
		})
	}

	/*关闭详情*/
	function closeDetail(){
		dispatch({
			type : 'classManageDetailModel/updateState',
			payload : {
				detailVisible : false,
				currentItem   : {},
				userList      : [],
				stuList       : [],
				roomList      : [],
				courseList    : []
			}
		})
	}

	/*编辑班级*/
	function editClass(){
		dispatch({
			type : 'classCreateFormModel/editClass',
			payload : {
				currentItem,
				courseList,
				userList
			}
		})
	}

	/*点击删除班级*/
	function deleteClassItem( clsId, orgId ){
		dispatch({
			type : 'classManageDetailModel/updateState',
			payload : {
				AlertVisible : true
			}
		})
	}

	/*确认删除班级*/
	function AlertOnOk(){
		dispatch({
			type : 'classManageDetailModel/AlertOnOk',
			payload : {
				clsId : currentItem.clsId,
				orgId : currentItem.orgId
			}
		})
	}

	/*取消删除班级*/
	function AlertOnCancel(){
		dispatch({
			type : 'classManageDetailModel/updateState',
			payload : {
				AlertVisible : false
			}
		})
	}

	/*班级学员 分页*/
	function studentPageIndexChange( pageIndex, pageSize ){
		dispatch({
			type : 'classManageDetailModel/studentPageIndexChange',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}

	/*上课记录 分页*/
	function attendClassPageIndexChange( pageIndex, pageSize ){
		dispatch({
			type : 'classManageDetailModel/attendClassPageIndexChange',
			payload : {
				pageIndex,
				pageSize
			}
		})
	}

	/*移除学员*/
	function removeStudent( stuId ){
		dispatch({
			type : 'classManageDetailModel/removeStudent',
			payload : {
				stuId
			}
		})
	}

	/*得到学员未上课 节数*/
	function getClassNum( stuId ){
		dispatch({
			type : 'classManageDetailModel/getClassNum',
			payload : {
				stuId
			}
		})
	}

	/*删除上课记录*/
	function deleteClassRecord( orgId, cpmId, cpdId ){
		dispatch({
			type : 'classManageDetailModel/deleteClassRecord',
			payload : {
				orgId, cpmId, cpdId
			}
		})
	}

	/*修改信息*/
	function editClassInfo( record ){
		dispatch({
			type : 'classManageDetailModel/updateState',
			payload : {
				editClassInfoVisible : true,
				editClassInfoObj     : record
			}
		})
	}

	/*查看班级学员约课情况*/
	function checkAppointClassStuNum( record ){
		dispatch({
			type : 'classManageDetailModel/checkAppointClassStuNum',
			payload : {
				record
			}
		})
	}

	/*关闭班级学员约课情况*/
	function closeAppointClassFunc(){
		dispatch({
			type : 'classManageDetailModel/updateState',
			payload : {
				appointClassModalVisible : false,
				hasAppointList           : [],
				appointClassObj          : {}
			}
		})
	}

	/*取消修改排课信息*/
	function classInfoCreateCancel(){
		dispatch({
			type : 'classManageDetailModel/updateState',
			payload : {
				editClassInfoVisible : false,
				editClassInfoObj     : {}
			}
		})
	}

	/*确认修改排课信息*/
	function classInfoCreateConfirm( values ){
		dispatch({
			type : 'classManageDetailModel/classInfoCreateConfirm',
			payload : {
				values
			}
		})
	}

	/*添加学员*/
	function addStudent(){
		dispatch({
			type : 'classManageDetailModel/updateState',
			payload : {
				addStudentVisible : true
			}
		})
	}

	/*取消添加学员*/
	function cancelAddStudent(){
		dispatch({
			type : 'classManageDetailModel/updateState',
			payload : {
				addStudentVisible : false
			}
		})
	}

	/*确认添加学员*/
	function confirmAddStudent( values ){
		let stuIdArr = values.stuId;
		let stuIdStr = stuIdArr.join(',');
		values.stuId = stuIdStr;
		dispatch({
			type : 'classManageDetailModel/confirmAddStudent',
			payload : {
				values
			}
		})
	}

	/*头部参数*/
	let detailHeaderProps = {
		currentItem,

		closeDetail,          //关闭详情
		editClass,            //编辑班级
		deleteClassItem,      //删除班级
	}

	/*班级学员参数*/
	let studentListProps = {
		studentDataSource,
		studentResultCount,
		studentPageSize,
		studentPageIndex,
		studentLoading,

		studentNoClassNum,

		/*方法*/
		studentPageIndexChange,

		getClassNum,                 //得到学员未上课节数
		removeStudent,               //移除学员
	}

	/*上课记录*/
	let attentClassListProps = {
		attendClassDataSource,
		attendClassResultCount,
		attendClassPageSize,
		attendClassPageIndex,
		attendClassLoading,

		/*方法*/
		attendClassPageIndexChange,

		deleteClassRecord,             //删除上课记录
		editClassInfo,                 //修改信息
		checkAppointClassStuNum,       //查看班级成员约课情况
	}

	/*班级成员约课情况参数*/
	let appointClassModalProps = {
		appointClassModalVisible,
		hasAppointList,
		appointClassObj,
		studentDataSource,

		closeAppointClassFunc
	}

	/*修改信息模态框*/
	let editClassInfoModalProps = {
		editClassInfoVisible,
		editClassInfoObj,
		userList,
		roomList,

		classInfoCreateCancel,           //取消修改排课信息
		classInfoCreateConfirm,          //确认修改排课信息
	}

	/*增加学员 模态框*/
	let addStudentModalProps = {
		studentDataSource,          //已报班学员

		stuList,
		currentItem,         //当前选中的班级
		addStudentVisible,

		cancelAddStudent,
		confirmAddStudent,
	}

	 let AlertModalProps = {
        visible       : AlertVisible,                   //提示框是否显示
        title         : AlertTitle,                     //提示框标题
        content       : AlertContent,                   //提示框内容
        buttonLoading : AlertButtonLoading,             //提示框按钮是否加载状态
        onOk          : AlertOnOk,                      //提示框点击确认
        onCancel      : AlertOnCancel,                  //提示框点击取消
    }

    return (
		<div className = 'common_detail' >
			<NewModal
				visible = { detailVisible }
				width = '900px'
				headVisible = { false }
				footer = '' >
				<DetailHeader { ...detailHeaderProps } />
				<Tabs onChange = { changeTab } size = 'small' activeKey = { activeKey } >
					<TabPane tab = '班级学员' key = "1" >
						<Button type = 'primary' style = {{ marginLeft : '20px', marginTop : '20px' }} onClick = { addStudent } >添加学员</Button>
						<div className = 'vip_detail_content_item' >
							<StudentList { ...studentListProps } />
						</div>
					</TabPane>
					<TabPane tab = '上课记录' key = '2' >
						<div className = 'vip_detail_content_item' >
							<AttendClassList { ...attentClassListProps } />
						</div>
					</TabPane>
				  </Tabs>
			</NewModal>
			<AppointClassModal { ...appointClassModalProps } />
			<EditClassInfoModal { ...editClassInfoModalProps } />
			<AddStudentModal { ...addStudentModalProps } />
			<AlertModal { ...AlertModalProps }/>
		</div>
    );

}

function mapStateToProps({ classManageDetailModel }) {
  	return { classManageDetailModel };
}

export default connect(mapStateToProps)(ClassManageDetailPage);
