import React from 'react';
import styles from './ClassScheduleMgrComponent.less';
import ClassSchedule from '../../../pages/erp/class-schedule/ClassSchedule';

/**
 * 课程表
 * 管理组件
 */
function ClassScheduleMgrComponent () {
    let filterType = ['org', 'class', 'course', 'teacher', 'sutdent'];
    return (
        <div className={styles.class_schedule_mgr_cont}>

            <div className={styles.class_schedule_content}>
                <ClassSchedule
                    tbody_height={'65vh'}
                    createAble
                    filterType={filterType} />
            </div>
        </div>
    );
}

export default ClassScheduleMgrComponent;
