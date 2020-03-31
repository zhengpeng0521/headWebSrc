import qs from 'qs';

//支出记录列表
export async function getExpenseList(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/record/Query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//支出项目列表
export async function getProjectList(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/project/queryProject`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//支出方式列表
export async function getPayWayList(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/payWay/queryPayWay`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//新增支出记录
export async function addExpense(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/record/add`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//支出记录详情
export async function getExpenseDetail(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/record/queryDeatil`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//编辑支出记录
export async function editExpense(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/record/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//删除支出记录
export async function removeExpense(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/record/delete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//增加支出项目
export async function addProject(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/project/add`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//编辑/删除支出项目
export async function editProject(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/project/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//增加支出方式
export async function addPayWay(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/payWay/add`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//编辑/删除支出方式
export async function editPayWay(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/payWay/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//是否是模板文件
export async function checkModelFile(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/import/isModelFile`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取导入字段
export async function getImportField(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/import/getDataSource`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//表格预览
export async function previewImport(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/import/preview`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//支出记录导入
export async function expenseImport(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/import/importData`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//支出记录导入是否完成
export async function expenseIsComplete(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/import/iscomplete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//支出记录获取管辖校区和部门
export async function expenseOrgAndDept(params) {
  return requestData(`${BASE_URL}/crm/hq/spend/deptOrgQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
