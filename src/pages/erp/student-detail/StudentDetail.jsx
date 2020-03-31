import React , { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Radio, Tabs } from 'antd';

import StudentInfoDetail from '../../../components/erp/student-detail/StudentInfoDetail';                               //学员详情

import ParentInfoTable        from '../../../components/erp/student-detail/parent-info/ParentInfoTable';                //家长信息
import AccountInfoTable       from '../../../components/erp/student-detail/account-info/AccountInfoTable';              //账户信息
import ClassHourTable         from '../../../components/erp/student-detail/class-hour/ClassHourTable';                  //课时信息

import FollowUpRecord         from '../../../components/erp/student-detail/follow-up-record/FollowUpRecord';            //跟进记录
import FollowUpRecordCreatePage from '../../../pages/scrm/follow-up-record/FollowUpRecordCreatePage';                   //跟进记录新增框

import ContractOrderTable     from '../../../components/erp/student-detail/contract-order/ContractOrderTable';          //合同订单
import RefundRecordTable      from '../../../components/erp/student-detail/refund-record/RefundRecordTable';            //退款

import ClassInfoTable         from '../../../components/erp/student-detail/class-info/ClassInfoTable';                  //报班信息
import ToClassModalPage       from '../../../pages/erp/student-detail/ToClassModalPage';                                //报班模态框
import StudentWorksUpload     from '../../../pages/erp/student-works/StudentWorksUploadPage';                           //上传作品框
import StudentWorksManageType from '../../../pages/erp/student-works/StudentWorksManageTypePage';                       //管理分类框

import StudentWorksUpdate     from '../../../pages/erp/student-works/StudentWorksUpdatePage';                           //修改作品框

import StudentWorksTable      from '../../../components/erp/student-detail/student-works/StudentWorksTable';            //作品

import SignRecordTable        from '../../../components/erp/student-detail/sign-record/SignRecordTable';                //签到记录
import ScheduleSignPage		  from '../stu-sign/ScheduleSignPage';

import ClassSchedule 	      from '../class-schedule/ClassSchedule';                                                   //课程表

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

