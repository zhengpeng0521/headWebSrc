import qs from 'qs';

/*获取城市校区*/
export async function queryCity(params) {
    return requestData(`${BASE_URL}/crm/hq/spend/deptOrgTreeQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取支出汇总*/
export async function queryList(params) {
    return requestData(`${BASE_URL}/stat/tmk/report/spendMonth/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
