import './index.html';
import dva from 'dva';
import 'babel-polyfill';
import '../../utils/request';
import '../../utils/GetNowDateAndTime';
import '../../utils/mouseRotate';
import './index.css';
import '../../assets/iconfont/iconfont.css';
import '../../assets/font/font.css';

import { message } from 'antd';

//总部
window.BASE_URL = window.BASE_URL ||'/thinknode/web/headquarters';

//总部导出接口拼接
window.DOWNLOAD_EXCEL_URL = window.DOWNLOAD_EXCEL_URL || `${window.BASE_URL}/downloadExcel`;

window.refreshTimes = 200;
window.LODOP;//Lodp 本地打印
window.hasInitMenu = false;
window.changeHeadMenu,window.changeLeftMenu;//变更头部菜单函数，变更侧边栏菜单
window.wActivityTimer; //微活动,传单,游戏每隔十分钟发一次请求
window.activityTimer;

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

//ie
if (window.navigator.userAgent.toLowerCase().indexOf("msie") > -1) {
    window.currentKernel = '-ms-';
}
//firefox
else if (window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    window.currentKernel = '-moz-';
}
//Chrome || Safari(禁用Safari)
else if(window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1/* || window.navigator.userAgent.toLowerCase().indexOf("safari") > -1*/){
    window.currentKernel = '-webkit-';
}
//Opera
else if(window.navigator.userAgent.toLowerCase().indexOf("opera") > -1){
    window.currentKernel = '-o-';
}

message.config({
  duration: 3,
});
/*
 * 前端缓存数据
 * orgPermissionList array 当前登陆用户的机构权限
 * firstOrg object 第一家机构
 * signBySelf object 自主签到的数据
 */
window._init_data = {};
/*
 * 微活动 相关工具方法
 */
window.timer;
window.gameIframeCloseAction;               //关闭窗口
window.gameIframeCloseAndRefreshAction;     //关闭窗口并刷新

// 1. Initialize
const app = dva();

// 2. Model
/***********************************基础配置*******************************************************************************************/
app.model(require('../../models/index/layout/indexLayoutModel'));                                               //整体的布局model
app.model(require('../../models/index/common/orgSelectModel'));                                                     //校区选择框
app.model(require('../../models/index/common/commonLayoutModel'));                                                  //公共布局 - 左右布局
app.model(require('../../models/index/common/leftMenuModel'));                                                      //侧边栏 - 菜单
app.model(require('../../models/index/common/siderMenuModel'));                                                      //侧边栏 - 菜单
app.model(require('../../models/index/common/mainLayoutModel'));                                                    //公共布局
app.model(require('../../models/index/common/uploadModel'));                                                  		//上传
app.model(require('../../models/index/common/uploadStudentModel'));                                                 //上传
app.model(require('../../models/index/common/eyebeamModel'));                                                  		//软电话
app.model(require('../../models/index/header/headerOrgInfoModel'));                                                 //顶部导航 - 机构信息
app.model(require('../../models/index/header/headerVersionInfoModel'));                                             //顶部导航 - 版本信息
app.model(require('../../models/index/header/headerMenuModel'));                                                    //顶部导航 - 顶部菜单
app.model(require('../../models/index/header/headerBarsModel'));                                                    //顶部导航 - 右侧工具栏
app.model(require('../../models/index/header/headerProductServiceModel'));                                          //顶部导航 - 产品与服务
app.model(require('../../models/index/header/headerQrcodeModel'));                                                  //顶部导航 - 商家交流群二维码
app.model(require('../../models/index/header/headerLoginUserInfoModel'));                                           //顶部导航 - 当前登陆用户信息
app.model(require('../../models/index/common/initGuideModel'));                                                     //新手指引

//hq-main-page
/***********************************首页*****************************************************************************************/
app.model(require('../../models/index/hq-main-page/HqMainPage'));                                                   //首页

//campus-management
/***********************************校区管理*****************************************************************************************/
app.model(require('../../models/index/campus-management/head-org-detail/HeadOrgDetail'));                           //校区详情
app.model(require('../../models/index/campus-management/staff-manage/StaffManage'));                                //员工管理
app.model(require('../../models/index/campus-management/courseManage/courseManageModel'));                          //课程管理

