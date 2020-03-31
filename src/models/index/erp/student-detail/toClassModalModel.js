import {
    getCourseList,
    getClassOptionList,
    confirmToClass,
} from '../../../../services/erp/student-detail/toClassModalService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'toClassModalModel',

    state : {
        stuId                         : '',
        orgId                         : '',

        toClassModalVisible           : false,              //报班模态框
        step                          : '1',                //报班步骤

        courseList                    : [],                 //可报班课程
        loading                       : false,

        classOptionList               : [],                 //可报班级下拉列表
        courseName                    : '',                 //报读课程
        couresId                      : '',                 //报读课程Id
        perNum                        : '',                 //每节消耗课程数
        maxProgress                   : 0,                  //总节数
    },

    effects : {
        *openToClassModal({ payload },{ call, put, select }){
            let { stuId, orgId } = payload;
            let toClassModalModel = yield select( state => state.toClassModalModel );
            let toClassModalVisible = toClassModalModel.toClassModalVisible;
            let params = {
                stuId : stuId,
                orgId : orgId,
            }
            let { ret } = yield call( getCourseList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        toClassModalVisible : !toClassModalVisible,
                        courseList          : ret.results,
                        stuId               : stuId,
                        orgId               : orgId,
                        step                : '1',
                    }
                })
            }else{
				message.error( ret && ret.errorMessage || '无法报班' )
			}
        },

        //点击报班
        *clickToClass({ payload },{ call, put, select }){
            let { id } = payload;
            let toClassModalModel = yield select( state => state.toClassModalModel );
            let params = {
                courseId : id,
                orgId    : toClassModalModel.orgId,
            }
            let { ret } = yield call( getClassOptionList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classOptionList : ret.results,
                        courseName      : ret.courseName,
                        perNum          : ret.perNum,
                        step            : '2',
                        courseId        : id,
                    }
                })
            }
        },

        //确认报班
        *confirmToClass({ payload },{ call, put, select }){
            let { values } = payload;
            let toClassModalModel = yield select( state => state.toClassModalModel );
            let toClassModalVisible = toClassModalModel.toClassModalVisible;
            let params = {
                courseId : toClassModalModel.courseId,
                stuId    : toClassModalModel.stuId,
                orgId    : toClassModalModel.orgId,
                cost     : values.cost,
                clsId    : values.clsId,
            }
            let { ret } = yield call( confirmToClass, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'studentDetailModel/getClassInfo',
                    payload : {
                        studentDetailTab : 'classInfo'
                    }
                });
                //刷新课时数
                yield put({
                    type : 'studentDetailModel/getClassHourInfoDetail',
                    payload : {

                    }
                });


                //刷新学员详情里报班信息
                yield put({
                    type : 'stuManagementModel/reshList',
                    payload : {

                    }
                });
                yield put({
                    type : 'updateState',
                    payload : {
                        toClassModalVisible : !toClassModalVisible,
                        courseList          : [],

                        classOptionList     : [],
                        courseId            : '',
                        courseName          : '',
                        perNum              : 0,
                        maxProgress         : 0,
                    }
                })
            }else{
                message.error( ret && ret.errorMessage || '报班失败' );
            }
        }
    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
