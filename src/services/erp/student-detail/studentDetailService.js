import qs from 'qs';

//得到单个学员信息
export async function getStudentDetailInfo(params) {
  return requestData(`${BASE_URL}/stu/getSingleStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//得到家长列表
export async function getParentInfo(params) {
  return requestData(`${BASE_URL}/stu/getStuParentList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到账户信息
export async function getAccountInfoList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/stuAccInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到课时信息
export async function getClassHourInfoList(params) {
  return requestData(`${BASE_URL}/stuCardInfo/stuPeriodInfoById`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到跟进记录信息
export async function getFollowUpRecordList(params) {
  return requestData(`${BASE_URL}/commRecordService/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//删除跟进记录
export async function deleteFollowUpRecord(params) {
  return requestData(`${BASE_URL}/commRecordService/delete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}


//得到合同订单
export async function getContractOrderList(params) {
  return requestData(`${BASE_URL}/orderController/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到退款列表
export async function getRefundRecordInfo(params) {
  return requestData(`${BASE_URL}/refundOrderQuery/refundOrderList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到报读信息
export async function getClassInfo(params) {
  return requestData(`${BASE_URL}/stuCourse/stuCourseQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认停课
export async function confirmEndCourse(params) {
  return requestData(`${BASE_URL}/stuCourse/pauseCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
//复原课程
export async function recoverCourse(params) {
  return requestData(`${BASE_URL}/stuCourse/backPauseCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
//结束课程
export async function endCourse(params) {
  return requestData(`${BASE_URL}/stuCourse/endCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认分班
export async function confirmWaitForCourse(params) {
  return requestData(`${BASE_URL}/stuClassController/stuDevideClass`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到分班列表
export async function getWaitForCourseList(params) {
  return requestData(`${BASE_URL}/stuCourse/classesOfCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到作品信息列表
export async function getStudentWorksList(params) {
  return requestData(`${BASE_URL}/stuWorkController/listWorks`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//删除作品
export async function deleteWork(params) {
  return requestData(`${BASE_URL}/stuWorkController/stuWorkDel`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

export async function getCommunicationRecords(params) {
  return requestData(`${BASE_URL}/commRecordService/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//新增沟通记录
export async function confirmAddCommunicationRecord(params) {
  return requestData(`${BASE_URL}/commRecordService/create`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//修改沟通记录
export async function confirmUpdateCommunicationRecord(params) {
  return requestData(`${BASE_URL}/commRecordService/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//得到签到记录列表
export async function getSignRecordList(params) {
  return requestData(`${BASE_URL}/signController/stuSignQuery`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

//撤销签到记录
export async function deleteSignRecord(params) {
  return requestData(`${BASE_URL}/signController/revokeSign`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
};

