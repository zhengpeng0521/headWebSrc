import qs from 'qs';

//得到校区下拉列表
export async function getOrgOptionsList(params) {
  return requestData(`${BASE_URL}/tenantOrgController/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到课程列表
export async function getCourseList(params) {
  return requestData(`${BASE_URL}/courseController/queryCourseList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//删除课程
export async function deleteCourse(params) {
  return requestData(`${BASE_URL}/courseController/updateStatus`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认新增课程
export async function confirmCreateForm(params) {
  return requestData(`${BASE_URL}/courseController/createCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//修改得到单个课程信息
export async function getCourseInfo(params) {
  return requestData(`${BASE_URL}/courseController/getSingleCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到所选校区
export async function getCourseOrgIds(params) {
  return requestData(`${BASE_URL}/courseOrgController/getCourseOrgMsg`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//课程下拉框数据
export async function getCourseComList(params) {
  return requestData(`${BASE_URL}/courseController/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
