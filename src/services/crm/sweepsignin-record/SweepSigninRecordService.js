/**
 * Created by zhaosi on 2017/5/8.
 */
import qs from 'qs';

export async function listenrecordsList(params) {
   // return requestData(`${BASE_URL}/signController/stuSignQuery`, {

         return requestData(`${BASE_URL}/crmStuSignInfo/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });


         
}

 //撤销签到
 export async function  repealSignrecode(params) {
     return requestData(`${BASE_URL}/crmStuSignInfo/updateStatus`, {
         method: 'post',
         headers: {
             "Content-Type": "application/x-www-form-urlencoded",
         },
         body: qs.stringify(params),
     });
 }
