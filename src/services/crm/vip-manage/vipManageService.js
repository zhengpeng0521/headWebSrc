import qs from 'qs';

//得到会员卡列表
export async function getVipList( params ) {
    return requestData(`${BASE_URL}/crm/hq/stu/stucard/stuCardListByCon`, {
        method : 'post',
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded",
        },
        body : qs.stringify( params ),
    });
}
