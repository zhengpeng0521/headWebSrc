import React from 'react';
import { Router, Route, IndexRoute, IndexRedirect } from 'dva/router';

/***********************************基础配置*******************************************************************************************/
import IndexLayoutPage                          from '../../pages/layout/index-layout/IndexLayoutPage';
import MainLayout                               from '../../pages/common/main-layout/MainLayout';
import CommonLayout                             from '../../pages/common/common-layout/CommonLayout';
import Home        		                        from '../../pages/home/HomeLayout';
import NotFound                                 from '../../components/common/not-found/NotFound';

/***********************************营销类*******************************************************************************************/
import ScrmOverView                             from '../../pages/scrm/scrm-overview/ScrmOverView';                            //营销首页
//微信预约
import WxReservationMgr                         from '../../pages/scrm/wx-reservation/WxReservationMgr';                       //微信预约列表
import WxReservationConfig                      from '../../pages/scrm/wx-reservation-set/WxReservationSetPage';               //微信预约设置
//微官网
import WOfficeSetPage                           from '../../pages/scrm/wOffice-set/WOfficeSetPage';                            //微官网设置
import WxBanner                                 from '../../pages/scrm/wx-banner/WxBanner';                                    //微官网首页轮播图
import WxActivityPage                           from '../../pages/scrm/wx-activity/WxActivityPage';                            //微官网下活动
import WxCoursePage                             from '../../pages/scrm/wx-course/WxCoursePage';                                //微官网下活动
import GetHoliday                               from '../../pages/crm/get-holiday/GetHoliday'                                  //微官网下学员请假
import SweepSigninRecordPage                    from '../../pages/crm/sweepsignin-record/SweepSigninRecordPage';               //微官网-签到记录
import WxCreateActivityPage                     from '../../pages/scrm/wx-activity-create/WxActivityCreatePage';               //微官网下活动

//微信营销
import MicroActivity                            from '../../pages/scrm/microActivity/MicroActivity';                           //微活动
import MicroGame                                from '../../pages/scrm/microGame/MicroGame';                                   //微游戏
import MicroLeaflet                             from '../../pages/scrm/microLeaflet/MicroLeaflet1';                            //微传单
import MyMarketing                              from '../../pages/scrm/myMarketing/MyMarketingEntrance';                       //我的营销
//市场活动
import MarketActivity                           from '../../pages/scrm/market/MarketActivityPage';                             //市场活动
import MarketOfflineLeaflets                    from '../../pages/scrm/market/MarketOfflineLeafletsPage';             		   //线下传单编辑
import MarketMyOfflineLeaflets                  from '../../pages/scrm/market/MarketMyOfflineLeafletsPage';             	   //我的传单
import MicroGamePage                            from '../../pages/scrm/micro-game/MicroGamePage';							   //微游戏的列表

/***********************************首页********************************************************************************************/
import HqMainPage                               from '../../pages/hq-main-page/HqMainPage';                                    //首页

/***********************************校区管理*****************************************************************************************/
import HeadOrgDetail                            from '../../pages/campus-management/head-org-detail/HeadOrgDetail';            //校区详情
import StaffManage 	                            from '../../pages/campus-management/staff-manage/StaffManage';                 //员工管理
import CourseManage		                        from '../../pages/campus-management/courseManage/CourseManage';               //课程管理
/***********************************校区服务*****************************************************************************************/
import Courseware                               from '../../pages/campus-service/courseware/Courseware';                       //教学课件

/***********************************财务中心*****************************************************************************************/
import AccountDetails                           from '../../pages/financial-center/online-account/AccountDetailsPage';          //线上账户
import Expenses                                 from '../../pages/financial-center/expenses/Expenses'                           //费用支出
import Income                                   from '../../pages/financial-center/income/Income'                               //收款录入

