var service = require("../../common/common.js");

//获取教师数据渲染搜索栏下拉列表
export async function GetTeacherMsg(params) {
	return service.generalSaasInterface('/tenantUserController/summaryQuery', params);
}

//获取课程数据渲染搜索栏下拉列表
export async function GetCourseMsg(params) {
	return service.generalSaasInterface('/cerpCourse/summaryQuery', params);
}

//获取列表数据，列表数据不存在删除功能，无须做非第一页空数据则请求前一页数据的功能
export async function GetTableList(params) {
	return service.generalSaasInterface('/hsComm/cpQuery', params);
}

//获取详情老师评价和家长评价列表数据
export async function GetDetail(params) {
	return service.generalSaasInterface('/hsComm/commAllQuery', params);
}

//老师评价编辑modal提交
export async function SubmitCommentEditModal(params) {
	return service.generalSaasInterface('/hsComm/tcrCommUpdate', params);
}

//上课内容编辑modal提交
export async function tcrCommUpdate(params) {
	return service.generalSaasInterface('/hsComm/cpContentUpdate', params);
}
