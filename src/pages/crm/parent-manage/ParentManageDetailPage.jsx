import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button } from 'antd';
import { StatusFlag, NewModal } from '../../../components/common/new-component/NewComponent';
import DetailHeader from '../../../components/crm/parent-manage/parent-manage-detail/DetailHeader';
import StudentList from '../../../components/crm/parent-manage/parent-manage-detail/StudentList';
import FollowRecordList from '../../../components/crm/parent-manage/parent-manage-detail/FollowRecordList';
import LeadersTurnRecord from '../../../components/crm/parent-manage/parent-manage-detail/LeadersTurnRecord';
import AddBindStudent from '../../../components/crm/parent-manage/parent-manage-detail/AddBindStudent';

const TabPane = Tabs.TabPane;

function ParentManageDetailPage({ dispatch, parentManageDetailModel }){
    let {
		detailVisible,
		activeKey,

		currentItem,

		//学员列表
		studentDataSource,
		studentLoading,

		/*名单转化记录*/
		leaderTurnRecordDataSource,
		leaderTurnRecordLoading,
		leaderTurnRecordPageSize,
		leaderTurnRecordPageIndex,
		leaderTurnRecordResultCount,

		leadersTurnRecordVisible,

		/*添加关联学员*/
		stuIdList,
		parentRelationList,
		addBindStudentVisible,
        addBindButtonLoading

    } = parentManageDetailModel;

	/*改变tab*/
	function changeTab( activeKey ){
		dispatch({
			type : 'parentManageDetailModel/changeTab',
			payload : {
				activeKey
			}
		})
	}

	//关闭详情
	function closeDetail(){
		dispatch({
			type : 'parentManageDetailModel/updateState',
			payload : {
				detailVisible : false,
				currentItem   : undefined
			}
		})
	}

	//删除家长
	function deleteParent(){
		let selectedRecords = [];
		selectedRecords.push({
			pId   : currentItem.id,
			stuId : currentItem.stuId,
			orgId : currentItem.orgId,
		});
		dispatch({
            type : 'parentManageModel/deleteParent',
            payload : {
                selectedRecords
            }
        })
	}

	//名单转化记录
	function leaderTurnRecord(){
		dispatch({
			type : 'parentManageDetailModel/leaderTurnRecord',
			payload : {
			}
		})
	}

	//编辑家长
	function updateParent(){
		let id = currentItem.id;
		let orgId = currentItem.orgId;
		let stuId = currentItem.stuId;
		dispatch({
            type : 'parentManageModel/updateParent',
            payload : {
                id, orgId, stuId
            }
        })
	}

	/*头部详情参数*/
	let headDetailProps = {
		closeDetail,
		currentItem,

		deleteParent,            //删除家长
		leaderTurnRecord,        //名单转化记录

		updateParent,            //编辑家长详情
	}

	/*解除关联学员*/
	function cancelBindParent( stuId ){
		let selectedRecords = [];
		selectedRecords.push({
			stuId : stuId,
			pId   : currentItem.id,
			orgId : currentItem.orgId,
		});
		dispatch({
			type : 'parentManageDetailModel/cancelBindParent',
			payload : {
				selectedRecords
			}
		})
	}

	//学员列表
	let studentListProps = {
		studentDataSource,
		studentLoading,

		cancelBindParent,           //解除关联
	}

	//名单转化记录分页
	function leaderTurnRecordPageSizeChange( pageIndex, pageSize ){

	}
	function leaderTurnRecordPageIndexChange( pageIndex ){

	}

	//关闭名单转化记录
	function closeLeadersTurnRecord(){
		dispatch({
			type : 'parentManageDetailModel/updateState',
			payload : {
				leadersTurnRecordVisible  : false
			}
		})
	}
	//名单转化记录
	let leaderTurnRecordProps = {
		leaderTurnRecordDataSource,
		leaderTurnRecordLoading,
		leaderTurnRecordPageSize,
		leaderTurnRecordPageIndex,
		leaderTurnRecordResultCount,


		leaderTurnRecordPageSizeChange,
		leaderTurnRecordPageIndexChange,

		leadersTurnRecordVisible,
		closeLeadersTurnRecord
	}

	//点击添加关联学员
	function addBindStudent(){
		dispatch({
			type : 'parentManageDetailModel/addBindStudent',
			payload : {
			}
		})
	}

	//取消添加关联学员
	function cancelAddBindStudent(){
		dispatch({
			type : 'parentManageDetailModel/updateState',
			payload : {
				addBindStudentVisible : false
			}
		})
	}

	//确定添加关联学员
	function confirmAddBindStudent( values ){
		dispatch({
			type : 'parentManageDetailModel/confirmAddBindStudent',
			payload : {
				values
			}
		})
	}

	//绑定学员属性
	let addBindStudentProps = {
		addBindStudentVisible,
        addBindButtonLoading,

		stuIdList,
		parentRelationList,

		cancelAddBindStudent,
		confirmAddBindStudent,
	}

    return (
        <div className = 'common_detail' >
			<NewModal
				visible = { detailVisible }
				width = '900px'
				headVisible = { false }
				footer = '' >
				<DetailHeader { ...headDetailProps } />
				<Tabs onChange = { changeTab } size = "small" activeKey = { activeKey } >
					<TabPane tab = '学员' key = "1">
						<div className = 'vip_detail_content_item' >
							<Button type = 'primary' style = {{ marginLeft : '20px', marginBottom : '10px' }} onClick = { addBindStudent } >添加关联学员</Button>
							<StudentList { ...studentListProps } />
						</div>
					</TabPane>
				  </Tabs>
			</NewModal>
			<LeadersTurnRecord { ...leaderTurnRecordProps } />
			<AddBindStudent { ...addBindStudentProps } />
		</div>
    )
};

function mapStateToProps ({ parentManageDetailModel }){
	return { parentManageDetailModel };
};

export default connect( mapStateToProps )( ParentManageDetailPage );
