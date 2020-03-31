var service = require("../../common/common.js");

//确认新增记录
export async function confrimAddFollowUpRecord(params) {
  return service.generalSaasInterface('/commRecordService/create', params);
}

//确认修改记录
export async function confirmUpdateFollowUpRecord(params) {
  return service.generalSaasInterface('/commRecordService/update', params);
}

//新增修改时获得跟进记录信息
export async function getFollowUpInfo(params) {
  return service.generalSaasInterface('/commRecordService/getMsg', params);
}

//得到跟进记录列表
export async function getFollowUpTypeList(params) {
  return service.generalSaasInterface('/dictController/get', params);
}

//获取下拉学员下拉列表
export async function getStudentList(params) {
  return service.generalSaasInterface('/stu/stusOfUser', params);
}

//获取家长下拉列表
export async function getParentIdList(params) {
  return service.generalSaasInterface('/stu/parentSummary', params);
}
