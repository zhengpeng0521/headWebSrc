var service = require("../../../common/common.js");

//获取最大拥有名单数
export async function getMaxList(params) {
    return service.generalSaasInterface('/confController/get', params);
}

//修改最大拥有名单数
export async function SaveMaxList(params) {
    return service.generalSaasInterface('/confController/save', params);
}
