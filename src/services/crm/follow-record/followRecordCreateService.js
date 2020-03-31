import qs from 'qs';

//确认新增记录
export async function confirmAddFollowRecord(params) {
  return requestData(`${BASE_URL}/commRecordService/create`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认修改记录
export async function confirmUpdateFollowRecord(params) {
  return requestData(`${BASE_URL}/commRecordService/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//新增修改时获得跟进记录信息
export async function getFollowRecordInfo(params) {
  return requestData(`${BASE_URL}/commRecordService/getMsg`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到跟进记录列表
export async function getFollowTypeList(params) {
  return requestData(`${BASE_URL}/dictController/get`, {
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

//获取家长下拉列表
export async function getParentList(params) {
  return requestData(`${BASE_URL}/stu/parentSummary`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取leader家长下拉列表
export async function getLeaderParentList(params) {
  return requestData(`${BASE_URL}/cluePoolController/getParentByStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
