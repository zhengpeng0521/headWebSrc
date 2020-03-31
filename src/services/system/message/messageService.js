var service = require("../../common/common.js");

export async function getMessageList(params) {
  return service.generalSaasInterface('/smsQuery/getSendHistory', params);
}
