import qs from 'qs';

/*获取查重规则*/
export async function getLeadsDup(params) {
    return requestData(`${BASE_URL}/sysBase/duplicate/clueDupCheckInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*保存查重规则*/
export async function saveLeadsDup(params) {
  return requestData(`${BASE_URL}/sys/conf/saveDupCheckInfo`, {
      method: 'post',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(params),
  });
}
