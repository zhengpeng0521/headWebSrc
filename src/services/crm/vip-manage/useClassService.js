import qs from 'qs';

//得到会员卡列表
export async function getUseClassList(params) {
    return requestData(`${BASE_URL}/stuCardInfo/queryRepealCourseInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//得到拥有会员卡 的学员下拉列表
export async function getStuIdList(params) {
    return requestData(`${BASE_URL}/stuCardInfo/getStuInfo`, {
        method : 'post',
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded",
        },
        body : qs.stringify(params),
    });
}

//得到拥有课时的 课程列表
export async function getCourseList(params) {
    return requestData(`${BASE_URL}/stuCardInfo/getBaseInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//确认新增手动消课
export async function confirmAddUseClass(params) {
    return requestData(`${BASE_URL}/stuCard/createRepealCourse`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
