import qs from 'qs';

//收款单列表
export async function getReceiptList(params) {
  return requestData(`${BASE_URL}/crm/hq/crm/order/payInfoList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//收款单审核
export async function checkPayInfo(params) {
  return requestData(`${BASE_URL}/crm/hq/crm/order/checkPayInfo`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//收款单下拉列表
export async function getPaymentList(params) {
  return requestData(`${BASE_URL}/crm/hq/payment/queryPaymentAccountList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
