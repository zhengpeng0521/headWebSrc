import React from 'react';
import { Modal, Button, Form, Input, InputNumber, message , Popconfirm } from 'antd';
import styles from './CheckModal.less';
import QueueAnim from 'rc-queue-anim';
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 19,
    },
};

/*退款单驳回modal*/
const CheckModal = ({
    refundFormCheckModalVisible,                //审核退款单modal是否显示
    refundFormCheckModalPassButtonLoading,      //审核退款单modal通过按钮加载状态
    refundFormCheckModalRejectButtonLoading,    //审核退款单modal驳回按钮加载状态
    refundFormCheckModalCheckDetail,            //审核退款单详情

    RefundFormCheckModalPass,                   //审核退款单modal点击通过
    RefundFormCheckModalReject,                 //审核退款单modal点击驳回
    RefundFormCheckModalCancel,                 //审核退款单modal关闭
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll,
    },
  }) => {

    //渲染退课时信息
    let course = [];
    if(refundFormCheckModalCheckDetail.peridInfo && refundFormCheckModalCheckDetail.peridInfo.length > 0){
        course = refundFormCheckModalCheckDetail.peridInfo.map((item,index) => {
            return(
                <div key = { index }>
                    <div>课程名称：{ item.courseName }</div>
                    <div>退课时数：{ item.periodNum }</div>
                </div>
            );
        })
    }

    function handleComplete(e,type){
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }

            //处理id
            values.id = refundFormCheckModalCheckDetail.id;

            if(type == 'reject'){
                delete values.money;
                RefundFormCheckModalReject(values);
            }else if(type == 'pass'){
                 //处理退款审核通过状态下退款金额
                if(values.money == '' || values.money == null || values.money == undefined || /^[\s]*$/.test(values.money)){
                    return message.warn('请输入退款金额');
                }
                if(parseFloat(values.money) < 0){
                    return message.warn('金额不能小于0');
                }
                if(parseFloat(values.money)>parseFloat(refundFormCheckModalCheckDetail.money)){
                    return message.warn('金额超出限额');
                }
                if(!(/^\d+(\.\d+)?$/.test(values.money)) || parseFloat(values.money) < 0 || parseFloat(values.money)>parseFloat(refundFormCheckModalCheckDetail.money)){
                    return message.warn('金额输入有误，请检查是否为数字');
                }
                if(!(/^\d+(\.\d{1,2})?$/.test(values.money))){
                    return message.warn('金额输入有误，不能超过小数点后两位');
                }
                values.realMoney = refundFormCheckModalCheckDetail.money;
                RefundFormCheckModalPass(values);
            }
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        RefundFormCheckModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '审核退款',
        maskClosable : false,
        visible : refundFormCheckModalVisible,
        closable : true,
        width : 550,
        onCancel : handleCancel,
        footer : [
            <Popconfirm placement = "top" title = '确定驳回？' onConfirm = {(e) => handleComplete(e,'reject')} okText = "是" cancelText = "否">
                <Button key="cancel" type="primary"
                        className={styles.reject_button}
                        disabled={refundFormCheckModalRejectButtonLoading}
                        loading={refundFormCheckModalRejectButtonLoading}>驳回</Button>
            </Popconfirm>,
            <Popconfirm placement = "top" title = '确定通过？' onConfirm = {(e) => handleComplete(e,'pass')} okText = "是" cancelText = "否">
                <Button key="submit" type="primary"
                        disabled={refundFormCheckModalPassButtonLoading}
                        loading={refundFormCheckModalPassButtonLoading}
                        style={{marginLeft:20}}>通过</Button>
            </Popconfirm>
        ],
        className : 'refund_form_rejectModal'
    };

    return (
        <Modal {...modalOpts}>
            <div className={styles.all}>
                <div>
                    退款单编号：{ refundFormCheckModalCheckDetail.id }
                </div>
                <div>
                    类型：{ refundFormCheckModalCheckDetail.refundType && refundFormCheckModalCheckDetail.refundType == '1' ? '退款' :
                           refundFormCheckModalCheckDetail.refundType && refundFormCheckModalCheckDetail.refundType == '2' ? '退课时' : ''}
                </div>
                <Form>
                    { refundFormCheckModalCheckDetail.refundType && refundFormCheckModalCheckDetail.refundType == '1' ?
                        <FormItem
                            label = "退款金额"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('money',{
                                initialValue : refundFormCheckModalCheckDetail.money + '' || undefined
                            })(
                                <Input placeholder = '（确认时必填，驳回时填写无效）' style = {{ width : 200 }} disabled = { true }/>
                            )}
                        </FormItem>
                        :
                        <div style={{position:'relative'}}>
                            <FormItem
                                label = "退款金额"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('money')(
                                    <Input placeholder = '（确认时必填，驳回时填写无效）' style = {{ width : 200 }}/>
                                )}
                            </FormItem>
                            <span style={{position:'absolute',top:'5px',left:'300px',color:'rgba(0, 0, 0, 0.4)'}}>最多可退{refundFormCheckModalCheckDetail.money}元</span>
                            <QueueAnim
                                type={['top', 'top']}
                                ease={['easeOutQuart', 'easeInOutQuart']}>
                                { !isNaN(parseFloat(getFieldValue('money'))) && parseFloat(getFieldValue('money')) > 0 && parseFloat(getFieldValue('money'))<=parseFloat(refundFormCheckModalCheckDetail.money) ?
                                    <div className = {styles.refund_money_intro} key = 'refund_money_intro'>
                                        已退{parseFloat(getFieldValue('money'))}元，剩下
                                        {(parseFloat(refundFormCheckModalCheckDetail.money) - parseFloat(getFieldValue('money'))).toFixed(2)}
                                        元作为手续费
                                    </div>
                                    :
                                    null
                                }
                            </QueueAnim>
                        </div>
                    }
                </Form>
                { refundFormCheckModalCheckDetail.refundType && refundFormCheckModalCheckDetail.refundType == '2' ?
                    <div className={styles.course_detail}>
                        课程信息：
                        <div>{ course || [] }</div>
                    </div>
                    :
                    null
                }
                <Form>
                    <FormItem
                        label = "审核说明"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('refundWay',{
                            rules : [
                                { required : true , message : '请输入审核说明(200字以内)' , whitespace : true , max: 200 },
                            ]
                        })(
                            <Input type = 'textarea' placeholder = '请输入审核说明(200字以内)' autosize = {{ minRows : 3 , maxRows : 3 }}/>
                        )}
                    </FormItem>
                </Form>
            </div>
        </Modal>
    );
};

export default Form.create()(CheckModal);
