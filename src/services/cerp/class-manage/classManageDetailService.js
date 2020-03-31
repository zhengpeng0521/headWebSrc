var service = require("../../common/common.js");

/*得到班級學員列表*/
export async function getStudentList(params) {
    return service.generalSaasInterface('/classGrade/queryClassStuList', params);
}

/*确认添加学员*/
export async function confirmAddStudent(params) {
    return service.generalSaasInterface('/classGrade/addClassStu', params);
}

/*移除學員*/
export async function removeStudent(params) {
    return service.generalSaasInterface('/classGrade/removeClassStu', params);
}

/*获取学员所预约课程节数*/
export async function getClassNum(params) {
    return service.generalSaasInterface('/classGrade/getClassStuInfo', params);
}

/*得到上課記錄列表*/
export async function getAttendClassList(params) {
    return service.generalSaasInterface('/clsCpbook/cpquery', params);
}

/*删除班级*/
export async function deleteClassItem(params) {
    return service.generalSaasInterface('/classGrade/deleteClassGrade', params);
}

/*得到班级详情*/
export async function getClassInfo(params) {
    return service.generalSaasInterface('/classGrade/getClassGradeDetail', params);
}

/*查询班级约课学员*/
export async function checkAppointClassStuNum(params) {
    return service.generalSaasInterface('/clsCpbook/cpbookStu', params);
}

/*删除日程*/
export async function clsCpbook(params) {
    return service.generalSaasInterface('/clsCpbook/delete', params);
}

/*确认修改信息*/
export async function classInfoCreateConfirm(params) {
    return service.generalSaasInterface('/cerpCoursePlan/update', params);
}
