import qs from 'qs';

//销售订单列表
export async function getContractOrderList( params ) {
    return requestData(`${BASE_URL}/crm/hq/crm/order/queryOrderList`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//审核通过
export async function passOrder(params) {
    return requestData(`${BASE_URL}/crm/hq/crm/order/passOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//审核不通过
export async function rejectOrder(params) {
    return requestData(`${BASE_URL}/crm/hq/crm/order/rejectOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}
