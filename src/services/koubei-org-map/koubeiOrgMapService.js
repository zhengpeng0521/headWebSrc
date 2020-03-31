var service = require("../../common/common.js");

//口碑商户绑定租户
export async function bindTenant(params) {
  return service.generalSaasInterface('/tenantMappingController/createTenantMapping', params);
}

//口碑商户绑定租户
export async function initSaasOrgList(params) {
  return service.generalSaasInterface('/tenantMappingController/queryTenantOrgList', params);
}

//口碑商户绑定租户
export async function initKoubeiShopList(params) {
  return service.generalSaasInterface('/tenantMappingController/queryMerchantShop', params);
}

//口碑商户绑定租户
export async function initMapList(params) {
  return service.generalSaasInterface('/tenantMappingController/queryOrgMapping', params);
}

//口碑商户绑定租户
export async function updateOrgMap(params) {
  return service.generalSaasInterface('/tenantMappingController/bindShop', params);
}
