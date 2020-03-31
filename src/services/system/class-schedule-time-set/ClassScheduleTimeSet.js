var service = require("../../common/common.js");

export async function GetTimeData(params) {
    return service.generalSaasInterface('/confController/get', params);
}

export async function FormSubmit(params) {
    return service.generalSaasInterface('/confController/save', params);
}
