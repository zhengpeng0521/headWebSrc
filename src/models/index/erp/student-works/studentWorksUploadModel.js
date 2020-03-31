import {
    getWorkTagList,
    getStuIdList,
    uploadWorksToCloud
} from '../../../../services/erp/student-works/studentWorksUploadService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'studentWorksUploadModel',

	state : {
		uploadWorksModalVisible : false,              //管理分类模态框

        stuIdList               : [],                 //学员列表
        tagIdList               : [],                 //分类列表

        fileList                : [],                 //图片列表

        allSize	                : '',                 //全部空间
        usedSize	            : '',                 //已用空间

        stuId                   : '',
        orgId                   : '',

        uploadLoading           : false,              //上传加载状态(按钮+表单)
	},

	effects : {
        //打开上传框
		*openUploadModal({ payload },{ call, put, select }){

            let { allSize, usedSize, tagIdList, orgId, stuId } = payload;
            let studentWorksUploadModel = yield select( state => state.studentWorksUploadModel );
            let uploadWorksModalVisible = studentWorksUploadModel.uploadWorksModalVisible;

            if( !!orgId ){
                let { ret } = yield call( getStuIdList, ({ orgId : orgId }));
                if( ret && ret.errorCode == '9000' ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            stuIdList : ret.results,
                        }
                    })

                    yield put({
                        type : 'updateState',
                        payload : {
                            uploadWorksModalVisible : !uploadWorksModalVisible,
                            tagIdList,
                            usedSize,
                            allSize,
                            orgId:orgId,
                            stuId,
                        }
                    })


                }


            }else  {

               // console.log("11111111");
                yield put({
                    type : 'updateState',
                    payload : {
                        uploadWorksModalVisible : !uploadWorksModalVisible,
                        tagIdList,
                        usedSize,
                        allSize,
                        orgId:!orgId?'':orgId,
                        stuId,
                    }
                })
            }



        },
        //选择校区更新学员下拉列表
        *tenantSelectOnSelect({ payload },{ call, put, select }){
            let { value } = payload;
            let { ret } = yield call( getStuIdList, ({ orgId : value }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuIdList : ret.results,
                    }
                })
            }else {
                message.error( ret && ret.errorMessage || '获取学员列表失败' )
            }
        },

        //点击上传
        *uploadWorksToCloud({ payload },{ call, put, select }){
            yield put({ type : 'showUpLoadingLoading' });
            let { values, works, refreshList } = payload;
            let studentWorksUploadModel = yield select( state => state.studentWorksUploadModel );
            let uploadWorksModalVisible = studentWorksUploadModel.uploadWorksModalVisible;
            let params = {
                works    : JSON.stringify(works),
                allSize  : studentWorksUploadModel.allSize,
                usedSize : studentWorksUploadModel.usedSize,
                ...values,
            }
            let { ret } = yield call( uploadWorksToCloud, ({ ...params }) )
            if( ret && ret.errorCode == '9000' ){
                message.success('上传成功');
                refreshList();
                yield put({
                    type : 'updateState',
                    payload : {
                        uploadWorksModalVisible : false,
                        fileList : [],
                        orgId    : '',
                        stuId    : '',
                    }
                });
            }else {
                message.error( ret && ret.errorMessage || '上传失败' );
            }
            yield put({ type : 'closeUpLoadingLoading' });
        }
    },

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		},
        showUpLoadingLoading(state, action){
            return { ...state, uploadLoading : true }
        },
        closeUpLoadingLoading(state, action){
            return { ...state, uploadLoading : false }
        }
	}
}
