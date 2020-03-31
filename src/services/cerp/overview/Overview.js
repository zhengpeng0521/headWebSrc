var service = require("../../common/common.js");

//获取当前日期
export async function GetNowTime(params) {
	return service.generalSaasInterface('/sys/get', params);
}

//获取学员信息
export async function GetStu(params) {
	return service.generalSaasInterface('/stu/summaryQuery', params);
}

//获取主教和助教信息
export async function GetTeacher(params) {
	return service.generalSaasInterface('/tenantUserController/summaryQuery', params);
}

//获取首页默认展示的排课数据
export async function GetFirstArrangeCourse(params) {
	return service.generalSaasInterface('/cerpCoursePlan/nearQuery', params);
}

//获取排课列表
export async function GetArrangeCourseList(params) {
	return service.generalSaasInterface('/cerpCoursePlan/query', params);
}

//左侧下方灰色区域点击事件查询考勤明细
export async function GetSignDetail(params) {
	return service.generalSaasInterface('/cerpCpbook/signQuery', params);
}

//首页签到点击签到
export async function CerpOverviewSignModalSubmit(params) {
	return service.generalSaasInterface('/cerpCpbook/batchStuSign', params);
}

//获取今日签到信息
export async function GetTodaySignData(params) {
	return service.generalSaasInterface('/cerpCpbook/attendStatistics', params);
}

//获取续费提醒课时信息
export async function GetCourseAlertNum(params) {
	return service.generalSaasInterface('/stuCardInfo/getPeriodRemindNum', params);
}
