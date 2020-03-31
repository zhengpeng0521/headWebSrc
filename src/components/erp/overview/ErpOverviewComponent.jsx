import React from 'react';

import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
//import ClassSchedule from '../../../pages/erp/class-schedule/ClassSchedule';
import ClassSchedulePage from '../../../pages/erp/schedule/SchedulePage';                 //课程表
import SignByStuPage from '../../../pages/erp/overview/SignByStuPage';                    //首页按学员的快捷签到
import StuSignPage from '../../../pages/erp/stu-sign/StuSignPage';                        //首页学员签到
import ScheduleSignPage from '../../../pages/erp/stu-sign/ScheduleSignPage';              //根据排课签到

import styles from './ErpOverviewComponent.less';
import {Spin,Select,Button} from 'antd';

const Option = Select.Option;

function ErpOverviewComponent ({
    loading,selectOrgId,allStuComList,changeSelectOrg,signByStu,stuSign,firstSchedule,openScheduleSign,stuSignSelf,
    jumpTo,overviewData,
}) {
    /*加载最近的排课计划*/
    function renderFirstScheduleCont(firstScheduleData) {
        if(firstScheduleData == undefined || firstScheduleData.cpId == undefined || firstScheduleData.cpId == '') {
            return (
                <div className={styles.schedule_content_empty}>
                    今日没有排课计划
                </div>
            );
        }
        let teaNum = (firstScheduleData.ptArr ? firstScheduleData.ptArr.length : 0) + (firstScheduleData.atArr ? firstScheduleData.atArr.length : 0);
        let stuNum = (firstScheduleData.auditionStuArr ? firstScheduleData.auditionStuArr.length : 0) +
                     (firstScheduleData.normalStuArr ? firstScheduleData.normalStuArr.length : 0) +
                     (firstScheduleData.remedialStuArr ? firstScheduleData.remedialStuArr.length : 0);

        let cpType = ['', '试听','班课','补课'];

        let {studyDate, startTime, endTime} = firstScheduleData;

        return (
            <div className={styles.schedule_content} onClick={()=>openScheduleSign(firstScheduleData.orgId, firstScheduleData.cpId)}>
                <div className={styles.schedule_title_and_people}>
                    <span className={styles.schedule_class_name}>{firstScheduleData.courseName || firstScheduleData.className || '课程名称'}</span>
                    <span className={styles.schedule_tea_num}>老师{teaNum}名</span>
                    <span className={styles.schedule_stu_num}>{stuNum}名学员</span>
                </div>

                <div className={styles.schedule_info_cont}>

                    <div className={styles.schedule_info_line}>
                        <span className={styles.schedule_type}>{cpType[(firstScheduleData.type||0)]}</span>
                        <span className={styles.schedule_info_right_item}>校区: {firstScheduleData.orgName || ''}</span>
                    </div>

                    <div className={styles.schedule_info_line}>
                        <span className={styles.schedule_info_left_item}>教室: {firstScheduleData.classroomName || ''}</span>
                        <span className={styles.schedule_info_right_item}>上课时间: {studyDate||''} {startTime||''}~{endTime || ''}</span>
                    </div>

                </div>

                <div className={styles.first_schedule_sign_text}>
                    签到
                </div>
            </div>
        );
    }

    return (
        <div className={styles.erp_overview_cont} >
            <Spin tip="闪电般的速度加载中..." spinning={loading}>

            <div className={styles.org_filter_cont}>
                <TenantOrgFilter value={selectOrgId} onChange={changeSelectOrg} width={300}/>
            </div>

            <div className={styles.overview_sign_cont}>

                <div className={styles.schedule_sign_cont}>
                    <div className={styles.title_cont}>
                        <div className={styles.sign_title_text}>
                            排课签到
                        </div>

                        <div className={styles.schedule_sign_more}>
                            <span className={styles.schedule_sign_more_href} onClick={stuSign}>查看全部排课</span>
                        </div>
                    </div>
                    {renderFirstScheduleCont(firstSchedule)}
                </div>

                <div className={styles.student_sign_cont}>
                    <div className={styles.title_cont}>
                        <div className={styles.sign_title_text}>
                            排课签到
                        </div>

                        <div className={styles.sign_by_self_cont}>
                            {!!false && <span className={styles.schedule_sign_more_href} onClick={stuSignSelf}>自助签到</span>}
                        </div>
                    </div>

                    <div className={styles.stu_select_cont}>
                        <Select
                           placeholder="请选择学员"
                           allowClear
                           showSearch
                           optionFilterProp="children"
                           notFoundContent="没有学员"
                           onSelect={(value, option)=>signByStu(value, option.props.children)}
                           style={{width: '100%'}}>
                            {allStuComList && allStuComList.map(function(item) {
                                return (<Option key={item.stuId+''} value={item.stuId+''}>{item.stuName}</Option>);
                            })}
                        </Select>
                    </div>
                </div>
            </div>

            <div className={styles.today_sign_record_cont}>

                <div className={styles.sign_record_title}>今日签到信息</div>

                <div className={styles.sign_record_list}>

                    <div className={styles.sign_record_item}>
                       <div className={styles.sign_record_item_cont}>

                            <div className={styles.sign_record_item_type}>上 课</div>
                            <div className={styles.sign_record_item_content} onClick={()=>jumpTo({type: '1'})}>

                                <div className={styles.maa_all_num_cont}>
                                    <div className={styles.maa_all_num}>{overviewData.skTotal || 0}</div>
                                    <div className={styles.remark_text}>预约</div>
                                </div>

                                <div className={styles.really_data_cont}>

                                    <div className={styles.really_sign_num_cont}>
                                        <div className={styles.really_sign_num}>{overviewData.skSign || 0}</div>
                                        <div className={styles.remark_text}>已签</div>
                                    </div>

                                    <div className={styles.sign_type_num_cont}>
                                        <div className={styles.sign_type_item}>
                                            <span className={styles.sign_type_label}>上课</span>
                                            <span className={styles.sign_type_num}>{overviewData.sksk || 0}</span>
                                        </div>

                                        <div className={styles.sign_type_item}>
                                            <span className={styles.sign_type_label}>请假</span>
                                            <span className={styles.sign_type_num}>{overviewData.skqj || 0}</span>
                                        </div>

                                        <div className={styles.sign_type_item}>
                                            <span className={styles.sign_type_label}>旷课</span>
                                            <span className={styles.sign_type_num}>{overviewData.skkk || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className={styles.sign_record_item}>
                       <div className={styles.sign_record_item_cont}>

                            <div className={styles.sign_record_item_type_buke}>补 课</div>
                            <div className={styles.sign_record_item_content} onClick={()=>jumpTo({type: '3'})}>

                                <div className={styles.maa_all_num_cont}>
                                    <div className={styles.maa_all_num}>{overviewData.bkTotal || 0}</div>
                                    <div className={styles.remark_text}>预约</div>
                                </div>

                                <div className={styles.really_data_cont}>

                                    <div className={styles.really_sign_num_cont}>
                                        <div className={styles.really_sign_num_buke}>{overviewData.bkSign || 0}</div>
                                        <div className={styles.remark_text}>已签</div>
                                    </div>

                                    <div className={styles.sign_type_num_cont}>
                                        <div className={styles.sign_type_item}>
                                            <span className={styles.sign_type_label}>上课</span>
                                            <span className={styles.sign_type_num}>{overviewData.bksk || 0}</span>
                                        </div>

                                        <div className={styles.sign_type_item}>
                                            <span className={styles.sign_type_label}>请假</span>
                                            <span className={styles.sign_type_num}>{overviewData.bkqj || 0}</span>
                                        </div>

                                        <div className={styles.sign_type_item}>
                                            <span className={styles.sign_type_label}>旷课</span>
                                            <span className={styles.sign_type_num}>{overviewData.bkkk || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className={styles.sign_record_item}>
                       <div className={styles.sign_record_item_cont}>

                            <div className={styles.sign_record_item_type_shiting}>试 听</div>
                            <div className={styles.sign_record_item_content} onClick={()=>jumpTo({type: '5'})}>

                                <div className={styles.maa_all_num_cont}>
                                    <div className={styles.maa_all_num}>{overviewData.stTotal || 0}</div>
                                    <div className={styles.remark_text}>预约</div>
                                </div>

                                <div className={styles.really_data_cont}>

                                    <div className={styles.really_sign_num_cont}>
                                        <div className={styles.really_sign_num_shiting}>{overviewData.stSign || 0}</div>
                                        <div className={styles.remark_text}>已签</div>
                                    </div>

                                    <div className={styles.sign_type_num_cont}>
                                        <div className={styles.sign_type_item}>
                                            <span className={styles.sign_type_label}>试听</span>
                                            <span className={styles.sign_type_num}>{overviewData.stst || 0}</span>
                                        </div>

                                        <div className={styles.sign_type_item}>
                                            <span className={styles.sign_type_label}>缺席</span>
                                            <span className={styles.sign_type_num}>{overviewData.stqx || 0}</span>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div className = { styles.class_schedule_cont } >
				<ClassSchedulePage createAble = { false } orgId = { selectOrgId } />
            </div>
            <SignByStuPage />
            <StuSignPage />
            <ScheduleSignPage />
            </Spin>
        </div>
    );
}

//                <ClassSchedule filterType={['class', 'course', 'teacher', 'sutdent']} defaultQuery={{orgId: selectOrgId}}/>
export default ErpOverviewComponent;
