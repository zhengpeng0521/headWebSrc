import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import FollowRecordCreateComponent from '../../../components/crm/follow-record/FollowRecordCreate';

function FollowRecordCreatePage({ dispatch, followRecordCreateModel, refreshList }){
    let {

		followRecordCreateVisible,
		followRecordInfo,
		followTypeList,
		studentList,
		parentList,
		id,
		stuId,
		orgId,
		followRecordBtnLoading,
		source

    } = followRecordCreateModel;
	/*取消新增跟进记录*/
	function cancelAddFollowRecord(){
		dispatch({
			type : 'followRecordCreateModel/updateState',
			payload : {
				followRecordCreateVisible : false
			}
		})
	}

	/*确认新增跟进记录*/
	function confirmAddFollowRecord( values ){
		dispatch({
			type : 'followRecordCreateModel/confirmAddFollowRecord',
			payload : {
				values,
				refreshList
			}
		})
	}

	/*学员更换 获得家长下拉*/
	function studentChange( value ){
		dispatch({
			type : 'followRecordCreateModel/studentChange',
			payload : {
				value
			}
		})
	}

	/*校区更换 获得学员下拉*/
	function TenantSelectOnSelect( value ){
		dispatch({
			type : 'followRecordCreateModel/TenantSelectOnSelect',
			payload : {
				value
			}
		})
	}

	let followRecordCreateProps = {
		followRecordCreateVisible,
		followRecordInfo,
		followTypeList,
		studentList,
		parentList,
		id,
		stuId,
		orgId,
		source,
		followRecordBtnLoading,        //提交loading状态
		cancelAddFollowRecord,
		confirmAddFollowRecord,
		studentChange,

		TenantSelectOnSelect,
	}

    return (
        <div>
			<FollowRecordCreateComponent { ...followRecordCreateProps } />
        </div>
    )
};

function mapStateToProps ({ followRecordCreateModel }){
	return { followRecordCreateModel };
};

export default connect( mapStateToProps )( FollowRecordCreatePage );
