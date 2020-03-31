var service = require("../../common/common.js");

//得到课程列表
export async function getCourseIntroduceList(params) {
  return service.generalSaasInterface('/courseintroduce/introduceList', params);
}

//批量操作
export async function batchOperation(params) {
  return service.generalSaasInterface('/courseintroduce/updateStatus', params);
}

//得到单个课程信息
export async function getSingleCourseInfo(params) {
  return service.generalSaasInterface('/courseintroduce/getCourse', params);
}

//确认新增课程
export async function confirmAddCourse(params) {
  return service.generalSaasInterface('/courseintroduce/saveOrupdate', params);
}

//富文本编辑器
export async function tableOnUpdateHtmldetailItem(params) {
  return service.generalSaasInterface('/courseintroduce/openText', params);
}

//确认课程详情
export async function confirmAddCourseEditor(params) {
  return service.generalSaasInterface('/courseintroduce/saveText', params);
}