//campus-service
/***********************************校区服务*****************************************************************************************/
app.model(require('../../models/index/campus-service/courseware/Courseware'));                                      //教学课件

//financial-center
/***********************************财务中心*****************************************************************************************/
app.model(require('../../models/index/financial-center/online-account/AccountDetailsModel'));                       //支付中心>账户明细
app.model(require('../../models/index/financial-center/expenses/expensesModel'));                                   //支付中心>费用支出
app.model(require('../../models/index/financial-center/income/incomeModel'));                                       //支付中心>收款录入

//crm
/***********************************CRM*********************************************************************************************/
app.model(require('../../models/index/crm/overview/crmOverviewModel'));                                             //CRM 首页
app.model(require('../../models/index/crm/get-holiday/GetHoliday'));                                                //crm学员请假
app.model(require('../../models/index/crm/parent-manage/parentManageModel'));                                       //家长管理
app.model(require('../../models/index/crm/parent-manage/parentManageDetailModel'));                                 //家长管理详情
app.model(require('../../models/index/crm/teaching-material/teachingMaterialModel'));                               //教材管理
app.model(require('../../models/index/crm/teaching-material/teachingMaterialFormModel'));                           //教材管理
app.model(require('../../models/index/crm/sweepsignin-record/sweepSigninRecordModel'));                             //签到记录
app.model(require('../../models/index/crm/offline-booking/crmOfflineBookingModel'));                                //预约试听
app.model(require('../../models/index/crm/stuManagement/stuManagementModel'));                                      //学员管理
app.model(require('../../models/index/crm/leads-follow/LeadsFollow'));                                              //CRM leads跟进
//app.model(require('../../models/index/crm/leads-follow/LeadsDispatch'));                                            //CRM leads分配
//app.model(require('../../models/index/crm/leads-follow/LeadsAdd'));                                                 //CRM leads添加

app.model(require('../../models/index/crm/leads-follow-all/LeadsFollow'));                                              //CRM leads跟进
app.model(require('../../models/index/crm/leads-follow-all/LeadsDispatch'));                                            //CRM leads分配
app.model(require('../../models/index/crm/leads-follow-all/LeadsAdd'));                                                 //CRM leads添加

app.model(require('../../models/index/crm/vip-manage/vipManageModel'));                                             //CRM vip管理
app.model(require('../../models/index/crm/vip-manage/useClassModel'));                                              //CRM 手动消课记录
app.model(require('../../models/index/crm/vip-manage/addUseClassModel'));                                              //CRM 新增消课记录模态框
app.model(require('../../models/index/crm/vip-manage/sendClassHourModel'));                                         //CRM vip赠课时
app.model(require('../../models/index/crm/vip-manage/vipManageDetailModel'));                                       //CRM vip详情
app.model(require('../../models/index/crm/follow-record/followRecordModel'));                                       //CRM 跟进记录
app.model(require('../../models/index/crm/follow-record/followRecordCreateModel'));                                 //CRM 跟进新增
app.model(require('../../models/index/crm/visit-record/visitRecordModel'));                                         //CRM 到访管理
app.model(require('../../models/index/crm/visit-record/visitRecordCreateModel'));                                   //CRM 到访新增
app.model(require('../../models/index/crm/contract-order/contractOrderModel'));                                     //CRM 合同订单列表
//app.model(require('../../models/index/crm/contract-order/contractOrderCreateModel'));                               //CRM 合同创建
app.model(require('../../models/index/crm/contract-order/contractOrderDetailModel'));                               //CRM 合同详情
app.model(require('../../models/index/crm/contract-order-receipt/contractOrderReceiptListModel'));                  //CRM 合同收款列表
app.model(require('../../models/index/crm/contract-order/contractOrderReceiptFormModel'));                          //CRM 合同收款弹框
app.model(require('../../models/index/crm/contract-order/depositManage'));                                          //CRM 合同定金管理

