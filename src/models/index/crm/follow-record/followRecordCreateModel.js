import {
	getFollowRecordInfo,
	getStudentList,
	getStudentLeadersList,
	getParentList,
	getLeaderParentList,
	getFollowTypeList,

	confirmUpdateFollowRecord,
	confirmAddFollowRecord
} from '../../../../services/crm/follow-record/followRecordCreateService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'followRecordCreateModel',

    state : {
		followRecordCreateVisible : false,
		followRecordInfo          : {},            //修改时已有的内容
		followTypeList            : [],
		studentList               : [],
		parentList                : [],
		id                        : undefined,     //跟进记录id
		stuId                     : undefined,     //学员id
		orgId                     : undefined,     //校区id

		source                    : undefined,     //来源
		condition                 : undefined,

		followRecordBtnLoading    : false
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/follow_up' ){

				}
            })
        }
    },

    effects : {
		*openFollowRecordCreate({ payload },{ call, put, select }){
			let state = yield select( state => state.followRecordCreateModel );
			let followRecordCreateVisible = state.followRecordCreateVisible;
			let { id, stuId, orgId, source, condition } = payload;
			if( !orgId ){
				orgId = window._init_data.firstOrg.key;
			}
			let { ret } = yield call( getFollowRecordInfo , ({ id : id }));
			let studentList = {};
			if( source == '2' ){
				studentList = yield call( getStudentLeadersList, ({ orgId : orgId, condition }));
			}else{
				studentList = yield call( getStudentList, ({ orgId : orgId, condition }) );
			}
			if( studentList && studentList.ret && studentList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentList : studentList.ret.results
					}
				})
			}
			if( ret && ret.errorCode == 9000 ){
				if( !!stuId || !! id ){
					let parentList = {};
					if( source == '2' ){
						parentList = yield call( getLeaderParentList, ({ stuId : stuId, orgId : orgId }));

					}else{
						parentList = yield call( getParentList, ({ stuId : stuId }));
					}
					if( parentList && parentList.ret && parentList.ret.errorCode == 9000 ){
						yield put({
							type : 'updateState',
							payload : {
								parentList : parentList.ret.results,
							}
						})
					}
				}
				yield put({
					type : 'updateState',
					payload : {
						stuId                     : stuId,
						orgId                     : orgId,
						followRecordInfo          : ret,
						followRecordCreateVisible : !followRecordCreateVisible,
						source                    : source,
						id                        : id,
						condition                 : condition

					}
				})
				let followTypeList = yield call( getFollowTypeList, ({ dictkey : 'studentFollowWay' }));
				if( followTypeList && followTypeList.ret && followTypeList.ret.errorCode == 9000 ){
					yield put({
						type : 'updateState',
						payload : {
							followTypeList : followTypeList.ret.list
						}
					})
				}
			}
		},

		/*确认新增跟进记录*/
		*confirmAddFollowRecord({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					followRecordBtnLoading : true
				}
			})
			let { values, refreshList } = payload;
			if( !!values.nextFollowTime ){
				values.nextFollowTime = values.nextFollowTime.format('YYYY-MM-DD HH:mm:00');
			}
			let state = yield select( state => state.followRecordCreateModel );
			let id = state.id;
			let params = {
				id     : state.id,
				source : state.source,
				...values
			};
			let ret = {};
			if( !!id ){
				let updateFollowRecord = yield call( confirmUpdateFollowRecord, ( params ));
				ret = updateFollowRecord.ret;
			}else{
				let createFollowRecord = yield call( confirmAddFollowRecord, ( params ));
				ret = createFollowRecord.ret;
			}
			if( ret && ret.errorCode == 9000 ){
				refreshList();             //新增后刷新列表
				yield put({
					type : 'updateState',
					payload : {
						followRecordCreateVisible : false,
						stuId                     : undefined,
						orgId                     : undefined,
						followRecordInfo          : {},
						followTypeList            : [],
						studentList               : [],
						parentList                : []
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '新增记录失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					followRecordBtnLoading : false
				}
			})
		},

		/*切换校区得到学员下拉*/
		*TenantSelectOnSelect({ payload },{ call, put, select }){
			let state = yield select( state => state.followRecordCreateModel );
			let condition = state.condition;
			let { value } = payload;
			let ret = {};
			if( state.source == '2' ){
				ret = yield call( getStudentLeadersList, ({ orgId : value, condition }));
			}else{
				ret = yield call( getStudentList, ({ orgId : value, condition }));
			}
			if( ret && ret.ret && ret.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentList : ret.ret.results,
						orgId       : value,
					}
				})
			}else{
				message.error( ret.ret && ret.ret.errorMessage || '获取学员下拉列表失败' )
			}
		},

		/*切换学员获得家长列表*/
		*studentChange({ payload },{ call, put, select }){
			let { value } = payload;
			let state = yield select( state => state.followRecordCreateModel );
			let ret = {};
			if( state.source == '2' ){
				ret = yield call( getLeaderParentList, ({ stuId : value, orgId : state.orgId }));
			}else{
				ret = yield call( getParentList, ({ stuId : value }));
			}
			if( ret.ret && ret.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						parentList : ret.ret.results
					}
				})
			}else{
				message.error( ret.ret && ret.ret.errorMessage || '获取家长下拉列表失败' )
			}
		}
    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
