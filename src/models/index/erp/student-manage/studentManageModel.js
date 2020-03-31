import {
    getClassInfoList,    //得到班级下拉列表
    getTeacherIdList,    //得到老师下拉列表
    getStudentList,      //得到学员列表
    getParentWxInfo,
    deleteStudent,       //删除学员
    updateParentWxInfo
} from '../../../../services/erp/student-manage/studentManageService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'studentManageModel',
	state : {
        searchVisible               : false,              //搜索框是否可见
        teacherOptions              : [],                 //搜索框带班老师列表
        classOptions                : [],                 //报读信息列表

        name                        : '',                 //学员姓名
        sex                         : '',                 //学员性别
        teacherId                   : '',                 //老师id
        orgId                       : '',                 //校区id
        attention                   : '',                 //微信是否关注
        mobile                      : '',                 //联系信息
        clsId                       : '',                 //报读信息
        status                      : '',                 //状态

		dataSource                  : [],
        resultCount                 : '',
        selectedRowKeys             : [],
        selectedRows                : [],
        selectedRecordIds           : [],                 //批量操作选择的列表项
        pageIndex                   : 0,
        pageSize                    : 10,


        menuList                    : {},

    },
	subscriptions : {
		setup ({ dispatch, history }){
			history.listen( ({ pathname }) => {
				if( pathname === '/erp_stu_list' ){
					dispatch({
						type : 'getStudentListParams',
						payload : {

						}
					});
            dispatch({
                type : 'getSelectOpts',
                payload : {}
            })
				}
			})
		}
	},
	effects : {
        //获得下拉列表
        *getSelectOpts({ payload },{ call, put, select }){
            let teacherIdList = yield call( getTeacherIdList );
            if( teacherIdList && teacherIdList.ret && teacherIdList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload　: {
                        teacherOptions : teacherIdList.ret.results,
                    }
                })
            }else {
                message.error( teacherIdList && teacherIdList.ret && teacherIdList.ret.errorMessage || '获取老师下拉列表失败' );
            };

        },

        //获得学员列表所需传参
        *getStudentListParams({ payload },{ call, put, select }){
            let studentManageModel = yield select( state => state.studentManageModel );
            let params = {
                pageIndex  : studentManageModel.pageIndex,
                pageSize   : studentManageModel.pageSize,
                name       : studentManageModel.name,
                sex        : studentManageModel.sex,
                teacherId  : studentManageModel.teacherId,
                orgId      : studentManageModel.orgId,
                attention  : studentManageModel.attention,
                mobile     : studentManageModel.mobile,
                clsId      : studentManageModel.clsId,
                status     : studentManageModel.status
            };
            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            })
        },
        //得到学员列表
		*getStudentList({ payload } , { put , call , select }){
            let { params } = payload;
            let { ret } = yield call( getStudentList ,({ ...params }) );
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
		},
        //搜索框显隐藏
        *searchStudent({ payload },{ put, call, select }){
            let { searchVisible } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    searchVisible : !searchVisible
                }
            })
        },

        //选择校区得到班级下拉列表
        *changeOrgId({ payload },{ call, put , select }){
            let { value } = payload;
            let { ret } = yield call( getClassInfoList, ({ orgId : value }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classOptions : ret.results,
                    }
                })
            }
        },

        //点击搜索按钮
        *onStudentSearch({ payload },{ put, call, select }){
            let { values } = payload;
            let studentManageModel = yield select( state => state.studentManageModel );
            let params = {
                pageSize   : studentManageModel.pageSize,
                pageIndex  : 0,
                ...values,

            }

            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            })
        },
        //点击重置按钮
        *onStudentReset({ payload},{ call , put , select }){
            let { values } = payload;
            let studentManageModel = yield select( state => state.studentManageModel );
            let pageSize = studentManageModel.pageSize;
            let pageIndex = studentManageModel.pageIndex;
            let params = {
                pageSize  : studentManageModel.pageSize,
                pageIndex : studentManageModel.pageIndex,
                ...values
            }
            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            })
        },

		//点击微信绑定
        *studentWxBindModal({ payload },{ call, put , select }){
            let { studentWxcodeModalVisible ,id } = payload;
            let { ret } = yield call( getParentWxInfo );
            if( ret && ret.errorCode == '9000' ){
                let studentWxList = ret.results;
                yield put({
                    type : 'updateState',
                    payload : {
                        studentWxcodeModalVisible : !studentWxcodeModalVisible,
                        studentWxList,
                    }
                })
            }
        },

        //点击跳到学员详情
        *studentInfoDetail({ payload } , { call, select , put}){
            let studentManageModel = yield select( state => state.studentManageModel );
            let menuList = studentManageModel.menuList;
            let studentDetailTab = '';
            if( !!menuList.crm_stuparent_mgr ){
                studentDetailTab = 'parentInfo';
            }else if( !!menuList.crm_product_mgr ){
                studentDetailTab = 'accountInfo'
            }else if( !!menuList.crm_follow_mgr ){
                studentDetailTab = 'followUpRecord'
            }else if( !!menuList.crm_sorder_mgr ){
                studentDetailTab = 'contractOrder'
            }else if( !!menuList.crm_rorder_mgr ){
                studentDetailTab = 'refundRecord'
            }else if( !!menuList.erp_course_mgr ){
                studentDetailTab = 'classInfo'
            }else if( !!menuList.erp_cloud_mgr ){
                studentDetailTab = 'studentWorks'
            }else if( !!menuList.erp_stusign_mgr ){
                studentDetailTab = 'signRecord'
            }else if( !!menuList.erp_cp_mgr ){
                studentDetailTab = 'classSchedule'
            }
            let { id, orgId } = payload;
            yield put( routerRedux.push('/erp_stu_detail?studentId='+id+'&orgId='+orgId+'&key='+studentDetailTab ) );
        },

        //分页
        *paginationChange({ payload} , { call ,put , select}){
            let { pageIndex , pageSize } = payload;
            let studentManageModel = yield select( state => state.studentManageModel );
            let { studentName, studentSex, salerId, teacherId, orgId, attention, mobile, clsId, status } = studentManageModel;
            let params = {
                pageSize  : pageSize,
                pageIndex : pageIndex - 1,
                name      : studentManageModel.name,
                sex       : studentManageModel.sex,
                teacherId : studentManageModel.teacherId,
                orgId     : studentManageModel.orgId,
                attention : studentManageModel.attention,
                mobile    : studentManageModel.mobile,
                clsId     : studentManageModel.clsId,
                status    : studentManageModel.status,
            };
            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            })
        },
	},
	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
