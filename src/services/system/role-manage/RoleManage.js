var service = require("../../common/common.js");

/*请求左边角色总览列表数据*/
export async function searchAllRoleList(params) {
    return service.generalSaasInterface('/tenantRoleController/query', params);
}

/*请求右边所有功能列表数据*/
export async function searchAllFunction(params) {
    return service.generalSaasInterface('/tenantRoleController/getResourceTree', params);
}

/*左边角色列表重命名角色*/
export async function RenameRole(params) {
    return service.generalSaasInterface('/tenantRoleController/update', params);
}

/*左边角色列表复制角色*/
export async function CopyRole(params) {
    return service.generalSaasInterface('/tenantRoleController/copy', params);
}

/*左边角色列表删除角色*/
export async function DeleteRole(params) {
    return service.generalSaasInterface('/tenantRoleController/delete', params);
}

/*左边角色列表新增角色*/
export async function CreateRole(params) {
    return service.generalSaasInterface('/tenantRoleController/create', params);
}


/*权限保存*/
export async function SaveRoleFunction(params) {
    return service.generalSaasInterface('/tenantRoleController/update', params);
}
