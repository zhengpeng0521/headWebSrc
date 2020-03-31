import qs from 'qs';

/*获取全部列表数据*/
export async function GetTableList(params) {
    return requestData(`${BASE_URL}/crm/hq/ClueStudentQueryService/queryClueStus`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//重要程度
export async function GetImportant(params) {
    return requestData(`${BASE_URL}/crm/hq/dictController/detail`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
