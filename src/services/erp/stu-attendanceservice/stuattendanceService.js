import qs from 'qs';


export async function getCheckQuery(params) {
    let zj_type = params.zj_type || undefined;
    let url = `${BASE_URL}/cerpCpbook/`;
    switch(zj_type){
        case 'all' : url += 'checkQuery';break;
        case 'my' : url += 'myCheckQuery';break;
    }
    delete params.zj_type;
    return requestData(url, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}



export async function getDate(params) {

    return requestData(`${BASE_URL}/sys/get`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

///cerpCoursePlan/detailQuery
//获取考勤信息接口
export async function getsignQuery(params) {

    return requestData(`${BASE_URL}/cerpCpbook/signQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


export async function getbatchStuSign(params) {
    return requestData(`${BASE_URL}/cerpCpbook/batchStuSign`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//打开补打小票modal并获取相关信息
export async function OpenPrintSmallTicketModal(params) {
    return requestData(`${BASE_URL}/cerpCoursePlan/printQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

