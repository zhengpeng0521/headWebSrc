import qs from 'qs';

//得到标签下拉列表
export async function getTagIdList(params) {
  return requestData(`${BASE_URL}/workTagController/workTagList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//得到学员下拉列表
export async function getStuIdList(params) {
  return requestData(`${BASE_URL}/stu/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//得到作品列表
export async function getStudentWorkList(params) {
  return requestData(`${BASE_URL}/stuWorkController/listWorks`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//得到用户空间
export async function getSpaceSize(params) {
  return requestData(`${BASE_URL}/tenantSpaceController/getUsedSpace`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//批量删除
export async function deleteWorks(params) {
  return requestData(`${BASE_URL}/stuWorkController/stuWorkDel`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};


