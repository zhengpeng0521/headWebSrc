import qs from 'qs';

//是否有安全手机号
export async function checkPhoneNum(params) {
    return requestData(`${BASE_URL}/crm/hq/security/querySecurtyMobile`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//改绑
export async function getNetStep(params) {
    return requestData(`${BASE_URL}/crm/hq/security/setSecurtyMobile`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
