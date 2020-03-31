import qs from 'qs';

//学员下拉
export async function getStudentList(params) {
    return requestData(`${BASE_URL}/stu/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//学员下拉
export async function getSubStudentListByCrm(params) {
    return requestData(`${BASE_URL}/stu/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//班级下拉
export async function getClassList(params) {
    return requestData(`${BASE_URL}/classGrade/classGradeSummary`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//学员下拉
export async function getSubStudentListByLeader(params) {
    return requestData(`${BASE_URL}/cluePoolController/allLeadsSummary`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//约课
export async function confirmOrderClass(params) {
    return requestData(`${BASE_URL}/cerpCpbook/stuCreate`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//预约班级
export async function confirmOrderClassByAll(params) {
    return requestData(`${BASE_URL}/clsCpbook/create`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//预约补课
export async function confirmOrderMissClass(params) {
    return requestData(`${BASE_URL}/cerpCpbook/stuMulCreate`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//预约试听
export async function confirmSubscribeClass(params) {
    return requestData(`${BASE_URL}/subscribeAuditionController/create`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//取消预约试听
export async function cancelTryOrderClass(params) {
    return requestData(`${BASE_URL}/subscribeAuditionController/updateStatus`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//得到学员明细
export async function getDetailList(params) {
    return requestData(`${BASE_URL}/cerpCoursePlan/detailQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//得到批量约课的课程
export async function getBatchCourseList(params) {
    return requestData(`${BASE_URL}/cerpCoursePlan/query`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//得到会员卡详情
export async function getVipDetailInfo(params) {
    return requestData(`${BASE_URL}/stuCardInfo/cardSummaryPeriodByStuId`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//当前日期
export async function getCurrentDate(params) {
    return requestData(`${BASE_URL}/sys/get`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//改变学员状态
export async function changeStudentStatus(params) {
    return requestData(`${BASE_URL}/cerpCpbook/stuSign`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//回访确认
export async function isCheckUpdate(params) {
    return requestData(`${BASE_URL}/cerpCpbook/isCheckUpdate`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//排队转上课
export async function turnToClass(params) {
    return requestData(`${BASE_URL}/cerpCpbook/inlineChange`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//得到班级学员 ( 批量约课 )
export async function getClassStuList(params) {
    return requestData(`${BASE_URL}/classGrade/queryClassStuList`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//确认批量预约班级
export async function confirmBatchOrderClassByAll(params) {
    return requestData(`${BASE_URL}/clsCpbook/batchCreate`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

