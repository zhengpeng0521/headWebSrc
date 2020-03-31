import qs from 'qs';

/*冻结学员表*/
export async function queryList(params) {
    return requestData(`${BASE_URL}/stat/tmk/cerp/queryFreeze`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
