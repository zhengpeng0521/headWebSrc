import qs from 'qs';

/*获取月结表*/
export async function queryList(params) {
    return requestData(`${BASE_URL}/crm/hq/crm/cardReport/queryPeriodMonthList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


//会员卡课时月结表合计信息
export async function queryPeriodMonthTotal(params) {
    return requestData(`${BASE_URL}/crm/hq/crm/cardReport/queryPeriodMonthTotal`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//更新云数据
export async function queryUpdateCloudData(params) {
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

