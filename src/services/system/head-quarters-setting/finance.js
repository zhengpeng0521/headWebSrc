import qs from 'qs';

/*获取财务设置*/
export async function getFinanceList(params) {
    return requestData(`${BASE_URL}/crm/hq/spend/project/queryProject`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增类别*/
export async function addFinance(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/project/add`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}

/*编辑/删除类别*/
export async function updateFinance(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/project/update`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}

/*新增项目*/
export async function addProject(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/project/addItem`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}

/*编辑/删除项目*/
export async function updateProject(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/project/updateItem`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}

/*获取支出管理设置*/
export async function getFinanceSet(params) {
    return requestData(`${BASE_URL}/sysBase/sysConf/queryByKey`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

  /*保存支出管理设置*/
export async function saveFinanceSet(params) {
    return requestData(`${BASE_URL}/sys/conf/saveConf`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
