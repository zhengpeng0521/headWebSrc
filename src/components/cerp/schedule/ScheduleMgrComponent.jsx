import React from 'react';
//import styles from './ClassScheduleMgrComponent.less';
import SchedulePage from '../../../pages/erp/schedule/SchedulePage';

/**
 * 课程表
 * 管理组件
 */
function ScheduleMgrComponent ({
	createAble
}) {

	let orgId = window._init_data.firstOrg.key;
	let schedulePageProps = {
		createAble,
		orgId
	}

    return (
		<SchedulePage { ...schedulePageProps } />
    );
}

export default ScheduleMgrComponent;
