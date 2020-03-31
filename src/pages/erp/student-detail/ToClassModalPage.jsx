import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ToClassModalComponent from '../../../components/erp/student-detail/to-class-modal/ToClassModalComponent';

function ToClassModalPage({ dispatch, toClassModalModel }){
    let {
        toClassModalVisible,
        step,

        courseList,
        pageSize,
        pageIndex,

        classOptionList,
        courseName,
        perNum,
        maxProgress,

    } = toClassModalModel;

    //点击报班
    function clickToClass( id ){
        dispatch({
            type : 'toClassModalModel/clickToClass',
            payload : {
                id
            }
        })
    };

    //返回班级课程列表
    function backToCourseList(){
        dispatch({
            type : 'toClassModalModel/updateState',
            payload : {
                step : '1',
                maxProgress : 0,
				perNum : 0
            }
        })
    };
    //选择班级
    function selectClass( value, option){
        dispatch({
            type : 'toClassModalModel/updateState',
            payload : {
                maxProgress : option.props.maxProgress
            }
        })
    };
    //确认报班
    function confirmToClass( values ){
        dispatch({
            type : 'toClassModalModel/confirmToClass',
            payload : {
                values
            }
        })
    };
    //关闭报班模态框
    function closeToClassModal(){
        dispatch({
            type : 'toClassModalModel/updateState',
            payload : {
                toClassModalVisible : !toClassModalVisible,
                step : '1',
            }
        })
    };

    let toClassModalComponentProps = {
        toClassModalVisible,
        step,

        courseList,

        clickToClass,

        classOptionList,
        courseName,
        perNum,
        maxProgress,

        backToCourseList,
        confirmToClass,
        selectClass,

        closeToClassModal,
    }
    return (
        <div>
            <ToClassModalComponent { ...toClassModalComponentProps } />
        </div>
    )
};

function mapStateToProps ({ toClassModalModel }){
	return { toClassModalModel };
};

export default connect( mapStateToProps )( ToClassModalPage );
