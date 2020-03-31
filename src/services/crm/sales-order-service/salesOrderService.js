import qs from 'qs';

//销售订单列表
export async function orderList(params) {
    return requestData(`${BASE_URL}/orderController/list`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//订单支付
export async function payOrder(params) {
    return requestData(`${BASE_URL}/orderController/payOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//创建订单
export async function createClassOrder(params) {
    return requestData(`${BASE_URL}/orderController/addClassOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//创建订单
export async function createMoneyOrder(params) {
    return requestData(`${BASE_URL}/orderController/addMoneyOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//获取订单数据
export async function getOrder(params) {
    return requestData(`${BASE_URL}/orderController/getOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//删除订单
export async function deleteOrder(params) {
    return requestData(`${BASE_URL}/orderController/deleteOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//打印订单
export async function printOrder(params) {
    return requestData(`${BASE_URL}/orderController/orderPrint`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//驳回订单
export async function rejectOrder(params) {
    return requestData(`${BASE_URL}/orderController/rejectOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//审核通过订单
export async function throughOrder(params) {
    return requestData(`${BASE_URL}/orderController/passOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//更新充值订单
export async function updateMoneyOrder(params) {
    return requestData(`${BASE_URL}/orderController/updateMoneyOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//更新课程包订单
export async function updateClassOrder(params) {
    return requestData(`${BASE_URL}/orderController/updateClassOrder`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
    });
}

//获取账户余额
export async function getAccountBalance(params) {
  return requestData(`${BASE_URL}/stuCardInfo/stuAccInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取已经支付的方式
export async function getPayWayList(params) {
  return requestData(`${BASE_URL}/orderController/getPayInfo`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
