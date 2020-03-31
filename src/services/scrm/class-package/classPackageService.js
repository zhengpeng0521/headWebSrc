import qs from 'qs';

//得到课时包列表
export async function getClassPackageList(params) {
    return requestData(`${BASE_URL}/crm/hq/productController/getProductList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//删除课时包
export async function deleteClassPackage(params) {
    return requestData(`${BASE_URL}/crm/hq/productController/deleteProduct`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获得课程下拉列表
export async function getCourseOptList(params) {
    return requestData(`${BASE_URL}/crm/hq/productController/getPublicCourse`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//得到单个课时包信息
export async function getClassPackageInfo(params) {
    return requestData(`${BASE_URL}/crm/hq/productController/getSingleProduct`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//确认新增课时包
export async function confirmAddClassPackage(params) {
    return requestData(`${BASE_URL}/crm/hq/productController/createProduct`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
