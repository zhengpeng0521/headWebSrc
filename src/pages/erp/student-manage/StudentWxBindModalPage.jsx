import React , { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import StudentWxBindModalComponent from '../../../components/erp/student-manage/StudentWxBindModalComponent';

function StudentWxBindModalPage({ dispatch , studentWxBindModalModel }){
	let {
        wxCodeModalVisible,
        url,
		orgName

	} = studentWxBindModalModel;

    //关闭微信绑定框
    function closeWxcodeModal(){
		dispatch({
			type : 'parentManageModel/refreshList',
			payload : {

			}
		});
        dispatch({
            type : 'studentWxBindModalModel/updateState',
            payload : {
                wxCodeModalVisible : !wxCodeModalVisible,
                url                : '',
				orgName            : undefined
            }
        })
    };

    let StudentWxBindModalComponentProps = {
        wxCodeModalVisible,
        closeWxcodeModal,
        url,
		orgName
    }
	return (
		<StudentWxBindModalComponent { ...StudentWxBindModalComponentProps } />
	)
};

function mapStateToProps ({ studentWxBindModalModel }){
	return { studentWxBindModalModel };
};

export default connect(mapStateToProps)(StudentWxBindModalPage);

