var service = require("../../common/common.js");

/*得到班级列表*/
export async function getClassList(params) {
    return service.generalSaasInterface('/classGrade/queryClassGradeList', params);
}

/*得到员工下拉列表*/
export async function getUserList(params) {
    return service.generalSaasInterface('/tenantUserController/summaryQuery', params);
}

/*得到课程下拉列表*/
export async function getCourseList(params) {
    return service.generalSaasInterface('/cerpCourse/summaryQuery', params);
}

/*得到学员下拉列表*/
export async function getStuList(params) {
    return service.generalSaasInterface('/stu/summaryQuery', params);
}

/*得到教室下拉列表*/
export async function getRoomList(params) {
    return service.generalSaasInterface('/cerpClsroom/summaryQuery', params);
}

/*删除班级*/
export async function deleteClass(params) {
    return service.generalSaasInterface('/classGrade/deleteClassGrade', params);
}
