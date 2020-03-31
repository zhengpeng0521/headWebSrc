import qs from 'qs';

//支付方式列表
export async function defaultPayWayList(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取支付方式
export async function getAllMessage(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/get`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//新增支付方式
export async function newAddPayWay(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/add`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//更新支付方式
export async function updatePayWay(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//删除
export async function deletePayWay(params) {
    console.info('service ',params);
  return requestData(`${BASE_URL}/PaymentAcctController/delete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取新增页面支付方式下拉框
export async function getPayWaySelect(params) {
  return requestData(`${BASE_URL}/dictController/get`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
