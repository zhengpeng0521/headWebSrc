
var service = require("../../../common/common.js");

/*查询口碑商品-课程*/
export async function queryKoubeiGoodsCourse(params) {
  return service.generalSaasInterface('/orderGoodController/courseList', params);
}

export async function queryKoubeiGoodsActivity(params) {
  return service.generalSaasInterface('/orderGoodController/activityList', params);
}

/*口碑商品  各个状态数量*/
export async function queryKoubeiGoodsCountOfStatus(params) {
  return service.generalSaasInterface('/orderGoodController/countOfStatus', params);
}

/*口碑商品 更改状态*/
export async function updateCourseStatus(params) {
  return service.generalSaasInterface('/orderGoodController/updateCourseStatus', params);
}

/*口碑商品 更改状态*/
export async function updateActivityStatus(params) {
  return service.generalSaasInterface('/orderGoodController/updateActivityStatus', params);
}

/*查询口碑商品详情-课程*/
export async function getKoubeiGoodsDetailCourse(params) {
  return service.generalSaasInterface('/orderGoodController/getCourseById', params);
}

/*查询口碑商品详情-课程*/
export async function getKoubeiGoodsDetailActivity(params) {
  return service.generalSaasInterface('/orderGoodController/getActivityById', params);
}

/*查询口碑商品表单项的下拉框*/
export async function initKoubeiFormData(params) {
  return service.generalSaasInterface('/organController/getOrganDict', params);
}

/*修改口碑商品*/
export async function createKoubeiGoodsCourse(params) {
  return service.generalSaasInterface('/orderGoodController/courseCreate', params);
}

/*修改口碑商品*/
export async function createKoubeiGoodsActivity(params) {
  return service.generalSaasInterface('/orderGoodController/activityCreate', params);
}

/*修改口碑商品*/
export async function updateKoubeiGoodsCourse(params) {
  return service.generalSaasInterface('/orderGoodController/courseUpdate', params);
}

/*修改口碑商品*/
export async function updateKoubeiGoodsActivity(params) {
  return service.generalSaasInterface('/orderGoodController/activityUpdate', params);
}

/*查询口碑商品订单*/
export async function queryKoubeiGoodsOrder(params) {
  return service.generalSaasInterface('/purchaseController/list', params);
}

/*查询口碑商品核销*/
export async function queryKoubeiGoodsVerify(params) {
  return service.generalSaasInterface('/purchaseController/settleList', params);
}

/*获取商品类目*/
export async function queryCategoryId(params) {
  return service.generalSaasInterface('/kbGoodCatController/query', params);
}

/*查询口碑商品的门店*/
export async function queryKoubeiGoogsOrg(params) {
  return service.generalSaasInterface('/orderOrgController/kbOpenShop', params);
}
