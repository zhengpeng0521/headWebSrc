import qs from 'qs';

//得到到访管理记录
export async function getVisitRecordList(params) {
  return requestData(`${BASE_URL}/crm/hq/VisitRecordQueryService/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
