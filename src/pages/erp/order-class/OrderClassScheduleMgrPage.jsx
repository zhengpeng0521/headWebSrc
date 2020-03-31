import React from 'react';
import { connect } from 'dva';
import ScheduleMgrComponent from '../../../components/erp/order-class/order-class-schedule/ScheduleMgrComponent';

function OrderClassScheduleMgrPage({dispatch, orderClassScheduleModel}) {

	let scheduleMgrComponentProps = {
		createAble : true
	}

    return (
        <ScheduleMgrComponent { ...scheduleMgrComponentProps } />
    );
}


function mapStateToProps({orderClassScheduleModel}) {
  return {orderClassScheduleModel};
}

export default connect(mapStateToProps)(OrderClassScheduleMgrPage);
