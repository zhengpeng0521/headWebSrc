import qs from 'qs';

//查询老师搜客列表数据
export async function GetTeacherTeachingTable(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/stats/SQTeachTime/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}

//查询老师授课详情
export async function OpenTeachingDetail(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/stuClass/queryDetail`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}
//更新云数据
export async function UpdateCloudData(params) {
    return requestData(`${BASE_URL}/crm/stats/xxl/info`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//点击确定
export async function ConfirmDeptOrgSelect(params) {
    return requestData(`${BASE_URL}/crm/stats/xxl/call`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//点击云数据时
export async function OnconfirmDeptOrgSelect(params) {
    return requestData(`${BASE_URL}/crm/stats/xxl/call/check`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
