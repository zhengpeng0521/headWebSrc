import qs from 'qs';

export async function getErpOverviewData(params) {
  return requestData(`${BASE_URL}/signController/stuSignToday`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
