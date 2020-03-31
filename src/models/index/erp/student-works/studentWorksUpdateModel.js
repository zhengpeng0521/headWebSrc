import {
    getStuIdList,               //得到学员下拉列表
    getStudentWorkInfo,         //得到单个作品信息
    confirmUpdateWorks,         //确认修改作品信息
    getTagIdList

} from '../../../../services/erp/student-works/studentWorksUpdateService';
import { message } from 'antd';
import parse from 'qs';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'studentWorksUpdateModel',

	state : {
		updateWorksModalVisible        : false,               //修改模态框
        studentWorkInfo                : {},                  //作品信息
        imgUrl                         : '',                  //图片地址

        stuId                          : '',                  //学员id

        tagIdList                      : [],                  //标签id列表
        stuIdList                      : [],                  //学员id列表
	},

	effects : {
		*openUpdateModal({ payload }, { call, put, select }){
            let { id, imgUrl, tagIdList, stuId } = payload;
            let studentWorksUpdateModel = yield select( state => state.studentWorksUpdateModel );
            let updateWorksModalVisible = studentWorksUpdateModel.updateWorksModalVisible;
            let { ret } = yield call( getStudentWorkInfo, ({ id : id }));
            if( ret && ret.errorCode == '9000' ){
                let studentWorkInfo = {
                    id    : ret.id,
                    orgId : ret.orgId,
                    stuId : ret.stuId,
                    tagId : ret.tagId,
                    title : ret.title,
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        stuId,
                        imgUrl,
                        tagIdList,
                        studentWorkInfo,
                        updateWorksModalVisible : !updateWorksModalVisible
                    }
                });
                yield put({
                    type : 'getSelectOptList',
                    payload : {
                        orgId : ret.orgId
                    }
                })
            } else {
                message.error( ret && ret.errorMessage || '获取单个作品信息失败' );
            }
        },

        //得到下拉列表
        *getSelectOptList({ payload },{ call, put, select }){
            let { orgId } = payload;
            let stuIdList = yield call( getStuIdList, ({ orgId : orgId }) );
            let tagIdList = yield call( getTagIdList );
            if( tagIdList && tagIdList.ret && tagIdList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        tagIdList : tagIdList.ret.results
                    }
                })
            }else {
                message.error( tagIdList && tagIdList.ret && tagIdList.ret.errorMessage || '获取下拉列表失败' );
            }
            if( stuIdList && stuIdList.ret && stuIdList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        stuIdList : stuIdList.ret.results,
                    }
                })
            } else{
                message.error( stuIdList && stuIdList.ret && stuIdList.ret.errorMessage || '获取学员列表失败' )
            }
        },

        //确认修改作品
        *confirmUpdateWorks({ payload },{ call, put, select }){
            let { values, refreshList } = payload;
            let studentWorksUpdateModel = yield select( state => state.studentWorksUpdateModel );
            let updateWorksModalVisible = studentWorksUpdateModel.updateWorksModalVisible;
            let studentWorkInfo = studentWorksUpdateModel.studentWorkInfo;
            let params = {
                id       : studentWorkInfo.id,
                orgId    : studentWorkInfo.orgId,
                ...values,
            }
            let { ret } = yield call( confirmUpdateWorks, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                message.success('保存成功');
                refreshList();
                yield put({
                    type : 'updateState',
                    payload : {
                        studentWorkInfo : {}
                    }
                })
            }else{
                message.error( stuIdList && stuIdList.ret && stuIdList.ret.errorMessage || '保存失败' )
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
