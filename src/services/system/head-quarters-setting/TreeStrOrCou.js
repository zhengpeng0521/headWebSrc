import qs from 'qs';

/*获取组织架构数据*/
export async function GetTreeStuOrCou(params) {
    let path = params.treeType == 'structure' ? 'dept/departQuery' : params.treeType == 'courseware' ? 'coursewareCategory/query' : '';
    return requestData(`${BASE_URL}/crm/hq/${path}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增编辑组织架构提交*/
export async function AddOrEditTreeModalSubmit(params) {
    let path = params.treeType == 'structure' ? 'dept' : params.treeType == 'courseware' ? 'coursewareCategory' : '';
    //将'create_son'替换为'create',因为请求的都是'/xxx/xxx/create'
    let operationType = params.addOrEditTreeModalType == 'create_son' ? 'create' : params.addOrEditTreeModalType;
    delete params.treeType;
    delete params.addOrEditTreeModalType;
    return requestData(`${BASE_URL}/crm/hq/${path}/${operationType}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
