var service = require("../../common/common.js");

/*获取banner图*/
export async function GetBanner(params) {
    return service.generalSaasInterface('/marketingHome/bannerList', params);
}

/*获取统计报表数据*/
export async function GetReportData(params) {
    return service.generalSaasInterface('/marketingHome/newTemplateApplyNum', params);
}

/*热门招生方案*/
export async function GetHotMethod(params) {
    return service.generalSaasInterface('/marketingHome/hotRecruitStuSchemaList', params);
}

/*免费申请试用招生方案*/
export async function GetFreeTrailMethod(params) {
    return service.generalSaasInterface('/marketingHome/freeApplyRecruSchema', params);
}

/*机构使用案例*/
export async function GetOrgUseing(params) {
    return service.generalSaasInterface('/marketingHome/sucCaseList', params);
}

/*获取营销资讯*/
export async function GetScrmMessage(params) {
    return service.generalSaasInterface('/marketingHome/marketingInfoList', params);
}
