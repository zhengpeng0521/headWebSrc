import qs from 'qs';

/*排课类型下拉框数据*/
export async function classTypeComList(params) {
  return requestData(`${BASE_URL}/classSchedule/classTypeComList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*排课计划的保存提交*/
export async function submitSchedule(params) {
  return requestData(`${BASE_URL}/coursePlanController/cpcreate`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*排课计划 删除*/
export async function deleteSchedule(params) {
  return requestData(`${BASE_URL}/coursePlanController/cpdelete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*查询当日最近的排课计划*/
export async function queryFirstSchedule(params) {
  return requestData(`${BASE_URL}/coursePlanController/nearQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*查询课程下的补课学员*/
export async function updateRemedialStuData(params) {
  return requestData(`${BASE_URL}/stuCourse/stuCourseClass`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*查询课程下的补课学员*/
export async function getScheduleDetail(params) {
  return requestData(`${BASE_URL}/coursePlanController/cpdetail`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
