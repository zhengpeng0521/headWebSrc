import qs from 'qs';
//设置查询
export async function timeOutDetail(params) {
    return requestData(`${BASE_URL}/crm/hq/clue/timeOutDetail`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//设置保存
export async function timeOutRecyle(params) {
    return requestData(`${BASE_URL}/crm/hq/clue/timeOutRecyle`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
