import qs from 'qs';

/*签单类型统计表 1*/
export async function querySignList(params) {
    return requestData(`${BASE_URL}/stat/tmk/report/signbill/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*签单类型统计表 2*/
export async function queryList(params) {
    return requestData(`${BASE_URL}/stat/tmk/report/purSignType/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
