import qs from 'qs';

/*从数据字典获取跟进状态*/
export async function QueryOrgSraff(params) {
    return requestData(`${BASE_URL}/tenantUserController/summaryQueryFromNewTable`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取角色下拉列表用于查询*/
export async function GetRoleList(params) {
    return requestData(`${BASE_URL}/tenantRoleController/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取公海池可分配信息及每个员工已分配信息*/
export async function GetPublicAndStaffMessage(params) {
    return requestData(`${BASE_URL}/cluePoolController/queryAllotData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*点击保存*/
export async function LeadsDispatchInputOnSubmit(params) {
    return requestData(`${BASE_URL}/cluePoolController/allotLeads`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
