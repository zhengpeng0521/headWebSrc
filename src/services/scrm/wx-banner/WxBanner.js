var service = require("../../common/common.js");

//得到活动列表
export async function GetBannerList(params) {
    return service.generalSaasInterface('/orgConfigController/queryBanner', params);
}

//modal课程外链下拉列表
export async function GetCourseSelectContent(params) {
    return service.generalSaasInterface('/orgCourseController/queryCourse', params);
}

//modal活动外链下拉列表
export async function GetActivitySelectContent(params) {
    return service.generalSaasInterface('/micNetActivityController/getActivityList', params);
}

//banner改变状态(显示，隐藏，删除)
export async function ChangeWxBannerStatus(params) {
    return service.generalSaasInterface('/orgConfigController/changeBanner', params);
}

//刚进入新增表单和表单选择校区onChange事件发生时查看当前校区banner数量有没有到限制数(5个)
export async function CheckOrgBannersNum(params) {
    return service.generalSaasInterface('/orgConfigController/queryOrgNumBanner', params);
}

//新增编辑banner
export async function AddOrEditBanner(params) {
    return service.generalSaasInterface('/orgConfigController/createBanner', params);
}
