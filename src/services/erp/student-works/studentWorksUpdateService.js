import qs from 'qs';

//得到学员下拉列表
export async function getStuIdList(params) {
  return requestData(`${BASE_URL}/stu/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到标签下拉
export async function getTagIdList(params) {
  return requestData(`${BASE_URL}/workTagController/workTagList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到单个作品信息
export async function getStudentWorkInfo(params) {
  return requestData(`${BASE_URL}/stuWorkController/getSingleWork`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认修改
export async function confirmUpdateWorks(params) {
  return requestData(`${BASE_URL}/stuWorkController/updateStuWork`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
