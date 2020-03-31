import qs from 'qs';

/*获取上方总统计数据*/
export async function GetTopAllData(params) {
    return requestData(`${BASE_URL}/statisticsController/queryOrgTaTotal`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取校区收入排行数据*/
export async function QueryOrgAllData(params) {
    return requestData(`${BASE_URL}/statisticsController/queryOrgTaIncome`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取教材统计数据*/
export async function QueryTextAllData(params) {
    return requestData(`${BASE_URL}/statisticsController/queryTaIncome`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


