import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ClassScheduleTimeSetComponent from '../../../components/system/class-schedule-time-set/ClassScheduleTimeSet';

function ClassScheduleTimeSet({ dispatch, classScheduleTimeSet }) {

    let {

        loading,                //整个页面loading状态
        buttonLoading,          //按钮loading状态
        startTime,              //时间范围开始时间
        endTime,                //时间范围结束时间
        initialArr,             //查询获取到的数据，提交时需要更新此数组[0]的key

	} = classScheduleTimeSet;

    //提交保存
    let FormSubmit = function(data){
        dispatch({
            type:'classScheduleTimeSet/FormSubmit',
            payload:{
                ...data
            }
        });
    }

    let ClassScheduleTimeSetComponentProps = {
        loading,                //整个页面loading状态
        buttonLoading,          //按钮loading状态
        startTime,              //时间范围开始时间
        endTime,                //时间范围结束时间
        initialArr,             //查询获取到的数据，提交时需要更新此数组[0]的key

        FormSubmit,             //提交保存
    };

    return(
        <ClassScheduleTimeSetComponent {...ClassScheduleTimeSetComponentProps}/>
    );
}

function mapStateToProps({ classScheduleTimeSet }) {
    return { classScheduleTimeSet };
}

export default connect(mapStateToProps)(ClassScheduleTimeSet);
