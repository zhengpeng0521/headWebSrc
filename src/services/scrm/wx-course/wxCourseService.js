var service = require("../../common/common.js");

//得到活动列表
export async function getCourseList(params) {
  return service.generalSaasInterface('/orgCourseController/queryCourse', params);
}

//得到课程类型和年龄选择项
export async function getCheckBoxOptions(params) {
  return service.generalSaasInterface('/organController/getOrganDict', params);
}

//得到单个课程信息
export async function getCourseInfo(params) {
  return service.generalSaasInterface('/orgCourseController/courseDetail', params);
}

//保存课程信息
export async function confirmAddWxCourse(params) {
  return service.generalSaasInterface('/orgCourseController/updateCourse', params);
}

//改变课程装填
export async function updateCourseStatus(params) {
  return service.generalSaasInterface('/orgCourseController/changeCourse', params);
}

//查看二维码
export async function showCourseUrl(params) {
  return service.generalSaasInterface('/orgCourseController/queryUrl', params);
}
