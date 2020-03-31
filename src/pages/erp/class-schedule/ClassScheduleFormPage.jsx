import React from 'react';
import { connect } from 'dva';
import ClassScheduleFormComponent from '../../../components/erp/class-schedule/ClassScheduleFormComponent';

/**
 * visible boolean 窗口是否显示
 * afterSubmit function 数据提交之后触发事件，可以刷新数据
 */
function ClassScheduleFormPage({dispatch, classScheduleFormModel, afterSubmit,}) {

    let {
        visible, formLoading, formData,
        classRoomComList,classComList, courseComList, teacherComList,allStuComList,classStuComList,
        remedialStuData,remedialStuArr,remedialStuArrInit, classStuComArr,
    } = classScheduleFormModel;

    /*更新班级进度*/
    function updateClassProgress(classId) {
        dispatch({
            type: 'classScheduleFormModel/updateClassProgressComList',
            payload: {
                classId
            }
        });
    }

    /*更新班级学员*/
    function updateClassStudent(classId, courseId, orgId) {
        dispatch({
            type: 'classScheduleFormModel/updateClassStudent',
            payload: {
                classId,courseId,orgId,
            }
        });
    }

    function onSubmitAction(params, onCloseFunction) {
        dispatch({
            type: 'classScheduleFormModel/submitSchedule',
            payload: {
                params,
                onCloseFunction,
                afterSubmitFunction: afterSubmit,
            }
        });
    }

    //重置 补课学员
    function resetRemedialStuArr() {
        dispatch({
            type: 'classScheduleFormModel/resetRemedialStuArr',
        });
    }

    //重置记录在model的表单数据
    function resetFormModel() {
        dispatch({
            type: 'classScheduleFormModel/resetFormModel',
        });
    }

    //增加 补课学员
    function updateRemedialStuItem(remedialStuArr, remedialStuArrInit) {
        dispatch({
            type: 'classScheduleFormModel/updateState',
            payload: {
                remedialStuArr, remedialStuArrInit
            }
        });
    }

    /*更新课程班级*/
    function updateCourseClass(courseId) {
        dispatch({
            type: 'classScheduleFormModel/updateCourseClass',
            payload: {
                courseId
            }
        });
    }

    //机构选择改变
    function onOrgChange(orgId) {
        dispatch({
            type : 'classScheduleFormModel/changeOrgSelect',
            payload: {
              orgId
          }
        });
    }

    //删除排课计划
    function deleteSchedule(orgId,cpId) {
        dispatch({
            type: 'classScheduleFormModel/deleteSchedule',
            payload: {
                orgId,cpId,
                onCloseFunction: onClose,
                afterSubmitFunction: afterSubmit,
            }
        });
    }

    /*更新课程下的补课学员情况*/
    function updateRemedialStuData(orgId, courseId) {
        dispatch({
            type: 'classScheduleFormModel/updateRemedialStuData',
            payload: {
                orgId, courseId
            }
        });
    }

    /*关闭窗口*/
    function onClose() {
        dispatch({
            type: 'classScheduleFormModel/onClose',
        });
    }

    //更改课程时间
    function changeClassTime(type, time, timeString) {
        dispatch({
            type: 'classScheduleFormModel/changeClassTime',
            payload: {
                type, time, timeString
            }
        });
    }

    let classScheduleFormProps = {
        visible, formLoading, formData, afterSubmit, onClose,resetFormModel,
        classRoomComList,classComList,courseComList,teacherComList,allStuComList,classStuComList,classStuComArr,
        remedialStuArr,remedialStuArrInit,resetRemedialStuArr,
        updateRemedialStuItem, updateClassProgress,updateClassStudent,onSubmitAction,
        remedialStuData,updateRemedialStuData,onOrgChange,deleteSchedule,changeClassTime,
    };
    return (
        <ClassScheduleFormComponent {...classScheduleFormProps} />
    );
}

function mapStateToProps({classScheduleFormModel}) {
  return {classScheduleFormModel};
}

export default connect(mapStateToProps)(ClassScheduleFormPage);
