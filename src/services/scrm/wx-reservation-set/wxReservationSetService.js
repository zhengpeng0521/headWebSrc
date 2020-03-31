var service = require("../../common/common.js");

//得到预约设置信息
export async function getReservationInfo(params) {
  return service.generalSaasInterface('/reservationConfig/get', params);
}

//保存预约设置
export async function saveWxReservation(params) {
  return service.generalSaasInterface('/reservationConfig/save', params);
}
