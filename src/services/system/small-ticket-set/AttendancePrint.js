var service = require("../../common/common.js");

//搜索栏获取角色下拉列表内容,之后查询列表
export async function GetRoleSelectContent(params) {
    return service.generalSaasInterface('/tenantRoleController/query', params);
}

//打开工资设置modal时获取课程下拉列表内容
export async function GetCourseSummary(params) {
    return service.generalSaasInterface('/cerpCourse/summaryQuery', params);
}

