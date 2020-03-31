import qs from 'qs';

/*获取当前租户申请状态*/
export async function DomainGetApplyStatus(params) {
    return requestData(`${BASE_URL}/crm/hq/sys/org/queryStatus`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*第一步申请使用点击提交*/
export async function DomainFirstStepApplyForSubmit(params) {
    return requestData(`${BASE_URL}/crm/hq/sys/org/applyHost`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*第四步保存设置事件*/
export async function DomainForthStepSetSubmit(params) {
    return requestData(`${BASE_URL}/crm/hq/sys/org/loginPageSet`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
