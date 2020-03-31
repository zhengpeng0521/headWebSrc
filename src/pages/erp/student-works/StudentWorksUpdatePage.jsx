import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import StudentWorksUpdate from '../../../components/erp/student-works/StudentWorksUpdate';

function StudentWorksUpdatePage ({ dispatch , studentWorksUpdateModel, refreshList }){
	let {
        updateWorksModalVisible,
        studentWorkInfo,
        stuId,
        imgUrl,
        tagIdList,
        stuIdList,

    } = studentWorksUpdateModel;

    //确认修改作品
    function confirmUpdateWorks( values ){
        dispatch({
            type : 'studentWorksUpdateModel/confirmUpdateWorks',
            payload : {
                values,
                refreshList
            }
        })
    };

    //取消修改作品
    function cancelUpdateWorks(){
        dispatch({
            type : 'studentWorksUpdateModel/updateState',
            payload : {
                updateWorksModalVisible : !updateWorksModalVisible,
                studentWorkInfo : {}
            }
        })
    };

    let studentWorksUpdateProps = {
        updateWorksModalVisible,
        studentWorkInfo,
        stuId,
        imgUrl,

        tagIdList,
        stuIdList,

        confirmUpdateWorks,

        cancelUpdateWorks
    }
	return (
		<StudentWorksUpdate { ...studentWorksUpdateProps } />
	)
};

function mapStateToProps ({ studentWorksUpdateModel }){
	return { studentWorksUpdateModel };
};

export default connect(mapStateToProps)(StudentWorksUpdatePage);
