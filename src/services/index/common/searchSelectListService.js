import qs from 'qs';

//校区查询
export async function getCampus(params) {
  return requestData(`${BASE_URL}/tenantOrgController/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//课程查询
export async function getCourses(params) {
  return requestData(`${BASE_URL}/courseController/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//老师查询
export async function getTeachers(params) {
  return requestData(`${BASE_URL}/tenantUserController/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//班级查询
export async function getClasses(params) {
  return requestData(`${BASE_URL}/classesService/summaryQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//学员查询
export async function getStudents(params) {
  return requestData(`${BASE_URL}/stu/stusOfUser`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//教材列表
export async function getMaterial(params) {
  return requestData(`${BASE_URL}/teachingAidController/queryTeachingAid`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//产品列表
export async function getProduct(params) {
  return requestData(`${BASE_URL}/productController/getProductList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//字典列表
export async function getDicList(params) {
  return requestData(`${BASE_URL}/dictController/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//数据字典下拉列表
export async function getDicSelects(params) {
  return requestData(`${BASE_URL}/dictController/get`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//保存字典数据
export async function save(params) {
  return requestData(`${BASE_URL}/dictController/save`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取销售列表
export async function getSalesList(params) {
  return requestData(`${BASE_URL}/tenantUserController/summaryQueryFromNewTable`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取支付类型列表
export async function getPayList(params) {
    return requestData(`${BASE_URL}/PaymentAcctController/list`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

////上传EXCEL表格
//export async function uploadExcel(params) {
//  return requestData(`${BASE_URL}/upload/uploadExcel`, {
//    method: 'post',
//    headers: {
//        "Content-Type": "application/x-www-form-urlencoded",
//    },
//    body: qs.stringify(params),
//  });
//}
//

//机构列表
export async function tenantOrgList(params) {
    return requestData(`${BASE_URL}/tenantOrgController/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}
