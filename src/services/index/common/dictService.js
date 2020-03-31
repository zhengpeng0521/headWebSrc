import qs from 'qs';

/*
 * 获取数据字典
 */
export async function getDictByKey(params) {
  return requestData(`${BASE_URL}/dictController/get`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
