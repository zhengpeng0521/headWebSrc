var service = require("./common.js");

/*获取机构图片*/
export async function queryCurrentOrgLogo(params) {
    return service.generalSaasInterface('/organController/getTenant', params);
}

/*获取机构图片*/
export async function queryApplicationList(params) {
    return service.generalSaasInterface('/appService/queryAppInfo', params);
}

/*获取机构所有部门*/
export async function getOrgList(params) {
    return serviceRequest2(`${BASE_URL}/crm/hq/org/orgDeptTreeQuery`, params);
}
