import qs from 'qs';

//账户余额，提现金额
export async function showBalance(params) {
    return requestData(`${BASE_URL}/sys/payment/queryPayAccountMsg`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//账户流水
export async function showAccountFlow(params) {
    return requestData(`${BASE_URL}/sys/payment/queryPayHistoryAccountList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//提现记录
export async function showWithdrawalsRecord(params) {
    return requestData(`${BASE_URL}/sys/payment/queryPaySetRecordList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//支付明细 退款明细
export async function showPayAndRefundDetails(params) {
    return requestData(`${BASE_URL}/sys/payment/queryPayOrderMsgList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//总收入及收入几笔
export async function showIncomeNums(params) {
	return requestData(`${BASE_URL}/sys/payment/queryPayOrderTotal`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
	})
}

//提现申请
export async function checkApplication(params) {
    return requestData(`${BASE_URL}/sys/payment/queryPayTelBankMsg`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//提现申请 提交
export async function addSetSubmit(params) {
    return requestData(`${BASE_URL}/sys/payment/addSett`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取验证码
export async function getVerificationCode(params) {
    return requestData(`${BASE_URL}/crm/hq/sms/genVerifyCode`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
