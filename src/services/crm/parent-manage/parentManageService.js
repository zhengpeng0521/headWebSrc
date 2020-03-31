import qs from 'qs';

//得到家长列表
export async function GetTableList(params) {
    return requestData(`${BASE_URL}/crm/hq/stu/parent/zjlParentList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

