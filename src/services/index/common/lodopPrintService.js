import qs from 'qs';

export async function getLodopConfig(params) {
  return requestData(`${BASE_URL}/lodop/getLodopConfig`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
