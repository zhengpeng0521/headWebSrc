var service = require("./common.js");
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
  return service.generalSaasInterface('/regist/channel/form', params);
}

export async function registerChannelList(params) {
  return service.generalSaasInterface('/regist/banner/list', params);
}
