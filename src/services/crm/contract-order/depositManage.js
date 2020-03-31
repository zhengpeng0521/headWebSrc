import qs from 'qs';

//获取收款方式
export async function GetPaymentMethod(params) {
    return requestData(`${BASE_URL}/PaymentAcctController/list`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//校区选择onChange获取所属学员
export async function GetStuSummary(params) {
    return requestData(`${BASE_URL}/stu/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//订金管理列表查询
export async function GetTableList(params) {
    return requestData(`${BASE_URL}/purchaseDeposit/query`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//新建订金modal提交
export async function CreateOrUpdateModalSubmit(params) {
    return requestData(`${BASE_URL}/purchaseDeposit/create`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//退款
export async function Refund(params) {
    return requestData(`${BASE_URL}/purchaseDeposit/back`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//删除
export async function Remove(params) {
    return requestData(`${BASE_URL}/purchaseDeposit/delete`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}