app.model(require('../../models/index/crm/new-refund-form/NewRefundForm'));                                         //CRM 新退款单
app.model(require('../../models/index/erp/materials-manage/materialsManageModel'));                                 //教具管理
app.model(require('../../models/index/erp/student-manage/studentWxBindModalModel'));                                //微信绑定框
app.model(require('../../models/index/erp/student-works/studentWorksUploadModel'));                                 //上传作品上传框
app.model(require('../../models/index/erp/student-works/studentWorksManageTypeModel'));                             //上传作品管理分类框
app.model(require('../../models/index/erp/student-works/studentWorksUpdateModel'));                                 //上传作品修改框
app.model(require('../../models/index/erp/student-detail/toClassModalModel'));                                      //报班模态框

/***********************************早教类erp*********************************************************************************************/
app.model(require('../../models/index/cerp/cerp-overview/Overview'));                                                //教学2-首页

app.model(require('../../models/index/cerp/class-manage/classManageModel'));                                         //教学2-班级管理
app.model(require('../../models/index/cerp/class-manage/classCreateFormModel'));                                     //教学2-班级新增
app.model(require('../../models/index/cerp/class-manage/classManageDetailModel'));                                   //教学2-班级详情
app.model(require('../../models/index/cerp/classroom/classroomModel'));                                              //教学2-教室管理
app.model(require('../../models/index/cerp/new-arrange-course/CreateArrangeCourse'));                                //新增排课
app.model(require('../../models/index/cerp/new-arrange-course/NewArrangeCourse'));                                   //排课列表
app.model(require('../../models/index/erp/order-class/orderClassModel'));                                            //ERP 约课管理
app.model(require('../../models/index/erp/order-class/orderClassScheduleModel'));                                    //ERP 约课课表
app.model(require('../../models/index/erp/order-class/orderClassDetailModel'));                                      //ERP 约课管理详情
app.model(require('../../models/index/erp/order-class/orderRecordModel'));                                           //ERP 约课记录
app.model(require('../../models/index/erp/schedule/scheduleModel'));                                                 //新增课程表
app.model(require('../../models/index/cerp/print-file/follow-course-print/FollowCoursePrint'));                      //cerp按课程打印签到表(暂不用)
app.model(require('../../models/index/cerp/print-file/new-follow-course-print/NewFollowCoursePrint'));               //cerp新按课程打印签到表
app.model(require('../../models/index/cerp/print-file/schedule-print-by-day/SchedulePrintByDay'));                   //cerp按天打印签到表
app.model(require('../../models/index/cerp/course-alert-list/CourseAlertList'));                                     //cerp首页续费提醒
app.model(require('../../models/index/cerp/home-school-comment/HomeSchoolComment'));                                 //cerp家校互评
app.model(require('../../models/index/cerp/vacate-manage/vacateManageModel'));                                       //教务管理 请假记录
app.model(require('../../models/index/erp/student-works/studentWorksModel'));                                        //学员作品
app.model(require('../../models/index/erp/stu-attendance/StuAttendanceModel'));                                      //考勤

/***********************************培训类erp**********************************************************************************************/
app.model(require('../../models/index/erp/sign/signModel'));                 	                                    //签到页面
app.model(require('../../models/index/erp/stu-sign/stuSignModel'));                 	                            //学员签到页面
app.model(require('../../models/index/erp/stu-sign/scheduleSignModel'));                 	                        //排课签到页面
app.model(require('../../models/index/erp/stu-sign/stuSignBySelfModel'));                 	                        //扫码自主签到
app.model(require('../../models/index/erp/allsign-record/signRecordModel'));                         	            //签到记录

/***********************************报表**********************************************************************************************/
//销售表
app.model(require('../../models/index/report-form/sales-report/SalesWorksheet'));                                    //销售工作表
app.model(require('../../models/index/report-form/sales-report/SalesAchievementSheet'));                             //销售业绩表
app.model(require('../../models/index/report-form/sales-report/LeadsSourceSheet'));                                  //名单来源表
app.model(require('../../models/index/report-form/sales-report/LeadsFollowSheet'));                                  //名单跟进表
app.model(require('../../models/index/report-form/sales-report/sendRecordSheetModel'));                              //赠课记录表
app.model(require('../../models/index/report-form/sales-report/contractIncomeSheetModel'));                          //赠课记录表

