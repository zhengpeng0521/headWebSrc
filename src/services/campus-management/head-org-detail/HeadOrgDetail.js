import qs from 'qs';

//获取校区信息左侧组织架构
export async function GetLeftOrganList(params) {
    return requestData(`${BASE_URL}/crm/hq/dept/departTreeQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取总部套餐信息
export async function GetPackage(params) {
    return requestData(`${BASE_URL}/crm/hq/res/storeQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取右侧校区数据
export async function GetRightTableList(params) {
    return requestData(`${BASE_URL}/crm/hq/org/orgQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取校区详情
export async function GetOrgDetailMessage(params) {
    return requestData(`${BASE_URL}/crm/hq/org/singleOrgQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取校区套餐
export async function GetOrgPackageMessage(params) {
    return requestData(`${BASE_URL}/crm/hq/res/respkgQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取校区服务管理
export async function GetOrgServiceManageMessage(params) {
    return requestData(`${BASE_URL}/crm/hq/serconf/queryConfList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//校区服务管理开关onChange事件
export async function ServiceSwitchOnChange(params) {
    return requestData(`${BASE_URL}/crm/hq/serconf/updateConf`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//校区编辑
export async function EditModalSubmit(params) {
    return requestData(`${BASE_URL}/crm/hq/dept/relaUpdate`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//套餐分配提交
export async function PackageModalSubmit(params) {
    return requestData(`${BASE_URL}/crm/hq/res/openPkg`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


//校区可见人列表
export async function orgUserQuery(params) {
    return requestData(`${BASE_URL}/crm/hq/org/orgUserQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


//校区可见人设置保存
export async function CourseSetPersonUpdate(params) {
    return requestData(`${BASE_URL}/crm/hq/teacher/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
