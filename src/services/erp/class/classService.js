import qs from 'qs';

/*班级下拉框数据*/
export async function classComList(params) {
  return requestData(`${BASE_URL}/classesService/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
/*课程下的班级  下拉框数据*/
export async function courseClassComList(params) {
  return requestData(`${BASE_URL}/classesService/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
