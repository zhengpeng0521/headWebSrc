var service = require("../../common/common.js");

export async function onLoginService(params) {
  return service.generalSaasInterface('/saas/login', params);
}

export async function onMainService(params) {
  return service.generalSaasInterface('/saas/main', params);
}
