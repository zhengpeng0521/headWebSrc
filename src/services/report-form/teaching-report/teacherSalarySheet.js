import qs from 'qs';

/*获取系统当前日期与时间*/
export async function QueryList(params) {
    return requestData(`${BASE_URL}/crm/hq/salary/teacherSalaryQuery`, {
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
