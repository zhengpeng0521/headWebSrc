import qs from 'qs';

/*学员下拉框数据*/
export async function allStuComList(params) {
  return requestData(`${BASE_URL}/stu/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*班级内学员下拉框数据*/
export async function classStuComList(params) {
  return requestData(`${BASE_URL}/stu/stusOfClass`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
