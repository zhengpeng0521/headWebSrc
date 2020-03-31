
var service = require("../../../common/common.js");

//获取系统当前时间
export async function GetNowTime(params) {
	return service.generalSaasInterface('/sys/get', params);
}

//获取课程信息
export async function GetCourseInfo(params) {
	return service.generalSaasInterface('/cerpCoursePlan/query', params);
}

//获取员工信息
export async function GetStaffList(params) {
	return service.generalSaasInterface('/tenantUserController/summaryQuery', params);
}

//获取教室信息
export async function GetClsRoomList(params) {
	return service.generalSaasInterface('/cerpClsroom/summaryQuery', params);
}

//获取课程表时段
export async function GetTimeStartAndEnd(params) {
	return service.generalSaasInterface('/confController/get', params);
}
