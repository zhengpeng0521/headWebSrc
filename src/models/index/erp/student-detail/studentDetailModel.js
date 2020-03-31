import {
    getStudentDetailInfo,

    getParentInfo,
    getAccountInfoList,
    getClassHourInfoList,

    getFollowUpRecordList,    //跟进记录
    deleteFollowUpRecord,     //删除跟进记录

    getContractOrderList,     //合同訂單列表

    getRefundRecordInfo,      //退款記錄列表

    getClassInfo,             //報班信息列表
    confirmEndCourse,
    endCourse,
    recoverCourse,
    confirmWaitForCourse,    //确认分班
    getWaitForCourseList,    //分班班级列表

    getStudentWorksList,
    deleteWork,

    getSignRecordList,        //簽到記錄列表
    deleteSignRecord,         //撤销签到记录
} from '../../../../services/erp/student-detail/studentDetailService';
import {
    getTagIdList,              //得到标签下拉列表
    getSpaceSize,              //得到用户空间状况
} from '../../../../services/erp/student-works/studentWorksService';
import parse from 'qs';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
	namespace : 'studentDetailModel',
	state : {
        studentId                    : '',                     //学员id
        orgId                        : '',                     //校区id
        studentDetailInfo            : {},                     //学员信息详情

        studentDetailTab             : '',

        //家长
        parentInfoDataSource         : [],                     //家长信息列表
        parentInfoLoading            : false,

        //账户
        accountInfoDataSource        : [],                     //账户信息列表
        accountInfoResultCount       : '',
        accountInfoPageIndex         : 0,
        accountInfoPageSize          : 10,
        accountInfoBalacne           : '0',
        accountInfoLoading           : false,

        //课时
        classHourDataSource          : [],                     //课时信息列表
        classHourResultCount         : '',                     //课时列表总数
        classHourPageIndex           : 0,
        classHourPageSize            : 10,
        classHourTotal               : '',                     //总课时数
        classHourLeft                : '',                     //剩余课时数
        classHourLoading             : false,

        //跟进记录
        followUpRecords              : [],                     //跟进记录列表
        followUpRecordResultCount    : 0,
        followUpRecordPageIndex      : 0,
        followUpRecordPageSize       : 10,
        followUpRecordId             : '',                     //跟进记录id
        followUpRecordInfo           : {},                     //跟进记录信息

        //合同订单
        contractOrderDataSource      : [],                     //合同订单列表
        contractOrderResultCount     : '',
        contractOrderPageSize        : 10,
        contractOrderPageIndex       : 0,
        contractOrderLoading         : false,

        //退款
        refundRecordInfoDataSource   : [],                     //退款列表
        refundRecordInfoResultCount  : '',
        refundRecordInfoPageSize     : 10,
        refundRecordInfoPageIndex    : 0,
        refundRecordInfoLoading      : false,

        //报班信息
        courseId                     : '',                     //课程Id
        stuCourseId                  : '',                     //报课Id
        classInfoDataSource          : [],                     //班级信息列表
        classInfoResultCount         : '',
        classInfoPageSize            : 10,
        classInfoPageIndex           : 0,
        classEndReasonModalVisible   : false,                  //停课原因模态框
        classInfoLoading             : false,
        classInfoLeft                : '0',                     //剩余课时
        classInfoTotal               : '0',                     //总共课时
        //分班
        classInfoCourseList          : [],                      //分班列表
        classInfoWaitForClassModal   : false,                   //分班弹框
        waitForCourseSelectedRowKeys : [],
        waitForCourseSelectedRows    : [],

        //作品
        studentWorksDataSource       : [],                     //作品列表
        studentWorksResultCount      : '',
        studentWorksPageSize         : 10,
        studentWorksPageIndex        : 0,
        studentWorksLoading          : false,

        //签到记录
        signRecordDataSource         : [],                     //签到记录列表
        signRecordResultCount        : '',
        signRecordPageSize           : 10,
        signRecordPageIndex          : 0,
        signRecordLoading            : false,

        menuList                     : {},

        //课程表
        permissionUids: [],     //有权限的用户编号 包含当前登陆用户和当前登陆用户的下属
	},
	subscriptions : {
		setup({ dispatch, history }){
			history.listen( ({ pathname , query }) => {
                let { studentId, orgId, key } = query;
				if( pathname === '/crm_stu_detail' || pathname == '/erp_stu_detail' ){
					dispatch({
                        type : 'initInStudentDetail',
                        payload : {
                            studentId,
                            orgId,
                            studentDetailTab : key,
                        }
                    });
                    dispatch({
                        type : 'updateState',
                        payload : {
                            studentId,
                            orgId,
                            studentDetailTab : key,
                        }
                    });
                    dispatch({
                        type : 'initPermissionUids',
                    });
				}
			})
		}
	},
	effects : {

        *initPermissionUids({ payload } , { call , put , select }){
            let mainLayoutModel = yield select( state => state.mainLayoutModel );
            let {currentUserId,subordinates} = mainLayoutModel;
            let permissionUids = [];
            permissionUids.push(currentUserId);
            subordinates && subordinates.length > 0 && subordinates.map(function(item) {
                permissionUids.push(item.id);
            });
            yield put({
                type : 'updateState',
                payload : {
                    permissionUids,
                }
            });
        },

        //进入学员详情界面
        *initInStudentDetail({ payload } , { call , put , select }){
            let { studentDetailTab, studentId, orgId } = payload;

            //得到学员详情信息
            let { ret } = yield call( getStudentDetailInfo, ({ stuId : studentId, orgId : orgId }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        studentDetailInfo : ret,
                    }
                })
            };

            //tab页
            if( studentDetailTab == 'parentInfo' ){
                yield put({
                    type : 'getParentInfo',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'accountInfo' ){
                yield put({
                    type : 'getAccountInfo',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'classHour' ){
                yield put({
                    type : 'getClassHourInfo',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'followUpRecord' ){
                yield put({
                    type : 'getFollowUPrecordParams',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'contractOrder' ){
                yield put({
                    type : 'getContractOrder',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'refundRecord' ){
                yield put({
                    type : 'getRefundRecordInfo',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'classInfo' ){
                yield put({
                    type : 'getClassInfo',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'studentWorks' ){
                yield put({
                    type : 'getStudentWorks',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'signRecord' ){
                yield put({
                    type : 'getSignRecord',
                    payload : {
                        studentDetailTab
                    }
                })
            }else if( studentDetailTab == 'classSchedule' ){
                yield put({
                    type : 'getClassSchedule',
                    payload : {
                        studentDetailTab
                    }
                })
            }
        },

        //点击家长tab
        *getParentInfo({ payload },{ call , put , select}){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab,
                    parentInfoLoading : true,
                }
            });
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                pageSize  : 10,
                pageIndex : 0,
                orgId     : studentDetailModel.orgId,
                stuId     : studentDetailModel.studentId,
            };
            let { ret } = yield call( getParentInfo, ({ ...params }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        parentInfoDataSource : ret.results,
                    }
                });
            } else{
                message.error( (ret && ret.errorMessage ) || '家长列表加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    parentInfoLoading    : false,
                }
            })
        },

        //点击账户
        *getAccountInfo({ payload },{ call, put, select }){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab,
                    accountInfoLoading : true,
                    accountInfoBalacne : '0',
                }
            });
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId      : studentDetailModel.studentId,
                orgId      : studentDetailModel.orgId,
                pageIndex  : 0,
                pageSize   : 10,
            }
            let { ret } = yield call( getAccountInfoList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        accountInfoDataSource   : ret.results,
                        accountInfoResultCount  : ret.data.resultCount,
                        accountInfoPageIndex    : 0,
                        accountInfoPageSize     : 10,
                    }
                });
                if( !!ret.results[0] ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            accountInfoBalacne     : ret.balance,
                        }
                    })
                };
            }else {
                message.error( (ret && ret.errorMessage ) || '账户记录加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    accountInfoLoading      : false,
                }
            })
        },

        //账户记录分页
        *accountInfoPagination({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    accountInfoLoading : true,
                }
            });
            let { accountInfoPageIndex, accountInfoPageSize } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageSize  : accountInfoPageSize,
                pageIndex : accountInfoPageIndex - 1
            };
            let { ret } = yield call( getAccountInfoList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        accountInfoDataSource  : ret.results,
                        accountInfoResultCount : ret.data.resultCount,
                        accountInfoPageIndex   : accountInfoPageIndex - 1,
                        accountInfoPageSize,
                    }
                });
            }else {
                message.error( (ret && ret.errorMessage ) || '账户记录加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    accountInfoLoading      : false,
                }
            })
        },

        //点击课时
        *getClassHourInfo({ payload },{ call, put, select }){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab,
                    classHourLoading : true,
                }
            });
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageIndex : 0,
                pageSize  : 10,
            }
            let { ret } = yield call( getClassHourInfoList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classHourDataSource  : ret.results,
                        classHourResultCount : ret.data.resultCount,
                        classHourTotal       : ret.allPeriodNum,
                        classHourLeft        : ret.allLeftPeriodNum,
                        classHourPageSize    : 10,
                        classHourPageIndex   : 0,
                    }
                })
            } else{
                message.error( (ret && ret.errorMessage ) || '加载课时记录失败' )
            }
            yield put({
                type : 'updateState',
                payload : {
                    classHourLoading : false,
                }
            })
        },

        //课时记录分页
        *classHourPagination({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    classHourLoading : true,
                }
            });
            let { classHourPageSize, classHourPageIndex } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );

            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageSize  : classHourPageSize,
                pageIndex : classHourPageIndex - 1
            };
            let { ret } = yield call( getClassHourInfoList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classHourDataSource  : ret.results,
                        classHourResultCount : ret.data.resultCount,
                        classHourPageIndex   : classHourPageIndex - 1,
                        classHourPageSize,
                    }
                })
            }else{
                message.error( (ret && ret.errorMessage ) || '加载课时记录失败' )
            }
            yield put({
                type : 'updateState',
                payload : {
                    classHourLoading     : false,
                }
            })
        },

        //点击跟进记录
        //得到跟进记录参数
        *getFollowUPrecordParams({ payload },{ call, put, select }){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab
                }
            });

            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId : studentDetailModel.studentId,
                pageSize : 10,
                pageIndex : 0,
            };
            yield put({
                type : 'getFollowUpRecord',
                payload : {
                    params
                }
            });
        },

        //得到跟进记录列表
        *getFollowUpRecord({ payload },{ call, put, select }){
            let { params } = payload;
            let { ret } = yield call( getFollowUpRecordList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        followUpRecords : ret.results,
                        followUpRecordResultCount : ret.data.resultCount,
                        ...params
                    }
                })
            }
        },
        //刷新跟进记录列表
        *refreshFollowUpList({ payload },{ call, put, select }){
            let studentDetailTab = 'followUpRecord';
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab
                }
            });
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageSize  : studentDetailModel.followUpRecordPageSize,
                pageIndex : studentDetailModel.followUpRecordPageIndex,
            };
            yield put({
                type : 'getFollowUpRecord',
                payload : {
                    params
                }
            })
        },
        //新增跟进记录
        *addFollowUpRecord({ payload },{ call, put, select }){
            let { id } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let stuId = studentDetailModel.studentId;
            let orgId = studentDetailModel.orgId;
            yield put({
                type : 'followUpRecordCreateModel/openFollowUpRecordModal',
                payload : {
                    stuId : stuId,
                    id    : id,
                    orgId : orgId,
                }
            })
        },
        //编辑跟进记录
        *editFollowUpRecord({ payload },{ call, put, select }){
            let { id } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let stuId = studentDetailModel.stuId;
            yield put({
                type : 'followUpRecordCreateModel/openFollowUpRecordModal',
                payload : {
                    stuId : stuId,
                    id : id
                }
            })
        },
        //删除跟进记录
        *deleteFollowUpRecord({ payload },{ call, put, select }){
            let { id } = payload;
            let { ret } = yield call( deleteFollowUpRecord, ({ id : id }));
            let studentDetailModel = yield select( state => state.studentDetailModel );
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    stuId     : studentDetailModel.studentId,
                    pageSize  : studentDetailModel.pageSize,
                    pageIndex : studentDetailModel.pageIndex,
                }
                yield put({
                    type : 'getFollowUpRecord',
                    payload : {
                        params
                    }
                })
            }
        },

        //跟进记录分页
        *paginationChange({ payload },{ call, put, select }){
            let { followUpRecordPageSize, followUpRecordPageIndex } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                pageSize : followUpRecordPageSize,
                pageIndex : followUpRecordPageIndex - 1,
                stuId : studentDetailModel.studentId,
            };
            yield put({
                type : 'getFollowUpRecord',
                payload : {
                    params
                }
            })
        },

        //点击合同订单
        *getContractOrder({ payload },{ call, put, select }){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab,
                    contractOrderLoading : true,
                }
            });

            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                pageSize : 10,
                pageIndex : 0,
                stuId : studentDetailModel.studentId,
            }
            let { ret } = yield call( getContractOrderList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        contractOrderDataSource  : ret.results,
                        contractOrderResultCount : ret.data.resultCount,
                        contractOrderPageSize    : 10,
                        contractOrderPageIndex   : 0,
                    }
                })
            }else {
                message.error( (ret && ret.errorMessage ) || '合同订单记录加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    contractOrderLoading     : false,
                }
            })
        },

        //合同订单记录分页
        *contractOrderPagination({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    contractOrderLoading : true,
                }
            })
            let { contractOrderPageIndex, contractOrderPageSize } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );

            let params = {
                stuId : studentDetailModel.studentId,
                orgId : studentDetailModel.orgId,
                pageSize : contractOrderPageSize,
                pageIndex : contractOrderPageIndex - 1
            };
            let { ret } = yield call( getContractOrderList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        contractOrderDataSource  : ret.results,
                        contractOrderResultCount : ret.data.resultCount,
                        contractOrderPageIndex   : contractOrderPageIndex - 1,
                        contractOrderPageSize,
                    }
                })
            }else {
                message.error( (ret && ret.errorMessage ) || '合同订单记录加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    contractOrderLoading     : false,
                }
            })
        },

        //点击退款
        *getRefundRecordInfo({ payload },{ call, put, select }){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab,
                    refundRecordInfoLoading : true,
                }
            });

            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                pageSize : 10,
                pageIndex : 0,
                orgId : studentDetailModel.orgId,
                stuId : studentDetailModel.studentId,
            }
            let { ret } = yield call( getRefundRecordInfo, ({ ...params }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        refundRecordInfoDataSource  : ret.results,
                        refundRecordInfoResultCount : ret.data.resultCount,
                        refundRecordInfoPageIndex   : 0,
                        refundRecordInfoPageSize    : 10,
                    }
                })
            }else {
                message.error( ( ret && ret.errorMessage ) || '退款列表加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    refundRecordInfoLoading : false,
                }
            })
        },
        //退款分页
        *refundRecordInfoPagination({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    refundRecordInfoLoading : true,
                }
            })
            let { refundRecordInfoPageSize, refundRecordInfoPageIndex } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );

            let params = {
                stuId : studentDetailModel.studentId,
                orgId : studentDetailModel.orgId,
                pageSize : refundRecordInfoPageSize,
                pageIndex : refundRecordInfoPageIndex - 1
            }
            let { ret } = yield call( getRefundRecordInfo, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        refundRecordInfoDataSource  : ret.results,
                        refundRecordInfoResultCount : ret.data.resultCount,
                        refundRecordInfoPageIndex   : refundRecordInfoPageIndex - 1,
                        refundRecordInfoPageSize,
                    }
                })
            }else {
                message.error( ( ret && ret.errorMessage ) || '退款列表加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    refundRecordInfoLoading     : false,
                }
            })
        },

        //点击报读信息
        //得到报班信息所需参数
		*getClassInfo({ payload } , { call , put , select }){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab,
                }
            });
            yield put({
                type : 'getClassHourInfoDetail',
                payload : {}
            });
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                orgId     : studentDetailModel.orgId,
                stuId     : studentDetailModel.studentId,
                pageIndex : 0,
                pageSize  : 10,
            };
            yield put({
                type : 'getClassInfoList',
                payload : {
                    params
                }
            });
        },

        //得到课时余额与总额
        *getClassHourInfoDetail({ payload },{ call, put, select }){
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageIndex : 0,
                pageSize  : 10,
            }
            let { ret } = yield call( getClassHourInfoList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classInfoLeft  : ret.allLeftPeriodNum,
                        classInfoTotal : ret.allPeriodNum
                    }
                })
            };
        },

        //得到报班信息列表
        *getClassInfoList({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    classInfoLoading : true,
                }
            });
            let { params } = payload;
            let { ret } = yield call( getClassInfo, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classInfoDataSource   : ret.results,
                        classInfoResultCount  : ret.data.resultCount,
                        ...params,
                    }
                })
            }else {
                 message.error( ( ret && ret.errorMessage ) || '班级列表加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    classInfoLoading      : false,
                }
            })
        },

        //报班
        *toJoinClass({ payload },{ call, put, select }){
            let studentDetailModel = yield select( state => state.studentDetailModel );
            yield put({
                type : 'toClassModalModel/openToClassModal',
                payload : {
                    stuId : studentDetailModel.studentId,
                    orgId : studentDetailModel.orgId,
                }
            })
        },

        //分班
        *waitForCourse({ payload },{ call, put, select }){
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let classInfoWaitForClassModal = studentDetailModel.classInfoWaitForClassModal;
            let { courseId, stuCourseId } = payload;
            let params = {
                orgId    : studentDetailModel.orgId,
                courseId : courseId,
            };
            let { ret } = yield call( getWaitForCourseList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classInfoCourseList           : ret.results,
                        classInfoWaitForClassModal    : !classInfoWaitForClassModal,
                        stuCourseId                   : stuCourseId
                    }
                })
            }
        },

        //确认分班
        *confirmWaitForClass({ payload },{ call, put, select }){
            let { waitForCourseSelectedRows, classInfoWaitForClassModal } = payload;
            if( !!waitForCourseSelectedRows && waitForCourseSelectedRows.length > 0 ){
                let selectedRows = waitForCourseSelectedRows[0];
                let studentDetailModel = yield select( state => state.studentDetailModel );
                let params = {
                    stuId       : studentDetailModel.studentId,
                    orgId       : selectedRows.orgId,
                    stuCourseId : studentDetailModel.stuCourseId,
                    clsId       : selectedRows.id,
                };
                let { ret } = yield call( confirmWaitForCourse, ({ ...params }));
                if( ret && ret.errorCode == '9000' ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            classInfoWaitForClassModal   : !classInfoWaitForClassModal,
                            classInfoCourseList          : [],
                            waitForCourseSelectedRows    : [],
                            waitForCourseSelectedRowKeys : [],
                            stuCourseId                  : '',
                            clsId                        : '',
                        }
                    })
                    let obj = {
                        orgId     : studentDetailModel.orgId,
                        stuId     : studentDetailModel.studentId,
                        pageSize  : studentDetailModel.classInfoPageSize,
                        pageIndex : studentDetailModel.classInfoPageIndex,
                    };
                    yield put({
                        type : 'getClassInfoList',
                        payload : {
                            params : obj
                        }
                    });
                }
            }else {
                message.error( '请选择班级' );
                return;
            }
        },

        //确认停课
        *confirmEndCourse({payload },{ call, put, select }){
            let { params, classEndReasonModalVisible } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let values = {
                stuCourseId : studentDetailModel.stuCourseId,
                orgId       : studentDetailModel.orgId,
                reason      : params.endClassReason,
                backDay     : params.endClassTime.format('YYYY-MM-DD'),
            }
            let { ret } = yield call( confirmEndCourse, ({ ...values }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        classEndReasonModalVisible : !classEndReasonModalVisible,
                        stuCourseId                : '',
                    }
                });
                let obj = {
                    orgId     : studentDetailModel.orgId,
                    stuId     : studentDetailModel.studentId,
                    pageSize  : studentDetailModel.classInfoPageSize,
                    pageIndex : studentDetailModel.classInfoPageIndex,
                };
                yield put({
                    type : 'getClassInfoList',
                    payload : {
                        params : obj
                    }
                });
            }
        },

        //结束课程
        *endCourse({ payload },{ call, put, select }){
            let { id } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                orgId       : studentDetailModel.orgId,
                stuCourseId : id,
            };
            let { ret } = yield call( endCourse, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                let obj = {
                    orgId     : studentDetailModel.orgId,
                    stuId     : studentDetailModel.studentId,
                    pageSize  : studentDetailModel.classInfoPageSize,
                    pageIndex : studentDetailModel.classInfoPageIndex,
                }
                yield put({
                    type : 'getClassInfoList',
                    payload : {
                        params : obj
                    }
                })
            }
        },

        //班级信息点击复原
        *recoverCourse({payload },{ call ,put, select }){
            let { id } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuCourseId : id,
                orgId       : studentDetailModel.orgId,
            }
            let { ret } = yield call( recoverCourse, ({ ...params }) );
            if( ret && ret.errorCode == '9000' ){
                let obj = {
                    orgId     : studentDetailModel.orgId,
                    stuId     : studentDetailModel.studentId,
                    pageSize  : studentDetailModel.classInfoPageSize,
                    pageIndex : studentDetailModel.classInfoPageIndex,
                }
                yield put({
                    type : 'getClassInfoList',
                    payload : {
                        params : obj
                    }
                })
            }
        },

        //班级信息分页
        *classInfoPagination({ payload },{call , select , put}){
            let { classInfoPageIndex , classInfoPageSize } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                orgId     : studentDetailModel.orgId,
                stuId     : studentDetailModel.studentId,
                pageSize  : classInfoPageSize,
                pageIndex : classInfoPageIndex - 1,
            };
            yield put({
                type : 'getClassInfoList',
                payload : {
                    params
                }
            })
        },

        //点击作品
        *getStudentWorks({ payload },{ call, select, put }){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab
                }
            });
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageIndex : 0,
                pageSize  : 10,
            };
            yield put({
                type : 'getStudentWorksList',
                payload : {
                    params
                }
            });
        },
        //得到作品列表
        *getStudentWorksList({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    studentWorksLoading : true,
                }
            })
            let { params } = payload;
            let { ret } = yield call( getStudentWorksList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        studentWorksDataSource  : ret.results,
                        studentWorksResultCount : ret.data.resultCount,
                        ...params,
                    }
                })
            }else {
                message.error( ( ret && ret.errorMessage ) || '作品列表加载失败' )
            };
            yield put({
                type : 'updateState',
                payload : {
                    studentWorksLoading     : false,
                }
            })
        },

        //上传作品
        *uploadWorks({ payload },{ call, put, select }){
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let tagIdListCall = yield call( getTagIdList );
            let spaceSizeCall = yield call( getSpaceSize );
            let tagIdList, allSize, usedSize;
            if( tagIdListCall && tagIdListCall.ret && tagIdListCall.ret.errorCode == '9000'){
                tagIdList = tagIdListCall.ret.results
            } else{
                message.error( tagIdListCall && tagIdListCall.ret && tagIdListCall.ret.errorMessage || '获取分类列表失败' )
            };
            if( spaceSizeCall && spaceSizeCall.ret && spaceSizeCall.ret.errorCode == '9000' ){
                allSize = Number( spaceSizeCall.ret.allsize );
                usedSize = Number( spaceSizeCall.ret.usedsize );
            }
            yield put({
                type : 'studentWorksUploadModel/openUploadModal',
                payload : {
                    allSize, usedSize, tagIdList,
                    stuId : studentDetailModel.studentId,
                    orgId : studentDetailModel.orgId
                }
            })
        },
        //刷新学员作品列表
        *refreshStudentWorks({ payload },{ call, put, select }){
            let studentDetailTab = 'studentWorks';
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab
                }
            })
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageSize  : studentDetailModel.studentWorksPageSize,
                pageIndex : studentDetailModel.studentWorksPageIndex,
            };
            yield put({
                type : 'getStudentWorksList',
                payload : {
                    params
                }
            })
        },
        //删除作品
        *deleteWork({ payload },{ call, put, select }){
            let { id } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let { ret } = yield call( deleteWork, ({ workIds : id }));
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    stuId     : studentDetailModel.studentId,
                    orgId     : studentDetailModel.orgId,
                    pageSize  : studentDetailModel.studentWorksPageSize,
                    pageIndex : studentDetailModel.studentWorksPageIndex,
                }
                yield put({
                    type : 'getStudentWorksList',
                    payload : {
                        params
                    }
                })
            }
        },

        //点击修改作品
        *updateStudentWork({ payload },{ call, put, select }){
            let { id, url } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            yield put({
                type : 'studentWorksUpdateModel/openUpdateModal',
                payload : {
                    id,
                    imgUrl : url,
                    stuId  : studentDetailModel.studentId,
                }
            });
        },

        //作品分页
        *studentWorksPagination({ payload },{ call, put, select }){
            let { studentWorksPageIndex, studentWorksPageSize } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );

            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageSize  : studentWorksPageSize,
                pageIndex : studentWorksPageIndex - 1
            }
            yield put({
                type : 'getStudentWorksList',
                payload : {
                    params
                }
            })
        },

        //点击签到记录
        *getSignRecord({ payload } , { call , put , select }){
            let { studentDetailTab } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab,
                }
            });

            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                stuId     : studentDetailModel.studentId,
                orgId     : studentDetailModel.orgId,
                pageSize  : studentDetailModel.signRecordPageSize,
                pageIndex : studentDetailModel.signRecordPageIndex,
            }
            yield put({
                type : 'getSignRecordList',
                payload : {
                    params
                }
            })
        },

        //得到签到记录列表
        *getSignRecordList({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    signRecordLoading : true
                }
            });
            let { params } = payload;
            let { ret } = yield call( getSignRecordList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        signRecordDataSource : ret.results,
                        signRecordResultCount : ret.data.resultCount,
                        ...params
                    }
                })
            }else {
                message.error( ( ret && ret.errorMessage ) || '签到记录加载失败' );
            };
            yield put({
                type : 'updateState',
                payload : {
                    signRecordLoading : false
                }
            })

        },
        //撤销签到记录
        *deleteSignRecord({ payload },{ call, put, select }){
            let { id } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                orgId : studentDetailModel.orgId,
                stuSignId : id,
            }
            let { ret } = yield call( deleteSignRecord, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                let values = {
                    stuId     : studentDetailModel.studentId,
                    orgId     : studentDetailModel.orgId,
                    pageSize  : studentDetailModel.signRecordPageSize,
                    pageIndex : studentDetailModel.signRecordPageIndex,
                }
                yield put({
                    type : 'getSignRecordList',
                    payload : {
                        params : values
                    }
                })
            }else{
                message.error( ret && ret.errorMessage || '加载签到记录失败' )
            }
        },
        //签到记录分页
        *signRecordPagination({ payload },{ call, select, put}){
            let { signRecordPageSize, signRecordPageIndex } = payload;
            let studentDetailModel = yield select( state => state.studentDetailModel );
            let params = {
                pageSize : signRecordPageSize,
                pageIndex : signRecordPageIndex - 1,
                orgId : studentDetailModel.orgId,
                stuId : studentDetailModel.studentId,
            }
            yield put({
                type : 'getSignRecordList',
                payload : {
                    params
                }
            })
        },

        //点击课程表
        *getClassSchedule({ payload } , { call , put , select }){
            let { studentDetailTab } = payload;

            yield put({
                type : 'updateState',
                payload : {
                    studentDetailTab
                }
            })
        },
	},
	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		},
        //表格加载中
        showLoading(state,action) {
            return { ...state, ...action.payload, loading: true };
        },
        //表格加载消失
        closeLoading(state,action){
            return { ...state, ...action.payload, loading: false };
        },
	}
}
