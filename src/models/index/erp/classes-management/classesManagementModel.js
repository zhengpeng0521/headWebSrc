import * as API from '../../../../services/erp/classes-management/classesManagementService';
import * as BASEAPI from '../../../../services/index/common/searchSelectListService';

import { parse } from 'qs';
import { message } from 'antd';

export default {

  	namespace: 'classesManagementModel',

  	state: {
		/*搜索*/
		courseList 				: [],		//课程列表
		cpCourseList 			: [],		//备用课程列表
		teacherList 			: [],		//老师列表

		/*常用搜索*/
		id                      : undefined,
		name                    : undefined,
		/*高级搜索*/
		searchVisible           : false,
		orgId                   : undefined,
		courseId                : undefined,
		uid                     : undefined,

		pageIndex 				: 0,
		pageSize 				: 20,
		selectedRowKeys			: [],
		selectedRows            : [],
		resultCount             : 0,
		dataSource		     	: [],		//列表数据
      	loading					: false,	//显示加载状态
		newColumns              : [],

		toDealBishopTeacherList : [],		//处理后的主教老师列表
		toDealTaTeacherList 	: [],		//处理后的助教老师列表
		selectBishopTeacherIds	: [],		//存放选中的主教老师ids
		selecttTaTeacherIds		: [],		//存放选中的助教老师ids
		remainingOptionalTeacherList : [],	//剩余可选老师

		showAddStudentModal 	: false,	//显示添加班级框

		cnum					: 0,		//总课时
		pnum					: 0,		//消耗课时
		ctype					: 0,		//1 通用 2. 渐进
		btnLoading              : false,    //新增按钮loading
  	},

  	subscriptions: {
      	setup({ dispatch, history }) {
          	history.listen(( { pathname, query }) => {
              	if(pathname === '/erp_cls_list') {
				  	dispatch({
					  	type : 'getClassesListData'
				  	})
					
					dispatch({
					  	type : 'getCourseListData'
				  	})
			  	}
          	});
      	},
  	},

  	effects: {
		//首次进入初始化数据
	 	*getClassesListData({ payload } , { put , call , select }){
			let state = yield select(state => state.classesManagementModel );
			let params = {
				pageIndex 	: 0,
				pageSize 	: state.pageSize,
				status 		: 2,
			};
			let { ret } = yield call( API.query, parse( params ) );
			yield put({ type : 'showLoadingState' });
            if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource : ret.results,
						resultCount : ret.data.resultCount,
						...params
					}
				});
			}else{
				message.error(( ret && ret.errorMessage ) || '获取列表失败');
			}
			yield put({ type : 'hiddenLoadingState' });
		},

		//搜索改变列表数据
		*searchFunction({ payload },{ call, put, select }){
			yield put({ type : 'showLoadingState' });
			let { params }  = payload;
			let state = yield select( state => state.classesManagementModel );
			params.status = 2;
			let { ret } = yield call( API.query, parse( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource : ret.results,
						resultCount : ret.data.resultCount,
						selectedRowKeys : [],
						selectedRows    : [],
						...params
					}
				})
			}else{
				message.error(( ret && ret.errorMessage ) || '获取列表失败');
			}
			yield put({ type : 'hiddenLoadingState' });
		},

		//获取课程列表
		*getCourseListData({ payload },{ put, call, select }){
			let paramter = {
				status : 1,
				orgId  : payload && payload.id || 0,
			}
			let { ret, err } = yield call( BASEAPI.getCourses, parse(paramter));
			if(ret && ret.errorCode == 9000) {
				yield put({
					type : 'updateState',
					payload : {
						courseList 	 : ret.results,
						cpCourseList : ret.results,
						pnum		 : 0,
						cnum		 : 0,
					}
				})
			}
		},

		//获取老师列表
		*getTeacherListData({ payload } , { put , call , select }){ 
			let paramter = {
				status 		: 1,
				orgId : payload&&payload.id || 0,
			}
			let {ret, err} = yield call(BASEAPI.getTeachers, parse(paramter));
			if(ret && ret.errorCode == 9000) {
				yield put({
					type : 'updateState',
					payload : {
						teacherList 			: ret.results,
						toDealBishopTeacherList : ret.results,
						toDealTaTeacherList 	: ret.results,
					}
				})
			}
		},
			
		//删除班级数据
		*deleteClasses({ payload },{ call, put, select }){
			let state = yield select( state => state.classesManagementModel );
			let values = {
				status : 2,
				ids : payload.ids.join(',')
			}
			let { ret } = yield call( API.delect, parse( values ));
			if( ret && ret.errorCode == 9000 ){
				let params = {
					id        : state.id,
					name      : state.name,
					pageIndex : state.pageIndex,
					pageSize  : state.pageSize,
					uid       : state.uid,
					orgId     : state.orgId,
					courseId  : state.courseId,
					status 	  : 2,
				}
				yield put({
					type : 'searchFunction',
					payload : {
						params
					}
				})
			}else{
				message.error( ret && ret.errorMessage || '删除失败' )
			}
		},

		//添加班级
		*addClasses({payload}, {put, call, select}) {
			yield put({
				type : 'updateState',
				payload : {
					btnLoading : true
				}
			})
			let state		= yield select( state => state.classesManagementModel );
			let tplArr 		= [ payload.paramter.one, payload.paramter.two, payload.paramter.three, payload.paramter.four ];
			let tplValue 	= tplArr.join(',');
			let params = {
				progress 	: payload.paramter.progress, 		//当前进度
				name		: payload.paramter.name,			//班级名称
				maxProgress : payload.paramter.maxProgress, 	//最大进度
				courseId 	: payload.paramter.courseName.key,  //所属课程
				stuNum 		: payload.paramter.shangkerenshu,	//上课人数
				maxStuNum 	: payload.paramter.shangkerenshu,	//最大上课人数
				taIds 		: payload.paramter.ta&&payload.paramter.ta.join(','),
				bishopIds 	: payload.paramter.bishop&&payload.paramter.bishop.join(','),
				costTpl 	: tplValue,							//课时消耗
				minStuNum 	: 0, 								//最小上课人数
				status 		: 2, 								//创建班级时候的上课状态
				orgId 		: payload.paramter.suoshuxiaoqu, 	//所选校区
			}

			let createObj = yield call( API.create, parse(params));
			if(createObj.ret && createObj.ret.errorCode == 9000){
				yield put({
					type : 'updateState',
					payload : {
						listDataSource 			: createObj.ret.results,
						showAddStudentModal 	: false,
						courseList				: [],
						toDealBishopTeacherList : [],
						toDealTaTeacherList 	: [],	
						selectBishopTeacherIds	: [],
						selecttTaTeacherIds		: [],
					}
				})
				message.success('添加成功');
				let values = {
					pageIndex 	: state.pageIndex,
					pageSize 	: state.pageSize,
					id          : state.id,
					name        : state.name,
					uid         : state.uid,
					orgId       : state.orgId,
					courseId    : state.courseId,
					status 		: 2,
				}
				yield put({
					type : 'searchFunction',
					payload : {
						params : values
					}
				})
			} else {
				message.error((ret&&ret.errorMessage) || '创建失败');
			}
			yield put({
				type : 'updateState',
				payload : {
					btnLoading : false
				}
			})
		},
  	},

  	reducers: {
		
	  	updateState(state, action) {return {...state, ...action.payload};},

		showLoadingState(state, action) {return {...state, ...action.payload, loading : true};},

		hiddenLoadingState(state, action) {return {...state, ...action.payload, loading : false};},
  	},
}
