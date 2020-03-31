import qs from 'qs';

//获取校区信息左侧组织架构
export async function GetLeftCoursewareList(params) {
    return requestData(`${BASE_URL}/crm/hq/coursewareCategory/catTree`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取课件列表数据
export async function GetCoursewareList(params) {
    return requestData(`${BASE_URL}/crm/hq/courseware/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取课件详情(有几张图片)
export async function RightTableOpenDetail(params) {
    return requestData(`${BASE_URL}/crm/hq/courseware/getImgTotal`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//如果详情图片多余0张，则获取第一张做默认显示
export async function GetDetailImg(params) {
    return requestData(`${BASE_URL}/crm/hq/courseware/detail`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//课件删除
export async function CoursewareDelete(params) {
    return requestData(`${BASE_URL}/crm/hq/courseware/delete`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//发布课件提交
export async function ReleaseCoursewareModalSubmit(params) {
    return requestData(`${BASE_URL}/crm/hq/courseware/create`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取课件详情
export async function CoursewareDetailInfo(params) {
    return requestData(`${BASE_URL}/crm/hq/courseware/detailInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//课件编辑提交
export async function CoursewareUpdate(params) {
    return requestData(`${BASE_URL}/crm/hq/courseware/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取课件分组列表
export async function getGroupList(params) {
    return requestData(`${BASE_URL}/crm/hq/courseGroup/orgList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//新增/修改/删除 校区可见分组
export async function changeGroupName(params) {
    return requestData(`${BASE_URL}/crm/hq/courseGroup/change`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//复制分组
export async function copyGroup(params) {
    return requestData(`${BASE_URL}/crm/hq/courseGroup/copyGroupInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//保存分组信息
export async function saveGroupInfo(params) {
    return requestData(`${BASE_URL}/crm/hq/courseGroup/addOrg`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取阿里云token
export async function getAliToken(params) {
    return requestData(`${BASE_URL}/uploadFile/getTstToken`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//校验
export async function uploadCourse(params) {
    return requestData(`${BASE_URL}/crm/hq/uploadCheckInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//校验
export async function uploadPdf(params) {
    return requestData(`${BASE_URL}/crm/hq/uploadCourseware`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
