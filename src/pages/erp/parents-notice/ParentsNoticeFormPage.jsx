import React from 'react';
import { connect } from 'dva';
import ParentsNoticeFormComponent from '../../../components/erp/parents-notice/ParentsNoticeFormComponent';

function ParentsNoticeFormPage({dispatch, parentsNoticeFormModel}) {

	let {
        visible,                 //表单窗口是否显示
        loading,
        noticeId,
        sendTime,                  //发送时间
        stuList,               //通知的学员
        stuObjList,               //通知的学员
        noticeTitle,          //通知的标题
        noticeContent,       //通知的内容  html

        stuLoading,
        studentSelectVisible,allStudentList,courseComList,employeeComList,
    } = parentsNoticeFormModel;

    function onRemoveAllStu() {
        dispatch({
            type: 'parentsNoticeFormModel/onRemoveAllStu',
        });
    }
    function onSearchStudents(query) {
        dispatch({
            type: 'parentsNoticeFormModel/searchStudents',
            payload: {
                query,
            }
        });
    }

    /*改变学生选择窗口的显隐*/
    function changeStudentSelectVisible() {
        dispatch({
            type: 'parentsNoticeFormModel/changeStudentSelectVisible',
        });
    }
    /*打开学生选择窗口*/
    function showStudentSelect() {
        dispatch({
            type: 'parentsNoticeFormModel/updateState',
            payload: {
                studentSelectVisible: true,
                allStudentList: [],
            }
        });
    }

    //选择学员或者班级
    function onChangeStuSelect(e, type, classId, stuId, stuName) {
        let {target} = e;
        let check = target.checked;

        dispatch({
            type: 'parentsNoticeFormModel/changeStuSelect',
            payload: {
                check, type, classId, stuId, stuName,
            }
        });
    }
    //移除选择学员
    function onRemoveStu(stuId, stuName) {
        dispatch({
            type: 'parentsNoticeFormModel/changeStuSelect',
            payload: {
                check: false,
                type: 'stu',
                classId: '',
                stuId,
                stuName,
            }
        });
    }

    //关闭表单界面
    function onClose() {
        dispatch({
           type: 'parentsNoticeFormModel/onClose',
        });
    }

    //关闭表单界面
    function onSubmit(params) {
        dispatch({
           type: 'parentsNoticeFormModel/onSubmit',
            paylaod: {
                params
            }
        });
    }

    let parentNoticeFormProps = {
        visible,                 //表单窗口是否显示
        noticeId,
        sendTime,                  //发送时间
        stuList,               //通知的学员
        stuObjList,               //通知的学员
        noticeTitle,          //通知的标题
        noticeContent,       //通知的内容  html
        courseComList,employeeComList,
        showStudentSelect,
        onSearchStudents,
        stuLoading,
        studentSelectVisible,allStudentList,onRemoveAllStu,changeStudentSelectVisible,onChangeStuSelect,onRemoveStu,
        onClose,onSubmit,
    };

    return (
        <ParentsNoticeFormComponent {...parentNoticeFormProps} />
    );
}

function mapStateToProps({ parentsNoticeFormModel }) {
  	return { parentsNoticeFormModel };
}

export default connect(mapStateToProps)(ParentsNoticeFormPage);
