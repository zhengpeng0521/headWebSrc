
function charge( DateType, Number ){
    if( DateType < Number ){
        return '0' + DateType;
    }else{
        return DateType;
    }
};
//时间格式化
export function FormatDate( strTime , flag){
    let date = new Date( strTime );
    let Months, Day, Hours, Minutes, Seconds;
    Months  = charge(date.getMonth()+1,10);
    Day     = charge(date.getDate(),10);
    Hours   = charge(date.getHours(),10);
    Minutes = charge(date.getMinutes(),10);
    Seconds = charge(date.getSeconds(),10);
    if(!!flag && flag){
        return date.getFullYear() + "-" + Months + "-" + Day;
    }else{
        return date.getFullYear() + "-" + Months + "-" + Day + " " + Hours + ":" + Minutes + ":" + Seconds;
    }

};

//计算两个时间天数差的函数，通用
export function  DateDiffByDay(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式
    var oDate1, oDate2, iDays;
    oDate1  =  new  Date(sDate1)    //转换为12-18-2006格式
    oDate2  =  new  Date(sDate2)
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  / 24)    //把相差的毫秒数转换为天数
    return  iDays;
}

//计算两个时间月份差的函数，通用(抛弃小数)
export function  DateDiffByMon(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式
    var oDate1, oDate2, iDays;
    oDate1  =  new  Date(sDate1)    //转换为12-18-2006格式
    oDate2  =  new  Date(sDate2)
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  / 24 / 30)    //把相差的毫秒数转换为天数
    return  iDays;
}


/*
*计算二个日期间有几个星期一到星期日
*date_sta及date_end需是Date型参数
*/
export function getWeekDays(startDate,endDate,weekNum){
    var date_sta = new Date(startDate);
    var date_end = new Date(endDate);
    if(date_sta > date_end){
        console.error('开始日期不能大于结束日期');
        return;
    }
    var days = (date_end - date_sta) / 1000 / 60 / 60 / 24 + 1;//二个日期相关得到天数
    var sta_week_day = date_sta.getDay();//返回星期几（星期日为0，星期一为1...星期六为6
    var weeks = Math.floor(days / 7);
    var day = days % 7;
    var weekday = [];
    weekday[0] = weekday[1] = weekday[2] = weekday[3] = weekday[4] = weekday[5] = weekday[6] = weeks;
    for(var i = 0 ;i < day ; i++){
        var n = (sta_week_day + i) % 7;
        weekday[n] ++;
    }
    switch(weekNum){
        case 7 : return weekday[0] ; break ;
        case 1 : return weekday[1] ; break ;
        case 2 : return weekday[2] ; break ;
        case 3 : return weekday[3] ; break ;
        case 4 : return weekday[4] ; break ;
        case 5 : return weekday[5] ; break ;
        case 6 : return weekday[6] ; break ;
        default : return { Sun:weekday[0] , Mon:weekday[1] , Tues:weekday[2] , Wed:weekday[3] ,Thur:weekday[4] ,Fri:weekday[5] ,Sat:weekday[6] }; break;
    };
};

//获取一个月有多少天(入参为年，月)
export function GetCountDays(year,month) {
    var dayCount;
    var now = new Date(year,month, 0);
    dayCount = now.getDate();
    return dayCount;
}

//判断星座
export function JusConstellation(date) {
    var dataFormat = new Date(date);
    var year = dataFormat.getFullYear();
    if(new Date(year + '-03-21').getTime() <= dataFormat.getTime() && new Date(year + '-04-19').getTime() >= dataFormat.getTime()){
        return '白羊座';
    }
    if(new Date(year + '-04-20').getTime() <= dataFormat.getTime() && new Date(year + '-05-20').getTime() >= dataFormat.getTime()){
        return '金牛座';
    }
    if(new Date(year + '-05-21').getTime() <= dataFormat.getTime() && new Date(year + '-06-20').getTime() >= dataFormat.getTime()){
        return '双子座';
    }
    if(new Date(year + '-06-22').getTime() <= dataFormat.getTime() && new Date(year + '-07-22').getTime() >= dataFormat.getTime()){
        return '巨蟹座';
    }
    if(new Date(year + '-07-23').getTime() <= dataFormat.getTime() && new Date(year + '-08-22').getTime() >= dataFormat.getTime()){
        return '狮子座';
    }
    if(new Date(year + '-08-23').getTime() <= dataFormat.getTime() && new Date(year + '-09-22').getTime() >= dataFormat.getTime()){
        return '处女座';
    }
    if(new Date(year + '-09-23').getTime() <= dataFormat.getTime() && new Date(year + '-10-23').getTime() >= dataFormat.getTime()){
        return '天秤座';
    }
    if(new Date(year + '-10-24').getTime() <= dataFormat.getTime() && new Date(year + '-11-22').getTime() >= dataFormat.getTime()){
        return '天蝎座';
    }
    if(new Date(year + '-11-23').getTime() <= dataFormat.getTime() && new Date(year + '-12-21').getTime() >= dataFormat.getTime()){
        return '射手座';
    }
    if(new Date(year + '-12-22').getTime() <= dataFormat.getTime() && new Date((year + 1) + '-01-19').getTime() >= dataFormat.getTime()){
        return '摩羯座';
    }
    if(new Date(year + '-01-20').getTime() <= dataFormat.getTime() && new Date(year + '-02-18').getTime() >= dataFormat.getTime()){
        return '水瓶座';
    }
    if(new Date(year + '-02-19').getTime() <= dataFormat.getTime() && new Date(year + '-03-20').getTime() >= dataFormat.getTime()){
        return '双鱼座';
    }
    return undefined
}

