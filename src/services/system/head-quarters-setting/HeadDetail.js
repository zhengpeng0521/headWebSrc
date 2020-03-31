import qs from 'qs';

/*总部信息查询*/
export async function HeadDetailQuery(params) {
    return requestData(`${BASE_URL}/crm/hq/org/headOrgInfoQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*总部信息保存*/
export async function HeadDetailSubmit(params) {
    return requestData(`${BASE_URL}/crm/hq/org/headOrgUpdate`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

