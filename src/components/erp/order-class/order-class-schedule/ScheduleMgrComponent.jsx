import React from 'react';
import OrderClassSchedulePage from '../../../../pages/erp/order-class/OrderClassSchedulePage';

/**
 * 约课课程表
 * 管理组件
 */
function ScheduleMgrComponent ({
	createAble
}){

	let orgId = window._init_data.cerp_orgId;          //得到校区id
	let orderClassSchedulePageProps = {
		createAble,
		orgId
	}

    return (
		<OrderClassSchedulePage { ...orderClassSchedulePageProps } />
    );
}

export default ScheduleMgrComponent;
