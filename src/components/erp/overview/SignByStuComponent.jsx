import React from 'react';
import styles from './SignByStuComponent.less';
import {Modal, Button,Spin,Checkbox} from 'antd';
import QueueAnim from 'rc-queue-anim';
const CheckboxGroup = Checkbox.Group;

function SignByStuComponent ({
    loading, visible, orgId, stuId, stuName, scheduleList,
    onCloseClick,showScheduleOpts,stuQuickSign,
    ErpSignByStuCheckBoxOnchange,       //打印小票checkbox的onChange事件
}) {

    function renderBarCcont(scheduleItem,index) {
        let {
            type,
            signType,
            costTpl,
            cpId,
            showOpts
        } = scheduleItem;

        let class_cost = 0,         //上课消耗课时
            leave_cost = 0,         //请假消耗课时
            remedial_cost = 0,      //补课消耗课时
            cut_cost = 0,           //旷课消耗课时
            listen_cost = 0,        //试听消耗课时
            absent_cost = 0;        //缺席消耗课时

        if(costTpl != undefined && costTpl != '') {
            let costTplArr = costTpl.split(',');
            if(costTplArr && costTplArr.length == 4) {
                class_cost = costTplArr[0] || '0';
                leave_cost = costTplArr[1] || '0';
                remedial_cost = costTplArr[2] || '0';
                cut_cost = costTplArr[3] || '0';
            } else {
                remedial_cost = costTpl;
            }
        }

        let show_class      = (type == '2')                 && (signType == undefined || signType == '1');                          //是否显示上课按钮
        let show_leave      = (type == '2')  && ((signType == undefined && showOpts) || signType == '2');       //是否显示请假按钮
        let show_remedial   = (type == '3')                 && (signType == undefined || signType == '3');                          //是否显示补课按钮
        let show_cut        = (type == '2' || type == '3')  && ((signType == undefined && showOpts) || signType == '4');       //是否显示补课按钮
        let show_listen     = (type == '1')                 && (signType == undefined || signType == '5');                          //是否显示试听按钮
        let show_absent     = (type == '1')                 && ((signType == undefined && showOpts) || signType == '6');       //是否显示缺席按钮
        let show_opt_more   = signType == undefined && !showOpts;

        return (
            <div className={styles.bar_cont} key="bar_cont">

                    <QueueAnim animConfig={[
                                { opacity: [1, 0], translateX: [0, 50] },
                                { opacity: [0, 0] }
                            ]}
                            type={['right', 'right']}
                            className={styles.schedule_btn_group}>
                            <div style={{display:'inline-block'}}>
                                <CheckboxGroup onChange={(e) => ErpSignByStuCheckBoxOnchange(e,index)} options={[{ label: '打印小票', value: '1' }]}/>
                            </div>
                            {!!show_class       && <Button type="primary" className={styles.schedule_btn} key={'schedule_btn_class_'+cpId} disabled={signType == '1'} onClick={()=>stuQuickSign(cpId, orgId, stuId, '1', index)}  >上课 ({class_cost}课时)</Button>}
                            {!!show_remedial    && <Button type="primary" className={styles.schedule_btn} key={'schedule_btn_bu_'+cpId}    disabled={signType == '3'} onClick={()=>stuQuickSign(cpId, orgId, stuId, '3', index)}  >补课 ({remedial_cost}课时)</Button>}
                            {!!show_leave       && <Button type="ghost"   className={styles.schedule_btn} key={'schedule_btn_jia_'+cpId}   disabled={signType == '2'} onClick={()=>stuQuickSign(cpId, orgId, stuId, '2', index)}  >请假 ({leave_cost}课时)</Button>}
                            {!!show_cut         && <Button type="ghost"   className={styles.schedule_btn} key={'schedule_btn_kuang_'+cpId} disabled={signType == '4'} onClick={()=>stuQuickSign(cpId, orgId, stuId, '4', index)}  >旷课 ({cut_cost}课时)</Button>}
                            {!!show_listen      && <Button type="primary" className={styles.schedule_btn} key={'schedule_btn_ting_'+cpId}  disabled={signType == '5'} onClick={()=>stuQuickSign(cpId, orgId, stuId, '5')}  >试听</Button>}
                            {!!show_absent      && <Button type="ghost"   className={styles.schedule_btn} key={'schedule_btn_que_'+cpId}   disabled={signType == '6'} onClick={()=>stuQuickSign(cpId, orgId, stuId, '6')}  >缺席</Button>}

                            {!!show_opt_more &&
                            <Button
                                    type="ghost"
                                    className={styles.schedule_btn}
                                    key={'schedule_btn_more_'+cpId}
                                    onClick={()=>showScheduleOpts(cpId)}
                                >更多操作</Button>
                            }
                    </QueueAnim>

                </div>
        );
    }

    let loopStuScheduleCont = data => data.map(function(item, index) {

        let teaNum = (item.ptArr ? item.ptArr.length : 0) + (item.atArr ? item.atArr.length : 0);
        let stuNum = (item.auditionStuArr ? item.auditionStuArr.length : 0) +
                     (item.normalStuArr ? item.normalStuArr.length : 0) +
                     (item.remedialStuArr ? item.remedialStuArr.length : 0);

        let cpType = ['', '试听','班课','补课'];

        let {studyDate, startTime, endTime} = item;

        return (
            <div className={styles.schedule_sign_item} key={'schedule_sign_item_' + index}>

                <div className={styles.title_and_people}>
                    <span className={styles.class_name_text}>{item.courseName || item.className || ''}</span>
                    <span className={styles.tea_num_cont}>老师{teaNum}名</span>
                    <span className={styles.stu_num_cont}>{stuNum}名学员</span>
                </div>

                <div className={styles.schedule_content}>

                    <div className={styles.schedule_line_item}>
                        <span className={styles.schedule_type}>{cpType[(item.type||0)]}</span>
                        <span className={styles.line_item_right_cont}>校区: {item.orgName || ''}</span>
                    </div>

                    <div className={styles.schedule_line_item}>
                        <span className={styles.line_item_left_cont}>教室: {item.classroomName || ''}</span>
                        <span className={styles.line_item_right_cont}>上课时间: {studyDate||''} {startTime||''}~{endTime || ''}</span>
                    </div>

                    {renderBarCcont(item,index)}
                </div>
            </div>
        );
    });

    return (
        <Modal
            title={stuName||'学员名称'}
            visible={visible}
            maskClosable={false}
            closable={true}
            onCancel={onCloseClick}
            width={550}
            footer={null}>

            <div className={styles.sign_by_stu_cont}>
                {(scheduleList && scheduleList.length > 0) ? loopStuScheduleCont(scheduleList||[])
                :
                <div className={styles.today_no_schedule_text}>
                    该学员今日无课程安排
                </div>
                }
            </div>

        </Modal>
    );
}

export default SignByStuComponent;
