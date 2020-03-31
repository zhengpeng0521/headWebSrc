import {

    getTagIdList,              //得到标签下拉列表
    getStuIdList,              //得到学员下拉列表
    getStudentWorkList,        //得到作品列表
    getSpaceSize,              //得到用户空间状况
    deleteWorks                //删除作品

} from '../../../../services/erp/student-works/studentWorksService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'studentWorksModel',

	state : {
		searchVisible             : false,               //是否显示高级搜索
		commonSearchContent       : {},                  //常用搜索项内容
		superSearchContent        : {},                  //高级搜索项内容

		tagIdList                 : [],                  //分类id下拉列表
		stuIdList                 : [],                  //学员下拉列表

		newColumns                : [],
		dataSource                : [],                  //作品列表
		loading                   : false,
		resultCount               : 0,                   //数据总量
		pageSize                  : 20,
		pageIndex                 : 0,

		allSize                   : 0,
		usedSize                  : 0,

		selectedRecordIds         : [],
		selectedRowKeys           : [],
		selectedRows              : [],

	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/erp_stu_work_list') {
                    //得到作品列表数据
                    dispatch({
                        type : 'getStudentWorkParams',
                        payload : {
                        }
                    });
                    //获得下拉列表
                    dispatch({
                        type : 'getSelectList',
                        payload : {
                        }
                    });
                    //获得用户空间
                    dispatch({
                        type : 'getUseSpace',
                        payload : {
                        }
                    })
                }
            });
        },
    },

	effects : {
        //得到用户空间大小
        *getUseSpace({ payload },{ call, put, select }){
            let { ret } = yield call( getSpaceSize );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        allSize  : Number(ret.allsize),
                        usedSize : Number(ret.usedsize),
                    }
                })
            }
        },

        //获得下拉列表
        *getSelectList({ payload },{ call, select, put }){
			//得到分类下拉列表
            let tagIdList = yield call( getTagIdList );
            if( tagIdList && tagIdList.ret && tagIdList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        tagIdList : tagIdList.ret.results
                    }
                })
            }else{
                message.error( ret && ret.errorMessage || '获取分类下拉列表失败');
            }

			//得到学员下拉列表
			let orgId = window._init_data.cerp_orgId;
            let { ret } = yield call( getStuIdList, ({ orgId }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuIdList : ret.results
                    }
                })
            }else{
				message.error( ret && ret.errorMessage || '获取学员下拉列表失败' )
			}
        },

        //得到传参
        *getStudentWorkParams({ payload },{ call, put, select }){
            let state = yield select( state => state.studentWorksModel );
			let commonSearchContent = [];
			let superSearchContent = [];
            let params = {
                pageSize  : state.pageSize,
                pageIndex : state.pageIndex,
            };
            yield put({
                type : 'getStudentWorkList',
                payload : {
                    params,
					commonSearchContent,
					superSearchContent,
                }
            })
        },

        //获取作品列表
        *getStudentWorkList({ payload },{ call, put, select }){
            let { params, commonSearchContent, superSearchContent } = payload;
			let orgId = window._init_data.cerp_orgId;
            yield put({ type : 'showLoading' });
            let { ret } = yield call( getStudentWorkList , ({ ...params, ...commonSearchContent, ...superSearchContent, orgId }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource        : ret.results,
                        resultCount       : ret.data.resultCount,
						selectedRowKeys   : [],
						selectedRows      : [],
						selectedRecordIds : [],
						commonSearchContent,
						superSearchContent,
                        ...params
                    }
                });
            };
            yield put({ type : 'closeLoading' });
        },

        //选择校区得到学员下拉列表
        *TenantSelectOnSelect({ payload },{ call, put, select }){
            let { value } = payload;
            let { ret } = yield call( getStuIdList, ({ orgId : value }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuIdList : ret.results
                    }
                })
            }
        },

        //点击搜索
        *onSearch({ payload },{ call, select, put }){
            let { superSearchContent, commonSearchContent } = payload;
            let studentWorksModel = yield select( state => state.studentWorksModel );
            let params = {
                pageSize : studentWorksModel.pageSize,
                pageIndex : 0,
            };
            yield put({
                type : 'getStudentWorkList',
                payload : {
                    params,
					superSearchContent,
					commonSearchContent
                }
            })
        },

        //批量删除
        *deleteWorks({ payload },{ call, put, select }){
            let state = yield select( state => state.studentWorksModel );
			let commonSearchContent = state.commonSearchContent;
			let superSearchContent = state.superSearchContent;
            let { selectedRecordIds } = payload;
            let workIds = selectedRecordIds.join(',');
            let { ret } = yield call( deleteWorks, ({ workIds : workIds }));
            if( ret && ret.errorCode == '9000' ){
                message.success('删除成功');
                let params = {
                    pageSize  : state.pageSize,
                    pageIndex : state.pageIndex,
                };
                yield put({
                    type : 'getStudentWorkList',
                    payload : {
                        params,
						commonSearchContent,
						superSearchContent
                    }
                });
            } else {
                message.error( ret && ret.errorMessage || '删除失败' );
            }
        },

        //删除
        *deleteWork({ payload },{ call, put, select }){
            let state = yield select( state => state.studentWorksModel );
			let commonSearchContent = state.commonSearchContent;
			let superSearchContent = state.superSearchContent;
            let { id } = payload;
            let { ret } = yield call( deleteWorks, ({ workIds : id }));
            if( ret && ret.errorCode == '9000' ){
                message.success('删除成功');
                let params = {
                    pageSize  : state.pageSize,
                    pageIndex : state.pageIndex
                };
                yield put({
                    type : 'getStudentWorkList',
                    payload : {
                        params,
						commonSearchContent,
						superSearchContent
                    }
                })
            }else {
                message.error( ret && ret.errorMessage || '删除失败' );
            }
        },

        //点击修改作品
        *updateStudentWork({ payload },{ call, put, select }){
            let { id, url } = payload;
            yield put({
                type : 'studentWorksUpdateModel/openUpdateModal',
                payload : {
                    id,
                    imgUrl : url,
                }
            });

        },

        //点击分页
        *paginationChange({ payload },{ call, select, put }){
            let { pageSize, pageIndex } = payload;
            let state = yield select( state => state.studentWorksModel );
			let commonSearchContent = state.commonSearchContent;
			let superSearchContent = state.superSearchContent;
            let params = {
                pageSize   : pageSize,
                pageIndex  : pageIndex - 1,
            };
            yield put({
                type : 'getStudentWorkList',
                payload : {
                    params,
					commonSearchContent,
					superSearchContent
                }
            });
        }
    },

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		},
        //表格加载中
        showLoading(state,action) {
            return { ...state, loading: true };
        },
        //表格加载消失
        closeLoading(state,action){
            return { ...state, loading: false };
        },
	}
}
