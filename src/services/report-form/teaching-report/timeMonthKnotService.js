import qs from 'qs';

export async function queryList(params) {
    return requestData(`${BASE_URL}/crm/hq/crm/order/resultForMonth`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
