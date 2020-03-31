import qs from 'qs';

/*获取上方统计数据*/
export async function GetTopAllData(params) {
    return requestData(`${BASE_URL}/statisticsController/queryOrgTotalIncome`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取校区统计数据*/
export async function QueryOrgData(params) {
    return requestData(`${BASE_URL}/statisticsController/queryOrgIncome`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取课程统计数据*/
export async function QueryCourseData(params) {
  return requestData(`${BASE_URL}/statisticsController/queryCourseIncome`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*获取支付方式统计数据*/
export async function QueryPayWayData(params) {
    return requestData(`${BASE_URL}/statisticsController/queryPaymentIncome`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
