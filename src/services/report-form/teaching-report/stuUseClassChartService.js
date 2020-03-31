import qs from 'qs';

/*课程统计*/
export async function getCourseList(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/stats/costSQ/queryByCourse`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*机构统计*/
export async function getOrganList(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/stats/costSQ/queryByOrg`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*老师统计*/
export async function getTeacherList(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/stats/costSQ/queryByTeacher`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*负责销售统计*/
export async function getSalesList(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/stats/costSQ/queryBySeller`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*负责顾问统计*/
export async function getCounselorList(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/stats/costSQ/queryByCounselor`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*负责客服统计*/
export async function getCustomerList(params) {
    return requestData(`${BASE_URL}/stat/tmk/cerp/costByWait`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
