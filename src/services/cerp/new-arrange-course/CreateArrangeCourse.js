var service = require("../../common/common.js");

//选择校区onChange事件获取课程信息
export async function GetCourse(params) {
	return service.generalSaasInterface('/cerpCourse/summaryQuery', params);
}

//选择课程onChange事件，通过机构ID和课程ID获取课程详情用于填写课程后面的俩空
export async function GetCourseDetail(params) {
	return service.generalSaasInterface('/cerpCourse/queryById', params);
}

//选择校区onChange事件，获取主教和助教信息
export async function GetTeacher(params) {
	return service.generalSaasInterface('/tenantUserController/summaryQuery', params);
}

//选择校区onChange事件获取教室信息
export async function GetClassRoom(params) {
	return service.generalSaasInterface('/cerpClsroom/summaryQuery', params);
}

//点击生成排课
export async function CreateNewCourse(params) {
	return service.generalSaasInterface('/cerpCoursePlan/create', params);
}
