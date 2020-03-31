import React from 'react';
import styles from './StuSignComponent.less';
import {Modal, Form, Select,Spin,message,DatePicker} from 'antd';
import moment from 'moment';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import ScheduleSignPage from '../../../pages/erp/stu-sign/ScheduleSignPage';

const Option = Select.Option;

function StuSignComponent ({
    visible,onClose,loading,scheduleList,query,
    courseComList,classComList,employeeComList,stuComList,
    searchContent,     //查询内容
    openScheduleSign,queryScheduleList,onOrgChange,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    //时间选择器时间范围限制
    function disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    function orgQueryChange(query) {
        if(query.orgId == undefined) {
            message.warn('请至少选择一家门店');
            return;
        }
        setFieldsValue({
            classId: undefined,
            teacherId: undefined,
            courseId: undefined,
            stuId: undefined,
        });
        onOrgChange && onOrgChange(query);
    }

    function onCloseClick() {
        resetFields();
        onClose && onClose();
    }

    return (
        <Modal
            title="学员签到"
            visible={visible}
            maskClosable={false}
            closable={true}
            onCancel={onCloseClick}
            width={600}
            className={styles.stu_sign_modal}
            footer={null}>

            <div className={styles.stu_sign_cont}>
                <Form className={styles.search_stu_form_cont}>
                    <div>
                        {getFieldDecorator('chooseDate', {
                            initialValue : moment() || undefined
                        })(
                            <DatePicker
                                disabledDate = { disabledDate }
                                style = {{ width : '100%' }}
                                onChange={(date,dateString)=>queryScheduleList({
                                    orgId: getFieldValue('orgId'),
                                    classId: getFieldValue('classId'),
                                    teacherId: getFieldValue('teacherId'),
                                    courseId: getFieldValue('courseId'),
                                    stuId: getFieldValue('stuId'),
                                    startDay:dateString,
                                    endDay:dateString }
                                )}/>
                        )}
                    </div>
                    <div>
                        {getFieldDecorator('orgId', {
                            initialValue: searchContent.orgId,
                        })(
                            <TenantOrgFilter width="100%"
                                onChange={(value)=>orgQueryChange({
                                    orgId: value,
                                    startDay:getFieldValue('chooseDate').format('YYYY-MM-DD'),
                                    endDay:getFieldValue('chooseDate').format('YYYY-MM-DD')})
                            }/>
                        )}
                    </div>
                    <div className={styles.search_stu_form_cont_item}>
                        <div>
                            {getFieldDecorator('courseId')(
                                <Select
                                   placeholder="请选择课程"
                                   allowClear
                                   showSearch
                                   optionFilterProp="children"
                                   notFoundContent="没有课程"
                                   onChange={(value)=>queryScheduleList({
                                        orgId: getFieldValue('orgId'),
                                        classId: getFieldValue('classId'),
                                        teacherId: getFieldValue('teacherId'),
                                        courseId: value,
                                        stuId: getFieldValue('stuId'),
                                        startDay:getFieldValue('chooseDate').format('YYYY-MM-DD'),
                                        endDay:getFieldValue('chooseDate').format('YYYY-MM-DD') }
                                    )}
                                   style={{width: '100%'}}>
                                    {courseComList && courseComList.map(function(item) {
                                        return (<Option key={item.id+''} value={item.id+''}>{item.title}</Option>);
                                    })}
                                </Select>
                            )}
                        </div>

                        <div>
                            {getFieldDecorator('classId')(
                                <Select
                                   placeholder="请选择班级"
                                   allowClear
                                   showSearch
                                   optionFilterProp="children"
                                   notFoundContent="没有班级"
                                   onChange={(value)=>queryScheduleList({
                                        orgId: getFieldValue('orgId'),
                                        classId: value,
                                        teacherId: getFieldValue('teacherId'),
                                        courseId: getFieldValue('courseId'),
                                        stuId: getFieldValue('stuId'),
                                        startDay:getFieldValue('chooseDate').format('YYYY-MM-DD'),
                                        endDay:getFieldValue('chooseDate').format('YYYY-MM-DD') }
                                    )}
                                   style={{width: '100%'}}>
                                    {classComList && classComList.map(function(item) {
                                        return (<Option key={item.clsId+''} value={item.clsId+''}>{item.clsName}</Option>);
                                    })}
                                </Select>
                            )}
                        </div>

                        <div>
                            {getFieldDecorator('teacherId')(
                                <Select
                                   placeholder="请选择老师"
                                   allowClear
                                   showSearch
                                   optionFilterProp="children"
                                   notFoundContent="没有老师"
                                   onChange={(value)=>queryScheduleList({
                                        orgId: getFieldValue('orgId'),
                                        classId: getFieldValue('classId'),
                                        teacherId: value,
                                        courseId: getFieldValue('courseId'),
                                        stuId: getFieldValue('stuId'),
                                        startDay:getFieldValue('chooseDate').format('YYYY-MM-DD'),
                                        endDay:getFieldValue('chooseDate').format('YYYY-MM-DD') }
                                    )}
                                   style={{width: '100%'}}>
                                    {employeeComList && employeeComList.map(function(item) {
                                        return (<Option key={item.userId+''} value={item.userId+''}>{item.userName}</Option>);
                                    })}
                                </Select>
                            )}
                        </div>

                        <div className={styles.search_item_select}>
                            {getFieldDecorator('stuId')(
                                <Select
                                   placeholder="请选择学员"
                                   allowClear
                                   showSearch
                                   optionFilterProp="children"
                                   notFoundContent="没有学员"
                                    onChange={(value)=>queryScheduleList({
                                        orgId: getFieldValue('orgId'),
                                        classId: getFieldValue('classId'),
                                        teacherId: getFieldValue('teacherId'),
                                        courseId: getFieldValue('courseId'),
                                        stuId:  value,
                                        startDay:getFieldValue('chooseDate').format('YYYY-MM-DD'),
                                        endDay:getFieldValue('chooseDate').format('YYYY-MM-DD') }
                                    )}
                                   style={{width: '100%'}}>
                                    {stuComList && stuComList.map(function(item) {
                                        return (<Option key={item.stuId+''} value={item.stuId+''}>{item.stuName}</Option>);
                                    })}
                                </Select>
                            )}
                        </div>
                    </div>
                </Form>

                <Spin tip="加载中..." spinning={loading}>
                    <div className={styles.schedule_list_cont} key="schedule_list_cont">

                        {scheduleList && scheduleList.map(function(item, index) {

                            let ptCount = item.ptArr ? item.ptArr.length : 0;
                            let atCount = item.atArr ? item.atArr.length : 0;

                            let teaCount = ptCount + atCount;

                            let cpType = item.type;

                            let stuCount = 0;
                            if(cpType == '1') {
                                stuCount = item.auditionStuArr ? item.auditionStuArr.length : 0;
                            } else if(cpType == '2') {
                                stuCount = item.normalStuArr ? item.normalStuArr.length : 0;
                            } else if(cpType == '3') {
                                stuCount = item.remedialStuArr ? item.remedialStuArr.length : 0;
                            }

                            return (
                                <div className={styles.schedule_item_cont} key={'schedule_item_cont_' + index} onClick={()=>openScheduleSign(item.orgId, item.cpId)}>

                                    <div className={styles.course_and_nums}>
                                        <div className={styles.schedule_course}>{item.className || item.courseName}</div>
                                        <div className={styles.teacher_num}>{teaCount + '名老师'}</div>
                                        <div className={styles.student_num}>{stuCount + '名学员'}</div>
                                    </div>

                                    <div className={styles.schedule_detail}>
                                       <div className={styles.type_and_org}>
                                            <div className={styles.schedule_type}>{item.type == '1' ? '试听' : item.type == '2' ? '班课' : item.type == '3' ? '补课' : '未知类型'}</div>
                                            <div className={styles.schedule_org}>{item.orgName || ''}</div>
                                        </div>

                                        <div className={styles.room_and_time}>
                                            <div className={styles.schedule_room}>{item.classroomName || ''}</div>
                                            <div className={styles.schedule_time}>{item.studyDate + ' ' + item.startTime + '-' + item.endTime}</div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </Spin>

                <ScheduleSignPage />
            </div>
        </Modal>
    );
}

export default Form.create()(StuSignComponent);
