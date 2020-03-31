import qs from 'qs';

//得到会员卡列表
export async function getStudentList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/cardStuInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getParentList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/cardParentInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getBaseInfoParams(params) {
  return requestData(`${BASE_URL}/stuCardInfo/getBaseInfo`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getContractList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/cardPurInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getRefundList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/cardRefInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getSendClassList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/givePeriodList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getClassChangeList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/cardPeriodInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getBalanceList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/cardAmountInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//通过会员卡号得到合同下拉
export async function getContractSelectList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/purSummByCardId`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认添加赠送课时
export async function confirmAddSendClass(params) {
  return requestData(`${BASE_URL}/stuCardInfo/addGivePeriod`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到学员下拉
export async function getStudentSelectList(params) {
  return requestData(`${BASE_URL}/stu/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认新增适用学员
export async function confirmAddStudent(params) {
  return requestData(`${BASE_URL}/stuCard/addStuByCardId`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//移除学员
export async function removeStudent(params) {
  return requestData(`${BASE_URL}/stuCard/delStuByCardId`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取合同下拉列表内容
export async function GetOrderList(params) {
    return requestData(`${BASE_URL}/orderController/orderSummary`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//合同下拉列表onChange事件查询合同包含的课时信息(合同内)
export async function GetOutCourseDetail(params) {
    return requestData(`${BASE_URL}/transferPeriod/getCourseInfoByPurId`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//合同下拉列表onChange事件查询合同包含的课时信息(全校区)
export async function GetInCourseDetail(params) {
    return requestData(`${BASE_URL}/transferPeriod/getCourseInfoByCardId`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//转课提交
export async function TransCourseModalSubmit(params) {
    return requestData(`${BASE_URL}/transferPeriod/createTransferCourse`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