/***********************************CRM*********************************************************************************************/
import CrmOverview                              from '../../pages/crm/overview/CrmOverview'                                    //CRM首页
//名单跟进
import LeadsFollowAll                           from '../../pages/crm/leads-follow-all/LeadsFollow';                               //CRM
//公海池
import LeadsFollow                              from '../../pages/crm/leads-follow/LeadsFollow';                               //CRM leads跟进
import LeadsDispatch                            from '../../pages/crm/leads-follow/LeadsDispatch';                             //CRM leads分配
import LeadsAdd                                 from '../../pages/crm/leads-follow/LeadsAdd';                                  //CRM leads添加
//跟进记录
import FollowRecordPage                         from '../../pages/crm/follow-record/FollowRecordPage';                         //CRM 跟进记录
//到访管理
import VisitRecordPage                          from '../../pages/crm/visit-record/VisitRecordPage';                           //CRM 到访管理
//线下预约试听
import OfflinebookingPage                       from '../../pages/crm/offline-booking/OfflinebookingPage';                     // 预约试听
//会员卡管理
import VipManagePage                            from '../../pages/crm/vip-manage/VipManagePage';                               //CRM vip管理
import UseClassPage                             from '../../pages/crm/vip-manage/UseClassPage';                                //CRM 手动消课记录
import SendClassHourPage                        from '../../pages/crm/vip-manage/SendClassHourPage';                           //CRM vip赠课时
import VipTransCoursePage                       from '../../pages/crm/vip-manage/VipManagePage';                               //CRM 转课记录
//学员管理
import StuManagementPage                        from '../../pages/crm/stuManagement/StuManagementPage';                        // 学员管理
//学员家长
import ParentManage                             from '../../pages/crm/parent-manage/ParentManagePage';                         //家长管理
//合同订单
import ContractOrderPage                        from '../../pages/crm/contract-order/ContractOrderPage';                       //CRM 合同订单
//收款单
import ContractOrderReceipt                     from '../../pages/crm/contract-order-receipt/ContractOrderReceiptListPage';    //CRM收款单

//退款单
import NewRefundForm                            from '../../pages/crm/new-refund-form/NewRefundForm';                          //CRM 新退款单
import DepositManage                            from '../../pages/crm/contract-order/DepositManage';                           //CRM 合同定金管理列表

//销售产品
import ClassPackagePage                         from '../../pages/scrm/class-package/ClassPackagePage';                        //课时套餐
import TeachingMaterial   	                    from '../../pages/crm/teaching-material/TeachingMaterial';                     //教材信息

/***********************************早教类erp*********************************************************************************************/
import CerpOverview                             from '../../pages/cerp/cerp-overview/Overview';                                //saas3.2.0cerp首页
import CourseAlertList                          from '../../pages/cerp/course-alert-list/CourseAlertList';                     //cerp续费提醒
import FollowCoursePrint                        from '../../pages/cerp/print-file/follow-course-print/FollowCoursePrint';      //cerp按课程打印签到表
import NewFollowCoursePrint                     from '../../pages/cerp/print-file/new-follow-course-print/NewFollowCoursePrint';      //cerp新按课程打印签到表
import SchedulePrintByDay                       from '../../pages/cerp/print-file/schedule-print-by-day/SchedulePrintByDay';   //cerp按天打印签到表
//课程班级教室

import ClassManagePage		                    from '../../pages/cerp/class-manage/ClassManagePage';                          //教学2-班级管理
import CerpClassroom                            from '../../pages/cerp/classroom/Classroom';                                   //教学2-教室管理
//排课管理
import CreateArrangeCourse                      from '../../pages/cerp/new-arrange-course/CreateArrangeCourse';                //saas3.2.0新增排课
import NewArrangeCourseTable                    from '../../pages/cerp/new-arrange-course/NewArrangeCourse';                   //saas3.2.0排课列表
//约课管理
import OrderClassPage                           from '../../pages/erp/order-class/OrderClassPage';                             //约课管理 约课
import OrderRecordPage                          from '../../pages/erp/order-class/OrderRecordPage';                            //约课管理 约课
import OrderClassScheduleMgrPage                from '../../pages/erp/order-class/OrderClassScheduleMgrPage';                  //约课管理 课程表
//考勤管理
import StuAttendancePages                       from '../../pages/erp/stu-attendance/StuAttendancePages'                       //学员考勤/我的考勤
import StudentWorks                             from '../../pages/erp/student-works/StudentWorksPage';                         //学员作品
import ParentsNotice                            from '../../pages/erp/parents-notice/ParentsNotice';                           //家校通知
import HomeSchoolComment                        from '../../pages/cerp/home-school-comment/HomeSchoolComment';                 //家校互评
import VacateManagePage                         from '../../pages/cerp/vacate-manage/VacateManagePage';                        //请假记录

