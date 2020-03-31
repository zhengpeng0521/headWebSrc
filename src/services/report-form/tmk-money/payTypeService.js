import qs from 'qs';

/*获取收支分类汇总表*/
export async function queryList(params) {
    return requestData(`${BASE_URL}/stat/tmk/report/payBalance/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
