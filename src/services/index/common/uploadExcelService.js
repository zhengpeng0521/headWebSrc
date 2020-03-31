import qs from 'qs';

//获取元数据
export async function getSourceData(params) {
  return requestData(`${BASE_URL}/stuInfoImport/getSourceData`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//保存数据
export async function uploadMappingData(params) {
	return requestData(`${BASE_URL}/stuInfoImport/importData`, {
		method: 'post',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(params),
  	});
}

//获取上传列表
export async function getUploadStuExcelList(params) {
  return requestData(`${BASE_URL}/stuInfoImport/uploadStuExcelList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//是否是模板文件
export async function isModelFile(params) {
  return requestData(`${BASE_URL}/stuInfoImport/isModelFile`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取预览列表
export async function previewData(params) {
  return requestData(`${BASE_URL}/stuInfoImport/previewData`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//轮询查看学员是否导入完毕
export async function PollingCheckImport(params) {
  return requestData(`${BASE_URL}/stuInfoImport/isComplete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
