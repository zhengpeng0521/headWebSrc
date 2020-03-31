import qs from 'qs';

//得到课程列表
export async function getCourseList(params) {
  return requestData(`${BASE_URL}/stuCourse/noclass`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//获得班级下拉列表
export async function getClassOptionList(params) {
  return requestData(`${BASE_URL}/stuCourse/classesOfCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//确认报班
export async function confirmToClass(params) {
  return requestData(`${BASE_URL}/stuClassController/devideClass`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};
