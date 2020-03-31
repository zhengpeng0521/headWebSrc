import qs from 'qs';

/*跟进记录数字图*/
export async function QueryFollowRecord(params) {
    return requestData(`${BASE_URL}/sellerReport/getFollowRecord`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*查询销售漏斗图*/
export async function QuerySalesFunnelPlot(params) {
    return requestData(`${BASE_URL}/sellerReport/getSalesFunnel`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*预约试听雷达图*/
export async function QueryReservationRadar(params) {
    return requestData(`${BASE_URL}/sellerReport/getAppointAudition`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*到访记录雷达图*/
export async function QueryVisitedRadar(params) {
    return requestData(`${BASE_URL}/sellerReport/getVisitRecord`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
