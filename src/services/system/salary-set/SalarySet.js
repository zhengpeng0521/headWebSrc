var service = require("../../common/common.js");

//搜索栏获取角色下拉列表内容,之后查询列表
export async function GetRoleSelectContent(params) {
    return service.generalSaasInterface('/tenantRoleController/query', params);
}

//打开工资设置modal时获取课程下拉列表内容
export async function GetCourseSummary(params) {
    return service.generalSaasInterface('/cerpCourse/summaryQuery', params);
}

//列表查询(列表无删除操作，无需进行查询后零数据判断)
export async function QueryList(params) {
    return service.generalSaasInterface('/wageSet/queryUserWageSettingList', params);
}

//获取老师工资设置的详情信息
export async function GetTeacherDetail(params) {
    return service.generalSaasInterface('/wageSet/getUserWageSetting', params);
}

//工资设置modal提交
export async function SetSalaryModalSubmit(params) {
    return service.generalSaasInterface('/wageSet/saveUserWageSetting', params);
}
