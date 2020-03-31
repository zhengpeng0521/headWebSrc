var service = require("../../common/common.js");

//得到活动列表
export async function getActivityList(params) {
  return service.generalSaasInterface('/micNetActivityController/getActivityList', params);
}

//报名成功的列表
export async function applySuccessList(params) {
  return service.generalSaasInterface('/micNetApplyController/getJoinerList', params);
}

//获取所有标签列表
export async function getProductLabel(params) {
  return service.generalSaasInterface('/productLabel/alllabel/query', params);
}

//得到活动信息
export async function getActivityInfo(params) {
  return service.generalSaasInterface('/micNetActivityController/singleActivityMsg', params);
}

//保存活动信息
export async function confirmAddWxActivity(params) {
  return service.generalSaasInterface('/micNetActivityController/createActivity', params);
}

//上下架、删除
export async function updateActivityStatus(params) {
  return service.generalSaasInterface('/micNetActivityController/updateStatus', params);
}

//取消报名
export async function cancelApply(params) {
  return service.generalSaasInterface('/micNetApplyController/cancelJoin', params);
}

//查看二维码
export async function showActivityUrl(params) {
  return service.generalSaasInterface('/micNetActivityController/getActivityAddress', params);
}

//优先等位
export async function toBeNumberOne(params) {
  return service.generalSaasInterface('/micNetApplyController/precedenceWait', params);
}

//确认添加备注
export async function confirmAddRemark(params) {
  return service.generalSaasInterface('/micNetApplyController/addRemark', params);
}

