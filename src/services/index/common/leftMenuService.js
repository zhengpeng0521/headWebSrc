import qs from 'qs';

export async function loadAllMenuList(params) {
  return requestData(`${BASE_URL}/crm/hq/res/userMenuQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
