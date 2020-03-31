import qs from 'qs';

/*班级学员人数总计*/
export async function queryTotal(params) {
    return requestData(`${BASE_URL}/stat/tmk/clsStu/queryAllCount`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*班级学员人数汇总列表*/
export async function querySummary(params) {
    return requestData(`${BASE_URL}/stat/tmk/clsStu/queryCount`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*班级学员人数详情列表*/
export async function queryDetail(params) {
    return requestData(`${BASE_URL}/stat/tmk/clsStu/queryDetail`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
