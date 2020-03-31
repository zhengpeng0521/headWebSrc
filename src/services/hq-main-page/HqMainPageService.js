import qs from 'qs';
//首页-销售工作表数据概览 开始日期-结束日期
export async function sellerJobDataSe(params) {
    return requestData(`${BASE_URL}/crm/hq/reportIndex/sellerJobDataSe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//首页-销售工作表数据概览 年月查询
export async function sellerJobDataYe(params) {
    return requestData(`${BASE_URL}/crm/hq/reportIndex/sellerJobDataYe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//首页-销售业绩表数据概览 开始日期-结束日期
export async function sellerPerDataSe(params) {
    return requestData(`${BASE_URL}/crm/hq/reportIndex/sellerPerDataSe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//首页-销售业绩表数据概览 年月查询
export async function sellerPerDataYe(params) {
    return requestData(`${BASE_URL}/crm/hq/reportIndex/sellerPerDataYe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//首页-学员消课表数据概览 开始日期-结束日期
export async function periodIndexSe(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/statistics/periodIndexSe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//首页-学员消课表数据概览 年月查询
export async function periodIndexYe(params) {
    return requestData(`${BASE_URL}/crm/hq/erp/statistics/periodIndexYe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//校区排行-总合同金额排名列表(开始日期--结束日期)
export async function purMoneySortListSe(params) {
    return requestData(`${BASE_URL}/crm/hq/index/purMoneySortListSe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//校区排行-总合同金额排名列表(年月查询)
export async function purMoneySortListYe(params) {
    return requestData(`${BASE_URL}/crm/hq/index/purMoneySortListYe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//校区排行-消课总金额排名列表(开始日期--结束日期)
export async function costCourseMoneySortListSe(params) {
    return requestData(`${BASE_URL}/crm/hq/index/costCourseMoneySortListSe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//校区排行-消课总金额排名列表(年月查询)
export async function costCourseMoneySortListYe(params) {
    return requestData(`${BASE_URL}/crm/hq/index/costCourseMoneySortListYe`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//tmk数据
export async function getTmkHome(params) {
    return requestData(`${BASE_URL}/crm/tmk/homeInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
