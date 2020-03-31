import qs from 'qs';

export async function getNoticeList(params) {
  return requestData(`${BASE_URL}/noticeController/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getNoticeReadInfo(params) {
  return requestData(`${BASE_URL}/noticeController/queryStuRead`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
export async function deleteNotice(params) {
  return requestData(`${BASE_URL}/noticeController/deleteNotice`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getStudentList(params) {
  return requestData(`${BASE_URL}/noticeController/stuList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getParentsNoticeDetail(params) {
  return requestData(`${BASE_URL}/noticeController/getNotice`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
