var service = require("../../common/common.js");

//得到学员列表
export async function getStudentList(params) {
  return service.generalSaasInterface('/stu/queryCRMStuList', params);
}

//得到学员类型下拉列表
export async function getStudentTypeList(params) {
  return service.generalSaasInterface('/sdictControllertu/get', params);
}

//得到负责人下拉列表
export async function getSellerIdList(params) {
  return service.generalSaasInterface('/tenantUserController/queryMyUsers', params);
}

//获得单个学员信息
export async function getStudentInfo(params) {
  return service.generalSaasInterface('/stu/crmSingleStu', params);
}

//新增学员
export async function confirmCreateForm(params) {
  return service.generalSaasInterface('/stu/createStu', params);
}

//确认转移学员
export async function confirmTranslate(params) {
  return service.generalSaasInterface('/stu/moveStu', params);
}

//删除学员
export async function deleteStudent(params) {
  return service.generalSaasInterface('/stu/deleteStu', params);
}
