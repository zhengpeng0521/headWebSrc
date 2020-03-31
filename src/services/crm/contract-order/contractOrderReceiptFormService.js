import qs from 'qs';

//得到当前日期
export async function getCurrentDate(params) {
  return requestData(`${BASE_URL}/sys/get`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//查询机构是否开通pos
export async function getIsOpenPos(params) {
  return requestData(`${BASE_URL}/orderController/isOpenPos`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到关联pos所得到的流水单列表
export async function getWaterSingleList(params) {
  return requestData(`${BASE_URL}/orderController/getPosBillByPurchaseId`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认关联流水单列表
export async function confirmConnectPosList(params) {
  return requestData(`${BASE_URL}/orderController/bindingPosBill`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取收款方式下拉列表
export async function getPaymentList(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//手填确认收款
export async function confirmReceiptContract(params) {
  return requestData(`${BASE_URL}/orderController/payOrder`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取订金列表内容
export async function getDepositList(params) {
  return requestData(`${BASE_URL}/purchaseDeposit/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取收款方式
export async function getPayment(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

