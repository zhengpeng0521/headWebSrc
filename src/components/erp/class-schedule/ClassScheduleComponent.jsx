import React from 'react';
import styles from './ClassScheduleComponent.less';
import ClassScheduleContentComponent from './ClassScheduleContentComponent';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import {Tabs,Button,Select,Popover,message} from 'antd';
import moment from 'moment';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

/**
 * 课程表
 * 查询组件 - 框架
 */
function ClassScheduleComponent ({
    onMenuItemClick, classScheduleList,previousWeek_classScheduleList,nextWeek_classScheduleList,query,
    classes_list,
    course_list,
    teacher_list,
    student_list,
    filterType,
    tbody_height, onFilterQuery,createAble,onCreateSchedule,onUpdateSchedule,
	beginTime,
	endTime
}) {

    let classScheduleContentProps1 = {
        classScheduleList: previousWeek_classScheduleList,
        beginDate: moment().startOf('week').subtract(7, 'd').format('YYYY-MM-DD'),
        endDate: moment().endOf('week').subtract(7, 'd').format('YYYY-MM-DD'),
        beginTime: beginTime,
        endTime: endTime,
        tbody_height,
        onUpdateSchedule,onCreateSchedule,createAble,
    };

    let classScheduleContentProps2 = {
        classScheduleList: classScheduleList,
        beginDate: moment().startOf('week').format('YYYY-MM-DD'),
        endDate: moment().endOf('week').format('YYYY-MM-DD'),
        beginTime: beginTime,
        endTime: endTime,
        tbody_height,
        onUpdateSchedule,onCreateSchedule,createAble,
    };

    let classScheduleContentProps3 = {
        classScheduleList: nextWeek_classScheduleList,
        beginDate: moment().startOf('week').add(7, 'd').format('YYYY-MM-DD'),
        endDate: moment().endOf('week').add(7, 'd').format('YYYY-MM-DD'),
        beginTime: beginTime,
        endTime: endTime,
        tbody_height,
        onUpdateSchedule,onCreateSchedule,createAble,
    };

    function orgFilterChange(value) {
        if(value == undefined || value == '') {
            return;
        }
        onFilterQuery({
            'orgId': value||'',
        });
    }

    function classFilterChange(value) {
        onFilterQuery({
            'classId': value||'',
        });
    }
    function courseFilterChange(value) {
        onFilterQuery({
            'courseId': value||'',
        });
    }
    function teacherFilterChange(value) {
        onFilterQuery({
            'teacherId': value||'',
        });
    }
    function studentFilterChange(value) {
        onFilterQuery({
            'stuId': value||'',
        });
    }

    let queryOrgId = undefined;
    if(query && query.orgId != undefined) {
        queryOrgId = query.orgId;
    }

    let class_schedule_filter_cont_items = [];
    filterType && filterType.length > 0 && filterType.map(function(filterTypeItem) {
        if(filterTypeItem == 'org') {
            //门店过滤课程表
            class_schedule_filter_cont_items.push(
                <div className={styles.class_schedule_org_filter_content} key="class_schedule_org_filter_content">
                    <TenantOrgFilter value={queryOrgId} onChange={orgFilterChange} />
                </div>
            );
        } else if(filterTypeItem == 'class') {
            //班级过滤课程表
            class_schedule_filter_cont_items.push(
                <div className={styles.class_filter_cont} key="class_filter_cont">
                    <Select style={{ width: 120 }} allowClear placeholder="请选择班级" onChange={classFilterChange}>
                      {classes_list&&classes_list.map(function(item) {
                            return (<Option value={item.clsId+''} key={item.clsId+''}>{item.clsName}</Option>);
                        })}
                    </Select>
                </div>
            );
        } else if(filterTypeItem == 'course') {
            //课程过滤课程表
            class_schedule_filter_cont_items.push(
                <div className={styles.course_filter_cont} key="course_filter_cont">
                    <Select style={{ width: 120 }} allowClear placeholder="请选择课程" onChange={courseFilterChange}>
                      {course_list && course_list.map(function(item) {
                            return (<Option value={item.id+''} key={item.id+''}>{item.title}</Option>);
                        })}
                    </Select>
                </div>
            );
        } else if(filterTypeItem == 'teacher') {
            //老师过滤课程表
            class_schedule_filter_cont_items.push(
                <div className={styles.teacher_filter_cont} key="teacher_filter_cont">
                    <Select style={{ width: 120 }} allowClear placeholder="请选择老师" onChange={teacherFilterChange}>
                      {teacher_list && teacher_list.map(function(item) {
                            return (<Option value={item.userId+''} key={item.userId+''}>{item.userName}</Option>);
                        })}
                    </Select>
                </div>
            );
        } else if(filterTypeItem == 'sutdent') {
            //学员过滤课程表
            class_schedule_filter_cont_items.push(
                <div className={styles.student_filter_cont} key="student_filter_cont">
                    <Select style={{ width: 120 }} allowClear placeholder="请选择学员" onChange={studentFilterChange}>
                      {student_list && student_list.map(function(item) {
                            return (<Option value={item.stuId+''} key={item.stuId+''}>{item.stuName}</Option>);
                        })}
                    </Select>
                </div>
            );
        }
    });

    let class_schedule_filter_cont = (
        <div className={styles.class_schedule_filter_cont}>
            {class_schedule_filter_cont_items}
        </div>
    );

    let tabBarComponent = (
        <div className={styles.tab_bar_content}>
            {!!createAble &&
            <div className={styles.search_btn_cont}>
                <Button type="primary" className={styles.search_btn} onClick={onCreateSchedule}>新增</Button>
            </div>
            }
           {!!(filterType && filterType.length > 0) &&
            <div className={styles.search_btn_cont} key="search_btn_cont">
               <Popover content={class_schedule_filter_cont} title={null} trigger="click" placement="bottomRight">
                  <Button key="class_schedule_filter" type="primary" className={styles.search_btn}>筛选</Button>
               </Popover>

            </div>
            }
        </div>

    );

    return (
        <div className="common_class_schedule_content" >
          <Tabs defaultActiveKey="current_week" onTabClick={onMenuItemClick} type="card" tabBarExtraContent={tabBarComponent}>
              <TabPane tab="上周" key="previous_week" >
                  <ClassScheduleContentComponent {...classScheduleContentProps1} />
              </TabPane>
              <TabPane tab="本周" key="current_week" >
                  <ClassScheduleContentComponent {...classScheduleContentProps2} />
              </TabPane>
              <TabPane tab="下周" key="next_week" >
                  <ClassScheduleContentComponent {...classScheduleContentProps3} />
              </TabPane>
          </Tabs>
        </div>
    );
}

export default ClassScheduleComponent;
