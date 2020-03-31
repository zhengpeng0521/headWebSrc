import qs from 'qs';

/*销售提成列表*/
export async function SearchSalesCommission(params) {
    return requestData(`${BASE_URL}/statisticsController/querySeller`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}

/*销售提成列表详情*/
export async function OpenSalesDetail(params) {
    return requestData(`${BASE_URL}/statisticsController/querySellerDetail`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}
