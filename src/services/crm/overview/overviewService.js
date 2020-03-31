import qs from 'qs';

/*获取当前日期与时间*/
export async function GetNowTime(params) {
	return requestData(`${BASE_URL}/sys/get`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
	});
}

/*获取所有人下拉列表*/
export async function getOverviewData(params) {
    return requestData(`${BASE_URL}/tenantUserController/queryUserBranch`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*上方数据看板数据*/
export async function GetTopDataBoard(params) {
    return requestData(`${BASE_URL}/crmHome/dataOverView`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*右方当日数据看板数据*/
export async function GetRightDataBoard(params) {
    return requestData(`${BASE_URL}/crmHome/todayData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取学员信息chart数据*/
export async function GetStuChartMessage(params) {
    return requestData(`${BASE_URL}/crmHome/stuMonthDataInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取学员信息table数据*/
export async function GetStuTableMessage(params) {
    return requestData(`${BASE_URL}/crmHome/stuDataInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取销售订单数据(包括chart和calender)*/
export async function GetSaleOrderChartData(params) {
    return requestData(`${BASE_URL}/crmHome/monthOrderInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取漏斗图数据*/
export async function GetFunnelDate(params) {
    return requestData(`${BASE_URL}/crmHome/salesFunnel`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取用户信息*/
export async function GetUserBranch(params) {
    return requestData(`${BASE_URL}/tenantUserController/queryUserBranch`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


