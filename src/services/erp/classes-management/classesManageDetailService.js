import qs from 'qs';

/*得到学员列表*/
export async function getStudentList(params) {
  return requestData(`${BASE_URL}/stu/getStuByClsId`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*得到签到记录列表*/
export async function getSignUpList(params) {
  return requestData(`${BASE_URL}/signController/clsSignQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
