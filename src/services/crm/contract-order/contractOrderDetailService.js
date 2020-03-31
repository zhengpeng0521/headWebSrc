import qs from 'qs';

//合同详情
export async function getContractOrderDetail(params) {
    return requestData(`${BASE_URL}/crm/hq/crm/order/getOrderDetailById`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//合同编号查询得到单条记录
export async function getCurrentItem(params) {
    return requestData(`${BASE_URL}/orderController/list`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//删除合同订单
export async function deleteContractOrder(params) {
    return requestData(`${BASE_URL}/orderController/deleteOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//收款单
export async function getReceiptList(params) {
    return requestData(`${BASE_URL}/crm/hq/crm/order/payInfoList`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//赠课记录
export async function getSendClassList(params) {
    return requestData(`${BASE_URL}/crm/hq/stu/stucard/givePeriodList`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}
