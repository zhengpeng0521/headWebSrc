var service = require("../../../common/common.js");

export async function queryKbReservation(params) {
  return service.generalSaasInterface('/koubeiReservationController/list', params);
}

export async function batchDeal(params) {
  return service.generalSaasInterface('/koubeiReservationController/batchDeal', params);
}

export async function updateRemark(params) {
  return service.generalSaasInterface('/koubeiReservationController/updateRemark', params);
}
