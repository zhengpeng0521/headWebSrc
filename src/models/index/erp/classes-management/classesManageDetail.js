import * as ClassesDetailAPI from '../../../../services/erp/classes-detail/ClassesDetailService';
import * as BASEAPI from '../../../../services/index/common/searchSelectListService';
import {
	getStudentList,
	getSignUpList
} from '../../../../services/erp/classes-management/classesManageDetailService';

import { parse } from 'qs';
import { message } from 'antd';

export default {

  namespace: 'classesDetailModel',

  state: {
		currentItem           : undefined,           //选择的列表项
		detailVisible         : false,               //详情是否显示
		activeKey             : '1',                 //当前激活的tab

	  	/*学员*/
		studentDataSource     : [],
		studentResultCount    : 0,
		studentPageIndex      : 0,
		studentPageSize       : 20,
		studentLoading        : false,
		/*学员*/

	  	/*签到记录*/
		signUpDataSource      : [],
		signUpResultCount     : 0,
		signUpPageIndex       : 0,
		signUpPageSize        : 20,
		signUpLoading         : false,
		/*签到记录*/

	  	topList				  : [],       //上端数据
	  	formData              : {},
        formLoading           : false,
        formVisible           : false,
	    selectBishopTeacherIds: [],		//选择的主教ids
	    selecttTaTeacherIds	  : [],		//选择的助教ids
		teacherListSelectArr  : [], 	//老师选择列表
  },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if( pathname === '/classes_detail' ) {

                }
            });
        },
    },

    effects: {
		*showDetail({ payload },{ call, put, select }){
			let { record } = payload;
			let state = yield select( state => state.classesDetailModel );
			yield put({
				type : 'updateState',
				payload : {
					detailVisible : true,
					activeKey     : '1',
					currentItem   :  record,
				}
			})
			yield put({
				type : 'getStudentListParams',
				payload : {
				}
			})
		},

		/*切换tab*/
		*changeTab({ payload },{ call, put, select }){
			let { activeKey } = payload;
			if( activeKey == '1' ){
				yield put({
					type : 'getStudentListParams',
				})
			}else if( activeKey == '2' ){
				yield put({
					type : 'getSignUpListParams'
				})
			}else if( activeKey == '3' ){
				console.log( '课程表' )
			}
			yield put({
				type : 'updateState',
				payload : {
					activeKey
				}
			})
		},

		//请求单条数据
        *queryDetailList({ payload }, { call, put, select }){
            let { ret } = yield call(ClassesDetailAPI.queryForTopList, parse({id : payload.id}));

            if (ret && ret.errorCode === 9000) {
				let defaultTeacherArr 	= [];
				let defaultTaTeacherArr	= [];
				ret.results[0].teacherList&&ret.results[0].teacherList.map(function(item,index){
					if(item.prime == '1') {
						defaultTeacherArr.push(item.uid);
					} else {
						defaultTaTeacherArr.push(item.uid);
					}
				})

                yield put({
                    type: 'updateState',
                    payload: {
						...payload,
						currentClassId 	        : payload.id,
                        topList			        : ret.results[0],
						selectBishopTeacherIds	: defaultTeacherArr,
						selecttTaTeacherIds     : defaultTaTeacherArr,
                    },
                });
            } else {
                message.error(ret&&ret.errorMessage || '获取数据失败');
            }
        },

		//获取老师列表
		*queryTeacherList({ payload }, { call, put, select }){
            let { ret } = yield call( BASEAPI.getTeachers, parse({orgId : payload.orgId} ));
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
                        teacherListSelectArr : ret && ret.results,
                    },
                });
            } else {
                message.error(ret&&ret.errorMessage || '获取老师列表失败');
            }
        },

		//学员列表
        *queryStudentlist({ payload }, { call, put, select }){
            let classesDetail = yield select(state => state.classesDetail);
            let params 		= {
				clsId	  	: payload.id || classesDetail.id,
				orgId 		: payload.orgId || classesDetail.orgId,
		 	};
            let { ret } = yield call(ClassesDetailAPI.queryForClassesList, parse(params));
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
						...payload,
                        classesList: ret&&ret.results,
                        classesListTotal: ret&&ret.data.resultCount,
                    },
                });
            }else {
                ret && ret.errorMessage && message.error( ret.errorMessage );
            }
        },

		/*得到学员列表参数*/
		*getStudentListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.classesDetailModel );
			let currentItem = state.currentItem;
			let params = {
				clsId     : currentItem.id,
				orgId     : currentItem.orgId,
				pageIndex : 0,
				pageSize  : state.studentPageSize
			}
			yield put({
				type : 'getStudentList',
				payload : {
					params
				}
			})
		},
		/*得到学员列表*/
		*getStudentList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					studentLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getStudentList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						studentDataSource  : ret.results,
						studentResultCount : ret.data.resultCount,
						studentPageIndex   : params.pageIndex,
						studentPageSize    : params.pageSize
					}
				})
			}
			yield put({
				type : 'updateState',
				payload : {
					studentLoading : false
				}
			})
		},
		/*学员列表分页*/
		*studentListPagination({ payload },{ call, put, select }){
			let { studentPageIndex, studentPageSize } = payload;
			let state = yield select( state => state.classesDetailModel );
			let currentItem = state.currentItem;
			let params = {
				pageIndex : studentPageIndex,
				pageSize  : studentPageSize,
				clsId     : currentItem.id,
				orgId     : currentItem.orgId,
			}
			yield put({
				type : 'getStudentList',
				payload : {
					params
				}
			})
		},

		/*得到签到记录参数*/
		*getSignUpListParams({ payload },{ call, put, select }){
			let state = yield select( state => state.classesDetailModel );
			let currentItem = state.currentItem;
			let params = {
				clsId     : currentItem.id,
				orgId     : currentItem.orgId,
				pageIndex : 0,
				pageSize  : state.studentPageSize
			}
			yield put({
				type : 'getSignUpList',
				payload : {
					params
				}
			})
		},
		/*得到签到记录*/
		*getSignUpList({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					signUpLoading : true
				}
			})
			let { params } = payload;
			let { ret } = yield call( getSignUpList, ( params ));
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						signUpDataSource  : ret.results,
						signUpResultCount : ret.data.resultCount,
						signUpPageIndex   : params.pageIndex,
						signUpPageSize    : params.pageSize
					}
				})
			}
			yield put({
				type : 'updateState',
				payload : {
					signUpLoading : false
				}
			})
		},
		/*得到签到记录分页*/
		*signUpPagination({ payload },{ call, put, select }){
			let { signUpPageIndex, signUpPageSize } = payload;
			let state = yield select( state => state.classesDetailModel );
			let currentItem = state.currentItem;
			let params = {
				pageIndex : signUpPageIndex,
				pageSize  : signUpPageSize,
				clsId     : currentItem.id,
				orgId     : currentItem.orgId,
			}
			yield put({
				type : 'getStudentList',
				payload : {
					params
				}
			})
		},

		//修改操作
		*modify({ payload }, { call, put, select }){
			yield put({ type : 'showLoading' });
            let obj = yield call( ClassesDetailAPI.modifyClassesInfo, parse( payload.parameters ));
			if (obj.ret && obj.ret.errorCode === 9000) {
                message.success( obj.ret.errorMessage || '成功' );
			 	yield put({type: 'updateState',});
				let classesDetail = yield select( state => state.classesDetail );
				let parameter = {
					orgId 		: classesDetail.orgId,
					tenantId	: classesDetail.tenantId,
					id			: classesDetail.id,
				}
				let updateTopList = yield call( ClassesDetailAPI.queryForTopList, parse( parameter ) );
				if ( updateTopList.ret && updateTopList.ret.errorCode === 9000 ) {
					yield put({
						type: 'updateState',
						payload: {
							formVisible : false,
							topList     : updateTopList.ret.results[0],
                    	},
					});
				} else {
					updateTopList.ret && updateTopList.ret.errorMessage && message.error(updateTopList.ret.errorMessage);
				}
			} else {
				obj.ret && obj.ret.errorMessage && message.error(obj.ret.errorMessage);
			}
			yield put({ type: 'closeLoading' });
		},
    },

    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
    },
}
