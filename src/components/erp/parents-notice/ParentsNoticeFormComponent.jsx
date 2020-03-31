import React from 'react';
import styles from './ParentsNoticeFormComponent.less';
import {Modal, Button,Form,Input,DatePicker,} from 'antd';
import RichEditor from '../../common/rich-editor/RichEditor';
import moment from 'moment';
import StudentSelectComponent from './StudentSelect';

const FormItem = Form.Item;

function ParentsNoticeFormComponent ({
    visible,                 //表单窗口是否显示
    loading,
    noticeId,
    sendTime,               //发送时间
    stuList,               //通知的学员
    stuObjList,               //通知的学员
    noticeTitle,          //通知的标题
    noticeContent,       //通知的内容  html

    onClose,
    onSubmit,

    showStudentSelect,//打开学生选择窗口
    studentSelectVisible,allStudentList,
    courseComList,employeeComList,
    stuLoading,
    onRemoveAllStu,onSearchStudents,changeStudentSelectVisible,onChangeStuSelect,onRemoveStu,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    function afterToday(date) {
        return date < moment();
    }

    function range(start, end) {
      let result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }

    function afterNowTime(date) {
        let now_hour = moment().format('HH');
        let now_min = moment().format('mm');
        let now_ses = moment().format('ss');

        let hour_dis_arr = range(0, now_hour);
        let min_dis_arr  = range(0, now_min);
        let ses_dis_arr  = range(0, now_ses);
        if(date) {

            let date_hour = date.format('HH');
            let date_min  = date.format('mm');
            let date_ses  = date.format('ss');
            if(date.format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) {
                hour_dis_arr = [];
                min_dis_arr = [];
                ses_dis_arr = [];
            } else {
                if(date_hour > now_hour) {
                    min_dis_arr = [];
                    ses_dis_arr = [];
                } else {
                    if(date_min > now_min) {
                        ses_dis_arr = [];
                    }
                }
            }
        }

        return {
                disabledHours: () => hour_dis_arr,
                disabledMinutes: () => min_dis_arr,
                disabledSeconds: () => ses_dis_arr,
            };
    }

    function onStuSelectClose() {
        setFieldsValue({
            'students': (stuList && stuList.length > 0) ? stuList.join(',') : ''
        });
        validateFields(['students']);
        changeStudentSelectVisible && changeStudentSelectVisible();
    }

    //关闭窗口
    function onCloseClick() {
        resetFields();
        onClose && onClose();
    }
    //保存按钮
    function onSaveClick() {
        let noticeContent = UE.getEditor('parent_notice_cont_richeditor').getContent();
        setFieldsValue({noticeContent});
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            onSubmit(values);
        });
    }

    let formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 },
    };

    let studentsSelectProps = {
        visible: studentSelectVisible,
        loading: stuLoading,
        selectStuIds: stuList,
        selectStudents: stuObjList,
        courseComList,employeeComList,
        onRemoveAll: onRemoveAllStu,
        onClose: onStuSelectClose,
        onSearch: onSearchStudents,
        onChangeStuSelect: onChangeStuSelect,
        onRemoveStu,
        dataSource: allStudentList,
    };

    return (
        <Modal
            title={noticeId == '' ? '新增通知' : '编辑通知'}
            visible={visible}
            maskClosable={false}
            closable={true}
            okText="保存"
            onOk={onSaveClick}
            cancelText="取消"
            onCancel={onCloseClick}
            width={800}
            style={{top: 50}}
            className={styles.parents_notice_form_modal}
        >
           <div className={styles.parents_notice_form_cont}>
               <Form>

                   <FormItem
                          {...formItemLayout}
                          label="发送对象"
                    >
                    {getFieldDecorator('students', {
                        rules: [{
                          required: true, message: '请选择发送对象',
                        }],
                      })(
                        <div className={styles.notice_target_cont}>
                            <div className={styles.notice_target_select_stu} onClick={()=>showStudentSelect()}>选择学员</div>
                            <div className={styles.notice_target_select_stu_info}>/已选择{stuList.length}学员</div>
                        </div>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="标题"
                    >
                    {getFieldDecorator('noticeTitle', {
                        initialValue: noticeTitle,
                        rules: [{
                          required: true, message: '请输入标题',
                        }],
                      })(
                        <Input placeholder="请输入标题"/>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="发送时间"
                    >
                    {getFieldDecorator('sendTime', {
                        initialValue: sendTime ? moment(sendTime, 'YYYY-MM-DD HH:mm') : undefined,
                        rules: [{
                          required: true, message: '请选择发送时间',
                        }],
                      })(
                        <DatePicker style={{width: '100%'}} placeholder="请选择发送时间" showTime showToday format="YYYY-MM-DD HH:mm" disabledDate={afterToday} disabledTime={afterNowTime}/>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="通知内容"
                    >
                       {getFieldDecorator('noticeContent', {
                        initialValue: noticeContent,
                        rules: [{
                          required: true, message: '请输入通知内容',
                        }],
                      })(
                        <RichEditor UEId="parent_notice_cont_richeditor" />
                        )}
                    </FormItem>

               </Form>

               <StudentSelectComponent {...studentsSelectProps} />
           </div>

        </Modal>
    );
}

export default Form.create()(ParentsNoticeFormComponent);
