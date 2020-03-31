import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import CreateArrangeCourseComponent from '../../../components/cerp/new-arrange-course/create-arrange-course/CreateArrangeCourse';

/*新增排课*/
function CreateArrangeCourse({ dispatch , createArrangeCourse }) {

    let {
        loading,                            //整个页面是否加载状态
        buttonLoading,                      //新增提交按钮加载状态
        wetherCreateSuccess,                //是否新增成功(用来清空表单)
        defaultOrgId,                       //cerp默认选中的校区

        courseSelectContent,                //课程信息下拉列表数据
        courseDetailContent,                //课程详情信息
        teacherSelectContent,               //主教和助教下拉列表数据
        classRoomSelectContent,             //教室下拉列表数据
    } = createArrangeCourse

    //选择校区onChange事件
    function CreateArrangeOrgOnChange(orgId){
        //获取课程信息
        dispatch({
            type:'createArrangeCourse/GetCourse',
            payload:{
                orgId
            }
        });
        //获取主教和助教信息
        dispatch({
            type:'createArrangeCourse/GetTeacher',
            payload:{
                orgId
            }
        });
        //获取教室信息
        dispatch({
            type:'createArrangeCourse/GetClassRoom',
            payload:{
                orgId
            }
        });
    }

    //选择课程onChange事件，通过机构ID和课程ID获取课程详情用于填写课程后面的俩空
    function CreateArrangeCourseOnChange(id){
        if(id == '' || id == null || id == undefined || /^[\s]*$/.test(id)){
            dispatch({
                type:'createArrangeCourse/updateState',
                payload:{
                    courseDetailContent : {}
                }
            })
        }else{
            dispatch({
                type:'createArrangeCourse/GetCourseDetail',
                payload:{
                    orgId : defaultOrgId,
                    id
                }
            });
        }
    }

    //点击生成排课
    function CreateNewCourse(data){
        dispatch({
            type:'createArrangeCourse/CreateNewCourse',
            payload:{
                ...data
            }
        });
    }

    //新增成功之后清空表单并且修改wetherCreateSuccess状态
    function ChangeCreateStatus(){
        dispatch({
            type:'createArrangeCourse/updateState',
            payload:{
                wetherCreateSuccess : false
            }
        });
    }

    //新增排课组件属性
    let CreateArrangeCourseComponentProps = {
        loading,                            //整个页面是否加载状态
        buttonLoading,                      //新增提交按钮加载状态
        wetherCreateSuccess,                //是否新增成功(用来清空表单)
        defaultOrgId,                       //cerp默认选中的校区
        courseSelectContent,                //课程信息下拉列表数据
        courseDetailContent,                //课程详情信息
        teacherSelectContent,               //主教和助教下拉列表数据
        classRoomSelectContent,             //教室下拉列表数据

        CreateArrangeOrgOnChange,           //选择校区onChange事件
        CreateArrangeCourseOnChange,        //选择课程onChange事件
        CreateNewCourse,                    //点击生成排课
        ChangeCreateStatus,                 //新增成功之后清空表单并且修改wetherCreateSuccess状态
    }

    return (
        <CreateArrangeCourseComponent {...CreateArrangeCourseComponentProps}/>
    );
}

function mapStateToProps({ createArrangeCourse }) {
    return { createArrangeCourse };
}

export default connect(mapStateToProps)(CreateArrangeCourse);
