import * as ClassesDetailAPI from '../../../../services/erp/classes-detail/ClassesDetailService';
import * as BASEAPI from '../../../../services/index/common/searchSelectListService';

import { parse } from 'qs';
import { message } from 'antd';

export default {

  namespace: 'classesDetail',

  state: {
      pageIndex				: 0,
      classesListTotal		: 0,     	//列表数据总数
	  currentClassId 		: 0,
      pageSize				: 10,
      formData				: {},
      searchData			: {},
	  signRecordPageData	: {},  		//签到记录列表
      topList				: [],       //上端数据
      classesList			: [],       //列表数据
	  teacherListSelectArr	: [], 		//老师选择列表
	  selectedRowKeys		: [],	 	//选中的行
	  signRecordList		: [],  		//签到记录列表
	  selectBishopTeacherIds: [],		//选择的主教ids
	  selecttTaTeacherIds	: [],		//选择的助教ids
      searchVisible 		: false,  	//搜索框是否显示
      formLoading			: false,    //表单按钮加载
      loading				: false,    //表格加载
      formVisible			: false,    //编辑表单展示

	  cnum                  : 0,
	  pnum                  : 0,
      ctype                 : 0,
  },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/classes_detail') {
					
					//查询单条数据
                    dispatch({
                        type: 'queryDetailList',
						payload : {
							...query
						}
                    });
					
					//老师列表
					dispatch({
                        type: 'queryTeacherList',
						payload : {
							...query
						}
                    });
					
					//当前班级的学员列表
					dispatch({
                        type: 'getStudentlist',
						payload : {
							...query
						}
                    });
                }
            });
        },
    },

    effects: {
		
		//请求单条数据
        *'queryDetailList'({ payload }, { call, put, select }){
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
						currentClassId 	: payload.id,
                        topList			: ret.results[0],
						selectBishopTeacherIds	: defaultTeacherArr,
						selecttTaTeacherIds : defaultTaTeacherArr,
                    },
                });
            } else {
                message.error(ret&&ret.errorMessage || '获取数据失败');
            }
        },
		
		//获取老师列表
		*'queryTeacherList'({ payload }, { call, put, select }){
            let { ret } = yield call(BASEAPI.getTeachers, parse({orgId : payload.orgId}));
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
                        teacherListSelectArr: ret&&ret.results,
                    },
                });
            } else {
                message.error(ret&&ret.errorMessage || '获取老师列表失败');
            }
        },
			
		//修改操作
		*'modify'({ payload }, { call, put, select }){
			yield put({ type: 'showLoading' });
            let obj = yield call(ClassesDetailAPI.modifyClassesInfo, parse(payload.parameters));
			if (obj.ret && obj.ret.errorCode === 9000) {
                message.success(obj.ret.errorMessage || '成功');
			 	yield put({type: 'updateState',});
				let classesDetail = yield select(state => state.classesDetail);
				let parameter = {
					orgId 		: classesDetail.orgId,
					tenantId	: classesDetail.tenantId,
					id			: classesDetail.id,
				}
				let updateTopList = yield call(ClassesDetailAPI.queryForTopList, parse(parameter));				
				if (updateTopList.ret && updateTopList.ret.errorCode === 9000) {
					yield put({
						type: 'updateState', 
						payload: {
							formVisible: false,
							topList: updateTopList.ret.results[0],
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

		//学员列表
        *getStudentlist({ payload }, { call, put, select }){	
            let classesDetail = yield select(state => state.classesDetail);
            let params 		= {
				clsId	  	: payload.id || classesDetail.id,
				orgId 		: payload.orgId || classesDetail.orgId,
			 };
            yield put({ type: 'showLoading' });
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
            } else {
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }
            yield put({ type: 'closeLoading' });
        },
			
		//签到列表
		*getSignList({ payload }, { call, put, select }) {
            let classesDetail 	= yield select(state => state.classesDetail);
            let params 			= { 
				pageSize 	: payload.pageSize != undefined ? payload.pageSize : classesDetail.pageSize,
				pageIndex 	: payload.pageIndex != undefined ? payload.pageIndex : classesDetail.pageIndex,
				clsId	  	: payload&&payload.id || classesDetail.id,
				orgId 		: classesDetail.topList.orgId,
			};
			yield put({ type: 'showLoading' });
            let { ret } = yield call(ClassesDetailAPI.clsSignQuery, parse(params));
            if (ret && ret.errorCode === 9000) {
                yield put({
                    type: 'updateState',
                    payload: {
                       	signRecordList 		: ret.results,
						signRecordPageData	: ret.data,
						pageIndex 			: params.pageIndex,
						pageSize  			: params.pageSize,
                    },
                });
            } else {
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }
            yield put({ type: 'closeLoading' });
        },		
    },

    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //表格加载中
        showLoading(state,action) {
            return { ...state, ...action.payload, loading: true };
        },
        //表格加载消失
        closeLoading(state,action){
            return { ...state, ...action.payload, loading: false };
        },
    },
}
