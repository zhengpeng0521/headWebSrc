import qs from 'qs';

/*获取统计校区，总消耗课时，总学费消耗数*/
export async function GetTopAllData(params) {
    return requestData(`${BASE_URL}/tuitionReduce/queryTotal`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*门店数据*/
export async function QueryForStoreData(params) {
    return requestData(`${BASE_URL}/tuitionReduce/queryOrg`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*课程数据*/
export async function QueryForCourseData(params) {
    return requestData(`${BASE_URL}/tuitionReduce/queryCourse`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*班级数据*/
export async function QueryForClassData(params) {
    return requestData(`${BASE_URL}/tuitionReduce/queryClass`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
