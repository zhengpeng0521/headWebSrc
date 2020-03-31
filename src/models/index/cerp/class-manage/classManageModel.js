import {
	getClassList,               //得到班级列表数据
	getUserList,                //得到员工下拉列表
	getCourseList,              //得到课程下拉列表
	getRoomList,                //得到教室下拉列表
	getStuList,                 //得到学员下拉列表

	deleteClass                //删除班级

} from '../../../../services/cerp/class-manage/classManageService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { FormatDate } from '../../../../utils/dateFormat';

export default {

    namespace: 'classManageModel',

    state : {
		orgId                      : undefined,

		loading                    : false,
		dataSource                 : [],
		newColumns                 : [],
		resultCount                : 0,
		pageIndex                  : 0,
		pageSize                   : 20,

		selectedRowKeys            : [],
		selectedRows               : [],
		newColumns                 : [],

		commonSearchContent        : {},             //常用搜索 参数
		superSearchContent         : {},             //高级搜索 参数
		userList                   : [],             //员工下拉列表
		courseList                 : [],             //课程下拉列表
		stuList                    : [],             //学员下拉列表
		roomList                   : [],             //教室下拉列表
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/cerp_kcjs_class'){
					dispatch({
						type : 'classManageDetailModel/updateState',
						payload : {
							detailVisible : false,
						}
					})
					dispatch({
						type : 'initClassList'
					})
				}
            });
        },
    },

    effects: {
		*initClassList({ payload },{ call, put, select }){
			let orgId = window._init_data.cerp_orgId;
			yield put({ type : 'updateState', payload : { loading : true, orgId } });
			let { ret } = yield call( getClassList, ( { pageIndex : 0, pageSize : 20, orgId } ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource          : ret.results,
						resultCount         : ret.data.resultCount,
						selectedRows        : [],
						selectedRowKeys     : [],
						commonSearchContent : {},
						superSearchContent  : {},
						pageIndex           : 0,
						pageSize            : 20
					}
				})
			}
			yield put({ type : 'updateState', payload : { loading : false } });
			yield put({
				type : 'getSelectList',
				payload : {
					orgId
				}
			})
		},

		/*得到下拉列表*/
		*getSelectList({ payload },{ call, put, select }){
			let { orgId } = payload;

			/*获取员工下拉列表*/
			let userList = yield call( getUserList, ({ orgId }));
			if( userList && userList.ret && userList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						userList : userList.ret.results
					}
				})
			}else{
				message.error( userList && userList.ret && userList.ret.errorMessage || '获取员工下拉失败' )
			}
			/*获取课程下拉列表*/
			let courseList = yield call( getCourseList, ({ orgId }));
			if( courseList && courseList.ret && courseList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						courseList : courseList.ret.results
					}
				})
			}else{
				message.error( courseList && courseList.ret && courseList.ret.errorMessage || '获取课程下拉失败' )
			}

			/*获取学员下拉列表*/
			let stuList = yield call( getStuList, ({ orgId }));
			if( stuList && stuList.ret && stuList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						stuList : stuList.ret.results
					}
				})
			}else{
				message.error( stuList && stuList.ret && stuList.ret.errorMessage || '获取学员下拉列表失败' )
			}

			/*获取教室下拉列表*/
			let roomList = yield call( getRoomList, ({ orgId }));
			if( roomList && roomList.ret && roomList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						roomList : roomList.ret.results
					}
				})
			}else{
				message.error( roomList && roomList.ret && roomList.ret.errorMessage || '获取教室下拉列表失败' )
			}
		},

		/*刷新列表*/
		*refreshClasssList({ payload },{ call, put, select }){
			let state = yield select( state => state.classManageModel );
			let commonSearchContent = state.commonSearchContent;
			let superSearchContent = state.superSearchContent;
			let params = {
				orgId     : state.orgId,
				pageIndex : state.pageIndex,
				pageSize  : state.pageSize,
				...superSearchContent,
				...commonSearchContent
			}
			yield put({
				type : 'getClassList',
				payload : {
					params
				}
			})
		},

		/*得到班级列表*/
		*getClassList({ payload },{ call, put, select }){
			yield put({ type : 'updateState', payload : { loading : true } });
			let { params } = payload;
			let { ret } = yield call( getClassList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource      : ret.results,
						resultCount     : ret.data.resultCount,
						pageSize        : params.pageSize,
						pageIndex       : params.pageIndex,
						selectedRows    : [],
						selectedRowKeys : []
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '班级列表加载失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false } })
		},

		/*搜索 常用 高级*/
		*onSearch({ payload },{ call, put, select }){
			let state = yield select( state => state.classManageModel );
			let { commonSearchContent, superSearchContent } = payload;
			yield put({
				type : 'updateState',
				payload : {
					commonSearchContent,
					superSearchContent
				}
			})
			let params = {
				pageIndex : 0,
				pageSize  : state.pageSize,
				orgId     : state.orgId,
				...superSearchContent,
				...commonSearchContent
			}
			yield put({
				type : 'getClassList',
				payload : {
					params
				}
			})
		},

		/*分页*/
		*pagination({ payload },{ call, put, select }){
			let { pageIndex, pageSize } = payload;
			let state = yield select( state => state.classManageModel );
			let superSearchContent = state.superSearchContent;
			let commonSearchContent = state.commonSearchContent;
			let params = {
				orgId     : state.orgId,
				pageIndex : pageIndex - 1,
				pageSize,
				...superSearchContent,
				...commonSearchContent
			}
			yield put({
				type : 'getClassList',
				payload : {
					params
				}
			})
		},

		/*删除班级*/
		*deleteClass({ payload },{ call, put, select }){
			let { clsId } = payload;
			let state = yield select( state => state.classManageModel );
			let params = {
				clsId,
				orgId : state.orgId
			};
			let { ret } = yield call( deleteClass, ( params ));
			if( ret && ret.errorCode == 9000 ){
                message.success('删除成功');
				yield put({
					type : 'refreshClasssList'
				})
			}else{
				message.error( ret && ret.errorMessage || '删除失败' )
			}
		}

    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
    },
};
