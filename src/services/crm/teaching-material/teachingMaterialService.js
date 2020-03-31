import qs from 'qs';

export async function getTeachingMaterialList(params) {
  return requestData(`${BASE_URL}/teachingAidController/queryTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getTeachingMaterialDetail(params) {
  return requestData(`${BASE_URL}/teachingAidController/queryTeachingAidById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function deleteTeachingMaterial(params) {
  return requestData(`${BASE_URL}/teachingAidController/deleteTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function createTeachingMaterial(params) {
  return requestData(`${BASE_URL}/teachingAidController/createTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function updateTeachingMaterial(params) {
  return requestData(`${BASE_URL}/teachingAidController/updateTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
