import qs from 'qs';

//课程列表
export async function getClassTableList(params) {
    return requestData(`${BASE_URL}/cerpCoursePlan/query`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//当前日期
export async function getDate(params) {
    return requestData(`${BASE_URL}/sys/get`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//课程下拉
export async function getCourseList(params) {
    return requestData(`${BASE_URL}/cerpCourse/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//教室下拉
export async function getClassRoomList(params) {
    return requestData(`${BASE_URL}/cerpClsroom/summaryQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

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

//老师下拉
export async function getTeacherList(params) {
    return requestData(`${BASE_URL}/tenantUserController/summaryQueryFromNewTable`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}

//课程表时间段
export async function getConfKey(params) {
    return requestData(`${BASE_URL}/confController/get?confKey=CPTIMESET`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
    	body: qs.stringify(params),
    });
}
