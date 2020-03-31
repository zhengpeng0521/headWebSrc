import qs from 'qs';

export async function loadAllMenuList(params) {
  return requestData(`${BASE_URL}/crm/hq/res/userMenuQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*得到校区列表用来判断是否需要选择校区*/
export async function getOrgIdList(params) {
  return requestData(`${BASE_URL}/tenantOrgController/upOrgsNoPatch`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getOrgPermissionList(params) {
  return requestData(`${BASE_URL}/tenantOrgController/userPermOrgs`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getMySubordinates(params) {
  return requestData(`${BASE_URL}/tenantUserController/queryUserBranch`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function queryUserImg(params) {
  return requestData(`${BASE_URL}/crm/hq/user/headImgQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*修改密码表单提交*/
export async function ChangePassWord(params) {
    return requestData(`${BASE_URL}/sysBase/tenantUser/changePassword`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


/*调用接口最左侧 应用类型*/
export async function getSystemType(params) {
    return requestData(`${BASE_URL}/appService/queryAppInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*切换校区 机构列表*/
export async function queryOrgListBySysUid(params) {
  return requestData(`${BASE_URL}/sysBase/org/queryOrgListBySysUid`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}

/*获取JwtToken的Code*/
export async function queryYqCode(params) {
  return requestData(`${BASE_URL}/sysBase/tenantUser/getToken`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}

/*设置校区默认值*/
export async function setDefaultLoginOrg(params) {
  return requestData(`${BASE_URL}/sysBase/tenantUser/setDefaultLoginOrg`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
