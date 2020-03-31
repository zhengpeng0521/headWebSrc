import qs from 'qs';

export async function onSsoLoginService(params) {
  return requestData(`${SSO_URL}/myController`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function onLoginService(params) {
  return requestData(`${SSO_URL}/login`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function accountActiveAction(params) {
  return requestData(`${BASE_URL}/tenantUserController/active`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*发送修改密码第一步请求*/
export async function PassWordRecoveryFirstStep(params) {
    return requestData(`${BASE_URL}/tenantUserController/upPwdByVerify`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*发送修改密码第二步请求*/
export async function PassWordRecoverySecondStep(params) {
    return requestData(`${BASE_URL}/tenantUserController/changePasswordByVerifyCode`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*免费申请获取机构类型下拉列表数据*/
export async function GetSchoolType(params) {
    return requestData(`${BASE_URL}/regist/getSchoolType`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*提交免费使用申请*/
export async function SendFreeTrailRequest(params) {
    return requestData(`${BASE_URL}/regist/freeRegist`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*H5注册*/
export async function getH5RichText(params) {
    return requestData(`${BASE_URL}/regist/getList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
    });
}


