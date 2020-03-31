var service = require("./common.js");

//校区查询
export async function getCampus(params) {
  return service.generalSaasInterface('/tenantOrgController/summaryQuery', params);
}

//课程查询
export async function getCourses(params) {
  return service.generalSaasInterface('/courseController/summaryQuery', params);
}

//老师查询
export async function getTeachers(params) {
  return service.generalSaasInterface('/tenantUserController/summaryQuery', params);
}

//班级查询
export async function getClasses(params) {
  return service.generalSaasInterface('/classesService/summaryQuery', params);
}

//学员查询
export async function getStudents(params) {
  return service.generalSaasInterface('/stu/stusOfUser', params);
}

//教材列表
export async function getMaterial(params) {
  return service.generalSaasInterface('/teachingAidController/queryTeachingAid', params);
}

//产品列表
export async function getProduct(params) {
  return service.generalSaasInterface('/productController/getProductList', params);
}

//字典列表
export async function getDicList(params) {
  return service.generalSaasInterface('/dictController/list', params);
}

//数据字典下拉列表
export async function getDicSelects(params) {
  return service.generalSaasInterface('/dictController/get', params);
}

//保存字典数据
export async function save(params) {
  return service.generalSaasInterface('/dictController/save', params);
}

//获取销售列表
export async function getSalesList(params) {
  return service.generalSaasInterface('/tenantUserController/summaryQueryFromNewTable', params);
}

//获取支付类型列表
export async function getPayList(params) {
  return service.generalSaasInterface('/PaymentAcctController/list', params);
}

////上传EXCEL表格
//export async function uploadExcel(params) {
//  return requestData(`${BASE_URL}/upload/uploadExcel`, {
//    method: 'post',
//    headers: {
//        "Content-Type": "application/x-www-form-urlencoded",
//    },
//    body: qs.stringify(params),
//  });
//}
//

//机构列表
export async function tenantOrgList(params) {
  return service.generalSaasInterface('/tenantOrgController/summaryQuery', params);
}
