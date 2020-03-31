import React from 'react';
import { connect } from 'dva';
import ScheduleMgrComponent from '../../../components/erp/schedule/ScheduleMgrComponent';

function ScheduleMgrPage({dispatch, scheduleModel}) {

	let scheduleMgrComponentProps = {
		createAble : true
	}

    return (
        <ScheduleMgrComponent { ...scheduleMgrComponentProps } />
    );
}


function mapStateToProps({scheduleModel}) {
  return {scheduleModel};
}

export default connect(mapStateToProps)(ScheduleMgrPage);
