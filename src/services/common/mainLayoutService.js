var service = require("./common.js");

export async function loadAllMenuList(params) {
  return service.generalSaasInterface('/menuController/loadAllMenuList', params);
}

/*得到校区列表用来判断是否需要选择校区*/
export async function getOrgIdList(params) {
  return service.generalSaasInterface('/tenantOrgController/upOrgsNoPatch', params);
}

export async function getOrgPermissionList(params) {
  return service.generalSaasInterface('/tenantOrgController/userPermOrgs', params);
}

export async function getMySubordinates(params) {
  return service.generalSaasInterface('/tenantUserController/queryUserBranch', params);
}

export async function queryUserImg(params) {
  return service.generalSaasInterface('/tenantUserController/getUserHeadImg', params);
}

/*修改密码表单提交*/
export async function ChangePassWord(params) {
  return service.generalSaasInterface('/tenantUserController/changePassword', params);
}

