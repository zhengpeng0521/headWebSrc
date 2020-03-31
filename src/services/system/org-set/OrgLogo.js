var service = require("../../common/common.js");

/*获取列表数据*/
export async function GetTenantPic(params) {
    return service.generalSaasInterface('/organController/getTenant', params);
}

/*保存图片*/
export async function SaveOrgPic(params) {
    return service.generalSaasInterface('/organController/saveTenantImg', params);
}