//教学表
app.model(require('../../models/index/report-form/teaching-report/StuAttendanceSheet'));                             //学员考勤表
app.model(require('../../models/index/report-form/teaching-report/classRoomRatioSheetModel'));                       //教室利用率表
app.model(require('../../models/index/report-form/teaching-report/stuUseClassChartModel'));                          //学员消课表
app.model(require('../../models/index/report-form/teaching-report/stuSilenceSheetModel'));                           //学员沉默表
app.model(require('../../models/index/report-form/teaching-report/teacherTeachingSheet'));                           //老师授课报表
app.model(require('../../models/index/report-form/teaching-report/courseDetailSheet'));                              //课时详情报表
app.model(require('../../models/index/report-form/teaching-report/teacherSalatySheetModal'));                        //课时工资报表
app.model(require('../../models/index/report-form/teaching-report/classMonthKnotModel'));                            //课时月结表
app.model(require('../../models/index/report-form/teaching-report/timeMonthKnotSheet'));                             //时长月结表

/***********************************设置**********************************************************************************************/
app.model(require('../../models/index/system/head-quarters-setting/HeadQuartersSetting'));                           //总部设置
app.model(require('../../models/index/system/RoleManage'));                                                          //角色管理
app.model(require('../../models/index/system/org-set/OrgLogo'));                                                     //机构logo
app.model(require('../../models/index/system/org-set/OrgManage'));                                                   //机构管理
app.model(require('../../models/index/system/small-ticket-set/AttendancePrint'));                                    //考勤小票
app.model(require('../../models/index/system/small-ticket-set/signInPrintModel'));                                   //签到打印
app.model(require('../../models/index/system/maintenanceModel'));    	                                             //数据字典维护
app.model(require('../../models/index/system/course-num-alert/CourseNumAlert'));    	                             //课时预警设置
app.model(require('../../models/index/system/domain-name-setting/DomainNameSetting'));    	                         //三级域名设置
app.model(require('../../models/index/system/salary-set/SalarySet'));    	                                         //工资设置

app.model(require('../../models/index/system/class-schedule-time-set/ClassScheduleTimeSet'));                        //课程表时段设置
app.model(require('../../models/index/system/gong-hai-set/check-same-rule/CheckSameRule'));                          //课程表时段设置
app.model(require('../../models/index/system/security-settings/SecuritySettingsModel'));                             //安全设置
app.model(require('../../models/index/system/gong-hai-set/lead-record-no-rule/leadRecordNoRuleModel'));              //无记录跟进名单
app.model(require('../../models/index/system/gong-hai-set/have-max-list/haveMaxListModel'));                         //最大拥有名单数
app.model(require('../../models/index/system/check-on-work-attendance/checkOnWorkAttendanceModel'));                 //考勤设置
app.model(require('../../models/index/system/account-card/accountCardModel'));                                       //支付方式
app.model(require('../../models/index/system/account-card/accountCardFormModel'));                                   //支付方式
app.model(require('../../models/index/system/message/messageModel')); 
app.model(require('../../models/index/system/file-log/filelogModel'));                                               //短信业务列表

app.model(require('../../models/index/common/veryCodeButtonModel'));                                                 //验证码按钮
app.model(require('../../models/index/common/countDownMsModel'));                                                 	//ms倒计时

/***********************************未知**********************************************************************************************/
app.model(require('../../models/index/scrm/koubei/reservation/kbReservationMgrModel'));                             //口碑预约列表
app.model(require('../../models/index/scrm/course-introduce/courseIntroduceModel'));                                //课程介绍
app.model(require('../../models/index/erp/statistical-report/TuitionIncome'));                                      //学费收入报表
app.model(require('../../models/index/erp/statistical-report/TuitionConsumption'));                                 //学费消耗报表
app.model(require('../../models/index/erp/statistical-report/TextbookSales'));                                      //教材销售报表
app.model(require('../../models/index/erp/statistical-report/SalesCommission'));                                    //销售提成报表

app.model(require('../../models/index/erp/classes-management/classesManagementModel'));    	                        //班级管理
app.model(require('../../models/index/erp/classes-management/classesManageDetail'));    	                        //班级详情

