import qs from 'qs';

/*获取来源列表*/
export async function getSourceList(params) {
    return requestData(`${BASE_URL}/sysBase/dict/dictTreeByDept`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增来源*/
export async function addSource(params) {
  return requestData(`${BASE_URL}/sysBase/dictType/deptAddItem`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}

/*删除来源*/
export async function deleteSource(params) {
  return requestData(`${BASE_URL}/sysBase/dictType/deleteDeptItem`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}

/*编辑来源*/
export async function updateSource(params) {
  return requestData(`${BASE_URL}/sysBase/dictType/updateDeptItem`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
