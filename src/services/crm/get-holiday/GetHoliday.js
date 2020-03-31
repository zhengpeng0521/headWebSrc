import qs from 'qs';

/*获取请假列表数据*/
export async function GetHolidayList(params) {
    return requestData(`${BASE_URL}/stuVacationController/getList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*请假处理表单提交*/
export async function HolidayReqDeal(params) {
    return requestData(`${BASE_URL}/stuVacationController/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*批量删除请假申请*/
export async function DeleteReq(params) {
    return requestData(`${BASE_URL}/stuVacationController/delete`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
