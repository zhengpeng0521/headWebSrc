
var service = require("../../common/common.js");

/*得到请假申请 记录*/
export async function getVacateList(params) {
    return service.generalSaasInterface('/vacation/queryVacationList', params);
}

/*审核*/
export async function confirmCheckVacate(params) {
    return service.generalSaasInterface('/vacation/vacationAudit', params);
}
