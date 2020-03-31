import qs from 'qs';

export async function listenrecordsList(params) {
	return requestData(`${BASE_URL}/signController/stuSignQuery`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
	});
}

//撤销签到
export async function repealSignrecode(params) {
 	return requestData(`${BASE_URL}/signController/revokeSign`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
      });
}

//列表点击打印
export async function SignRecordTableItemPrint(params) {
 	return requestData(`${BASE_URL}/signInfoPrint/info`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
      });
}
