import qs from 'qs';

//老师下拉列表
export async function getTeacherIdList(params) {
  return requestData(`${BASE_URL}/tenantUserController/summaryQueryFromNewTable`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//班级下拉列表
export async function getClassInfoList(params) {
  return requestData(`${BASE_URL}/classesService/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//得到学员列表
export async function getStudentList(params) {
  return requestData(`${BASE_URL}/stu/cardStuList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//删除学员
export async function deleteStudent(params) {
  return requestData(`${BASE_URL}/stu/deleteStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
