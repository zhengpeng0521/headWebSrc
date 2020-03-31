import qs from 'qs';

//得到学员列表
export async function getStudentList(params) {
  return requestData(`${BASE_URL}/stu/getStuListByParentId`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到学员下拉列表
export async function getStudentIdList(params) {
  return requestData(`${BASE_URL}/stu/stusOfUser`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//确认添加关联学员
export async function confirmAddBindStudent(params) {
  return requestData(`${BASE_URL}/stu/creatOrUpDateParent`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//解除关联学员
export async function cancelBindParent(params) {
  return requestData(`${BASE_URL}/stu/deleteParent`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//得到当前列表详情
export async function getCurrentItem(params) {
  return requestData(`${BASE_URL}/stu/getParentMsg`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};
