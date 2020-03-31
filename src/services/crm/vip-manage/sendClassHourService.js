import qs from 'qs';

//得到会员卡列表
export async function getSendClassHourList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/givePeriodList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//审核
export async function checkSendClass(params) {
  return requestData(`${BASE_URL}/stuCardInfo/checkGivePeriod`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
