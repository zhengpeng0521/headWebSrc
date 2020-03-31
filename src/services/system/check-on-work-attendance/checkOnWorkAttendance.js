var service = require("../../common/common.js");

//获取全部口碑门店数据
export async function GetCheckBoxAndChoose(params) {
    return service.generalSaasInterface('/confController/get', params);
}

//保存设置选项
export async function SaveSmallTicketSet(params) {
    return service.generalSaasInterface('/confController/save', params);
}
