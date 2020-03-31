import qs from "qs"

/*tmk报表合计*/
export async function queryTotal(params) {
  return requestData(`${BASE_URL}/stat/tmk/report/tmkReport/countQuery`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify(params)
  })
}

/*tmk报表*/
export async function queryList(params) {
  return requestData(`${BASE_URL}/stat/tmk/report/tmkReport/query`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify(params)
  })
}

/*tmk下拉*/
export async function queryTmkList(params) {
  return requestData(`${BASE_URL}/stat/tmk/tmker/summaryQuery`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify(params)
  })
}
