import qs from 'qs';

export async function query(params) {

  return requestData(`${BASE_URL}/classesService/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getSearchClassesList(params) {

  return requestData(`${BASE_URL}/classesManagement/getSearchClassesList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function delect(params) {

  return requestData(`${BASE_URL}/classesService/delete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function create(params) {

  return requestData(`${BASE_URL}/classesService/create`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}



