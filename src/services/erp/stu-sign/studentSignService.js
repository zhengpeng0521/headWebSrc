import qs from 'qs';

export async function getSignScheduleList(params) {
  return requestData(`${BASE_URL}/coursePlanController/cpquery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getSignScheduleDetail(params) {
  return requestData(`${BASE_URL}/signController/cpsignDetail`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function saveSign(params) {
  return requestData(`${BASE_URL}/signController/stuSign`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getStuSignScheduleList(params) {
  return requestData(`${BASE_URL}/signController/stuSignCpQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*家长自助扫码签到*/
export async function stuQuickSign(params) {
    console.info('services',params)
  return requestData(`${BASE_URL}/crmStuSignInfo/updateStatus`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*学员快速签到*/
export async function stuFastSign(params) {
  return requestData(`${BASE_URL}/signController/stuFastSign`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*扫码签到记录*/
export async function querySignSelf(params) {
  return requestData(`${BASE_URL}/crmStuSignInfo/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//选中小票打印后打印
export async function SignRecordPrint(params) {
 	return requestData(`${BASE_URL}/signInfoPrint/info`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取打印配置
export async function SignRecordTableItemPrint(params) {
 	return requestData(`${BASE_URL}/signInfoPrint/info`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
