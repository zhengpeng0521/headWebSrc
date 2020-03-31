import React from 'react';
import { message , Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { do_print } from '../../../../utils/printUtils';
//import SchedulePrintByDayVersionOne from '../../../../components/cerp/print-file/schedule-print-by-day/schedule-print-by-day-version-one/SchedulePrintByDay'; //有时间
import SchedulePrintByDayVersionTwo from '../../../../components/cerp/print-file/schedule-print-by-day/schedule-print-by-day-version-two/SchedulePrintByDay';   //无时间

/*cerp按天打印签到表*/
function SchedulePrintByDay({ dispatch , schedulePrintByDay }) {

    let {

        nowDate,                    //当前日期

        //课程信息
        courseInfo,                 //课程信息初始数据
        teacherInfo,                //格式化老师维度排课信息
        classRoomInfo,              //格式化教室维度排课信息
        selectTeaContent,           //下拉列表选中内容(老师)
        selectClsContent,           //下拉列表选中内容(教室)

        //员工信息
        staffInfo,                  //员工下拉列表内容

        //教室信息
        clsRoomInfo,                //教室下拉列表内容

        //课程表时间
        startClock,                 //开始时间
        endClock,                   //结束时间
        clockArray,                 //时间段数组

        startTime,                  //开始时间字符串('无冒号')
        endTime,                    //结束时间字符串('无冒号')
        timeArray,                  //时间段数组('无冒号')

        //选择区
        dimension,                  //维度(1老师/2教室)


    } = schedulePrintByDay

    function dp(path,obj){
        dispatch({
            type:path,
            payload:obj
        });
    }

    function Print(){
        let item = document.getElementsByClassName('schedule_print_by_day_time_item');
        for(let i in item){
            if(item[i] && item[i].style && item[i].style.height){
                item[i].style.height = `calc((100% - 40px)/${clockArray.length} - 1px)`;
                //console.info(item[i].clientHeight);
            }
        }
        let input = document.getElementById('schedule_print_by_day');
        do_print('schedule_print_by_day');
        for(let i in item){
            if(item[i] && item[i].style && item[i].style.height){
                item[i].style.height = `calc((100% - 40px)/${clockArray.length})`;
                console.info(item[i].clientHeight);
            }
        }
    }

    //维度选择onChange事件
    function DimensionOnChange(value){
        dp('schedulePrintByDay/updateState',{
            dimension : value,
        })
    }

    //老师选择onChange事件
    function SelectTeaOnChange(teaArr){
        let info = [];
        for(let i in teaArr){
            let index = teaArr[i].indexOf('-');
            let obj = {
                id : teaArr[i].substr(0,index),
                name : teaArr[i].substr(index+1),
                course : []
            }
            for(let j in courseInfo){
                let mtids = !!courseInfo[j].mtids ? courseInfo[j].mtids + '' : '';
                let atids = !!courseInfo[j].atids ? courseInfo[j].atids + '' : '';
                if(mtids.indexOf(teaArr[i].substr(0,index)) > -1){
                    obj.course.push(courseInfo[j]);
                }else if(atids.indexOf(teaArr[i].substr(0,index)) > -1){
                    obj.course.push(courseInfo[j]);
                }
            }
            info.push(obj)
        }
        dp('schedulePrintByDay/updateState',{
            teacherInfo : info,
            selectTeaContent : teaArr
        })
    }

    //教室选择onChange事件
    function SelectClsOnChange(clsArr){
        let info = [];
        for(let i in clsArr){
            let index = clsArr[i].indexOf('-');
            let obj = {
                id : clsArr[i].substr(0,index),
                name : clsArr[i].substr(index+1),
                course : []
            }
            for(let j in courseInfo){
                let roomId = !!courseInfo[j].roomId ? courseInfo[j].roomId + '' : '';
                if(roomId == clsArr[i].substr(0,index)){
                    obj.course.push(courseInfo[j]);
                }
            }
            info.push(obj)
        }
        dp('schedulePrintByDay/updateState',{
            classRoomInfo : info,
            selectClsContent : clsArr
        })
    }

    //有时间
//    let SchedulePrintByDayVersionOneProps = {
//        nowDate,                    //当前日期
//        //课程信息
//        courseInfo,                 //课程信息初始数据
//        selectTeaContent,           //下拉列表选中内容(老师)
//        selectClsContent,           //下拉列表选中内容(教室)
//        data : dimension == '1' ? teacherInfo : dimension == '2' ? classRoomInfo : [],      //格式化老师维度排课信息/格式化教室维度信息
//
//        //员工信息
//        staffInfo,                  //员工下拉列表内容
//
//        //教室信息
//        clsRoomInfo,                //教室下拉列表内容
//
//        //课程表时间
//        startClock,                 //开始时间
//        endClock,                   //结束时间
//        clockArray,                 //时间段数组
//
//        startTime,                  //开始时间字符串('无冒号')
//        endTime,                    //结束时间字符串('无冒号')
//        timeArray,                  //时间段数组('无冒号')
//
//        //选择区
//        dimension,                  //维度(1老师/2教室)
//
//        DimensionOnChange,          //维度选择onChange事件
//        SelectTeaOnChange,          //老师选择onChange事件
//        SelectClsOnChange,          //教室选择onChange事件
//    }

    //无时间
    let SchedulePrintByDayVersionTwoProps = {
        nowDate,                    //当前日期
        //课程信息
        courseInfo,                 //课程信息初始数据
        selectTeaContent,           //下拉列表选中内容(老师)
        selectClsContent,           //下拉列表选中内容(教室)
        data : dimension == '1' ? teacherInfo : dimension == '2' ? classRoomInfo : [],      //格式化老师维度排课信息/格式化教室维度信息

        //员工信息
        staffInfo,                  //员工下拉列表内容

        //教室信息
        clsRoomInfo,                //教室下拉列表内容

        //课程表时间
        startClock,                 //开始时间
        endClock,                   //结束时间
        clockArray,                 //时间段数组

        startTime,                  //开始时间字符串('无冒号')
        endTime,                    //结束时间字符串('无冒号')
        timeArray,                  //时间段数组('无冒号')

        //选择区
        dimension,                  //维度(1老师/2教室)

        DimensionOnChange,          //维度选择onChange事件
        SelectTeaOnChange,          //老师选择onChange事件
        SelectClsOnChange,          //教室选择onChange事件
    }

    return (
        <div style = {{ overflow : 'hidden' }}>
            <Button type='primary' onClick = { Print } style = {{ position : 'absolute' , right : 11 , top : 13 }}>打印签到表</Button>
            <SchedulePrintByDayVersionTwo {...SchedulePrintByDayVersionTwoProps}/>
        </div>
    );
}

function mapStateToProps({ schedulePrintByDay }) {
    return { schedulePrintByDay };
}

export default connect(mapStateToProps)(SchedulePrintByDay);
