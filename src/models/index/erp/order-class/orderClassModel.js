import {
	getClassTableList,                     //课程列表
	getDate,                               //得到当前日期

	getCourseList,                         //得到课程下拉
	getClassRoomList,                      //得到教室下拉
	getStudentList,                        //得到学员下拉
	getTeacherList,                        //得到老师下拉

	getConfKey

} from '../../../../services/erp/order-class/orderClassService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'orderClassModel',

    state : {
		searchVisible              : false,             //高级搜索
		classPerformance           : 'table',           //课表显示情况
		timePerformance            : 'day',             //时间显示情况

		courseList                 : [],
		classRoomList              : [],
		studentList                : [],
		teacherList                : [],

		orgId                      : undefined,

		/*常用搜索*/
		courseId                   : undefined,
		isfull                     : undefined,

		/*高级搜索*/
		roomId                     : undefined,
		tid                        : undefined,
		stuId                      : undefined,
		tryStuId                   : undefined,
		tryLeadsName               : undefined,

		/*按天, 按周, 按月*/
		startDate                  : undefined,
		endDate                    : undefined,

		startTime                  : undefined,
		endTime                    : undefined,

		startBeginTime             : undefined,
		startEndTime               : undefined,


		currentDate                : undefined,
		currentTime                : undefined,

		/*列表形式*/
		loading                    : false,
		dataSource                 : [],
		resultCount                : 0,
		pageSize                   : 20,
		pageIndex                  : 0,
		newColumns                 : []
	},

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/hq_orgdata_cpbook' ){
                }
            })
        }
    },

    effects : {
		/*得到课程表时间段*/
		*getConfKey({ payload },{ call, put, select }){
			let { ret } = yield call( getConfKey );
			if( ret && ret.errorCode == 9000 ){
				let key = ret.list.length > 0 && ret.list[0] && ret.list[0].key;
				let arrs = !!key && key.split('-');
				let beginTime = Number(arrs[0]) || 7;
				let endTime = Number(arrs[1]) || 22;
				yield put({
					type : 'updateState',
					payload : {
						startBeginTime : beginTime,
						startEndTime   : endTime
					}
				})
			}
		},
		/*得到当前日期*/
		*getDateAndTime({ payload },{ call, put, select }){
			let orgId = window._init_data.cerp_orgId;
			let { ret } = yield call( getDate );
			let date = new Date();
			let time = date.toLocaleString();
			date = date.toLocaleDateString();
			yield put({
				type : 'updateState',
				payload : {
					startDate : !!ret && ret.date || date,
					endDate   : !!ret && ret.date || date,
					startTime : !!ret && ret.nowTime || time,
					endTime   : !!ret && ret.nowTime || time,

					currentDate : !!ret && ret.date || date,
					currentTime : !!ret && ret.nowTime || time,

					orgId       : orgId
				}
			})
			yield put({
				type : 'initGetParams',
			})
		},

		*initGetParams({ payload },{ call, put, select }){
			let state = yield select( state => state.orderClassModel );
			let orgId = window._init_data.cerp_orgId;
			let classPerformance = 'table';
			let timePerformance = 'day';
			yield put({
				type : 'updateState',
				payload : {
					classPerformance,
					timePerformance
				}
			})
			let params = {
				startDate     : state.startDate,
				endDate       : state.endDate,
				orgId         : orgId,

				pageSize      : 20,
				pageIndex     : 0,
			}
			yield put({
				type : 'getClassTableList',
				payload : {
					params
				}
			})
		},

		/*得到下拉列表*/
		*getSelectList({ payload },{ call, put, select }){
			let orgId = window._init_data.cerp_orgId;
			let courseList = yield call( getCourseList, ({ orgId : orgId }));
			if( courseList && courseList.ret && courseList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						courseList : courseList.ret.results
					}
				})
			}
			let classRoomList = yield call( getClassRoomList, ({ orgId : orgId }));
			if( classRoomList && classRoomList.ret && classRoomList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						classRoomList : classRoomList.ret.results
					}
				})
			}
			let studentList = yield call( getStudentList, ({ orgId : orgId }));
			if( studentList && studentList.ret && studentList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentList : studentList.ret.results,
					}
				})
			}

			let teacherList = yield call( getTeacherList, ({ orgId : orgId }));
			if( teacherList && teacherList.ret && teacherList.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						teacherList : teacherList.ret.results
					}
				})
			}
		},

		/*点击跳到列表形式*/
		*jumpToClassTable({ payload },{ call, put, select }){
			let state = yield select( state => state.orderClassModel );
			let classPerformance = 'table';
			yield put({
				type : 'updateState',
				payload : {
					classPerformance
				}
			})
			let params = {
				startDate     : state.startDate,
				endDate       : state.endDate,

				orgId         : state.orgId,

				courseId      : state.courseId,
				isfull        : state.isfull,

				/*高级搜索*/
				roomId        : state.roomId,
				tid           : state.tid,
				stuId         : state.stuId,
				tryStuId      : state.tryStuId,
				tryLeadsName  : state.tryLeadsName,

				pageSize      : 20,
				pageIndex     : 0,
			}
			yield put({
				type : 'getClassTableList',
				payload : {
					params
				}
			})
		},

		*getParams({ payload },{ call, put, select }){
			let state = yield select( state => state.orderClassModel );
			let params = {
				startDate     : state.startDate,
				endDate       : state.endDate,

				orgId         : state.orgId,

				courseId      : state.courseId,
				isfull        : state.isfull,

				/*高级搜索*/
				roomId        : state.roomId,
				tid           : state.tid,
				stuId         : state.stuId,
				tryStuId      : state.tryStuId,
				tryLeadsName  : state.tryLeadsName,

				pageSize      : state.pageSize,
				pageIndex     : state.pageIndex,
			}
			yield put({
				type : 'getClassTableList',
				payload : {
					params
				}
			})
		},

		/*点击跳到课表形式*/
		*jumpToClassSchedule({ payload },{ call, put, select }){
			let { startDate, endDate } = payload;
			let state = yield select( state => state.orderClassModel );
			let classPerformance = 'schedule';
			let timePerformance = 'week';
			yield put({
				type : 'updateState',
				payload : {
					classPerformance,
					startDate,
					endDate,
					timePerformance
				}
			})
			let params = {
				startDate     : startDate,
				endDate       : endDate,

				orgId         : state.orgId,

				courseId      : state.courseId,
				isfull        : state.isfull,

				/*高级搜索*/
				roomId        : state.roomId,
				tid           : state.tid,
				stuId         : state.stuId,
				tryStuId      : state.tryStuId,
				tryLeadsName  : state.tryLeadsName,

				pageSize      : 9999,
				pageIndex     : 0,
			}

			yield put({
				type : 'getClassTableList',
				payload : {
					params
				}
			})
		},

		/*常用搜索*/
		*searchFunction({ payload },{ call, put, select }){
			let { values } = payload;
			let state = yield select( state => state.orderClassModel );
			let params = {
				startDate     : state.startDate,
				endDate       : state.endDate,

				orgId         : state.orgId,

				courseId      : values.courseId,
				isfull        : values.isfull,

				/*高级搜索*/
				roomId        : state.roomId,
				tid           : state.tid,
				stuId         : state.stuId,
				tryStuId      : state.tryStuId,
				tryLeadsName  : state.tryLeadsName,

				pageSize      : state.pageSize,
				pageIndex     : state.pageIndex,
			}
			yield put({
				type : 'getClassTableList',
				payload : {
					params
				}
			})
		},

		/*高级搜索*/
		*onSuperSearch({ payload },{ call, put, select }){
			let { values } = payload;
			let state = yield select( state => state.orderClassModel );
			let params = {
				startDate     : state.startDate,
				endDate       : state.endDate,

				orgId         : state.orgId,

				courseId      : state.courseId,
				isfull        : state.isfull,

				/*高级搜索*/
				roomId        : values.roomId,
				mtid           : values.mtid,
				stuId         : values.stuId,
				tryStuId      : values.tryStuId,
				tryLeadsName  : values.tryLeadsName,

				pageSize      : state.pageSize,
				pageIndex     : state.pageIndex,
			}
			yield put({
				type : 'getClassTableList',
				payload : {
					params
				}
			})
		},

		/*分页*/
		*pagination({ payload },{ call, put, select }){
			let { pageIndex, pageSize } = payload;
			let state = yield select( state => state.orderClassModel );
			let params = {
				startDate     : state.startDate,
				endDate       : state.endDate,

				orgId         : state.orgId,

				courseId      : state.courseId,
				isfull        : state.isfull,

				/*高级搜索*/
				roomId        : state.roomId,
				tid           : state.tid,
				stuId         : state.stuId,
				tryStuId      : state.tryStuId,
				tryLeadsName  : state.tryLeadsName,

				pageIndex     : pageIndex - 1,
				pageSize
			};
			yield put({
				type : 'getClassTableList',
				payload : {
					params
				}
			})
		},

		/*按时间搜索*/
		*searchByTime({ payload },{ call, put, select }){
			let { startDate, endDate, timePerformance } = payload;
			let state = yield select( state => state.orderClassModel );
			let params = {};
			if( state.classPerformance == 'table' ){
				params = {
					startDate,
					endDate,
					orgId         : state.orgId,

					courseId      : state.courseId,
					isfull        : state.isfull,
					roomId        : state.roomId,
					tid           : state.tid,
					stuId         : state.stuId,
					tryStuId      : state.tryStuId,
					tryLeadsName  : state.tryLeadsName,

					pageSize      : state.pageSize,
					pageIndex     : 0,
				}
			}else if( state.classPerformance == 'schedule' ){
				params = {
					startDate,
					endDate,
					orgId         : state.orgId,

					courseId      : state.courseId,
					isfull        : state.isfull,
					roomId        : state.roomId,
					tid           : state.tid,
					stuId         : state.stuId,
					tryStuId      : state.tryStuId,
					tryLeadsName  : state.tryLeadsName,

					pageSize      : 9999,
					pageIndex     : 0,
				}
			}
			yield put({
				type : 'updateState',
				payload : {
					timePerformance : timePerformance || state.timePerformance
				}
			})
			yield put({
				type : 'getClassTableList',
				payload : {
					params
				}
			})
		},

		/*得到列表数据*/
		*getClassTableList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					loading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getClassTableList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						dataSource : ret.results,
						resultCount : ret.data.resultCount,
						...params
					}
				})
			}

			yield put({
				type : 'updateState',
				payload : {
					loading : false
				}
			})
		}
	},

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
