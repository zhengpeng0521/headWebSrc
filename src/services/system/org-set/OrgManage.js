var service = require("../../common/common.js");

/*获取列表数据*/
export async function ShowOrgManageTable(params) {
    return service.generalSaasInterface('/organController/list', params);
}

/*修改机构状态(删除，停用，启用)*/
export async function UpdateOrganStatus(params) {
    return service.generalSaasInterface('/organController/updateOrganStatus', params);
}

/*表格点击新增校区获取表单中复选框的选项*/
export async function OpenAddOrgModalGetCheckBox(params) {
    return service.generalSaasInterface('/organController/getOrganDict', params);
}

/*点击编辑获取校区回填数据*/
export async function GetOrgDetail(params) {
    return service.generalSaasInterface('/organController/getOrgan', params);
}

/*新增编辑校区提交*/
export async function AddNewOrg(params) {
    return service.generalSaasInterface('/organController/addOrgan', params);
}

/*编辑校区提交*/
export async function EditExistOrg(params) {
    return service.generalSaasInterface('/organController/updateOrgan', params);
}
