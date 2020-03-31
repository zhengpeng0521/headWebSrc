import React from 'react';
import { connect } from 'dva';
import ClassScheduleMgrComponent from '../../../components/erp/class-schedule/ClassScheduleMgrComponent';

function ClassScheduleMgr({dispatch, classScheduleModel}) {

    return (
        <ClassScheduleMgrComponent />
    );
}

function mapStateToProps({classScheduleModel}) {
  return {classScheduleModel};
}

export default connect(mapStateToProps)(ClassScheduleMgr);
