var service = require("../../common/common.js");

/*查看微模板的模板配置*/
export async function moduleFormDetail(params) {
    return service.generalSaasInterface('/microActivity/moduleDetail', params);
}

/*查看微模板的模板配置*/
export async function moduleFormSubmit(params) {
    return service.generalSaasInterface('/microActivity/saveTenantMicroActivity', params);
}
