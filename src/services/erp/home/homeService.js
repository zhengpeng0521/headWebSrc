import qs from 'qs';

export async function homeData(params) {
  return requestData(`${BASE_URL}/courseManage/getCourseInfo`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
