import qs from 'qs';

//请求单条数据
export async function queryForTopList(params) {
  return requestData(`${BASE_URL}/classesService/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//学员下半部列表
export async function queryForClassesList(params) {
  return requestData(`${BASE_URL}/stu/getStuByClsId`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//班级修改
export async function modifyClassesInfo(params) {
  return requestData(`${BASE_URL}/classesService/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//班级签到列表
export async function clsSignQuery(params) {
  return requestData(`${BASE_URL}/signController/clsSignQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}







