import qs from 'qs';

//得到管理分类列表
export async function getManageTypeWorkTagList(params) {
  return requestData(`${BASE_URL}/workTagController/workTagList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//删除分类
export async function deleteWorkTag(params) {
  return requestData(`${BASE_URL}/workTagController/deleteWorktag`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认添加/修改分类
export async function confirmAddWorkTag(params) {
  return requestData(`${BASE_URL}/workTagController/createWorktag`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
