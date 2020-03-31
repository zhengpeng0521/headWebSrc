var service = require("../../../common/common.js");

//获取活动列表
export async function getActivity(params) {
    return service.generalSaasInterface('/zsb/market/queryList', params);
}

//获取域名
export async function getDataInit(params) {
    return service.generalSaasInterface('/zsb/market/dataInit', params);
}

//删除单条活动
export async function delectActivityItem(params) {
    return service.generalSaasInterface('/zsb/market/updateStatus', params);
}

//删除单条活动
export async function batchDelect(params) {
    return service.generalSaasInterface('/zsb/market/batch/updateStatus', params);
}

//表单候选项
export async function defaultFormConfig(params) {
    return service.generalSaasInterface('/zsb/market/defaultFormConfig', params);
}

//获取地点列表
export async function getdictkey(params) {
    return service.generalSaasInterface('/dictController/get', params);
}

//获取员工列表
export async function summaryQuery(params) {
    return service.generalSaasInterface('/tenantUserController/summaryQuery', params);
}

//创建活动
export async function createOrUpdate(params) {
    return service.generalSaasInterface('/zsb/market/createOrUpdate', params);
}

//查询单个活动
export async function queryDetail(params) {
    return service.generalSaasInterface('/zsb/market/queryDetail', params);
}

//报表头部数据
export async function overviewDataQuery(params) {
    return service.generalSaasInterface('/zsb/market/overviewDataQuery', params);
}

//报表活动访问量数据
export async function viewDataByDaysQuery(params) {
    return service.generalSaasInterface('/zsb/market/viewDataByDaysQuery', params);
}

//报表活动有效用户数据 (按天)
export async function countDataByDaysQuery(params) {
    return service.generalSaasInterface('/zsb/market/countDataByDaysQuery', params);
}

//报表活动有效用户数据 (按照釆单员维度)
export async function countDataByDaysOnMemberQuery(params) {
    return service.generalSaasInterface('/zsb/market/countDataByDaysOnMemberQuery', params);
}

//报表活动有效用户数据 (按照釆单员维度)
export async function getFormDataQuery(params) {
    return service.generalSaasInterface('/zsb/market/formDataQuery', params);
}

//获取二维码数据
export async function getQrLink(params) {
    return service.generalSaasInterface('/zsb/market/queryMembers', params);
}

//导出用户数据excel
export async function exportUserFormData(params) {
    return service.generalSaasInterface('/zsb/market/exportFormData', params);
}













