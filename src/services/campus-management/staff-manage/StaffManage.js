var service = require("../../common/common.js");
import qs from 'qs';

/*请求左边组织架构列表数据*/
export async function SearchAllOrganList(params) {
    let path = params.staffManageType == 'hq' ? 'dept/departTreeQuery' :
               params.staffManageType == 'org' ? 'org/orgDeptTreeQuery' : '';
    delete params.staffManageType;
    return requestData(`${BASE_URL}/crm/hq/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增部门*/
export async function AddSector(params) {
    return service.generalSaasInterface('/depatService/create', params);
}

/*编辑部门*/
export async function EditSector(params) {
    return service.generalSaasInterface('/depatService/update', params);
}

/*删除部门*/
export async function DeleteSector(params) {
    return service.generalSaasInterface('/depatService/delete', params);
}

/*员工列表展示*/
export async function ShowStaffTable(params) {
    let path = params.staffManageType == 'hq' ? 'user/userQuery' :
               params.staffManageType == 'org' ? 'org/orgUserQuery' : '';
    delete params.staffManageType;
    return requestData(`${BASE_URL}/crm/hq/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取搜索栏角色下拉列表数据*/
export async function GetRoleSelect(params) {
    return requestData(`${BASE_URL}/crm/hq/role/summaryQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*员工列表点击编辑获取详情*/
export async function GetStaffDetail(params) {
    let path = params.staffManageType == 'hq' ? 'crm/hq/user/detailQuery' :
               params.staffManageType == 'org' ? 'sysBase/tenantUser/detailById' : '';
    delete params.staffManageType;
    return requestData(`${BASE_URL}/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


/*点击编辑后查询当前机构下的汇报对象下拉列表内容*/
export async function GetLeaderSelect(params) {
    return service.generalSaasInterface('/tenantUserController/chiefUsers', params);
}

/*新增员工表单提交*/
export async function CreateStaff(params) {
    let path = params.staffManageType == 'hq' ? 'crm/hq/user/create' :
               params.staffManageType == 'org' ? 'sysBase/tenantUser/create' : '';
              // params.orgOrHq == 'hq'
    delete params.staffManageType;
    return requestData(`${BASE_URL}/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*汇报对象列表查询*/
export async function GetchiefUser(params) {
    return requestData(`${BASE_URL}/crm/permission/user/chiefUserQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*编辑表单提交*/
export async function UpdateStaff(params) {
    let path = params.staffManageType == 'hq' ? 'crm/hq/user/update' :
               params.staffManageType == 'org' ? 'sysBase/tenantUser/update' : '';
    delete params.staffManageType;
    return requestData(`${BASE_URL}/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*停用或启用或删除员工*/
export async function EnableOrFireOrDeleteStaff(params) {
    let path = params.staffManageType == 'hq' ? 'user/updateStatus' :
               params.staffManageType == 'org' ? 'org/orgUserDelete' : '';
    delete params.staffManageType;
    return requestData(`${BASE_URL}/crm/hq/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*修改员工职能提交*/
export async function ChangeStaffFunc(params) {
    let path = params.staffManageType == 'hq' ? 'user/updateFunc' :
               params.staffManageType == 'org' ? 'org/orgUserModify' : '';
//    delete params.staffManageType;
    return requestData(`${BASE_URL}/crm/hq/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
/*员工摘要查询*/
export async function userSummaryQuery(params) {
    return requestData(`${BASE_URL}/crm/hq/user/summaryQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取JwtToken的Code*/
export async function queryYqCode(params) {
    return requestData(`${BASE_URL}/sysBase/tenantUser/getToken`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取最新的员工工号*/
export async function queryMaxEmpNo(params) {
    return requestData(`${BASE_URL}/sysBase/tenantUser/queryMaxEmpNo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
