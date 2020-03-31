import qs from 'qs';

export async function sendVerifyCode(params) {
    return requestData(`${BASE_URL}/crm/hq/sms/genVerifyCode`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
export async function registerChannel(params) {
  return requestData(`${BASE_URL}/regist/channel/form`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
export async function registerChannelList(params) {
  return requestData(`${BASE_URL}/regist/banner/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