//scrm
/***********************************营销类*******************************************************************************************/
app.model(require('../../models/index/scrm/wx-template/wxTemplateModel'));
app.model(require('../../models/index/scrm/activity/activityModuleBuildModel'));                                    //微活动模板化
app.model(require('../../models/index/scrm/wx-activity/microModuleFormModel'));                                     //自定义微模板的机构配置表单界面
app.model(require('../../models/index/scrm/wx-reservation/wxReservationMgrModel'));                                 //微信预约列表
app.model(require('../../models/index/scrm/wx-reservation-set/wxReservationSetModel'));                             //微信预约设置
app.model(require('../../models/index/scrm/wOffice-set/wOfficeSetModel'));                                          //微官网设置
app.model(require('../../models/index/scrm/wx-activity/wxActivityModel'));                                          //微官网下活动
app.model(require('../../models/index/scrm/wx-activity-create/wxActivityCreateModel'));                                   //微官网下新活动
app.model(require('../../models/index/scrm/wx-course/wxCourseModel'));                                              //微官网下课程
app.model(require('../../models/index/scrm/wx-banner/WxBanner'));                                                   //微官网首页轮播管理
app.model(require('../../models/index/scrm/market/marketModel'));                              						//市场活动
app.model(require('../../models/index/scrm/market/marketOfflineLeafletsModel'));                              		//线下传单
app.model(require('../../models/index/scrm/market/marketMyOfflineLeafletsModel'));                               	//我的传单
app.model(require('../../models/index/scrm/micro-game/microGameMgrModel'));                          			    //微游戏
app.model(require('../../models/index/scrm/game-create/GameCreateModel'));                          				//微游戏创建（模板）
app.model(require('../../models/index/scrm/scrm-overview/ScrmOverView'));                                           //scrm首页
app.model(require('../../models/index/scrm/student-manage/studentManageModel'));                                    //scrm学员管理
app.model(require('../../models/index/scrm/class-package/classPackageModel'));                                      //scrm课时包
app.model(require('../../models/index/scrm/koubei/koubei-goods/koubeiGoodsModel'));                                 //口碑商品
app.model(require('../../models/index/scrm/koubei/koubei-goods/koubeiGoodsFormModel'));                             //口碑商品-表单
app.model(require('../../models/index/scrm/koubei/koubei-goods/koubeiGoodsOrderModel'));                            //口碑商品-订单
app.model(require('../../models/index/scrm/koubei/koubei-goods/koubeiGoodsVerifyModel'));                           //口碑商品-核销
app.model(require('../../models/index/scrm/follow-up-record/followUpRecordCreateModel'));                           //跟进记录新增
app.model(require('../../models/index/scrm/koubei/common/koubeiAuthValidateModel'));                                //口碑授权校验页面

/****************************************TMK ************************************************************************************************/
app.model(require('../../models/index/tmk/TmkPublicSeaModel'));                                //tmk公海池
app.model(require('../../models/index/tmk/TmkOwnSeaModel'));                                //tmk公海池

/**************************************** 财务报表 ************************************************************************************************/
app.model(require('../../models/index/report-form/tmk-money/powerModel'));                                  //权责收入表
app.model(require('../../models/index/report-form/tmk-money/payTypeModel'));                                //收支分类汇总表
app.model(require('../../models/index/report-form/tmk-money/payProjectModel'));                             //支出汇总表
app.model(require('../../models/index/report-form/tmk-money/tmkRefundModel'));                              //退费情况表
app.model(require('../../models/index/report-form/tmk-money/tmkIncomeModel'));                              //收入统计表

/**************************************** 运营报表 ************************************************************************************************/
app.model(require('../../models/index/report-form/operation/signTypeModel'));                               //签单类型统计表

/**************************************** 市场报表 ************************************************************************************************/
app.model(require('../../models/index/report-form/market/tmkSheetModel'));                                  //TMK报表

/**************************************** 教学报表 ************************************************************************************************/
app.model(require('../../models/index/report-form/tmk-teach/activeStuModel'));                              //活跃学员统计表
app.model(require('../../models/index/report-form/tmk-teach/loseStuModel'));                                //流失学员统计表
app.model(require('../../models/index/report-form/tmk-teach/freezeStuModel'));                              //冻结学员统计表
app.model(require('../../models/index/report-form/tmk-teach/classStuModel'));                               //班级学员人数统计表

app.router(require('./router'));

app.start('#root');
