import qs from 'qs';

//获取退款单列表
export async function GetTableList(params) {
    return requestData(`${BASE_URL}/crm/hq/refundOrderQuery/refundOrderList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//点击打印获取打印详情
export async function GetRefundFormPrintDetail(params) {
    return requestData(`${BASE_URL}/crm/hq/refundOrderQuery/getPrintRefundOrderById`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//点击审核获取当前项的详情
export async function GetRefundFormCheckDetail(params) {
    return requestData(`${BASE_URL}/crm/hq/refundOrderQuery/getRefundOrderById`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//审核退款通过
export async function RefundFormCheckModalPass(params) {
    return requestData(`${BASE_URL}/crm/hq/refundOrderWrite/acceptRefundOrder`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//审核退款驳回
export async function RefundFormCheckModalReject(params) {
    return requestData(`${BASE_URL}/crm/hq/refundOrderWrite/rejectRefundOrder`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}











