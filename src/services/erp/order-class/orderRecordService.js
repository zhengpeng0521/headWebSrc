import qs from 'qs';

//当前日期
export async function getDate(params) {
    return requestData(`${BASE_URL}/crm/hq/sys/getTime`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//得到约课记录
export async function getOrderRecordList(params) {
    return requestData(`${BASE_URL}/crm/hq/cerp/cpbook/query`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//改变状态
export async function updateStatus(params) {
    return requestData(`${BASE_URL}/cerpCpbook/stuSignCancel`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//修改固定位
export async function confirmUpdateFix(params) {
    return requestData(`${BASE_URL}/cerpCpbook/updateFix`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}


export async function getCourseList(params) {
    return requestData(`${BASE_URL}/cerpCourse/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}


export async function getClassRoomList(params) {
    return requestData(`${BASE_URL}/cerpClsroom/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

export async function getTeacherList(params) {
    return requestData(`${BASE_URL}/tenantUserController/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}
