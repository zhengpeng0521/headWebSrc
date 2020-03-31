var service = require("../../common/common.js");

/*获取当前租户申请状态*/
export async function GetCouGetApplyStatusrseNum(params) {
    return service.generalSaasInterface('/tenantHost/queryStatus', params);
}

/*第一步申请使用点击提交*/
export async function FirstStepApplyForSubmit(params) {
    return service.generalSaasInterface('/tenantHost/applyHost', params);
}

/*第四步保存设置事件*/
export async function ForthStepSetSubmit(params) {
    return service.generalSaasInterface('/tenantHost/loginPageSet', params);
}
