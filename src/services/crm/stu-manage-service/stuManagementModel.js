/**
 * Created by zhaosi on 2017/6/27.
 */
import qs from 'qs';

/*获取学员列表*/
export async function GetTableList(params) {
    return requestData(`${BASE_URL}/crm/hq/stu/getZjlCRMStuList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

