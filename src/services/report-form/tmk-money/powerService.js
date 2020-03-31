import qs from "qs"

/*获取权责收入表*/
export async function queryList(params) {
  return requestData(`${BASE_URL}/stat/tmk/accrual/query`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify(params)
  })
}
