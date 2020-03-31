import qs from 'qs';

//可以获取当前用户的ID
export async function GetUserBranch(params) {
    return requestData(`${BASE_URL}/tenantUserController/queryUserBranch`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取数据字典数据(跟进状态，一级来源)下拉列表内容*/
export async function GetDictMessage(params) {
    return requestData(`${BASE_URL}/dictController/get`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取机构下的员工下拉列表内容
export async function GetOrgStaffMessage(params) {
    return requestData(`${BASE_URL}/tenantUserController/summaryQueryFromNewTable`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取推荐人(家长)下拉列表内容
export async function GetRecommend(params) {
    return requestData(`${BASE_URL}/stu/parentSummary`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//孩子姓名，家长姓名，家长手机号onblur查重
export async function AddLeadsOnBlurCheckSame(params) {
    var requestPath = '';
    if(params && params.type == 'name'){
        requestPath = `${BASE_URL}/cluePoolController/leadsDupCheck`;
    }else{
        requestPath = `${BASE_URL}/cluePoolController/parentDupCheck`;
    }
    delete params.type;
    return requestData(requestPath, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//在全部leads中查询当前校区下这个名称的学员
export async function GetNameFormThisOrg(params) {
    return requestData(`${BASE_URL}/cluePoolController/queryClueStuList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//点击新增保存
export async function AddNewLeads(params) {
    return requestData(`${BASE_URL}/cluePoolController/addClueStu`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//查看是不是模板文件
export async function CheckWetherModalFile(params) {
    return requestData(`${BASE_URL}/leads/stuInfoImport/isModelFile`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//不是模板条件下第一步点击下一步进入第二步获取数据
export async function FirstFinishGetSourceData(params) {
    return requestData(`${BASE_URL}/leads/stuInfoImport/getSourceData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//第一步上传模板跳到第三步 或者 第二步选择完成进入第三步 获取预览表格
export async function LeadsImportPreview(params) {
    return requestData(`${BASE_URL}/leads/stuInfoImport/previewData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//批量导入提交
export async function LeadsImportSubmit(params) {
    return requestData(`${BASE_URL}/leads/stuInfoImport/importData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//轮询查看合同是否导入完毕
export async function PollingCheckImport(params) {
    return requestData(`${BASE_URL}/leads/stuInfoImport/isComplete`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

