import React from 'react';
import { connect } from 'dva';
import { FormatDate } from '../../../utils/dateFormat';
import StuAttendance from '../../../components/erp/stu-attendance/StuAttendance';
import CerpSignModal from '../../../components/cerp/overview/sign-modal/SignModal';
import PrintSmallTicket from '../../../components/erp/stu-attendance/PrintSmallTicket';

/*页面和不办小票从对应component获取，考勤表单从cerp签到中获取*/
function StuAttendancePage({dispatch, StuAttendanceModel}) {

    let {
        zj_type,        //菜单类型('all'全部考勤/'my'我的考勤)

        dataSource,
        loading ,
        pageIndex,
        pageSize,
        total,
        studyDate,
        todayDate,
        orgId,

        //考勤  考勤明细
        Schedulevisible,
        Scheduleloading,
        editing, //是否为考勤 且是否可以编辑

        cpdId, //排课编号
        ScheduleorgId, //排课编号
        ptArr,//主教老师
        atArr,//助教老师
        className,
        courseName,
        clsSignTime,

        normalStuArr,
        remedialStuArr,


        employeeComList,
        stuSignErrorMessage,
        WetherPrintTicket,          //是否打印小票

        teacherDetail,                              //主教和助教信息
        /*考勤modal 重写的*/
        wetherToday,                                //是否是今天(今天可以考勤和编辑明细，非今日只能编辑明细，cerp首页签到固定式今日，主要是考勤页面需要此参数来判断)
        selfOrgId,                                  //当前校区的orgId
        cerpOverviewSignModalVisible,               //考勤modal是否显示
        cerpOverviewSignModalLoading,               //考勤modal加载状态
        cerpOverviewSignModalButtonLoading,         //考勤modal按钮加载状态
        cerpOverviewSignSingleDetail,               //点击每一项之后获取的详情信息

        /*补打小票modal*/
        printSmallTicketVisible,                    //补打小票modal是否显示
        printSmallTicketLoading,                    //补打小票modal加载状态
        printSmallTicketButtonLoading,              //按钮加载状态
        printSmallTicketData,                       //打印小票获取到的数据

    } = StuAttendanceModel;

    function dateChange(value){
        dispatch({
            type : 'StuAttendanceModel/queryList',
            payload : {
                studyDate:value.format("YYYY-MM-DD"),
                orgId,
                pageIndex:0,
                pageSize,
                zj_type
            }
        });
    }

    function yestDaychange() {
        let value = new Date (new Date( studyDate ) - 24*60*60*1000);
        dispatch({
            type : 'StuAttendanceModel/queryList',
            payload : {
                studyDate:FormatDate(value).substr(0,10),
                orgId,
                pageIndex:0,
                pageSize,
                zj_type
            }
        });
    }

    function nextDaychange() {
       var  startDate = new Date(studyDate);
        startDate = +startDate + 1000*60*60*24;
        startDate = new Date(startDate);
        var value =  startDate;
        var newDate= FormatDate(value).substr(0,10);
        var date1 = new Date(newDate);
        var date2 = new Date(todayDate);
        if (date1.getTime() >  date2.getTime()){
            dispatch({
                type : 'StuAttendanceModel/queryList',
                payload : {
                    studyDate:todayDate,
                    orgId:orgId,
                    pageIndex:0,
                    pageSize,
                    zj_type
                }
            });
        }else  {
            dispatch({
                type : 'StuAttendanceModel/queryList',
                payload : {
                    studyDate:newDate,
                    orgId:orgId,
                    pageIndex:0,
                    pageSize,
                    zj_type
                }
            });
        }
    }

    //明细
    function stuattendancerecord(item) {
        dispatch({
            type : 'StuAttendanceModel/updateState',
            payload : {
                editing : "2",
                wetherToday : false
            }
        });
        //getdetailQuery
        dispatch({
            type: 'StuAttendanceModel/getdetailQuery',
            payload: {
                orgId:item.orgId,
                cpmId:item.cpmId,
                cpdId:item.cpdId,
            }
        });
    }
    //考勤
    function stuattendanceChange(item) {
        //  editing:"1", //可以编辑考勤
        dispatch({
            type : 'StuAttendanceModel/updateState',
            payload : {
                editing : "1",
                wetherToday : true
            }
        });
        //getdetailQuery
        dispatch({
            type: 'StuAttendanceModel/getdetailQuery',
            payload: {
                orgId:item.orgId,
                cpmId:item.cpmId,
                cpdId:item.cpdId,
            }
        });
    }

    //分页改变
    function PageOnChange(current,pageSize){
        dispatch({
            type : 'StuAttendanceModel/queryList',
            payload : {
                orgId,
                pageIndex : current - 1,
                pageSize : pageSize,
                studyDate,
                zj_type
            }
        })
    }

    function onCloseClick() {
        dispatch({
            type: 'StuAttendanceModel/updateState',
            payload : {
                Schedulevisible:false,
                cpdId:'', //排课编号
                ScheduleorgId:'',
                ptArr:[],
                atArr:[],//助教老师
                className:'',
                courseName:'',
                clsSignTime:'',
                normalStuArr:[],
                tryStuList:[],
                // stuSignErrorMessage:"",
                employeeComList:[],
            }
        });


    }

    function onSubmitClick(params, afterSave) {
        params.orgId = orgId;
        dispatch({
            type: 'StuAttendanceModel/saveSign',
            payload: {
                params
            }
        });
    }

	//改变签到选择类型
    function onChangeSignType(e, type, signType, stuId) {
        let {target} = e;
        let check = target.checked;
        dispatch({
            type: 'StuAttendanceModel/changeSignType',
            payload: {
                check,type,signType,stuId,
            }
       });
    }

    //首页签到点击签到
    function CerpOverviewSignModalSubmit(data){
        dispatch({
            type:'StuAttendanceModel/CerpOverviewSignModalSubmit',
            payload:{
                ...data
            }
        });
    }

    //首页签到modal关闭
    function CerpOverviewSignModalCancel(){
        dispatch({
            type:'StuAttendanceModel/updateState',
            payload:{
                cerpOverviewSignModalVisible : false,
                cerpOverviewSignModalButtonLoading : false,
                cerpOverviewSignModalLoading : false
            }
        });
    }

    //打开补打小票modal并获取相关信息
    function OpenPrintSmallTicketModal(item){
        dispatch({
            type : 'StuAttendanceModel/OpenPrintSmallTicketModal',
            payload : {
                orgId : item.orgId,
                cpdId : item.cpdId,
                cpmId : item.cpmId
            }
        })
    }

    //补打小票modal关闭
    function ClosePrintSmallTicketModal(){
        dispatch({
            type : 'StuAttendanceModel/updateState',
            payload : {
                printSmallTicketVisible : false,                //补打小票modal是否显示
                printSmallTicketLoading : false,                //补打小票modal加载状态
                printSmallTicketButtonLoading : false,          //按钮加载状态
                printSmallTicketData : {},                      //打印小票获取到的数据
            }
        })
    }

    let componProps = {
        orgId,
		dataSource,
		loading ,
        pageIndex,
        pageSize,
        total,
		studyDate,
        todayDate,
        dateChange,
        yestDaychange,
        nextDaychange,
        stuattendancerecord,
        stuattendanceChange,

        PageOnChange,          //分页改变

        /*补打小票*/
        OpenPrintSmallTicketModal,      //打开补打小票modal

    };

    //签到modal属性
    let CerpSignModalProps = {
        selfOrgId,                              //当前校区的orgId
        teacherDetail,                          //主教和助教信息
        wetherToday,                            //是否是就今天(今天可以考勤和编辑明细，非今日只能编辑明细，cerp首页签到固定式今日，主要是考勤页面需要此参数来判断)
        cerpOverviewSignModalVisible,           //考勤modal是否显示
        cerpOverviewSignModalLoading,           //考勤modal加载状态
        cerpOverviewSignModalButtonLoading,     //考勤modal按钮加载状态
        cerpOverviewSignSingleDetail,           //点击每一项之后获取的详情信息

        CerpOverviewSignModalSubmit,            //首页签到点击签到
        CerpOverviewSignModalCancel,            //首页签到modal关闭
    }

    //补打小票modal属性
    let PrintSmallTicketProps = {
        teacherDetail,                          //主教和助教信息
        printSmallTicketVisible,                //补打小票modal是否显示
        printSmallTicketLoading,                //补打小票modal加载状态
        printSmallTicketButtonLoading,          //按钮加载状态
        printSmallTicketData,                   //打印小票获取到的数据

        ClosePrintSmallTicketModal,             //补打小票modal关闭
    }

    return (
        <div style = {{ overflow : 'hidden' }}>
            <StuAttendance { ...componProps } />
            { cerpOverviewSignModalVisible ? <CerpSignModal {...CerpSignModalProps}/> : null }
            { printSmallTicketVisible ? <PrintSmallTicket {...PrintSmallTicketProps}/> : null }
		</div>
    );
}

function mapStateToProps({ StuAttendanceModel }) {
    return { StuAttendanceModel };
}

export default connect(mapStateToProps)(StuAttendancePage);
