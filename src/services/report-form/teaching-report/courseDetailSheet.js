import qs from 'qs';

/*课时详情表数据*/
export async function QueryList(params) {
    return requestData(`${BASE_URL}/crm/hq/stu/stucard/detailQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
