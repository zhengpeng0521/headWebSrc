import qs from 'qs';

export function generalSaasInterface(link, params, header, serviceSource={/*保留参数*/}, additionalParam={/*保留参数*/}) {
	return requestData(BASE_URL + link, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
            ...header,
		},
		body: qs.stringify(params),
	});
}
