import qs from 'qs';

//字典查询
export async function getDict(params) {
  return requestData(`${BASE_URL}/sysBase/dict/dictGetByKey`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//查询二级渠道
export async function getSubSecond(params) {
  return requestData(`${BASE_URL}/sysBase/dict/subSecondChannelQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//公海池列表
export async function getPublicList(params) {
  return requestData(`${BASE_URL}/crm/tmk/tmkStuList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//删除公海池名单
export async function removePublic(params) {
  return requestData(`${BASE_URL}/crm/tmk/recycleStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//新建公海池名单
export async function addPublic(params) {
  return requestData(`${BASE_URL}/crm/tmk/tmkAddClueStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取编辑详情
export async function getPublicDetail(params) {
  return requestData(`${BASE_URL}/crm/tmk/clue/queryDetail`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//编辑名单
export async function editPublic(params) {
  return requestData(`${BASE_URL}/crm/tmk/tmkAddClueStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取分配人员
export async function getTmkFollow(params) {
  return requestData(`${BASE_URL}/crm/tmk/followUserList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//分配
export async function assignPublic(params) {
  return requestData(`${BASE_URL}/crm/tmk/tmkAllotLeads`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//是否摸板文件
export async function isTmkModel(params) {
  return requestData(`${BASE_URL}/import/tmk/clue/student/isModelFile`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取预览表格源字段
export async function getTableCols(params) {
  return requestData(`${BASE_URL}/import/tmk/cluepool/getSourceData`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//导入预览
export async function previewData(params) {
  return requestData(`${BASE_URL}/import/tmk/cluepool/previewData`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//导入数据
export async function importTmk(params) {
  return requestData(`${BASE_URL}/import/tmk/clue/student/importLeadsData`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//导入是否完成
export async function importComplete(params) {
  return requestData(`${BASE_URL}/import/cluepool/isComplete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//收集人列表
export async function collecterList(params) {
  return requestData(`${BASE_URL}/sysBase/tenantUser/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
