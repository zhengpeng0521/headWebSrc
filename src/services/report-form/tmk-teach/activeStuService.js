import qs from 'qs';

/*活跃学员表*/
export async function queryList(params) {
    return requestData(`${BASE_URL}/stat/tmk/cerp/queryActive`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