/***********************************报表**********************************************************************************************/
//销售表
import SalesWorkSheet                           from '../../pages/report-form/sales-report/sales-work-sheet/SalesWorksheet';                    //销售工作表
import SalesAchievementSheet                    from '../../pages/report-form/sales-report/sales-achievement-sheet/SalesAchievementSheet';      //销售业绩表
import LeadsSourceSheet                         from '../../pages/report-form/sales-report/leads_source_sheet/LeadsSourceSheet';                //名单来源表
import LeadsFollowSheet                         from '../../pages/report-form/sales-report/leads_follow_sheet/LeadsFollowSheet';                //名单跟进表
import SendRecordSheetPage                      from '../../pages/report-form/sales-report/send-record-sheet/SendRecordSheetPage';              //赠课记录表
import ContractIncomeSheetPage                  from '../../pages/report-form/sales-report/contract-income-sheet/ContractIncomeSheetPage';      //合同收入表

//教学表
import StuAttendanceSheet                       from '../../pages/report-form/teaching-report/stu-attendance-sheet/StuAttendanceSheet';         //学员考勤表
import ClassRoomRatioSheet                      from '../../pages/report-form/teaching-report/class-room-ratio-sheet/ClassRoomRatioSheet';      //教室利用率表
import StuUseClassChartPage                     from '../../pages/report-form/teaching-report/stu-use-class-sheet/StuUseClassChartPage';        //学员消课表
import StuSilenceSheetPage                      from '../../pages/report-form/teaching-report/stu-silence-sheet/StuSilenceSheetPage';           //学员沉默表
import TeacherTeaching	                        from '../../pages/report-form/teaching-report/teacher-teaching/TeacherTeaching';                //老师授课报表
import CourseDetailSheet	                    from '../../pages/report-form/teaching-report/course-detail-sheet/CourseDetailSheet';           //课时详情报表
import TeacherSalarySheet	                    from '../../pages/report-form/teaching-report/teacher-salary-sheet/TeacherSalarySheet';         //老师工资报表
import ClassMonthKnotSheet	                    from '../../pages/report-form/teaching-report/class-month-knot-sheet/ClassMonthKnotSheet';      //课时月结表
import TimeMonthKnotSheet	                    from '../../pages/report-form/teaching-report/time-month-knot-sheet/TimeMonthKnotSheet';      //时长月结表

/***********************************设置**********************************************************************************************/
//系统设置
import HeadQuartersSetting                      from '../../pages/system/head-quarters-setting/HeadQuartersSetting';            //总部设置
import RoleManage 	                            from '../../pages/system/role-manage/RoleManage';                               //角色管理
import SystemDicDataMaintenance 	            from '../../pages/system/Maintenance';                                          //业务参数
import AccountCard   		                    from '../../pages/system/account-card/AccountCard';                             //收付款账号
import checkOnWorkAttendance                    from '../../pages/system/check-on-work-attendance/checkOnWorkAttendancePage' ;  //考勤设置
import SecuritySettings                         from '../../pages/system/security-settings/SecuritySettingsPage';               //安全设置
import ClassScheduleTimeSet                     from '../../pages/system/class-schedule-time-set/ClassScheduleTimeSet';         //课程表时间设置
import CourseNumAlert                           from '../../pages/system/course-num-alert/CourseNumAlert';                      //课时预警设置
import DomainNameSetting                        from '../../pages/system/domain-name-setting/DomainNameSetting';                //三级域名设置
import SalarySet                                from '../../pages/system/salary-set/SalarySet';                                 //工资设置
//小票设置
import AttendancePrint                          from '../../pages/system/small-ticket-set/AttendancePrint';                     //考勤打印
import SignInPrint                              from '../../pages/system/small-ticket-set/SignInPrintPage';                        //签到打印
//校区设置
import OrgLogo                                  from '../../pages/system/org-set/org-logo/OrgLogo';                             //机构logo
import OrgManage                                from '../../pages/system/org-set/org-manage/OrgManage';                         //机构管理
//短信业务
import MessagePage                              from '../../pages/system/message/MessagePage';                                  //短信记录
//公海池设置
import leadRecordNoRule                         from '../../pages/system/gong-hai-set/lead-record-no-rule/leadRecordNoRule' ;   //无跟进记录名单规则
import haveMaxList                              from '../../pages/system/gong-hai-set/have-max-list/haveMaxListPage' ;          //最大拥有名单数
import CheckSameRule                            from '../../pages/system/gong-hai-set/check-same-rule/CheckSameRule';           //查重规则
//口碑游戏库
import KoubeiGame                               from '../../pages/scrm/koubei-game/koubei-micro-game';              //游戏库
import MyKoubeiGame                             from '../../pages/scrm/koubei-game/my-koubei-game';                 //我的游戏
import CourseIntroducePage                      from '../../pages/scrm/course-introduce/CourseIntroducePage';       //课程介绍

