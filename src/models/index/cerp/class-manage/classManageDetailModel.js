import {
	getStudentList,             //得到班级学员列表
	getAttendClassList,         //得到上课记录列表

	getClassNum,                //获取学员所预约课程节数
	removeStudent,              //移除学员

	confirmAddStudent,          //确认添加学员
	deleteClassItem,            //删除班级

	getClassInfo,               //得到班级详情

	checkAppointClassStuNum,    //查看预约详情

	deleteClassRecord,          //删除日程

	classInfoCreateConfirm,     //确认修改信息
} from '../../../../services/cerp/class-manage/classManageDetailService';
import { parse } from 'qs';
import { message } from 'antd';

export default {

	namespace: 'classManageDetailModel',

	state: {
		currentItem                 : {},            //当前选中 表格项

		detailVisible               : false,         //详情是否打开
		activeKey                   : '1',           //tab页key

		currentItem                 : {},            //当前选择的班级

		userList                    : [],            //员工下拉列表
		stuList                     : [],            //学员下拉列表
		roomList                    : [],            //教室下拉列表
		courseList                  : [],            //课程下拉列表

		studentDataSource           : [],
		studentResultCount          : 0,
		studentPageSize             : 20,
		studentPageIndex            : 0,
		studentLoading              : false,

		studentNoClassNum           : 0,             //移除学员未上课节数

		attendClassDataSource       : [],
		attendClassResultCount      : 0,
		attendClassPageSize         : 20,
		attendClassPageIndex        : 0,
		attendClassLoading          : false,


		/*班级成员约课情况模态框*/
		appointClassModalVisible    : false,
		appointClassObj             : {},
		hasAppointList              : [],

		/*修改信息模态框*/
		editClassInfoVisible        : false,
		editClassInfoObj            : {},

		/*添加学员 模态框*/
		addStudentVisible           : false,

		/*删除班级 二次确认*/
		AlertVisible                : false,
		AlertTitle                  : '删除班级',
		AlertContent                : '确认删除此班级么?',
		AlertButtonLoading          : false,
		/*删除班级 二次确认*/

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
		/*得到班级详情*/
		*getClassDetailInfo({ payload },{ call, put, select }){
			let { clsId } = payload;
			let state = yield select( state => state.classManageDetailModel );
			let { ret } = yield call( getClassInfo, ({ clsId }));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						currentItem : ret.data
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取详情信息失败' )
			}
		},

		/*显示详情*/
		*showDetail({ payload },{ call, put, select }){
			let { record, userList, stuList, roomList, courseList } = payload;
			yield put({
				type : 'updateState',
				payload : {
					detailVisible : true,
					currentItem   : record,
					activeKey     : '1',
					userList,
					stuList,
					roomList,
					courseList
				}
			});
			let params = {
				pageIndex    : 0,
				pageSize     : 20,
				clsId        : record.clsId,
				orgId        : record.orgId
			}
			yield put({
				type : 'getStudentList',
				payload : {
					params
				}
			})
		},

		/*确认删除班级*/
		*AlertOnOk({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					AlertButtonLoading : true
				}
			})
			let { clsId, orgId } = payload;
			let { ret } = yield call( deleteClassItem, ( { clsId, orgId } ));
			if( ret && ret.errorCode == 9000 ){
                message.success('删除班级成功')
				yield put({
					type : 'classManageModel/refreshClasssList'
				})
				yield put({
					type : 'updateState',
					payload : {
						detailVisible : false,
						AlertVisible  : false
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '删除班级失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					AlertButtonLoading : false
				}
			})
		},

		/*改变tab页*/
		*changeTab({ payload },{ call, put, select }){
			let { activeKey } = payload;
			yield put({ type : 'updateState', payload : { activeKey } });
			let state = yield select( state => state.classManageDetailModel );
			let currentItem = state.currentItem;
			if( activeKey == '1' ){
				let params = {
					pageIndex    : 0,
					pageSize     : 20,
					clsId        : currentItem.clsId,
					orgId        : currentItem.orgId
				}
				yield put({
					type : 'getStudentList',
					payload : {
						params
					}
				})
			}else if( activeKey == '2' ){
				let params = {
					pageIndex    : 0,
					pageSize     : 20,
					clsId        : currentItem.clsId,
					orgId        : currentItem.orgId
				}
				yield put({
					type : 'getAttendClassList',
					payload : {
						params
					}
				})
			}
		},

		/*得到班級學員列表*/
		*getStudentList({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { studentLoading : true } });
			let { params } = payload;
			let { ret } = yield call( getStudentList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentDataSource  : ret.results,
						studentResultCount : ret.data.resultCount,
						studentPageSize    : params.pageSize,
						studentPageIndex   : params.pageIndex
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '班级学员列表加载失败' )
			}
			yield put({ type : 'updateState', payload : { studentLoading : false } });
		},

		/*班级学员列表分页*/
		*studentPageIndexChange({ payload },{ call, put, select }){
			let { pageIndex, pageSize } = payload;
			let state = yield select( state => state.classManageDetailModel );
			let currentItem = state.currentItem;
			let params = {
				clsId     : currentItem.clsId,
				orgId     : currentItem.orgId,
				pageIndex : pageIndex - 1,
				pageSize
			}
			yield put({
				type : 'getStudentList',
				payload : {
					params
				}
			})
		},

		/*得到上課記錄列表*/
		*getAttendClassList({ payload },{ call, put, select }){
			let { params } = payload;
			let { ret } = yield call( getAttendClassList, ( params ) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						attendClassDataSource  : ret.results,
						attendClassResultCount : ret.data.resultCount,
						attendClassPageSize    : params.pageSize,
						attendClassPageIndex   : params.pageIndex
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '上课记录加载失败' )
			}
		},

		/*上课记录列表分页*/
		*attendClassPageIndexChange({ payload },{ call, put, select }){
			let { pageIndex, pageSize } = payload;
			let state = yield select( state => state.classManageDetailModel );
			let currentItem = state.currentItem;
			let params = {
				clsId     : currentItem.clsId,
				orgId     : currentItem.orgId,
				pageIndex : pageIndex - 1,
				pageSize
			}
			yield put({
				type : 'getAttendClassList',
				payload : {
					params
				}
			})
		},

		/*得到移除学员未上课节数*/
		*getClassNum({ payload },{ call, put, select }){
			let { stuId } = payload;
			let state = yield select( state => state.classManageDetailModel );
			let currentItem = state.currentItem;
			let params = {
				orgId : currentItem.orgId,
				clsId : currentItem.clsId,
				stuId
			}
			let { ret } = yield call( getClassNum, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentNoClassNum : ret.openCourseNum || 0
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '获取学员已预约课程失败' )
			}
		},

		/*确认添加学员*/
		*confirmAddStudent({ payload },{ call, put, select }){
			let state = yield select( state => state.classManageDetailModel );
			let currentItem = state.currentItem;
			let { values } = payload;
			let params = {
				clsId   : currentItem.clsId,
				orgId   : currentItem.orgId,
				stuId   : values.stuId
			}
			let { ret } = yield call( confirmAddStudent, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						addStudentVisible : false
					}
				})
				let params1 = {
					pageIndex    : 0,
					pageSize     : 20,
					clsId        : currentItem.clsId,
					orgId        : currentItem.orgId
				}
				yield put({
					type : 'getStudentList',
					payload : {
						params : params1
					}
				})
				yield put({
					type : 'classManageModel/refreshClasssList',
				})
				yield put({
					type : 'getClassDetailInfo',
					payload : {
						clsId : currentItem.clsId
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '添加学员失败' )
			}
		},

		/*移除学员*/
		*removeStudent({ payload },{ call, put, select }){
			let { stuId } = payload;
			let state = yield select( state => state.classManageDetailModel );
			let currentItem = state.currentItem;
			let params = {
				clsId   : currentItem.clsId,
				orgId   : currentItem.orgId,
				stuId
			}
			let { ret } = yield call( removeStudent, ( params ));
			if( ret && ret.errorCode == 9000 ){
				let params1 = {
					pageSize  : 20,
					pageIndex : 0,
					clsId     : currentItem.clsId,
					orgId     : currentItem.orgId
				}
				yield put({
					type : 'getStudentList',
					payload : {
						params : params1
					}
				})
				yield put({
					type : 'classManageModel/refreshClasssList',
				})
				yield put({
					type : 'getClassDetailInfo',
					payload : {
						clsId : currentItem.clsId
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '移除学员失败' )
			}
		},

		/*删除上课记录 日程*/
		*deleteClassRecord({ payload },{ call, put, select }){
			let { orgId, cpmId, cpdId } = payload;
			let state = yield select( state => state.classManageDetailModel );
			let currentItem = state.currentItem;
			let params = {
				orgId,
				cpmId,
				cpdId,
				clsId  : currentItem.clsId
			}
			let { ret } = yield call( deleteClassRecord, ( params ));
			if( ret && ret.errorCode == 9000 ){
				let params1 = {
					pageSize : 20,
					pageIndex : 0,
					clsId     : currentItem.clsId,
					orgId     : currentItem.orgId
				}
				yield put({
					type : 'getAttendClassList',
					payload : {
						params : params1
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '删除日程失败' )
			}
		},

		/*查看班级成员约课情况*/
		*checkAppointClassStuNum({ payload },{ call, put, select }){
			let { record } = payload;
			let state = yield select( state => state.classManageDetailModel );
			let currentItem = state.currentItem;
			let params = {
				orgId : record.orgId,
				cpmId : record.cpmId,
				cpdId : record.cpdId,
				clsId : currentItem.clsId
			}
			let { ret } = yield call( checkAppointClassStuNum, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						hasAppointList           : ret.results,
						appointClassModalVisible : true,
						appointClassObj          : record
					}
				})
			}
		},

		/*确认修改信息*/
		*classInfoCreateConfirm({ payload },{ call, put, select }){
			let { values } = payload;
			let state = yield select( state => state.classManageDetailModel );
			let editClassInfoObj = state.editClassInfoObj;
			let currentItem = state.currentItem;
			let params = {
				cpmId  : editClassInfoObj.cpmId,
				orgId  : editClassInfoObj.orgId,
				cpdIds : editClassInfoObj.cpdId,
				...values
			}
			let { ret } = yield call( classInfoCreateConfirm, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						editClassInfoObj : {},
						editClassInfoVisible : false
					}
				})
				let params1 = {
					clsId     : currentItem.clsId,
					orgId     : currentItem.orgId,
					pageIndex : 0,
					pageSize  : 20
				}
				yield put({
					type : 'getAttendClassList',
					payload : {
						params : params1
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '修改信息失败' )
			}
		}

	},

	reducers: {
		updateState( state, action ){
			return { ...state, ...action.payload };
		}
	},
}
