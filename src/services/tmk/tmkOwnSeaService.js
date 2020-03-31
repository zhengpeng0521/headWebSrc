import qs from 'qs'

//个人池列表
export async function tmkStuList(params) {
  return requestData(`${BASE_URL}/crm/tmk/tmkStuList`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//跟进数据
export async function tmkTodayCount(params) {
  return requestData(`${BASE_URL}/crm/tmk/tmkRecordCount`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//跟进结果
export async function queryFollowResult(params) {
  return requestData(`${BASE_URL}/sysBase/sysConf/queryByKey`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//查询来源类别，市场渠道
export async function dictGetByKey(params) {
  return requestData(`${BASE_URL}/sysBase/dict/dictGetByKey`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//查询部门
export async function formatList(params) {
  return requestData(`${BASE_URL}/sysBase/department/formatList`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//新建跟进记录
export async function followCreate(params) {
  return requestData(`${BASE_URL}/crm/tmk/commRecord/create`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//新建到访
export async function addVisitRecord(params) {
  return requestData(`${BASE_URL}/crm/tmk/visit/addVisitRecord`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//新建预约试听
export async function addAudition(params) {
  return requestData(`${BASE_URL}/crm/tmk/subscribeAudition/create`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//分配校区
export async function distributionCampus(params) {
  return requestData(`${BASE_URL}/crm/tmk/stuInfo/clue/DistributionCampus`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//返回公海池
export async function recycleStu(params) {
  return requestData(`${BASE_URL}/crm/tmk/recycleStu`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//跟进人列表
export async function followUserList(params) {
  return requestData(`${BASE_URL}/crm/tmk/followUserList`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//查询跟进记录列表
export async function queryFollowList(params) {
  return requestData(`${BASE_URL}/crm/tmk/commRecord/queryList`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//预约试听 - 排课日期
export async function tryDayQuery(params) {
  return requestData(`${BASE_URL}/crm/tmk/tryDayQuery`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//预约试听 - 查询可试听排课课程
export async function tryCourseQuery(params) {
  return requestData(`${BASE_URL}/crm/tmk/tryCourseQuery`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
//预约试听 - 查询排课列表
export async function queryCoursePlan(params) {
  return requestData(`${BASE_URL}/crm/tmk/queryCoursePlan`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
