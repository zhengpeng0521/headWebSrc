import qs from 'qs';

/*获取品牌状态*/
export async function BrandGetStatus(params) {
    return requestData(`${BASE_URL}/crm/hq/brand/getBrand`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*品牌信息提交*/
export async function BrandSubmit(params) {
    let path = params.type;
    delete params.clear;
    delete params.type;
    return requestData(`${BASE_URL}/crm/hq/brand/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
