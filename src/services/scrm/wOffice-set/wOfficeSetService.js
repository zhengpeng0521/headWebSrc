var service = require("../../common/common.js");

//得到微官网设置信息
export async function getWOfficeInfo(params) {
  return service.generalSaasInterface('/orgConfigController/queryConfig', params);
}

//初始化微官网信息
export async function initWOfficeInfo(params) {
  return service.generalSaasInterface('/orgConfigController/initConfig', params);
}

//保存微官网设置信息
export async function showAndHideItem(params) {
  return service.generalSaasInterface('/orgConfigController/changeConfig', params);
}

//确认更改显示项
export async function confirmChangeTitle(params) {
  return service.generalSaasInterface('/orgConfigController/updateConfig', params);
}
