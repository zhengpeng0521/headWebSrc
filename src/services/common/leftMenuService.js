var service = require("./common.js");

export async function loadAllMenuList(params) {
  return service.generalSaasInterface('/menuController/loadAllMenuList', params);
}
