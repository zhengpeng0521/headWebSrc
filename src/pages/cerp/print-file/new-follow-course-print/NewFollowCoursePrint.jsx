import React from 'react';
import { Spin , message , Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { do_print } from '../../../../utils/printUtils';
import NewFollowCoursePrintArea from '../../../../components/cerp/print-file/new-follow-course-print/NewFollowCoursePrintArea';

/*cerp按课程打印签到表*/
function NewFollowCoursePrint({ dispatch , newFollowCoursePrint }) {

    let {
        wetherClickRouteIn,         //是否是点击路由进入
        loading,                    //页面加载状态
        orgId,                      //当前选中校区的orgId
        courseSelectContent,        //搜课程搜索栏数据
        listData,                   //列表数据
    } = newFollowCoursePrint

    function dp(path,obj){
        dispatch({
            type : path,
            payload : obj
        })
    }

    function Print(){
        do_print('new_cerp_follow_course_print');
    }

    //日期onChange事件
    function DateOnChange(date,dateString){
        if(!!dateString){
            let obj = {
                startDate : dateString,
                endDate : dateString,
                orgId,
                pageIndex : 0,
                pageSize : 99999
            }
            dp('newFollowCoursePrint/GetCourseListByDay',obj);
        }else{
            //清空课程下拉列表
            dp('newFollowCoursePrint/updateState',{ courseSelectContent : [] });
        }
        //清空显示的打印数据
        dp('newFollowCoursePrint/updateState',{ listData : [] })
    }

    //课程下拉列表onChange事件
    function CourseOnChange(cpdIdArr){
        let choosedArr = [];
        if(!!cpdIdArr && cpdIdArr.length > 0){
            cpdIdArr.map((item,index) => {
                for(let i in courseSelectContent){
                    if(item == courseSelectContent[i].cpdId){
                        choosedArr.push(courseSelectContent[i])
                        break;
                    }
                }
            })
        }
        dp('newFollowCoursePrint/updateState',{ listData : choosedArr })
    }

    let NewFollowCoursePrintAreaProps = {
        dp,
        wetherClickRouteIn,         //是否是点击路由进入
        listData,                   //列表数据
        courseSelectContent,        //搜课程搜索栏数据
        DateOnChange,               //日期onChange事件
        CourseOnChange,             //课程下拉列表onChange事件
    }

    return (
        <Spin spinning = { loading }>
            <div style = {{ overflow : 'hidden' }}>
                <Button type='primary' onClick = { Print } style = {{ position : 'absolute' , right : 11 , top : 13 }}>打印签到表</Button>
                <NewFollowCoursePrintArea {...NewFollowCoursePrintAreaProps}/>
            </div>
        </Spin>
    );
}

function mapStateToProps({ newFollowCoursePrint }) {
    return { newFollowCoursePrint };
}

export default connect(mapStateToProps)(NewFollowCoursePrint);
