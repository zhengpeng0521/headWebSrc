import qs from 'qs';

export async function showConsultationList(params) {
  return requestData(`${BASE_URL}/classMgr/classMgrList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
export async function queryConsultationList(params) {
  return requestData(`${BASE_URL}/classMgr/classMgrList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

