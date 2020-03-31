import React from 'react';
import { message } from 'antd';

import CourseNumAlertComponent from '../../../components/system/course-num-alert/CourseNumAlert';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function CourseNumAlert({ dispatch, courseNumAlert }) {

    let {
        information,                //课时信息
        loading,                    //按钮和整个页面加载状态
	} = courseNumAlert;

    //点击保存
    function SaveCourseLeastNum(value){
        if(value == '' || value == null || value == undefined || /^[\s]*$/.test(value)){
            return message.warn('课时数不能为空');
        }
        if(!/^[0-9]*$/.test(value)){
            return message.warn('只能输入非负数');
        }
        if(parseFloat(value) < 0){
            return message.warn('数字不能小于0');
        }
        let data = information;
        data.key = value;
        dispatch({
            type:'courseNumAlert/SaveCourseLeastNum',
            payload:{
                confKey : 'PERIODNUMREMIND',
                value : JSON.stringify([data]),
            }
        })
    }

    let CourseNumAlertComponentProps = {
        information,                //课时信息
        loading,                    //按钮和整个页面加载状态

        SaveCourseLeastNum,         //点击保存
    }

    return(
        <CourseNumAlertComponent {...CourseNumAlertComponentProps}/>
    );
}

function mapStateToProps({ courseNumAlert }) {
  return { courseNumAlert };
}

export default connect(mapStateToProps)(CourseNumAlert);
