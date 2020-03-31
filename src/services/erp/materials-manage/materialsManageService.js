import qs from 'qs';


//教具管理列表(查询加上默认列表)

export async function defaultMaterialsList(params) {
  return requestData(`${BASE_URL}/teachingAidController/queryTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//删除列表信息
export async function deleteMaterialsList(params) {
  return requestData(`${BASE_URL}/teachingAidController/deleteTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//新增列表信息
export async function addMaterialsList(params) {
  return requestData(`${BASE_URL}/teachingAidController/createTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//编辑更新列表信息
export async function updateMaterialsList(params) {
  return requestData(`${BASE_URL}/teachingAidController/updateTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//编辑查询获取所有数据
export async function getMaterialsMessage(params) {
  return requestData(`${BASE_URL}/teachingAidController/queryTeachingAidById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
