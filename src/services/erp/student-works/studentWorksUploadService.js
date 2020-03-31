import qs from 'qs';

//获取标签下拉列表
export async function getWorkTagList(params) {
  return requestData(`${BASE_URL}/workTagController/workTagList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取校区下拉列表
export async function getOrgIdList(params){
  return requestData(`${BASE_URL}/tenantOrgController/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取学员下拉列表
export async function getStuIdList(params) {
  return requestData(`${BASE_URL}/stu/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//上传作品
export async function uploadWorksToCloud(params) {
  return requestData(`${BASE_URL}/stuWorkController/stuCreate`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
