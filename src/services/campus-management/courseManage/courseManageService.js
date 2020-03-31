import qs from 'qs';

//得到课程列表
export async function getCourseList(params) {
  return requestData(`${BASE_URL}/crm/hq/cerpCourse/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//删除课程
export async function deleteCourse(params) {
  return requestData(`${BASE_URL}/crm/hq/cerpCourse/statusUpdate`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认新增课程
export async function confirmCreateForm(params) {
  return requestData(`${BASE_URL}/crm/hq/cerpCourse/create`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
//課程詳情
export async function getCourseDetail(params) {
  return requestData(`${BASE_URL}/crm/hq/cerpCourse/queryById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//修改得到单个课程信息  编辑
export async function CourseInfoUpdate(params) {
  return requestData(`${BASE_URL}/crm/hq/cerpCourse/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//查询课系列表
export async function CourseOrderSystemOpen(params) {
    return requestData(`${BASE_URL}/crm/hq/cerp/coursegroup/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//新增课系
export async function CourseOrderSystemAdd(params) {
    return requestData(`${BASE_URL}/crm/hq/cerp/coursegroup/create`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//编辑课系
export async function CourseOrderSystemEdit(params) {
    return requestData(`${BASE_URL}/crm/hq/cerp/coursegroup/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//删除课系
export async function CourseOrderSystemDelete(params) {
    return requestData(`${BASE_URL}/crm/hq/cerp/coursegroup/delete`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//主題新增
export async function CourseThemeCreate(params) {
    return requestData(`${BASE_URL}/crm/hq/courseTheme/create`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//主題刪除
export async function CourseThemeUpdateStatus(params) {
    return requestData(`${BASE_URL}/crm/hq/courseTheme/updateStatus`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//主題列表查詢
export async function CourseThemeQuery(params) {
    return requestData(`${BASE_URL}/crm/hq/courseTheme/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//主題編輯
export async function CourseThemeUpdate(params) {
    return requestData(`${BASE_URL}/crm/hq/courseTheme/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}