/***********************************TMK****************************************************************************************************/
import TmkPublicSeaPage                         from '../../pages/tmk/TmkPublicSeaPage'                            //tmk公海池
import TmkOwnSeaPage                            from '../../pages/tmk/TmkOwnSeaPage'                               //tmk个人池

/***********************************财务报表****************************************************************************************************/
import PowerSheet                               from '../../pages/report-form/tmk-money/power/PowerSheet'            //收入统计表
import PayTypeSheet                             from '../../pages/report-form/tmk-money/pay-type/PayTypeSheet'       //收支分类汇总表
import PayProjectSheet                          from '../../pages/report-form/tmk-money/pay-project/PayProjectSheet' //支出汇总表
import RefundSheet                              from '../../pages/report-form/tmk-money/refund/RefundSheet'          //退费情况表
import IncomeSheet                              from '../../pages/report-form/tmk-money/income/IncomeSheet'          //收入统计表

/***********************************运营报表****************************************************************************************************/
import SignTypeSheet                             from '../../pages/report-form/operation/sign-type/SignTypeSheet'   //签单类型统计表

/***********************************市场报表****************************************************************************************************/
import TmkSheet                                 from '../../pages/report-form/market/tmkSheet/TmkSheet'             //TMK报表

/***********************************教学报表****************************************************************************************************/
import ActiveStuSheet                           from '../../pages/report-form/tmk-teach/active-stu/ActiveStuSheet'  //活跃学员统计表
import LoseStuSheet                             from '../../pages/report-form/tmk-teach/lose-stu/LoseStuSheet'      //流失学员统计表
import FreezeStuSheet                           from '../../pages/report-form/tmk-teach/freeze-stu/FreezeStuSheet'  //冻结学员统计表
import ClassStuSheet                            from '../../pages/report-form/tmk-teach/class-stu/ClassStuSheet'    //班级学员人数统计表

/***********************************未知**********************************************************************************************/
import StudentManage           from '../../pages/erp/student-manage/StudentManage';
import StudentDetail           from '../../pages/erp/student-detail/StudentDetail';

/***********************************公共界面**********************************************************************************************/
import CountDownPage	from '../../pages/common/count-down-ms/CountDownMsPage';			//倒计时请求

