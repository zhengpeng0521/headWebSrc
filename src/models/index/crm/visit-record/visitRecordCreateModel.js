import {
	getStudentLeadersList,            //得到名单下拉列表
	getStudentList,                   //得到学员下拉列表
	confirmAddVisitRecord,			  //确认新增到访记录

	getVisitRecordInfo,               //得到到访详情
} from '../../../../services/crm/visit-record/visitRecordCreateService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'visitRecordCreateModel',

    state : {
		visitRecordCreateVisible  : false,
		visitRecordInfo           : {},            //修改时已有的内容
		studentList               : [],

		id                        : undefined,     //到访记录id
		stuId                     : undefined,     //学员id
		orgId                     : undefined,     //校区id
		sellerId                  : undefined,

		source                    : undefined,     //来源
		condition                 : undefined,

		visitRecordBtnLoading     : false
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
		*openVisitRecordCreate({ payload },{ call, put, select }){
			let state = yield select( state => state.visitRecordCreateModel );
			let visitRecordCreateVisible = state.visitRecordCreateVisible;
			let { id, stuId, orgId, source, condition } = payload;
			if( !orgId ){
				orgId = window._init_data.firstOrg.key;
			}
			let { ret } = yield call( getVisitRecordInfo , ({ id : id, orgId : orgId }));
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
				yield put({
					type : 'updateState',
					payload : {
						stuId                     : stuId,
						orgId                     : orgId,
						visitRecordInfo           : ret,
						visitRecordCreateVisible  : !visitRecordCreateVisible,
						source                    : source,
						id                        : id,
						condition
					}
				})
			}
		},

		/*确认新增跟进记录*/
		*confirmAddVisitRecord({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					visitRecordBtnLoading : true
				}
			})
			let { values, refreshList } = payload;
			if( !!values.visitTime ){
				values.visitTime = values.visitTime.format('YYYY-MM-DD HH:mm:00');
			}
			let state = yield select( state => state.visitRecordCreateModel );
			let id = state.id;
			let params = {
				id       : state.id,
				source   : state.source,
				sellerId : !!state.visitRecordInfo && state.visitRecordInfo.sellerId,
				...values
			};
			let { ret } = yield call( confirmAddVisitRecord, ( params ));
			if( ret && ret.errorCode == 9000 ){
				refreshList();             //新增后刷新列表
				yield put({
					type : 'updateState',
					payload : {
						visitRecordCreateVisible  : false,
						stuId                     : undefined,
						orgId                     : undefined,
						visitRecordInfo           : {},
						studentList               : []
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '新增记录失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					visitRecordBtnLoading : false
				}
			})
		},

		/*切换校区得到学员下拉*/
		*TenantSelectOnSelect({ payload },{ call, put, select }){
			let state = yield select( state => state.visitRecordCreateModel );
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

    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
