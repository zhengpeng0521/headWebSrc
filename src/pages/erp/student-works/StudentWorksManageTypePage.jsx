import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import StudentWorksManageType from '../../../components/erp/student-works/StudentWorksManageType';

function StudentWorksManageTypePage ({ dispatch , studentWorksManageTypeModel, refreshList }){
	let {
        manageTypeModalVisible,
        manageTypeWorkTagList,
        updateWorkTagKey

    } = studentWorksManageTypeModel;

    //点击修改分类名称
    function updateWorkTag( key ){
        dispatch({
            type : 'studentWorksManageTypeModel/updateState',
            payload : {
                updateWorkTagKey : key
            }
        })
    };

    //关闭管理分类框
    function closeManageTypeModal(){
        dispatch({
            type : 'studentWorksManageTypeModel/updateState',
            payload : {
                manageTypeModalVisible : !manageTypeModalVisible,
                updateWorkTagKey       : '',
            }
        })
    }

    //确认新增分类
    function confirmAddWorkTag( name ){
        dispatch({
            type : 'studentWorksManageTypeModel/confirmAddWorkTag',
            payload : {
                name : name
            }
        })
    };

    //删除分类
    function deleteWorkTag( id ){
        dispatch({
            type : 'studentWorksManageTypeModel/deleteWorkTag',
            payload : {
                id : id,
                refreshList
            }
        })
    };

    //确认修改分类
    function confirmUpdateWorkTag( name, id ){
        dispatch({
            type : 'studentWorksManageTypeModel/confirmUpdateWorkTag',
            payload : {
                name : name,
                id : id,
                refreshList
            }
        })
    };
    let studentWorksManageTypeProps = {
        manageTypeModalVisible,
        manageTypeWorkTagList,
        updateWorkTagKey,

        updateWorkTag,
        closeManageTypeModal,
        confirmAddWorkTag,
        confirmUpdateWorkTag,
        deleteWorkTag,

    }
	return (
        <div>
            { !!manageTypeModalVisible && <StudentWorksManageType { ...studentWorksManageTypeProps } key = "student_work_manage_type" /> }
        </div>
	)
};

function mapStateToProps ({ studentWorksManageTypeModel }){
	return { studentWorksManageTypeModel };
};

export default connect(mapStateToProps)(StudentWorksManageTypePage);
