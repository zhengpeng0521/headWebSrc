import {
	classCreateConfirm,            //确认新增班级
	classUpdateConfirm,            //确认修改班级

	getCourseList,                 //得到课程下拉列表
} from '../../../../services/cerp/class-manage/classCreateFormService';
import { parse } from 'qs';
import { message } from 'antd';

export default {

	namespace: 'classCreateFormModel',

	state: {
		createVisible         : false,                  //表单显隐
		orgId                 : undefined,
		userList              : [],
		courseList            : [],

		classInfo             : {},
		btnLoading            : false
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if(pathname === '/sys_scfg_param_set') {
				}
			});
		},
	},

	effects: {
		*openCreateClassModal({ payload },{ call, put, select }){
			let { orgId, userList, courseList } = payload;
			yield put({
				type : 'updateState',
				payload : {
					createVisible : true,
					orgId, userList, courseList
				}
			})
			/*获取课程下拉列表*/
			let { ret } = yield call( getCourseList, ({ orgId }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						courseList : ret.results
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取课程下拉失败' )
			}
		},

		*editClass({ payload },{ call, put, select }){
			let { courseList, userList, currentItem } = payload;
			yield put({
				type : 'updateState',
				payload : {
					courseList,
					userList,
					createVisible : true,
					orgId         : currentItem.orgId,
					classInfo     : currentItem
				}
			})
		},

		/*新增班级*/
		*classCreateConfirm({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { btnLoading : true }})
			let { values } = payload;
			let state = yield select( state => state.classCreateFormModel );
			let classInfo = state.classInfo || {};
			let clsId = classInfo.clsId;
			let ret = {};
			if( !!clsId ){
				ret = yield call( classUpdateConfirm, ( { ...values, clsId } ));
			}else{
				ret = yield call( classCreateConfirm, ( values ) );
			}
			ret = ret.ret;
			if( ret && ret.errorCode == 9000 ){
                message.success('保存成功');
				yield put({
					type : 'updateState',
					payload : {
						createVisible : false,
						orgId         : undefined,
						classInfo     : {}
					}
				})
				yield put({
					type : 'classManageModel/refreshClasssList',
				})
				if( !!clsId ){
					yield put({
						type : 'classManageDetailModel/getClassDetailInfo',
						payload : {
							clsId
						}
					})
				}
			}else {
				message.error( ret && ret.errorMessage || '新增班级失败' )
			}
			yield put({ type : 'updateState', payload : { btnLoading : false }})
		}
	},

	reducers: {
		updateState(state, action){
			return { ...state, ...action.payload };
		}
	},
}
