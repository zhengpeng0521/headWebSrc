import {
    getFollowUpTypeList,
    getFollowUpInfo,
    getStudentList,
    getParentIdList,
    confrimAddFollowUpRecord,
    confirmUpdateFollowUpRecord
} from '../../../../services/scrm/follow-up-record/followUpRecordCreateService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'followUpRecordCreateModel',

	state : {
        followUpRecordModalVisible        : false,                //新增跟进记录框
        followUpRecordInfo                : {},                   //获得跟进记录信息
        followUpTypeList                  : [],                   //跟进方式下拉列表
        studentList                       : [],                   //学员下拉列表
        parentIdList                      : [],                   //家长下拉列表
        followUpRecordId                  : '',                   //跟进记录id
        stuId                             : '',                   //学员id
        orgId                             : '',                   //校区id
	},

	effects : {
        *openFollowUpRecordModal({ payload },{ put, select, call}){
            let followUpRecordCreateModel = yield select( state => state.followUpRecordCreateModel );
            let followUpRecordModalVisible = followUpRecordCreateModel.followUpRecordModalVisible;
            let { id, stuId, orgId } = payload;
            //获得跟进人名称
            let { ret } = yield call( getFollowUpInfo, ({ id : id }));
            if( ret && ret.errorCode == '9000' ){
                if( !!id || !!stuId ){
                    let studentList = yield call( getStudentList, ({ orgId : ret.orgId || '' }));
                    if( studentList && studentList.ret && studentList.ret.errorCode == '9000' ){
                        yield put({
                            type : 'updateState',
                            payload : {
                                studentList : studentList.ret.results,
                            }
                        })
                    }else {
                        message.error( ret && ret.errorMessage || '获取学员下拉列表失败' );
                    }
                    let parentIdList = yield call( getParentIdList, ({ stuId : ret.stuId || stuId }));
                    if( parentIdList && parentIdList.ret && parentIdList.ret.errorCode == '9000' ){
                        yield put({
                            type : 'updateState',
                            payload : {
                                parentIdList     : parentIdList.ret.results,
                                followUpRecordId : id,
                                stuId            : stuId,
                                orgId            : orgId
                            }
                        })
                    } else {
                        message.error( ret && ret.errorMessage || '获取家长下拉列表失败' );
                    }
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        followUpRecordInfo          : ret,
                        followUpRecordModalVisible  : !followUpRecordModalVisible
                    }
                })
            }else {
                message.error( ret && ret.errorMessage || '获取跟进记录信息失败' );
            };

            let followUpTypeList = yield call( getFollowUpTypeList, ({ dictkey : 'studentFollowWay' }));
            if( followUpTypeList &&  followUpTypeList.ret && followUpTypeList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        followUpTypeList : followUpTypeList.ret.list,
                    }
                })
            } else {
                message.error( ret && ret.errorMessage || '获取跟进方式下拉列表失败' );
            };

        },

        //选择学员得到家长列表
        *studentChange({ payload },{ call, put, select }){
            let { value } = payload;
            let { ret } = yield call( getParentIdList, ({ stuId : value }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        parentIdList : ret.results,
                    }
                })
            }
        },

        //确认新增跟进记录
        *confirmAddFollowUpRecord({ payload },{  call, put, select }){
            let { values, refreshList } = payload;
            let followUpRecordCreateModel = yield select( state => state.followUpRecordCreateModel );
            let followUpRecordModalVisible = followUpRecordCreateModel.followUpRecordModalVisible;
            let followUpRecordId = followUpRecordCreateModel.followUpRecordId;
            let params = {
                id : followUpRecordId,
                ...values,
            }
            let ret = {};
            if( !!followUpRecordId ){
                let confirmAdd = yield call( confirmUpdateFollowUpRecord,({ ...params }));
                ret = confirmAdd.ret;

            } else{
                let confirmAdd = yield call( confrimAddFollowUpRecord, ({ ...params }));
                ret = confirmAdd.ret;
            }
            if( ret && ret.errorCode == '9000' ){
                refreshList();
                yield put({
                    type : 'updateState',
                    payload : {
                        followUpRecordInfo : {},
                        stuId : ''
                    }
                })
            }
        },

        //选择校区得到学员下拉列表
        *TenantSelectOnSelect({ payload },{ call, put, select }){
            let { orgId } = payload;


            let { ret } = yield call( getStudentList, ({ orgId : orgId }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        studentList : ret.results,
                    }
                })
            }
        }
    },
	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
