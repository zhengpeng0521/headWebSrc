var service = require("../../../common/common.js");

//获取学员查重规则
export async function GetStusCheckSameRule(params) {
    return service.generalSaasInterface('/confController/stuDupCheckInfo', params);
}

//获取名单查重规则
export async function GetLeadsCheckSameRule(params) {
    return service.generalSaasInterface('/confController/clueDupCheckInfo', params);
}

//提交保存
export async function Submit(params) {
    return service.generalSaasInterface('/confController/saveDupCheckInfo', params);
}
