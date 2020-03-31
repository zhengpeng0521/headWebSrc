import qs from 'qs';

export async function getDictByKey(params) {
    return requestData(`${BASE_URL}/sys/dict/dictGetByKey`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}

export async function getAccountCardList(params) {
    return requestData(`${BASE_URL}/crm/hq/payment/queryPaymentAccountList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

export async function getAccountCardDetail(params) {
    return requestData(`${BASE_URL}/crm/hq/payment/getPaymentAccount`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}

export async function deleteAccountCard(params) {
    return requestData(`${BASE_URL}/crm/hq/payment/deletePaymentAccount`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

export async function createAccountCard(params) {
    return requestData(`${BASE_URL}/crm/hq/payment/addPaymentAccount`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

export async function updateAccountCard(params) {
    return requestData(`${BASE_URL}/crm/hq/payment/updatePaymentAccount`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
