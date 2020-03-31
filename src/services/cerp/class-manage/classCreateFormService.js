var service = require("../../common/common.js");

/*确认新增班级*/
export async function classCreateConfirm(params) {
    return service.generalSaasInterface('/classGrade/addClassGrade', params);
}

/*确认修改班级*/
export async function classUpdateConfirm(params) {
    return service.generalSaasInterface('/classGrade/updateClassGrade', params);
}

/*得到课程下拉列表*/
export async function getCourseList(params) {
    return service.generalSaasInterface('/classGrade/summaryQuery', params);
}