export default function ({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexLayoutPage} >

        <Route path="hq_main_page" component={CommonLayout} breadcrumbName="校区管理">
            <Route path="/hq_homepage" component={HqMainPage} breadcrumbName="首页" onEnter={()=> changeLeftMenu && changeLeftMenu('hq_homepage')}/>
        </Route>

        <Route path="campus_management" component={CommonLayout} breadcrumbName="校区管理">
            <Route path="/hq_org_list" breadcrumbName="校区信息" component={HeadOrgDetail} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_org_list')}/>
            <Route path="/hq_org_hqusers" breadcrumbName="总部员工" component={StaffManage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_org_hqusers')}/>
            <Route path="/hq_org_orgusers" breadcrumbName="校区员工" component={StaffManage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_org_orgusers')}/>
            <Route path="/hq_org_course" breadcrumbName="课程管理" component={CourseManage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_org_course')}/>
            <Route path="/hq_org_periodpackge" breadcrumbName="课时套餐" component={ClassPackagePage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_org_periodpackge')}  />
            <Route path="/hq_org_cluestudent" breadcrumbName="总部公海池" component={LeadsFollow} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_org_cluestudent')}  />
        </Route>

        <Route path="campus_service" component={CommonLayout} breadcrumbName="校区服务">
            <Route path="/hq_orgser_courseware" breadcrumbName='教学课件' component={Courseware} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgser_courseware')}/>
        </Route>

        <Route path="financial_center" component={CommonLayout} breadcrumbName="财务中心">
            <Route path="/hq_orgser_lineaccount" breadcrumbName="线上账户" component={AccountDetails} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgser_lineaccount')}/>
            <Route path="/hq_orgser_expenses" breadcrumbName="费用支出" component={Expenses} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgser_expenses')}/>
            <Route path="/hq_orgser_income" breadcrumbName="收款录入" component={Income} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgser_income')}/>
        </Route>

        <Route path="org_data" component={CommonLayout} breadcrumbName="校区数据">
            <Route path="/hq_orgdata_leads" breadcrumbName="名单信息" component={LeadsFollowAll} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_leads')}  />
            <Route path="/hq_orgdata_comm" breadcrumbName="跟进记录" component={FollowRecordPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_comm')}  />
            <Route path="/hq_orgdata_visit" breadcrumbName="到访记录" component={VisitRecordPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_visit')}  />
            <Route path="/hq_orgdata_rev" breadcrumbName="预约试听" component={OfflinebookingPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_rev')}  />
            <Route path="/hq_orgdata_stu" breadcrumbName="学员信息" component={StuManagementPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_stu')} />
            <Route path="/hq_orgdata_stuparent" breadcrumbName="家长信息" component={ParentManage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_stuparent')}/>
            <Route path="/hq_orgdata_stucard" breadcrumbName="会员卡信息" component={VipManagePage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_stucard')}/>
            <Route path="/hq_orgdata_purchase" breadcrumbName="合同信息" component={ContractOrderPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_purchase')}/>
            <Route path="/hq_orgdata_payinfo" breadcrumbName="收款单" component={ContractOrderReceipt} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_payinfo')}/>
            <Route path="/hq_orgdata_checklist" breadcrumbName="退款单" component={NewRefundForm} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_checklist')}/>
            <Route path="/hq_orgdata_courseplan" breadcrumbName="排课记录" component={NewArrangeCourseTable} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_courseplan')}/>
            <Route path="/hq_orgdata_cpbook" breadcrumbName="约课记录" component={OrderRecordPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgdata_cpbook')} />
        </Route>

        <Route path="sys_setting" component={CommonLayout} breadcrumbName="系统设置">
            <Route path="/hq_setup_hqset" breadcrumbName="总部设置" component={HeadQuartersSetting} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_setup_hqset')}/>
            {/* <Route path="/hq_setup_hqset" breadcrumbName="设置" component={HeadQuartersSetting} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_setup_hqset')}/> */}
        </Route>

        <Route path="tmk_manager" component={CommonLayout} breadcrumbName="TMK管理">
            <Route path="/hq_tmk_publicsea" breadcrumbName="TMK公海池" component={TmkPublicSeaPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_publicsea')}/>
            <Route path="/hq_tmk_ownsea" breadcrumbName="TMK个人池" component={TmkOwnSeaPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_ownsea')}/>
            </Route>

        <Route path="scrm" component={CommonLayout} breadcrumbName="营销">
            <Route path="/scrm_homepage" component={ScrmOverView} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_homepage')} />
            <Route breadcrumbName="微信预约">
                <Route path="/scrm_wx_maa_list" breadcrumbName="预约名单" component={WxReservationMgr} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_wx_maa_list')} />
                <Route path="/scrm_wx_maa_set" breadcrumbName="预约设置" component={WxReservationConfig} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_wx_maa_set')} />
            </Route>
            <Route breadcrumbName="微官网">
                <Route path="/scrm_woffice_set" breadcrumbName="微官网设置" component={WOfficeSetPage} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_woffice_set')} />
                <Route path="/1" breadcrumbName="活动管理" component={WxActivityPage} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_woffice_activity')} />
                <Route path="/scrm_woffice_activity" breadcrumbName="活动管理" component={WxCreateActivityPage} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_woffice_activity')} />
                <Route path="/scrm_woffice_course" breadcrumbName="课程管理" component={WxCoursePage} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_woffice_course')} />
                <Route path="/scrm_woffice_banner" breadcrumbName="首页轮播图" component={WxBanner} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_woffice_banner')} />
                <Route path="/scrm_woffice_vocation" breadcrumbName="请假申请" component={GetHoliday} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_woffice_vocation')} />
                <Route path="/scrm_woffice_sign" breadcrumbName="签到记录" component={SweepSigninRecordPage} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_woffice_sign')} />
            </Route>
            <Route breadcrumbName="微互动">
                <Route path="/scrm_wx_wact_list" breadcrumbName="微活动" component={MicroActivity} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_wx_wact_list')} />
                <Route path="/scrm_wx_wgame_list" breadcrumbName="微游戏" component={MicroGamePage} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_wx_wgame_list')} />
                <Route path="/scrm_wx_myscrm_list" breadcrumbName="我的互动" component={MyMarketing} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_wx_myscrm_list')} />
            </Route>
            <Route breadcrumbName="市场管理">
                <Route path="/scrm_market_activity" breadcrumbName="市场活动" component={MarketActivity} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_market_activity')} />
                <Route path="/scrm_offline_leaflets" breadcrumbName="线下传单" component={MarketOfflineLeaflets} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_offline_leaflets')} />
                <Route path="/scrm_my_offline_leaflets" breadcrumbName="我的传单" component={MarketMyOfflineLeaflets} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_my_offline_leaflets')} />
            </Route>
        </Route>
        <Route path="report" component={CommonLayout} breadcrumbName="校区报表" >
                <Route path="/hq_orgstats_sellerwork" breadcrumbName="销售工作表" component={SalesWorkSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_sellerwork')}/>
                <Route path="/hq_orgstats_sellscore" breadcrumbName="销售业绩表" component={SalesAchievementSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_sellscore')}/>
                <Route path="/report_crm_leadssource" breadcrumbName="名单来源表" component={LeadsSourceSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('report_crm_leadssource')}/>
                <Route path="/report_crm_leadsfollow" breadcrumbName="名单跟进表" component={LeadsFollowSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('report_crm_leadsfollow')}/>
                <Route path="/hq_orgstats_extperiod" breadcrumbName="赠课记录表" component={SendRecordSheetPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_extperiod')}/>
                <Route path="/hq_orgstats_purchaseincome" breadcrumbName="合同收入表" component={ContractIncomeSheetPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_purchaseincome')}/>
                <Route path="/hq_orgstats_stucheck" breadcrumbName="学员考勤表" component={StuAttendanceSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_stucheck')}/>
                <Route path="/hq_orgstats_roomuse" breadcrumbName="教室利用表" component={ClassRoomRatioSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_roomuse')}/>
                <Route path="/hq_orgstats_stucost" breadcrumbName="学员消课表" component={StuUseClassChartPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_stucost')}/>
                <Route path="/hq_orgstats_stusilence" breadcrumbName="沉默学员表" component={StuSilenceSheetPage} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_stusilence')}/>
                <Route path="/hq_orgstats_teacher" breadcrumbName="老师授课表" component={TeacherTeaching} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_teacher')}/>
                <Route path="/hq_orgstats_costdetail" breadcrumbName="课时详情表" component={CourseDetailSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_costdetail')}/>
                <Route path="/hq_orgstats_teachersalary" breadcrumbName="老师工资表" component={TeacherSalarySheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_teachersalary')}/>
                <Route path="/hq_orgstats_period" breadcrumbName="课时月结表" component={ClassMonthKnotSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_period')}/>
                <Route path="/hq_orgstats_purchase_result" breadcrumbName="时长月结表" component={TimeMonthKnotSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_orgstats_purchase_result')}/>
        </Route>

        <Route path="money_report" component={CommonLayout} breadcrumbName="财务报表" >
                <Route path="/hq_tmk_report_accrual" breadcrumbName="权责收入表" component={PowerSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_report_accrual')}/>
                <Route path="/hq_tmk_report_payIncome" breadcrumbName="收支分类汇总表" component={PayTypeSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_report_payIncome')}/>
                <Route path="/hq_tmk_report_spend" breadcrumbName="支出汇总表" component={PayProjectSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_report_spend')}/>
                <Route path="/hq_tmk_report_refund" breadcrumbName="退费情况表" component={RefundSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_report_refund')}/>
                <Route path="/hq_tmk_report_income_count" breadcrumbName="收入统计表" component={IncomeSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_report_income_count')}/>
        </Route>

        <Route path="operantion_report" component={CommonLayout} breadcrumbName="运营报表" >
                <Route path="/hq_tmk_yunying_signType" breadcrumbName="签单类型统计表" component={SignTypeSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_yunying_signType')}/>
        </Route>

        <Route path="market_report" component={CommonLayout} breadcrumbName="市场报表" >
                <Route path="/hq_tmk_markReport_tmkReport" breadcrumbName="TMK报表" component={TmkSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_markReport_tmkReport')}/>
        </Route>

        <Route path="teach_report" component={CommonLayout} breadcrumbName="教学报表" >
                <Route path="/hq_tmk_cerpReport_active" breadcrumbName="活跃学员统计表" component={ActiveStuSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_cerpReport_active')}/>
                <Route path="/hq_tmk_cerpReport_runoff" breadcrumbName="流失学员统计表" component={LoseStuSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_cerpReport_runoff')}/>
                <Route path="/hq_tmk_cerpReport_freezeStu" breadcrumbName="冻结学员统计表" component={FreezeStuSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_cerpReport_freezeStu')}/>
                <Route path="/hq_tmk_cerpReport_classStuNum" breadcrumbName="班级学员人数统计表" component={ClassStuSheet} onEnter={()=> changeLeftMenu && changeLeftMenu('hq_tmk_cerpReport_classStuNum')}/>
        </Route>

        {/*<Route path="sys" component={CommonLayout} breadcrumbName="设置" >
            <Route breadcrumbName="系统设置">
                <Route path="/sys_scfg_role_list" breadcrumbName="角色管理" component={RoleManage} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_role_list')}/>
                <Route path="/sys_scfg_param_set" breadcrumbName="业务参数" component={SystemDicDataMaintenance} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_param_set')}/>
                <Route path="/sys_scfg_payacct_list" breadcrumbName="收付款账号" component={AccountCard} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_payacct_list')}/>
                <Route path="/sys_cfg_sign" breadcrumbName="考勤设置" component={checkOnWorkAttendance} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_cfg_sign')}/>
                <Route path="/sys_scfg_safety" breadcrumbName="安全设置" component={SecuritySettings} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_safety')}/>
                <Route path="/sys_scfg_cptime" breadcrumbName="课程表时段" component={ClassScheduleTimeSet} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_cptime')}/>
                <Route path="/sys_scfg_pr" breadcrumbName="续费提醒" component={CourseNumAlert} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_pr')}/>
                <Route path="/sys_scfg_host" breadcrumbName="域名设置" component={DomainNameSetting} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_host')}/>
                <Route path="/sys_scfg_salary_set" breadcrumbName="工资设置" component={SalarySet} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_salary_set')}/>
            </Route>

            <Route breadcrumbName="校区设置">
                <Route path="/sys_org_logo_set" breadcrumbName="校区logo" component={OrgLogo} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_org_logo_set')}/>
                <Route path="/sys_org_list" breadcrumbName="校区管理" component={OrgManage} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_org_list')}/>
            </Route>

			<Route breadcrumbName="短信业务">
				<Route path="/sys_sms_record" breadcrumbName="短信记录" component={MessagePage} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_sms_record')}/>
			</Route>

            <Route breadcrumbName="小票设置">
				<Route path="/sys_rece_kq_list" breadcrumbName="考勤打印" component={AttendancePrint} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_rece_kq_list')}/>
                <Route path="/sys_ticket_sign" breadcrumbName="签到打印" component={SignInPrint} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_ticket_sign')}/>
			</Route>
            <Route breadcrumbName="公海池设置">
                <Route path="/sys_sea_follow" breadcrumbName="跟进名单规则" component={leadRecordNoRule} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_sea_follow')}/>
                <Route path="/sys_sea_maxnum" breadcrumbName="拥有名单数规则" component={haveMaxList} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_sea_maxnum')}/>
                <Route path="/sys_sea_repetrule" breadcrumbName="查重规则" component={CheckSameRule} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_sea_repetrule')}/>
            </Route>
            <Route breadcrumbName="支付中心">

            </Route>
        </Route>*/}
        <Route path="other" component={CommonLayout} >
            <Route path="/*" breadcrumbName="未定义页面" component={NotFound} onEnter={()=> changeLeftMenu && changeLeftMenu('not_found')}/>
        </Route>
      </Route>
    </Router>
  );
}
