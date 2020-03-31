import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import HqMainPageComponent from '../../components/hq-main-page/HqMainPage';
import { FormatDate , GetCountDays } from '../../utils/dateFormat';
/*教学课件*/
function HqMainPage({ dispatch, hqMainPage }) {

    let {
        loading,
        selectMonth,
        selectType,     //下拉框选择类型
        selectYear,     //选择年
        startDate ,     //开始时间
        endDate   ,     //结束时间
        sellerJobList,  //销售工作报表
        sellerPerList,  //销售业绩表
        periodIndexList ,//学员销课表
        purMoneySortList ,//合同总金额数据列表
        costCourseMoneySortList, //消课总金额

        windowWidth,
        windowWidthLevel,

        funnelList,         //漏斗数据
        tmkData,            //表格数据

	} = hqMainPage

    //计算某一年某一月有多少天
    function mGetDate(year, month){
        var d = new Date(year, month, 0);
        return d.getDate();
    }
    function changeSelectMonth(selectMonth) {
        var totalDay = mGetDate((selectMonth.split('-'))[0],(selectMonth.split('-'))[1]);
        dispatch({
            type:'hqMainPage/updateState',
            payload:{
                selectMonth,
                startDate : selectMonth +'-01',
                endDate : selectMonth+'-'+totalDay,
            }
        });
        dispatch({
            type:'hqMainPage/allYearDateList',
            payload:{
                year : (selectMonth.split('-'))[0] ,
                month : (selectMonth.split('-'))[1] ,
            }
        });

    }
    function handleChange(value){
        let currentDate = moment();
        let startDate, endDate;
        let formatNowDate = new Date(currentDate);
        let week = formatNowDate.getDay();          //获取当前星期几(0-6/周日-周六)

        if( value === 'today' ){ //今日
            startDate = currentDate;
            endDate = currentDate;
        }else if( value === 'yesterday' ){ //昨日
            startDate = moment().subtract( 1, 'd' );
            endDate = moment().subtract( 1, 'd' );
        }else if( value === 'currentWeek' ){ //本周
            if(week == 0){//如果当前日期是周日
                startDate = FormatDate(formatNowDate.getTime() - 6*24*60*60*1000).substr(0,10);
                endDate = nowDate;
            }else{
                startDate = FormatDate(formatNowDate.getTime() - (week-1)*24*60*60*1000).substr(0,10);
                endDate = FormatDate(formatNowDate.getTime() - (week-1-6)*24*60*60*1000).substr(0,10);
            }
        }else if( value === 'lastWeek' ){ //上周
            if(week == 0){ //如果当前日期是周日
                startDate = FormatDate(formatNowDate.getTime() - 6*24*60*60*1000).substr(0,10);
                endDate = nowDate;
            }else{
                startDate = FormatDate(formatNowDate.getTime() - (week-1+7)*24*60*60*1000).substr(0,10);
                endDate = FormatDate(formatNowDate.getTime() - (week)*24*60*60*1000).substr(0,10);
            }
        }else if( value === 'currentMonth' ){ //本月
            startDate = moment().startOf('month');
            endDate = moment().endOf('month');
        }else if( value === 'lastMonth' ){ //上月
            let lastDay = moment().subtract( 1, 'M' ).format('YYYY-MM-DD');
            startDate = moment( lastDay ).startOf('month');
            endDate = moment( lastDay ).endOf('month');
        }
        dispatch({
            type:'hqMainPage/updateState',
            payload:{
                selectType : value,
                startDate : FormatDate(startDate,true) ,
                endDate : FormatDate(endDate,true),
            }
        });
        if(value == 'today' || value == 'yesterday' || value == 'currentWeek' || value == 'lastWeek' || value =='currentMonth' || value=='lastMonth' ){
            dispatch({
                type:'hqMainPage/allDateList',
                payload:{
                    startDate : FormatDate(startDate,true) ,
                    endDate : FormatDate(endDate,true),
                }
            });
        }



    }
    //年份下拉框选择事件
    function handleChangeYear(value){
        dispatch({
            type:'hqMainPage/updateState',
            payload:{
                selectYear : value,
                startDate : value +'-01-01',
                endDate : value +'-12-31',
            }
        });
        dispatch({
            type:'hqMainPage/allYearDateList',
            payload:{
                year : value
            }
        });
    }
    function JumpRouter(item){
        let routerPath = '';
        if(item.bigKey =='workReport'){
            routerPath = 'hq_orgstats_sellerwork'
        }else if(item.bigKey =='performanceReport'){
            routerPath = 'hq_orgstats_sellscore'
        }else if(item.bigKey=='stuUseReport'){
            routerPath = 'hq_orgstats_stucost'
        }

        dispatch({
            type:'hqMainPage/JumpToOtherRouter',
            payload:{
                routerPath, //路由地址
                selectType, //选择时间的类型
            }
        });
    }
    /*浏览器宽度改变事件*/
        let WindowOnReSize = function(width){
            if(parseInt(width) > 1500){
                dispatch({
                    type:'hqMainPage/updateState',
                    payload:{
                        windowWidthLevel : 'Lv1',
                        windowWidth : parseInt(width),      //当前浏览器宽度
                    }
                });
            }else if(parseInt(width) > 1200){
                dispatch({
                    type:'hqMainPage/updateState',
                    payload:{
                        windowWidthLevel : 'Lv2',
                        windowWidth : parseInt(width),      //当前浏览器宽度
                    }
                });
            }else if(parseInt(width) > 900){
                dispatch({
                    type:'hqMainPage/updateState',
                    payload:{
                        windowWidthLevel : 'Lv3',
                        windowWidth : parseInt(width),      //当前浏览器宽度
                    }
                });
            }else{
                dispatch({
                    type:'hqMainPage/updateState',
                    payload:{
                        windowWidthLevel : 'Lv3',
                        windowWidth : parseInt(width),      //当前浏览器宽度
                    }
                });
            }
        }
    const tmkHomeProps = {
        funnelList,         //漏斗数据
        tmkData,            //表格数据
    }

    let HqMainPageComponentProps = {
        loading,
        selectMonth,
        changeSelectMonth,  //月份选择事件
        handleChange,       //下拉框选择事件
        handleChangeYear,
        selectType,         //下拉框选择类型

        sellerJobList,  //销售工作报表
        sellerPerList,  //销售业绩表
        periodIndexList ,//学员销课表
        purMoneySortList ,//合同总金额数据列表
        costCourseMoneySortList, //消课总金额

        JumpRouter,  //路由跳转
        windowWidth,
        windowWidthLevel,
        WindowOnReSize,

        tmkHomeProps,
    }
    return(
        <div id='wyp_home_overview'>
            <HqMainPageComponent {...HqMainPageComponentProps}/>
        </div>
    );
}

function mapStateToProps({ hqMainPage }) {
  return { hqMainPage };
}

export default connect(mapStateToProps)(HqMainPage);
