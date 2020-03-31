import React from 'react';
import { message } from 'antd';

import CheckOnWorkAttendanceComponent from '../../../components/system/check-on-work-attendance/check-on-work-attendance';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function CheckOnWorkAttendance({ dispatch, checkOnWorkAttendance }) {

    let {
        loading,                    //是否加载状态
        attendWorkStatus,   //出勤状态
        leaveWorkStatus,    //请假状态
        outSchoolStatus,    //旷课状态
        cancelStatus,       //取消状态
        conent,
	} = checkOnWorkAttendance;

    function changeStatus1(data){

        dispatch({
            type:'checkOnWorkAttendance/updateState',
            payload:{
               attendWorkStatus :data
            }
        });

    }
    function changeStatus2(data){

        dispatch({
            type:'checkOnWorkAttendance/updateState',
            payload:{
               leaveWorkStatus :data
            }
        });

    }

    function changeStatus3(data){

        dispatch({
            type:'checkOnWorkAttendance/updateState',
            payload:{
               outSchoolStatus :data
            }
        });

    }


    function SaveAttendance(data){
         dispatch({
            type:'checkOnWorkAttendance/SaveLeadRecordRule',
            payload:{
               value:data,
               confKey:'DEDUCTCOST'
            }
        });
    }


    let checkOnWorkAttendanceProps = {
        loading,            //是否加载状态
        attendWorkStatus,   //出勤状态
        leaveWorkStatus,    //请假状态
        outSchoolStatus,    //旷课状态
        cancelStatus,       //取消状态
        changeStatus1,
        changeStatus2,
        changeStatus3,

        SaveAttendance,
    };

    return(
        <div>
            <CheckOnWorkAttendanceComponent {...checkOnWorkAttendanceProps}/>
        </div>
    );
}

function mapStateToProps({ checkOnWorkAttendance }) {
  return { checkOnWorkAttendance };
}

export default connect(mapStateToProps)(CheckOnWorkAttendance);
