import qs from "qs"

/*获取退费情况表*/
export async function queryList(params) {
  return requestData(`${BASE_URL}/stat/tmk/report/refundsInfo/query`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify(params)
  })
}
