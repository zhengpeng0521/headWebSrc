import qs from 'qs';

export async function GetClassRoomList(params) {
    return requestData(`${BASE_URL}/classRoomController/queryClassRoom`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增教室*/
export async function CreateClassRoom(params) {
    return requestData(`${BASE_URL}/classRoomController/addClassRoom`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*编辑教室*/
export async function UpdateClassRoom(params) {
    return requestData(`${BASE_URL}/classRoomController/updateClassRoom`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*教室摘要信息*/
export async function classroomComList(params) {
    return requestData(`${BASE_URL}/classRoomController/summaryQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*删除教室*/
export async function DeleteClassroom(params) {
    return requestData(`${BASE_URL}/classRoomController/deleteClassRoom`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

