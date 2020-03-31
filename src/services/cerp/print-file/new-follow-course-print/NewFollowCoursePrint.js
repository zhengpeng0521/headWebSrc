var service = require("../../../common/common.js");

export async function GetCourseListByDay(params) {
	return service.generalSaasInterface('/cerpCoursePlan/query', params);
}
