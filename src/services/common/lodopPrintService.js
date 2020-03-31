var service = require("./common.js");

export async function getLodopConfig(params) {
  return service.generalSaasInterface('/lodop/getLodopConfig', params);
}
