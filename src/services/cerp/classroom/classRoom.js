
var service = require("../../common/common.js");

export async function GetClassRoomList(params) {
    return service.generalSaasInterface('/cerpClsroom/cerpClsroom', params);
}

/*新增教室*/
export async function CreateClassRoom(params) {
    return service.generalSaasInterface('/cerpClsroom/create', params);
}

/*编辑教室*/
export async function UpdateClassRoom(params) {
    return service.generalSaasInterface('/cerpClsroom/update', params);
}

/*教室摘要信息*/
export async function classroomDetail(params) {
    return service.generalSaasInterface('/cerpClsroom/queryById', params);
}

/*删除教室*/
export async function DeleteClassroom(params) {
    return service.generalSaasInterface('/cerpClsroom/statusUpdate', params);
}
