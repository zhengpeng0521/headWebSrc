var service = require("../../common/common.js");

export async function GetCourseNum(params) {
    return service.generalSaasInterface('/confController/get', params);
}

export async function SaveCourseLeastNum(params) {
    return service.generalSaasInterface('/confController/save', params);
}
