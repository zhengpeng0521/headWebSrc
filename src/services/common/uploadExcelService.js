var service = require("./common.js");

//获取元数据
export async function getSourceData(params) {
  return service.generalSaasInterface('/stuInfoImport/getSourceData', params);
}

//保存数据
export async function uploadMappingData(params) {
  return service.generalSaasInterface('/stuInfoImport/importData', params);
}

//获取上传列表
export async function getUploadStuExcelList(params) {
  return service.generalSaasInterface('/stuInfoImport/uploadStuExcelList', params);
}

//是否是模板文件
export async function isModelFile(params) {
  return service.generalSaasInterface('/stuInfoImport/isModelFile', params);
}

//获取预览列表
export async function previewData(params) {
  return service.generalSaasInterface('/stuInfoImport/previewData', params);
}

//轮询查看学员是否导入完毕
export async function PollingCheckImport(params) {
  return service.generalSaasInterface('/stuInfoImport/isComplete', params);
}