function StudentDetailPage({ dispatch, studentDetailModel, mainLayoutModel }){
	let {
        studentId,
        orgId,

        studentDetailInfo,               //单个学员信息
        studentDetailTab,

        //家长信息
        parentInfoDataSource,
        parentInfoLoading,

        //账户信息列表
        accountInfoDataSource,
        accountInfoResultCount,
        accountInfoPageIndex,
        accountInfoPageSize,
        accountInfoBalacne,
        accountInfoLoading,

        //课时信息
        classHourDataSource,
        classHourResultCount,
        classHourPageIndex,
        classHourPageSize,
        classHourTotal,
        classHourLeft,
        classHourLoading,

        //跟进记录
        followUpRecords,
        followUpRecordResultCount,
        followUpRecordPageIndex,
        followUpRecordPageSize,
        followUpRecordCreateVisible,
        followUpRecordId,
        followUpRecordInfo,

        //合同订单记录
        contractOrderDataSource,
        contractOrderPageSize,
        contractOrderPageIndex,
        contractOrderResultCount,
        contractOrderLoading,

        //退款记录
        refundRecordInfoDataSource,
        refundRecordInfoResultCount,
        refundRecordInfoPageSize,
        refundRecordInfoPageIndex,
        refundRecordInfoLoading,

        //报班信息
        classInfoDataSource,
        classInfoPageSize,
        classInfoPageIndex,
        classEndReasonModalVisible,
        fileList,
        classInfoLeft,
        classInfoTotal,
        classInfoLoading,

        classInfoCourseList,
        classInfoWaitForClassModal,
        waitForCourseSelectedRowKeys,
        waitForCourseSelectedRows,

        //作品
        studentWorksDataSource,
        studentWorksResultCount,
        studentWorksPageSize,
        studentWorksPageIndex,
        studentWorksLoading,

        //签到记录
        signRecordClassList,
        signRecordSignTypeList,

        signRecordOrg,
        signRecordClass,
        signRecordSignType,
        signRecordPageSize,
        signRecordPageIndex,
        signRecordDataSource,
        signRecordResultCount,
        signRecordLoading,

        menuList,                    //权限
        permissionUids,
	} = studentDetailModel;

    let indexx = 1;
    if( JSON.stringify(menuList) == '{}' && indexx == '1' ){
        let allMenuList = mainLayoutModel.allMenuList;
        indexx++;
        allMenuList && allMenuList.map(function( item, index ){
            if( item.menu_key == 'crm' || item.menu_key == 'erp' ){
                let childMenuList = item.children['0'];
                childMenuList.map(function( item, index ){
                    menuList[item.menu_key] = item.menu_key
                })
            }
            dispatch({
                type : 'studentdetailModel/updateState',
                payload : {
                    menuList
                }
            })
        });
    };
    //切换tab
    function changeTableTab( value ){
        if( value == 'parentInfo' ){
            let studentDetailTab = 'parentInfo';
            dispatch({
                type : 'studentDetailModel/getParentInfo',
                payload : {
                    studentDetailTab
                }
            })
        }else if ( value == 'accountInfo' ){
            let studentDetailTab = 'accountInfo';
            dispatch({
                type : 'studentDetailModel/getAccountInfo',
                payload : {
                    studentDetailTab
                }
            });
        }else if ( value == 'classHour' ){
            let studentDetailTab = 'classHour';
            dispatch({
                type : 'studentDetailModel/getClassHourInfo',
                payload : {
                    studentDetailTab
                }
            })
        }else if ( value == 'followUpRecord' ){
            let studentDetailTab = 'followUpRecord';
            dispatch({
                type : 'studentDetailModel/getFollowUPrecordParams',
                payload : {
                    studentDetailTab
                }
            })
        }else if ( value == 'contractOrder' ){
            let studentDetailTab = 'contractOrder';
            dispatch({
                type : 'studentDetailModel/getContractOrder',
                payload : {
                    studentDetailTab
                }
            })

        }else if ( value == 'refundRecord' ){
            let studentDetailTab = 'refundRecord';
            dispatch({
                type : 'studentDetailModel/getRefundRecordInfo',
                payload : {
                    studentDetailTab
                }
            })

        }else if ( value == 'classInfo' ){
            let studentDetailTab = 'classInfo';
            dispatch({
                type : 'studentDetailModel/getClassInfo',
                payload : {
                    studentDetailTab
                }
            })
        }else if( value == 'studentWorks'){
            let studentDetailTab = 'studentWorks';
            dispatch({
                type : 'studentDetailModel/getStudentWorks',
                payload : {
                    studentDetailTab
                }
            })
        }else if( value == 'signRecord'){
            let studentDetailTab = 'signRecord';
            dispatch({
                type : 'studentDetailModel/getSignRecord',
                payload : {
                    studentDetailTab
                }
            })
        }else if( value == 'classSchedule'){
            let studentDetailTab = 'classSchedule';
            dispatch({
                type : 'studentDetailModel/getClassSchedule',
                payload : {
                    studentDetailTab
                }
            })
        }
    };

    //添加家长
    function addParent() {
        dispatch({
            type : 'parentManageModel/updateState',
            payload : {
                createParentVisible : true
            }
        });
    }

    //账户记录分页
    function accountInfoPageIndexChange( pageIndex ){
        dispatch({
            type : 'studentDetailModel/accountInfoPagination',
            payload : {
                accountInfoPageIndex : pageIndex,
                accountInfoPageSize,
            }
        })
    };
    function accountInfoPageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'studentDetailModel/accountInfoPagination',
            payload : {
                accountInfoPageIndex : pageIndex,
                accountInfoPageSize : pageSize,
            }
        })
    };

    //课时记录分页
    function classHourPageIndexChange( pageIndex ){
        dispatch({
            type : 'studentDetailModel/classHourPagination',
            payload : {
                classHourPageIndex : pageIndex,
                classHourPageSize,
            }
        })
    };
    function classHourPageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'studentDetailModel/classHourPagination',
            payload : {
                classHourPageIndex : pageIndex,
                classHourPageSize : pageSize,
            }
        })
    };

    //刷新跟进记录
    function refreshFollowUpList(){
        dispatch({
            type : 'studentDetailModel/refreshFollowUpList',
            payload : {}
        })
    };
    //点击新增跟进记录
    function addFollowUpRecord(){
        dispatch({
            type : 'studentDetailModel/addFollowUpRecord',
            payload : {
                id : '',
            }
        })
    };
    //删除跟进记录
    function deleteFollowUpRecord( id ){
        dispatch({
            type : 'studentDetailModel/deleteFollowUpRecord',
            payload : {
                id
            }
        })
    };

    //编辑跟进记录
    function editFollowUpRecord( id ){
        dispatch({
            type : 'studentDetailModel/editFollowUpRecord',
            payload : {
                id
            }
        })
    };

    //跟进记录分页
    function FollowUpRecordPageIndexChange( pageIndex ){
        dispatch({
            type : 'studentDetailModel/paginationChange',
            payload : {
                followUpRecordPageIndex : pageIndex,
                followUpRecordPageSize
            }
        })
    };
    function FollowUpRecordPageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'studentDetailModel/paginationChange',
            payload : {
                followUpRecordPageIndex : pageIndex,
                followUpRecordPageSize : pageSize
            }
        })
    };

    //退款记录分页
    function refundRecordInfoPageIndexChange( pageIndex ){
        dispatch({
            type : 'studentDetailModel/refundRecordInfoPagination',
            payload : {
                refundRecordInfoPageIndex : pageIndex,
                refundRecordInfoPageSize,
            }
        })
    };
    function refundRecordInfoPageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'studentDetailModel/refundRecordInfoPagination',
            payload : {
                refundRecordInfoPageIndex : pageIndex,
                refundRecordInfoPageSize : pageSize,
            }
        })
    };

    //合同订单分页
    function contractOrderPageIndexChange( pageIndex ){
        dispatch({
            type : 'studentDetailModel/contractOrderPagination',
            payload : {
                contractOrderPageIndex : pageIndex,
                contractOrderPageSize,
            }
        })
    };
    function contractOrderPageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'studentDetailModel/contractOrderPagination',
            payload : {
                contractOrderPageIndex : pageIndex,
                contractOrderPageSize  : pageSize,
            }
        })
    };

    //点击报班
    function toJoinClass(){
        dispatch({
            type : 'studentDetailModel/toJoinClass',
            payload : {

            }
        })
    };
    //报课信息结束课程
    function endCourse( id ){
        dispatch({
            type : 'studentDetailModel/endCourse',
            payload : {
                id
            }
        })
    };

    //暂停课程
    function puaseCourse( id ){
        dispatch({
            type : 'studentDetailModel/updateState',
            payload : {
                classEndReasonModalVisible : !classEndReasonModalVisible,
                stuCourseId                : id,
            }
        })
    };

    //复原课程
    function backPauseCourse( id ){
        dispatch({
            type : 'studentDetailModel/recoverCourse',
            payload : {
                id,
            }
        })
    };

    //分班
    function waitForCourse( courseId, stuCourseId ){
        dispatch({
            type : 'studentDetailModel/waitForCourse',
            payload : {
                courseId,
                stuCourseId
            }
        })
    };
    //选择分班班级
    function chooseCourseTo( selectedRowKeys, selectedRows ){
        dispatch({
            type : 'studentDetailModel/updateState',
            payload : {
                waitForCourseSelectedRowKeys : selectedRowKeys,
                waitForCourseSelectedRows    : selectedRows
            }
        })
    };

    //取消分班
    function closeWaitForCourseModal(){
        dispatch({
            type : 'studentDetailModel/updateState',
            payload : {
                classInfoWaitForClassModal   : !classInfoWaitForClassModal,
                classInfoCourseList          : [],
                waitForCourseSelectedRows    : [],
                waitForCourseSelectedRowKeys : [],
                stuCourseId                  : '',
                clsId                        : '',
            }

        })
    }
    //确认分班
    function confirmWaitForClass(){
        dispatch({
            type : 'studentDetailModel/confirmWaitForClass',
            payload : {
                waitForCourseSelectedRows,
                classInfoWaitForClassModal
            }
        })
    };

    //确认停课
    function confirmSuspendCourse( params ){
        dispatch({
            type : 'studentDetailModel/confirmEndCourse',
            payload : {
                params,
                classEndReasonModalVisible
            }
        })
    };

    //取消停课
    function cancelSuspendCourse(){
        dispatch({
            type : 'studentDetailModel/updateState',
            payload : {
                classEndReasonModalVisible : !classEndReasonModalVisible,
                stuCourseId                : '',
            }
        })
    };

    //班级信息分页
    function classInfoPageIndexChange( classInfoPageIndex ){
        dispatch({
            type : 'studentDetailModel/classInfoPagination',
            payload : {
                classInfoPageSize,
                classInfoPageIndex
            }
        })
    };
    function classInfoPageSizeChange(classInfoPageIndex ,classInfoPageSize){
        dispatch({
            type : 'studentDetailModel/classInfoPagination',
            payload : {
                classInfoPageSize,
                classInfoPageIndex
            }
        })
    };

    //删除作品
    function deleteWork( id ){
        dispatch({
            type : 'studentDetailModel/deleteWork',
            payload : {
                id
            }
        })
    };

    //刷新作品列表
    function refreshStudentWorksList(){
        dispatch({
            type : 'studentDetailModel/refreshStudentWorks',
            payload : {

            }
        })
    };
    //上传作品
    function uploadWorks(){
        dispatch({
            type : 'studentDetailModel/uploadWorks',
            payload : {

            }
        })
    };
    //修改作品
    function updateStudentWork( id, url ){
        dispatch({
            type : 'studentDetailModel/updateStudentWork',
            payload : {
                id,
                url,
            }
        })
    };
    //作品分页
    function studentWorksIndexChange( pageIndex ){
        dispatch({
            type : 'studentDetailModel/studentWorksPagination',
            payload : {
                studentWorksPageSize,
                studentWorksPageIndex : pageIndex
            }
        })
    };
    function studentWorksSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'studentDetailModel/studentWorksPagination',
            payload : {
                studentWorksPageSize : pageSize,
                studentWorksPageIndex : pageIndex
            }
        })
    }

    //撤销签到记录
    function deleteSignRecord( id ){
        dispatch({
            type : 'studentDetailModel/deleteSignRecord',
            payload : {
                id
            }
        })
    };
    //签到记录分页
    function signRecordPageIndexChange( signRecordPageIndex ){
        dispatch({
            type : 'studentDetailModel/signRecordPagination',
            payload : {
                signRecordPageSize, signRecordPageIndex
            }
        })
    };
    function signRecordPageSizeChange(signRecordPageIndex,signRecordPageSize ){
         dispatch({
            type : 'studentDetailModel/signRecordPagination',
            payload : {
                signRecordPageSize, signRecordPageIndex
            }
        })
    };

    //签到修改
    function clickToDetail( cpId, orgId ){
        dispatch({
            type : 'scheduleSignModel/showScheduleSign',
            payload : {
                cpId  : cpId,
                orgId : orgId,
            }
        })
    };

    let studentInfoDetailProps = {
        studentDetailInfo,
    }

    //家长信息属性
    let parentInfoProps = {
        parentInfoLoading,
        parentInfoDataSource,
        addParent,
    };

    //账户信息属性
    let accountInfoProps = {
        accountInfoDataSource,
        accountInfoResultCount,
        accountInfoPageIndex,
        accountInfoPageSize,
        accountInfoBalacne,

        accountInfoPageIndexChange,
        accountInfoPageSizeChange,
        accountInfoLoading,
    };

    //课时信息属性
    let classHourInfoProps = {
        classHourDataSource,
        classHourResultCount,
        classHourPageIndex,
        classHourPageSize,
        classHourTotal,
        classHourLeft,

        classHourPageIndexChange,
        classHourPageSizeChange,

        classHourLoading,
    };

    //跟进记录属性
    let followUpRecordProps = {
        followUpRecords,
        followUpRecordResultCount,
        followUpRecordPageIndex,
        followUpRecordPageSize,

        addFollowUpRecord,
        editFollowUpRecord,
        deleteFollowUpRecord,
        FollowUpRecordPageIndexChange,
        FollowUpRecordPageSizeChange,

        permissionUids,
    };
    let refreshFollowUpListProps = {
        refreshList : refreshFollowUpList
    }

    //合同订单属性
    let contractOrderProps = {
        contractOrderDataSource,
        contractOrderResultCount,
        contractOrderPageSize,
        contractOrderPageIndex,

        contractOrderPageIndexChange,
        contractOrderPageSizeChange,

        contractOrderLoading
    };

    //退款记录属性
    let refundRecordInfoProps = {
        refundRecordInfoDataSource,
        refundRecordInfoResultCount,
        refundRecordInfoPageSize,
        refundRecordInfoPageIndex,

        refundRecordInfoPageIndexChange,
        refundRecordInfoPageSizeChange,

        refundRecordInfoLoading,
    };

    //报班信息属性
    let classInfoProps = {
        classInfoPageIndexChange,
        classInfoPageSizeChange,
        classInfoDataSource,
        classInfoPageSize,
        classInfoPageIndex,
        classEndReasonModalVisible,

        endCourse,        //结束课程
        puaseCourse,      //暂停课程
        backPauseCourse,  //复原课程

        waitForCourse,    //分班
        classInfoCourseList,
        classInfoWaitForClassModal,
        waitForCourseSelectedRowKeys,

        chooseCourseTo,
        closeWaitForCourseModal,
        confirmWaitForClass,

        confirmSuspendCourse,
        cancelSuspendCourse,
        classInfoLeft,
        classInfoTotal,

        toJoinClass,

        classInfoLoading,

    };

    //作品信息属性
    let studentWorksProps = {
        studentWorksDataSource,
        studentWorksResultCount,
        studentWorksPageSize,
        studentWorksPageIndex,

        studentWorksIndexChange,
        studentWorksSizeChange,

        deleteWork,
        updateStudentWork,

        studentWorksLoading,

        uploadWorks
    };

    let studentWorksUpdateProps = {
        refreshList : refreshStudentWorksList
    }
    let studentWorksUploadProps = {
        refreshList : refreshStudentWorksList
    };

    //签到信息属性
    let signRecordProps = {
        signRecordClassList,
        signRecordSignTypeList,

        signRecordOrg,
        signRecordClass,
        signRecordSignType,
        signRecordPageSize,
        signRecordPageIndex,
        signRecordDataSource,
        signRecordLoading,
        signRecordResultCount,

        signRecordPageIndexChange,
        signRecordPageSizeChange,
        deleteSignRecord,

        clickToDetail,

    };

    //课程表信息属性
    let classScheduleProps = {
        defaultQuery : {
			orgId : orgId,
			stuId : studentId,
		}
    };

	return (
		<div className = 'yhwu_content_bg' >
            <StudentInfoDetail { ...studentInfoDetailProps }/>
            <div className="tabs">
                <Tabs
					activeKey = { studentDetailTab }
					type='card'
					onChange={ changeTableTab }
				>
                    {
                        !!menuList.crm_stuparent_mgr &&
                        <TabPane tab = { <span>家长</span> }    key = "parentInfo" >
                            <ParentInfoTable { ...parentInfoProps }/>
                        </TabPane>
                    }{
                        !!menuList.crm_product_mgr &&
                        <TabPane tab = { <span>账户</span >}    key = "accountInfo">
                            <AccountInfoTable { ...accountInfoProps }/>
                        </TabPane>
                    }{
                        !!menuList.crm_product_mgr &&
                        <TabPane tab = { <span>课时</span> }    key = "classHour">
                            <ClassHourTable { ...classHourInfoProps }/>
                        </TabPane>
                    }{
                        !!menuList.crm_follow_mgr &&
                        <TabPane tab = { <span>跟进记录</span> } key = "followUpRecord">
                            <FollowUpRecord { ...followUpRecordProps }/>
                        </TabPane>
                    }{
                        !!menuList.crm_sorder_mgr &&
                        <TabPane tab = { <span>合同订单</span> } key = "contractOrder">
                            <ContractOrderTable { ...contractOrderProps }/>
                        </TabPane>
                    }{
                        !!menuList.crm_rorder_mgr &&
                        <TabPane tab = { <span>退款</span> }    key = "refundRecord">
                            <RefundRecordTable { ...refundRecordInfoProps }/>
                        </TabPane>
                    }{
                        !!menuList.erp_course_mgr &&
                        <TabPane tab = { <span>报班信息</span> } key = "classInfo">
                            <ClassInfoTable { ...classInfoProps }/>
                        </TabPane>
                    }{
                        !!menuList.erp_cloud_mgr &&
                        <TabPane tab = { <span>作品</span> }    key = "studentWorks">
                            <StudentWorksTable { ...studentWorksProps } />
                        </TabPane>
                    }{
                        !!menuList.erp_stusign_mgr &&
                        <TabPane tab = { <span>签到记录</span> } key = "signRecord">
                            <SignRecordTable { ...signRecordProps } />
                        </TabPane>
                    }{
                        !!menuList.erp_cp_mgr &&
                        <TabPane tab = { <span>课程表</span> }   key = "classSchedule">
                        <ClassSchedule { ...classScheduleProps} />
                    </TabPane>
                    }
                </Tabs>
            </div>
            <StudentWorksUpload { ...studentWorksUploadProps } />
            <StudentWorksUpdate { ...studentWorksUpdateProps } />
            <StudentWorksManageType />
            <FollowUpRecordCreatePage { ...refreshFollowUpListProps } />
            <ToClassModalPage />
            <ScheduleSignPage />
		</div>
	)
};

function mapStateToProps ({ studentDetailModel, mainLayoutModel }){
	return { studentDetailModel, mainLayoutModel };
};

export default connect(mapStateToProps)(StudentDetailPage);
