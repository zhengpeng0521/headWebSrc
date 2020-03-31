
var service = require("../../common/common.js");

//查询续费提醒列表
export async function GetCourseAlertList(params) {
    return service.generalSaasInterface('/stuCardInfo/periodRemindList', params);
}

//table点击取消提醒
export async function CourseAlertTableOnCancelAlert(params) {
    return service.generalSaasInterface('/stuCard/removePeriodRemind', params);
}

//恢复提醒
export async function RecoveryModalSubmit(params) {
    return service.generalSaasInterface('/stuCard/recoverPeriodRemind', params);
}
