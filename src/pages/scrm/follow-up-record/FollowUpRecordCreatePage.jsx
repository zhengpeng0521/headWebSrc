import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FollowUpRecordCreate from '../../../components/scrm/follow-up-record/FollowUpRecordCreate';

function FollowUpRecordCreatePage ({ dispatch , followUpRecordCreateModel, refreshList }){
	let {
        followUpRecordModalVisible,
        followUpRecordInfo,
        followUpTypeList,
        studentList,
        parentIdList,
        stuId,
        orgId,
    } = followUpRecordCreateModel;

    //取消新增跟进记录
    function cancelAddFollowUpRecord(){
        dispatch({
            type : 'followUpRecordCreateModel/updateState',
            payload : {
                followUpRecordModalVisible : !followUpRecordModalVisible,
                followUpRecordInfo : {},
                stuId              : '',
                orgId              : '',
                followUpRecordId   : '',
            }
        })
    };

    //选择学员得到家长列表
    function studentChange( value ){
        dispatch({
            type : 'followUpRecordCreateModel/studentChange',
            payload : {
                value
            }
        })
    };

    //确认新增跟进记录
    function confirmAddFollowUpRecord( values ){
        dispatch({
            type : 'followUpRecordCreateModel/confirmAddFollowUpRecord',
            payload : {
                values,
                refreshList
            }
        })
    };

    //选择校区得到学员下拉列表
    function TenantSelectOnSelect( orgId ){
        dispatch({
            type : 'followUpRecordCreateModel/TenantSelectOnSelect',
            payload : {
                orgId
            }
        })
    };

    let followUpRecordCreateProps = {
        followUpRecordModalVisible,
        followUpRecordInfo,
        followUpTypeList,
        studentList,
        parentIdList,
        stuId,
        orgId,
        cancelAddFollowUpRecord,
        confirmAddFollowUpRecord,
        studentChange,

        TenantSelectOnSelect
    }

	return (
        <FollowUpRecordCreate { ...followUpRecordCreateProps } />
	)
};

function mapStateToProps ({ followUpRecordCreateModel }){
	return { followUpRecordCreateModel };
};

export default connect(mapStateToProps)(FollowUpRecordCreatePage);
