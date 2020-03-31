var service = require("../../../common/common.js");

//传单列表
export async function getLeafletsList(params) {
    return service.generalSaasInterface('/offlineLeaflet/orgLeafletModelList', params);
}

export async function getInstMsg(params) {
    return service.generalSaasInterface('/offlineLeaflet/getInstMsg', params);
}

//获取活动列表
export async function getActivityList(params) {
    return service.generalSaasInterface('/offlineLeaflet/markList', params);
}

//获取市场人员
export async function getUserLink(params) {
    return service.generalSaasInterface('/zsb/market/queryMembers', params);
}

//获取域名
export async function getDataInit(params) {
    return service.generalSaasInterface('/zsb/market/dataInit', params);
}

//获取市场人员
export async function saveData(params) {
    return service.generalSaasInterface('/offlineLeaflet/orgCreateLeaflet', params);
}

//获取线下传单列表
export async function getInstLeafletsList(params) {
    return service.generalSaasInterface('/offlineLeaflet/orgInstList', params);
}

//获取线下传单实例删除和上下架
export async function getInstDelect(params) {
    return service.generalSaasInterface('/offlineLeaflet/instUpdateStatus', params);
}

/*图片上传*/
export async function uploadImageMethods(params) {

    let value = undefined;

    return new Promise(function (resolve, reject) {

        var formData = new FormData();

        formData.append("file", params);

        var request = new XMLHttpRequest();

        request.open("post", `${BASE_URL}/uploadController/upload`);

        request.onload = function (oEvent) {

            if (oEvent.currentTarget.status === 200) {

                value = resolve(JSON.parse(oEvent.currentTarget.response));

            } else {
                reject(new Error('图片上传失败'))
            }
        }

        request.send(formData);
    }).catch(function (err) {
        _(err);
    })
}
