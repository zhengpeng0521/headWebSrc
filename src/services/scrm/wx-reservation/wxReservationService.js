var service = require("../../common/common.js");

/*查询口碑商品-课程*/
export async function queryWxReservation(params) {
  return service.generalSaasInterface('/reservationController/list', params);
}

/*查询口碑商品-课程*/
export async function batchDeal(params) {
  return service.generalSaasInterface('/reservationController/batchDeal', params);
}

/*查询口碑商品-课程*/
export async function updateRemark(params) {
  return service.generalSaasInterface('/reservationController/updateRemark', params);
}
