/**
 * Created by zhaosi on 2017/6/29.
 */

import qs from 'qs';

//得到试听列表
export async function getOfflineList(params) {
    return requestData(`${BASE_URL}/crm/hq/SubscribeAuditionQueryService/list`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
