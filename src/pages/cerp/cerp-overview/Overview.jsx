import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './Overview.less';
import CerpOverviewTop from '../../../components/cerp/overview/overview-top/TopContent';
import CerpSignModal from '../../../components/cerp/overview/sign-modal/SignModal';
import CerpCheckCourseModal from '../../../components/cerp/overview/check-course-modal/CheckCourseModal';
import CerpTodayDataSign from '../../../components/cerp/overview/today-sign-message/TodaySignMessage';
import ClassSchedule from '../../erp/order-class/OrderClassSchedulePage';

/*新增排课*/
function CerpOverview({ dispatch , cerpOverview }) {

    let {
        selfOrgId,                              //当前校区的orgId
        nowDate,                                //当天的日期
        stuDetail,                              //学员信息
        teacherDetail,                          //助教和助教信息

        //首页上方
        firstArrangeCourse,                     //默认第一条的排课信息
        curentArrangeCourseList,                //当前学员的排课信息(select下拉选中之后)
        allArrangeCourseList,                   //排课信息
        topLeftLoading,                         //首页上方左边加载状态
        topRightLoading,                        //首页上方右边加载状态

        //签到modal
        wetherToday,                            //是否是今天(今天可以考勤和编辑明细，非今日只能编辑明细，cerp首页签到固定式今日，主要是考勤页面需要此参数来判断)
        cerpOverviewSignModalVisible,           //首页签到modal是否显示
        cerpOverviewSignModalLoading,           //首页签到modal加载状态
        cerpOverviewSignModalButtonLoading,     //首页签到modal按钮加载状态
        cerpOverviewSignSingleDetail,           //点击每一项之后获取的详情信息

        //查看排课信息modal('all'/'stu')
        cerpOverviewCheckCourseModalType,       //查看排课信息modal类型('all'全部排课/'stu'当前学生排课)
        cerpOverviewCheckCourseModalVisible,    //查看排课信息modal是否显示
        cerpOverviewCheckCourseModalLoading,    //查看排课信息modal加载状态

        //今日签到信息
        todaySignMessage,                       //今日签到信息

        //续费提醒
        courseAlertNum,                         //续费提醒课时数

    } = cerpOverview

    //左侧下方灰色区域点击事件查询考勤明细
    function LeftBottomCheckSignQuery(cpmId,cpdId){
        dispatch({
            type:'cerpOverview/GetSignDetail',
            payload:{
                left:true,
                orgId:selfOrgId,
                cpmId,
                cpdId
            }
        });
    }

    //按课程打印签到表
    function PrintCourseSignList(data){
        dispatch(routerRedux.push({
            pathname: 'follow_course_print',
            query:{
                data : JSON.stringify(data)
            }
        }));
    }

    //点击查看全部排课(全部排课数据进入页面已经请求成功，只需要修改状态渲染出来即可)
    function CheckAllCourseMessage(){
        dispatch({
            type:'cerpOverview/updateState',
            payload:{
                cerpOverviewCheckCourseModalType : 'all',
                cerpOverviewCheckCourseModalVisible : true
            }
        });
    }

    //首页签到点击签到
    function CerpOverviewSignModalSubmit(data){
        dispatch({
            type:'cerpOverview/CerpOverviewSignModalSubmit',
            payload:{
                ...data
            }
        });
    }

    //首页签到modal关闭
    function CerpOverviewSignModalCancel(){
        dispatch({
            type:'cerpOverview/updateState',
            payload:{
                cerpOverviewSignModalVisible : false,
                cerpOverviewSignModalButtonLoading : false,
                cerpOverviewSignModalLoading : false
            }
        });
    }

    //选择学员onChange查看当前学员的排课数据(请求成功后打开modals)
    function StuSelectOnChange(stuId){
        if(stuId != '' && stuId != null && stuId != undefined && !/^[\s]*$/.test(stuId)){
            dispatch({
                type:'cerpOverview/GetCurrentStuArrangeCourseList',
                payload:{
                    orgId : selfOrgId,
                    stuId,
                    startDate : nowDate,
                    endDate : nowDate,
                    pageIndex : 0,
                    pageSize : 99999,
                }
            });
        }
    }

    //当前学员选中一项排课信息查询
    function CurrentStuSignQuery(cpmId,cpdId){
        dispatch({
            type:'cerpOverview/GetSignDetail',
            payload:{
                right:true,
                orgId:selfOrgId,
                cpmId,
                cpdId
            }
        });
    }

    //当前学员排课信息modal关闭
    function CerpOverviewCurrentStuModalCancel(){
        dispatch({
            type:'cerpOverview/updateState',
            payload:{
                cerpOverviewCheckCourseModalVisible : false,
                cerpOverviewCheckCourseModalType : '',
            }
        });
    }

    //查看续费提醒明细
    function JumpToCourseAlertList(){
        dispatch(routerRedux.push({
            pathname : 'course_alert_list',
        }))
    }

    //首页上方属性
    let CerpOverviewTopProps = {
        stuDetail,                              //学员信息
        firstArrangeCourse,                     //默认第一条的排课信息
        topLeftLoading,                         //首页按课程签到加载状态
        topRightLoading,                        //按学员签到加载状态
        courseAlertNum,                         //续费提醒课时数

        CheckAllCourseMessage,                  //点击查看全部排课
        LeftBottomCheckSignQuery,               //左侧下方灰色区域点击事件查询考勤明细
        StuSelectOnChange,                      //选择学员onChange查看当前学员的排课数据
        PrintCourseSignList,                    //按课程打印签到表
        JumpToCourseAlertList,                  //查看续费提醒明细
    }

    //签到modal属性
    let CerpSignModalProps = {
        selfOrgId,                              //当前校区的orgId
        teacherDetail,                          //助教和助教信息
        wetherToday,                            //是否是就今天(今天可以考勤和编辑明细，非今日只能编辑明细，cerp首页签到固定式今日，主要是考勤页面需要此参数来判断)
        cerpOverviewSignModalVisible,           //首页签到modal是否显示
        cerpOverviewSignModalLoading,           //首页签到modal加载状态
        cerpOverviewSignModalButtonLoading,     //首页签到modal按钮加载状态
        cerpOverviewSignSingleDetail,           //点击每一项之后获取的详情信息

        CerpOverviewSignModalSubmit,            //首页签到点击签到
        CerpOverviewSignModalCancel,            //首页签到modal关闭
    }

    //查看排课信息modal('all'/'stu')属性
    let CerpCheckCourseModalProps = {
        cerpOverviewCheckCourseModalType,       //查看排课信息modal类型('all'全部排课/'stu'当前学生排课)
        cerpOverviewCheckCourseModalVisible,    //查看排课信息modal是否显示
        cerpOverviewCheckCourseModalLoading,    //查看排课信息modal加载状态
        allArrangeCourseList,                   //全部排课信息
        curentArrangeCourseList,                //当前学员的排课信息(select下拉选中之后)

        CurrentStuSignQuery,                    //当前学员选中一项排课信息查询
        CerpOverviewCurrentStuModalCancel,      //当前学员排课信息modal关闭
        PrintCourseSignList,                    //按课程打印签到表
    }

    //今日签到信息
    let CerpTodayDataSignProps = {
        todaySignMessage,                       //今日签到信息
    }

    return (
        <div className={styles.all}>
            <CerpOverviewTop {...CerpOverviewTopProps}/>
            { cerpOverviewSignModalVisible ? <CerpSignModal {...CerpSignModalProps}/> : null }
            { cerpOverviewCheckCourseModalVisible ? <CerpCheckCourseModal {...CerpCheckCourseModalProps}/> : null }
            <CerpTodayDataSign {...CerpTodayDataSignProps}/>
            <ClassSchedule createAble = { false } orgId = { selfOrgId } />
        </div>
    );
}

function mapStateToProps({ cerpOverview }) {
    return { cerpOverview };
}

export default connect(mapStateToProps)(CerpOverview);
