import qs from 'qs';

//得到家长列表...
export async function filelogTabe(params) {
    return requestData(`${BASE_URL}/ss-es/es/business/logs/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}