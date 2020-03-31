import {
    deleteWorkTag,
    confirmAddWorkTag,
} from '../../../../services/erp/student-works/studentWorksManageTypeService';
import { getTagIdList } from '../../../../services/erp/student-works/studentWorksService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'studentWorksManageTypeModel',

	state : {

		manageTypeModalVisible : false,              //管理分类模态框
        manageTypeWorkTagList  : [],                 //分类列表
        updateWorkTagKey       : '',                 //修改的分类

	},

	effects : {
		*openManageTypeModal({ payload },{ call, put, select }){
            let { ret } = yield call( getTagIdList );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        manageTypeWorkTagList : ret.results
                    }
                })
            }else{
                message.error( ret && ret.errorMessage || '获取分类下拉列表失败');
            }
            let studentWorksManageTypeModel = yield select( state => state.studentWorksManageTypeModel );
            let manageTypeModalVisible = studentWorksManageTypeModel.manageTypeModalVisible;
            yield put({
                type : 'updateState',
                payload : {
                    manageTypeModalVisible : !manageTypeModalVisible,
                }
            })
        },

        //删除分类
        *deleteWorkTag({ payload },{ call, select, put }){
            let { id, refreshList } = payload;
            let { ret } = yield call( deleteWorkTag , ( { id : id , tenantId : '47' } ));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                       manageTypeWorkTagList : ret.results,
                    }
                });
                yield put({
                    type : 'studentWorksModel/updateState',
                    payload : {
                        tagIdList : ret.results
                    }
                });
                yield put({
                    type : 'studentWorksUploadModel/updateState',
                    payload : {
                        tagIdList : ret.results
                    }
                });
                //刷新列表
                refreshList();
            } else{
                message.error( ret && ret.errorMessage || '删除分类失败' );
            }
        },

        //确认新增分类
        *confirmAddWorkTag({ payload },{ call, select, put }){
            let { name } = payload;
            let { ret } = yield call( confirmAddWorkTag , ({ name : name }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        manageTypeWorkTagList : ret.results
                    }
                });
                yield put({
                    type : 'studentWorksModel/updateState',
                    payload : {
                        tagIdList : ret.results
                    }
                });
                yield put({
                    type : 'studentWorksUploadModel/updateState',
                    payload : {
                        tagIdList : ret.results
                    }
                });
            }else {
                message.error( ret && ret.errorMessage || '新增分类失败' );
            }
        },

        //确认修改分类
        *confirmUpdateWorkTag({ payload },{ call, put, select }){
            let { name, id, refreshList } = payload;
            let { ret } = yield call( confirmAddWorkTag, ({ name : name, id : id }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        manageTypeWorkTagList : ret.results,
                        updateWorkTagKey      : ''
                    }
                });
                yield put({
                    type : 'studentWorksModel/updateState',
                    payload : {
                        tagIdList : ret.results
                    }
                });
                yield put({
                    type : 'studentWorksUploadModel/updateState',
                    payload : {
                        tagIdList : ret.results
                    }
                });
                //刷新列表
                refreshList();
            }else {
                message.error( ret && ret.errorMessage || '修改分类失败' );
            }
        },
    },
	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
