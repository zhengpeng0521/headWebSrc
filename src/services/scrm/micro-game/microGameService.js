var service = require("../../common/common.js");
import qs from 'qs';

/*查询微游戏列表*/
export async function queryDataSource(params) {
    return service.generalSaasInterface('/pmgame/query/tenantGame/list', params);
}

/*查询微游戏推荐*/
export async function otherGameList(params) {
    return service.generalSaasInterface('/pmgame/query/tenantGame/micpmGameChoose', params);
}

//获取所有标签列表
export async function queryGameType(params) {
    return service.generalSaasInterface('/productLabel/alllabel/query', params);
}

/*查询新版编辑器模板信息*/
export async function queryThemeInst(params) {
    return service.generalSaasInterface('/h5c/queryThemeInstHq', params);
}
/*创建新版编辑器实例*/
export async function createThemeInst(params) {
    return service.generalSaasInterface('/h5c/createThemeInstHq', params);
}
/*获取域名*/
export async function getDomain(params) {
    return service.generalSaasInterface('/getUrl', params);
}
