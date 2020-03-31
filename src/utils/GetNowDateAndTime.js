import qs from 'qs';
import moment from 'moment';

//报表专用获取当前时间
window.GetNowDateAndTime = function(params){
    let obj = {
        startDate : moment().format('YYYY-MM-DD'),
        endDate : moment().format('YYYY-MM-DD'),
    };
    serviceRequest(`${BASE_URL}/crm/hq/sys/getTime`, {},
        function(ret) {
            //成功回调
            if(ret && ret.errorCode == '9000'){
                obj.startDate = ret.date;
                obj.endDate = ret.date;
            }
        },
        function(){
            //失败回调
        }
    );
    return obj;
}

/*其余获取系统当前时间接口*/
window.GetNowDateAndTimeCommon = function(params){
    let obj = {
        date : moment().format('YYYY-MM-DD'),
        nowTime : moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    serviceRequest(`${BASE_URL}/crm/hq/sys/getTime`, {},
        function(ret) {
            //成功回调
            if(ret && ret.errorCode == '9000'){
                obj.date = ret.date;
                obj.nowTime = ret.nowTime;
            }
        },
        function(){
            //失败回调
        }
    );
    return obj;
}
