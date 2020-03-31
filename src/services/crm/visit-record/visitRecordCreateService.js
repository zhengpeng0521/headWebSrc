import qs from 'qs';

//确认新增记录
export async function confirmAddVisitRecord(params) {
  return requestData(`${BASE_URL}/visitRecordController/createVisitRecord`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//新增修改时获得跟进记录信息
export async function getVisitRecordInfo(params) {
  return requestData(`${BASE_URL}/visitRecordController/getMsg`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取下拉学员下拉列表
export async function getStudentList(params) {
  return requestData(`${BASE_URL}/stu/stusOfUser`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取下拉leaders下拉列表
export async function getStudentLeadersList(params) {
  return requestData(`${BASE_URL}/cluePoolController/leadsSummary`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
