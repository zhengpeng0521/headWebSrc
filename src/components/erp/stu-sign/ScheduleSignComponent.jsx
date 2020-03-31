import React from 'react';
import styles from './ScheduleSignComponent.less';
import {Modal, Form, Select, DatePicker, Input, Rate, Checkbox, Button } from 'antd';
import moment from 'moment';
const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;

function ScheduleSignComponent ({
    visible,
    loading,
    editing, //是否为考勤 且是否可以编辑

    cpId, //排课编号
    orgId, //排课编号
    ptArr,//主教老师
    atArr,//助教老师
    className,courseName,
    clsSignTime,
    clsSignCostTpl,
    cpContent,
    homework,
    remarks,
    normalStuArr,
    remedialStuArr,
    auditionStuArr,

    employeeComList,

    onCloseClick,
    onSubmitClick,

    onChangeSignType,
    stuSignErrorMessage,
    WetherPrintTicket,          //是否打印小票
    form: {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    let signType_class = '1';//签到类型-上课
    let signType_leave = '2';//签到类型-请假
    let signType_remedial = '3';//签到类型-补课
    let signType_cut = '4';//签到类型-旷课
    let signType_listen = '5';//签到类型-试听
    let signType_absent = '6';//签到类型-缺席

    let teaFormItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };

    let formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    };

    //签到时间不能选择
    function afterToday(value) {
        return value < moment().startOf('day');
    }

    //点击保存排课的签到
    function onSaveClick() {
        onSubmitClick && onSubmitClick(getFieldsValue(), onClose);
    }
    //点击保存排课的签到
    function onClose() {
        resetFields();
        onCloseClick && onCloseClick();
    }
    function SaveClick() {
      //明细不可编辑
    }

    let scheduleModalFoot = [
        <div style={{display:'inline-block',marginRight:5}}>
            {
                (editing ==  '1' || editing =='2')  ? " " : <CheckboxGroup onChange={ WetherPrintTicket } options={[{ label:'打印小票', value: '1' }]}/>
            }
            {/*<CheckboxGroup onChange={ WetherPrintTicket } options={[{ label:'打印小票', value: '1' }]}/>*/}
        </div>,
        <Button key="schedule_sign_cancle_btn" type="ghost" onClick={onClose} loading={loading}>取消</Button>,
        <Button key="schedule_sign_save_btn" type="primary" onClick={ ( editing =='2')  ? SaveClick : onSaveClick} loading={loading}> {
            (editing ==  '1' || editing =='2')  ? "考勤" : "签到"
        }</Button>,
    ];

    return (
        <Modal
            title={className||courseName||'班级名称'}
            visible={visible}
            maskClosable={false}
            closable={true}
            onClose={onClose}
            width={600}
            style={{top: 50}}
            className={styles.schedule_sign_modal}
            footer={scheduleModalFoot}
         >

            <div className={styles.schedule_sign_cont}>
                <Form>
                <div className="schedule_class_detail_cont">

                    <div className="schedule_class_teacher_cont">
                        {getFieldDecorator('cpId', {
                            initialValue: cpId,
                          })(
                            <Input type="hidden" />
                          )}
                          {getFieldDecorator('orgId', {
                            initialValue: orgId,
                          })(
                            <Input type="hidden" />
                          )}
                        <div className={styles.primary_tea}>
                            <FormItem
                                  {...teaFormItemLayout}
                                  label="主教"
                            >
                            {getFieldDecorator('ptTea', {
                                initialValue: ptArr,
                              })(
                                <Select
                                   placeholder="请选择主教老师"
                                   allowClear
                                   showSearch
                                   multiple
                                   optionFilterProp="children"
                                   notFoundContent="没有老师"
                                   disabled
                                   style={{width: '100%'}}>
                                    {employeeComList && employeeComList.map(function(item) {
                                        return (<Option key={item.userId+''} value={item.userId+''}>{item.userName}</Option>);
                                    })}
                                </Select>
                              )}
                            </FormItem>
                        </div>

                       {!!(atArr && atArr.length > 0) &&
                        <div className={styles.assistant_tea}>
                            <FormItem
                                  {...teaFormItemLayout}
                                  label="助教"
                            >
                            {getFieldDecorator('atTea', {
                                initialValue: atArr,
                              })(
                                <Select
                                   placeholder="请选择助教老师"
                                   allowClear
                                   showSearch
                                   mode = 'multiple'
                                   optionFilterProp="children"
                                   notFoundContent="没有老师"
                                   disabled
                                   style={{width: '100%'}}>
                                    {employeeComList && employeeComList.map(function(item) {
                                        return (<Option key={item.userId+''} value={item.userId+''}>{item.userName}</Option>);
                                    })}
                                </Select>
                              )}
                            </FormItem>
                        </div>
                        }
                    </div>


                    <FormItem
                          {...formItemLayout}
                          label="上课时间"
                    >
                    {getFieldDecorator('clsSignTime', {
                        initialValue: clsSignTime,
                      })(
                        <Input disabled placeholder="签到时间" />
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="上课内容"
                    >
                    {getFieldDecorator('classContent', {
                        initialValue: cpContent,
                      })(
                        <Input type="textarea" disabled = {editing == 2 ? true : false }placeholder="请输入上课内容" autosize={{ minRows: 2, maxRows: 2 }} />
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="课后作业"
                    >
                    {getFieldDecorator('homework', {
                        initialValue: homework,
                      })(
                        <Input type="textarea" disabled = {editing == 2 ? true : false } placeholder="请输入课后作业" autosize={{ minRows: 2, maxRows: 2 }} />
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="备注"
                    >
                    {getFieldDecorator('remarks', {
                        initialValue: remarks,
                      })(
                        <Input type="textarea" disabled = {editing == 2 ? true : false } placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 2 }} />
                      )}
                    </FormItem>

                </div>

                <div className={styles.schedule_stu_list_cont}>

                    {!!(normalStuArr&&normalStuArr.length>0) &&
                        <div className={styles.schedule_type_item} key="schedule_type_item_normal">

                            {normalStuArr.map(function(stuItem, stuIndex) {

                                let stuHasSign = !(stuItem.stuSignType == undefined || stuItem.stuSignType == '');

                                let stuMessageObj = stuSignErrorMessage.find(function(x) {
                                    return x.stuId == stuItem.stuId;
                                });

                                let stuMsgFlg = '0';//学员签到结构   0  不显示   1 签到成功  2  签到错误消息
                                if(stuSignErrorMessage.length > 0) {
                                    if(stuMessageObj && stuMessageObj.message && stuMessageObj.message.length > 0) {
                                        stuMsgFlg = '2';
                                    } else {
                                        stuMsgFlg = '1';
                                    }
                                }

                                return (
                                    <div className={styles.schedule_stu_sign_item} key={'schedule_stu_sign_item_' + stuIndex}>
                                        <div className={styles.schedule_stu_detail}>
                                            <div className={styles.schedule_stu_name} title={stuItem.stuName}>{stuItem.stuName}</div>
                                            <div className={styles.schedule_stu_type}>班课</div>
                                        </div>

                                        <div className={styles.schedule_sign_detail}>
                                            <div className={styles.check_type_and_period}>

                                                <div className={styles.check_type}>

                                                    <div className={styles.sign_type_item}>
                                                        <Checkbox disabled={editing == 2 ? true : stuItem.disabled} checked={stuItem.stuSignType == signType_class} onChange={(e)=>onChangeSignType(e, '2', signType_class, stuItem.stuId)}>上课</Checkbox>
                                                    </div>

                                                    <div className={styles.sign_type_item}>
                                                        <Checkbox disabled={editing == 2 ? true :stuItem.disabled} checked={stuItem.stuSignType == signType_leave} onChange={(e)=>onChangeSignType(e, '2', signType_leave, stuItem.stuId)}>请假</Checkbox>
                                                    </div>

                                                    <div className={styles.sign_type_item}>
                                                        <Checkbox disabled={editing == 2 ? true :stuItem.disabled} checked={stuItem.stuSignType == signType_cut} onChange={(e)=>onChangeSignType(e, '2', signType_cut, stuItem.stuId)}>旷课</Checkbox>
                                                    </div>

                                                </div>

                                                <div className={styles.sign_period_cont}>
                                                    消耗课时<span className={styles.sign_period_num}>{stuItem.period||0}</span>
                                                </div>

                                            </div>

                                            <div className={styles.schedule_stu_remark}>
                                                {getFieldDecorator('normal_stuRemark_'+stuItem.stuId, {
                                                    initialValue: stuItem.stuSignRemark,
                                                  })(
                                                    <Input disabled={editing == 2 ? true :!stuHasSign} placeholder="请输入备注" style={{width: '100%'}} />
                                                  )}
                                            </div>

                                            <div className={styles.schedule_stu_score}>
                                                {getFieldDecorator('normal_stuScore_'+stuItem.stuId, {
                                                    initialValue: stuItem.stuEffect,
                                                  })(
                                                    <Rate disabled={!stuHasSign} />
                                                  )}
                                            </div>
                                            {!!(stuMsgFlg == '2') &&
                                            <div className={styles.schedule_stu_message_error}>
                                                {stuMessageObj.message}
                                            </div>}
                                            {!!(stuMsgFlg == '1') &&
                                            <div className={styles.schedule_stu_message_success}>
                                                {editing == '1' ? '考勤成功' :'签到成功' }

                                            </div>}
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    }

                    {!!(remedialStuArr && remedialStuArr.length>0) &&
                        <div className={styles.schedule_type_item} key="schedule_type_item_remedial">

                            {remedialStuArr.map(function(stuItem, stuIndex) {
                                let stuHasSign = !(stuItem.stuSignType == undefined || stuItem.stuSignType == '');
                                let stuMessageObj = stuSignErrorMessage.find(function(x) {
                                    return x.stuId == stuItem.stuId;
                                });
                                let stuMsgFlg = '0';//学员签到结构   0  不显示   1 签到成功  2  签到错误消息
                                if(stuSignErrorMessage.length > 0) {
                                    if(stuMessageObj && stuMessageObj.message && stuMessageObj.message.length > 0) {
                                        stuMsgFlg = '2';
                                    } else {
                                        stuMsgFlg = '1';
                                    }
                                }
                                return (
                                    <div className={styles.schedule_stu_sign_item} key={'schedule_stu_sign_item_' + stuIndex}>
                                        <div className={styles.schedule_stu_detail}>
                                            <div className={styles.schedule_stu_name} title={stuItem.stuName}>{stuItem.stuName}</div>
                                            <div className={styles.schedule_stu_type}>补课</div>
                                        </div>

                                        <div className={styles.schedule_sign_detail}>
                                            <div className={styles.check_type_and_period}>

                                                <div className={styles.check_type}>

                                                    <div className={styles.sign_type_item}>
                                                        <Checkbox disabled={editing == 2 ? true :stuItem.disabled} checked={stuItem.stuSignType == signType_remedial} onChange={(e)=>onChangeSignType(e, '3', signType_remedial, stuItem.stuId)}>补课</Checkbox>
                                                    </div>

                                                    <div className={styles.sign_type_item}>
                                                        <Checkbox disabled={editing == 2 ? true :stuItem.disabled} checked={stuItem.stuSignType == signType_leave} onChange={(e)=>onChangeSignType(e, '3', signType_leave, stuItem.stuId)}>请假</Checkbox>
                                                    </div>

                                                    <div className={styles.sign_type_item}>
                                                        <Checkbox disabled={editing == 2 ? true :stuItem.disabled} checked={stuItem.stuSignType == signType_cut} onChange={(e)=>onChangeSignType(e, '3', signType_cut, stuItem.stuId)}>旷课</Checkbox>
                                                    </div>

                                                </div>

                                                <div className={styles.sign_period_cont}>
                                                    消耗课时<span className={styles.sign_period_num}>{stuItem.period||0}</span>
                                                </div>

                                            </div>

                                            <div className={styles.schedule_stu_remark}>
                                                {getFieldDecorator('remedial_stuRemark_'+stuItem.stuId, {
                                                    initialValue: stuItem.stuSignRemark,
                                                  })(
                                                    <Input disabled={editing == 2 ? true :!stuHasSign} placeholder="请输入备注" style={{width: '100%'}} />
                                                  )}
                                            </div>

                                            <div className={styles.schedule_stu_score}>
                                                {getFieldDecorator('remedial_stuScore_'+stuItem.stuId, {
                                                    initialValue: stuItem.stuEffect,
                                                  })(
                                                    <Rate disabled={editing == 2 ? true :!stuHasSign} />
                                                  )}
                                            </div>
                                            {!!(stuMsgFlg == '2') &&
                                            <div className={styles.schedule_stu_message_error}>
                                                {stuMessageObj.message}
                                            </div>}
                                            {!!(stuMsgFlg == '1') &&
                                            <div className={styles.schedule_stu_message_success}>
                                                {editing == '1' ? '考勤成功' :'签到成功' }
                                            </div>}
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    }

                     {!!(auditionStuArr && auditionStuArr.length>0) &&
                        <div className={styles.schedule_type_item} key="schedule_type_item_audition">

                            {auditionStuArr.map(function(stuItem, stuIndex) {
                                let stuHasSign = !(stuItem.stuSignType == undefined || stuItem.stuSignType == '');
                                let stuMessageObj = stuSignErrorMessage.find(function(x) {
                                    return x.stuId == stuItem.stuId;
                                });
                                let stuMsgFlg = '0';//学员签到结构   0  不显示   1 签到成功  2  签到错误消息
                                if(stuSignErrorMessage.length > 0) {
                                    if(stuMessageObj && stuMessageObj.message && stuMessageObj.message.length > 0) {
                                        stuMsgFlg = '2';
                                    } else {
                                        stuMsgFlg = '1';
                                    }
                                }
                                return (
                                    <div className={styles.schedule_stu_sign_item} key={'schedule_stu_sign_item_' + stuIndex}>
                                        <div className={styles.schedule_stu_detail}>
                                            <div className={styles.schedule_stu_name} title={stuItem.stuName}>{stuItem.stuName}</div>
                                            <div className={styles.schedule_stu_type}>试听</div>
                                        </div>

                                        <div className={styles.schedule_sign_detail}>
                                            <div className={styles.check_type_and_period}>

                                                <div className={styles.check_type}>

                                                    <div className={styles.sign_type_item}>
                                                        <Checkbox disabled={editing == 2 ? true :stuItem.disabled} checked={stuItem.stuSignType == signType_listen} onChange={(e)=>onChangeSignType(e, '1', signType_listen, stuItem.stuId)}>试听</Checkbox>
                                                    </div>

                                                    <div className={styles.sign_type_item}>
                                                        <Checkbox disabled={editing == 2 ? true :stuItem.disabled} checked={stuItem.stuSignType == signType_absent} onChange={(e)=>onChangeSignType(e, '1', signType_absent, stuItem.stuId)}>缺席</Checkbox>
                                                    </div>

                                                </div>

                                            </div>

                                            <div className={styles.schedule_stu_remark}>
                                                {getFieldDecorator('audition_stuRemark_'+stuItem.stuId, {
                                                    initialValue: stuItem.stuSignRemark,
                                                  })(
                                                    <Input disabled={editing == 2 ? true :!stuHasSign} placeholder="请输入备注" style={{width: '100%'}} />
                                                  )}
                                            </div>

                                            <div className={styles.schedule_stu_score}>
                                                {getFieldDecorator('audition_stuScore_'+stuItem.stuId, {
                                                    initialValue: stuItem.stuEffect,
                                                  })(
                                                    <Rate disabled={editing == 2 ? true :!stuHasSign} />
                                                  )}
                                            </div>
                                            {!!(stuMsgFlg == '2') &&
                                            <div className={styles.schedule_stu_message_error}>
                                                {stuMessageObj.message}
                                            </div>}
                                            {!!(stuMsgFlg == '1') &&
                                            <div className={styles.schedule_stu_message_success}>
                                                {editing == '1' ? '考勤成功' :'签到成功' }
                                            </div>}
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    }

                </div>
                </Form>
            </div>
        </Modal>
    );
}
export default Form.create()(ScheduleSignComponent);
