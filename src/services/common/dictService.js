var service = require("./common.js");
/*
 * 获取数据字典
 */
export async function getDictByKey(params) {
  return service.generalSaasInterface('/dictController/get', params);
}
