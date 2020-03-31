var service = require("../../common/common.js");
import qs from 'qs';

//获取当前日期
export async function GetNowDateAndTime(params) {
	return service.generalSaasInterface('/sys/get', params);
}

//获取排课列表数据
export async function GetCourseList(params) {
    return requestData(`${BASE_URL}/crm/hq/cerp/cp/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//操作栏点击更改状态操作(这里只有删除)
export async function OperationChangeStatus(params) {
	return service.generalSaasInterface('/cerpCoursePlan/delete', params);
}

//点击编辑主排课信息查询
export async function GetMainArrangeCourseMessage(params) {
	return service.generalSaasInterface('/cerpCoursePlan/mainQuery', params);
}

//获取主教和助教信息
export async function GetTeacher(params) {
	return service.generalSaasInterface('/tenantUserController/summaryQuery', params);
}

//获取教室信息
export async function GetClassRoom(params) {
	return service.generalSaasInterface('/cerpClsroom/summaryQuery', params);
}

//主排课编辑modal提交
export async function CourseEditModalSubmit(params) {
	return service.generalSaasInterface('/cerpCoursePlan/update', params);
}
