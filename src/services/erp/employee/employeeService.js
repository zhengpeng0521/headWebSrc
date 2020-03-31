import qs from 'qs';

/*教师下拉框数据*/
export async function getEmployeeComList(params) {
  return requestData(`${BASE_URL}/tenantUserController/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

