import qs from 'qs';

//得到跟进记录列表
export async function getFollowRecordList(params) {
  return requestData(`${BASE_URL}/crm/hq/stu/commRecord/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
