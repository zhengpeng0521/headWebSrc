import qs from 'qs';

/*获取全部列表数据*/
export async function GetTableList(params) {
    return requestData(`${BASE_URL}/crm/hq/ClueStudentQueryService/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//名单分配
export async function distribute(params) {
    return requestData(`${BASE_URL}/crm/hq/ClueStudentService/distribute`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//分配校区列表
export async function orgList(params) {
    return requestData(`${BASE_URL}/crm/hq/org/list`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//一级来源列表

export async function GetStuSource(params) {
    return requestData(`${BASE_URL}/crm/hq/dictController/detail`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//查看是不是模板文件
export async function CheckWetherModalFile(params) {
    return requestData(`${BASE_URL}/crm/hq/stuInfoImport/isModelFile`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//不是模板条件下第一步点击下一步进入第二步获取数据
export async function FirstFinishGetSourceData(params) {
    return requestData(`${BASE_URL}/crm/hq/stuInfoImport/getSourceData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//第一步上传模板跳到第三步 或者 第二步选择完成进入第三步 获取预览表格
export async function LeadsImportPreview(params) {
    return requestData(`${BASE_URL}/crm/hq/stuInfoImport/previewData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//批量导入提交
export async function LeadsImportSubmit(params) {
    return requestData(`${BASE_URL}/crm/hq/stuInfoImport/importData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//轮询查看合同是否导入完毕
export async function PollingCheckImport(params) {
    return requestData(`${BASE_URL}/crm/hq/stuInfoImport/isComplete`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
