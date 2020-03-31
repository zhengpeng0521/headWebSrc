var service = require("../../common/common.js");

//得到课程列表
export async function getCourseList(params) {
    return service.generalSaasInterface('/cerpCourse/query', params);
}

//删除课程
export async function deleteCourse(params) {
    return service.generalSaasInterface('/cerpCourse/statusUpdate', params);
}

//确认新增课程
export async function confirmCreateForm(params) {
    return service.generalSaasInterface('/cerpCourse/create', params);
}

//修改得到单个课程信息
export async function CourseInfoUpdate(params) {
    return service.generalSaasInterface('/cerpCourse/update', params);
}

//得到所选校区
export async function getCourseOrgIds(params) {
    return service.generalSaasInterface('/courseOrgController/getCourseOrgMsg', params);
}

//课程下拉框数据
export async function getCourseComList(params) {
    return service.generalSaasInterface('/courseController/summaryQuery', params);
}

//課程詳情頁面
export async function getCourseDetail(params) {
    return service.generalSaasInterface('/cerpCourse/queryById', params);
}

//打开课系列表
export async function CourseOrderSystemOpen(params) {
    return service.generalSaasInterface('/cerpCourseGroup/query', params);
}

//新增课系
export async function CourseOrderSystemAdd(params) {
    return service.generalSaasInterface('/cerpCourseGroup/create', params);
}

//编辑课系
export async function CourseOrderSystemEdit(params) {
    return service.generalSaasInterface('/cerpCourseGroup/update', params);
}

//删除课系
export async function CourseOrderSystemDelete(params) {
    return service.generalSaasInterface('/cerpCourseGroup/delete', params);
}
