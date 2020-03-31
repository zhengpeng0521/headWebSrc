import qs from 'qs';

/*请求左边角色总览列表数据*/
export async function SearchAllRoleList(params) {
    return requestData(`${BASE_URL}/crm/hq/role/roleQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*请求右边所有功能列表数据*/
export async function SearchAllFunction(params) {
    return requestData(`${BASE_URL}/crm/hq/role/resourceTreeQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*左边角色列表重命名角色*/
export async function RenameRole(params) {
    return requestData(`${BASE_URL}/crm/hq/role/roleUpdate`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*左边角色列表复制角色*/
export async function CopyRole(params) {
    return requestData(`${BASE_URL}/crm/hq/role/roleCopy`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*左边角色列表删除角色*/
export async function DeleteRole(params) {
    return requestData(`${BASE_URL}/crm/hq/role/roleDelete`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*左边角色列表新增角色*/
export async function CreateRole(params) {
    return requestData(`${BASE_URL}/crm/hq/role/roleCreate`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*权限保存*/
export async function SaveRoleFunction(params) {
    return requestData(`${BASE_URL}/crm/hq/role/roleUpdate`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

