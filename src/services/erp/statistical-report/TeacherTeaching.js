import qs from 'qs';

//获取校区数量和总计数据
export async function ShowTeacherTeachingAllData(params) {
    return requestData(`${BASE_URL}/classSignInfo/queryTotal`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}

export async function ShowTeacherTeachingTable(params) {
    return requestData(`${BASE_URL}/classSignInfo/queryList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}

export async function OpenTeachingDetail(params) {
    return requestData(`${BASE_URL}/classSignInfo/queryDetail`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}
