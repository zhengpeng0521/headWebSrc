import qs from "qs"

/*获取收入统计表*/
export async function queryList(params) {
  return requestData(`${BASE_URL}/stat/tmk/report/income/query`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify(params)
  })
}
