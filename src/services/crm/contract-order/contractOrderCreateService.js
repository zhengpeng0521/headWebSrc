var service = require("../../common/common.js");

//获取已经支付的方式
export async function getPayWayList(params) {
  return service.generalSaasInterface('/orderController/getPayInfo', params);
}

//获取家长下拉列表
export async function getParentIdList(params) {
  return service.generalSaasInterface('/stu/parentSummary', params);
}

//获取会员卡下拉列表
export async function getVipCardList(params) {
  return service.generalSaasInterface('/stuCardInfo/stuCardSummary', params);
}

//获取学员下拉列表
export async function getStuIdList(params) {
  return service.generalSaasInterface('/stu/getStuInfoByParentId', params);
}

//通过vipcard获取学员下拉列表
export async function getStuIdListByCard(params) {
  return service.generalSaasInterface('/stuCardInfo/cardStuInfoById', params);
}

//得到产品下拉列表
export async function getProductList(params) {
  return service.generalSaasInterface('/productController/getProductList', params);
}

//得到教材下拉列表
export async function getTeachingList(params) {
  return service.generalSaasInterface('/teachingAidController/queryTeachingAid', params);
}

//得到销售下拉列表
export async function getSalesList(params) {
  return service.generalSaasInterface('/tenantUserController/summaryQueryFromNewTable', params);
}

//得到收款下拉列表
export async function getPaywayList(params) {
  return service.generalSaasInterface('/PaymentAcctController/list', params);
}

//确认新增充值
export async function confirmAddContractOrder(params) {
  return service.generalSaasInterface('/orderController/addMoneyOrder', params);
}

//确认新增充值
export async function confirmAddContractOrderProduct(params) {
  return service.generalSaasInterface('/orderController/addClassOrder', params);
}

//得到订单详情
export async function getOrderInfo(params) {
  return service.generalSaasInterface('/orderController/getOrder', params);
}

//编辑课时包
export async function updateContractOrderProduct(params) {
  return service.generalSaasInterface('/orderController/updateClassOrder', params);
}

//编辑充值
export async function updateContractOrder(params) {
  return service.generalSaasInterface('/orderController/updateMoneyOrder', params);
}

//编辑充值
export async function getOrderNum(params) {
  return service.generalSaasInterface('/orderController/getOrderNum', params);
}
