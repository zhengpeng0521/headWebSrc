import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Popover, Radio, DatePicker } from 'antd';
import styles from './LeadsFollowDetailSendOtherModal.less';
import QueueAnim from 'rc-queue-anim';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

/*转给他人modal*/
const LeadsFollowDetailSendOtherModal = ({
    leadsFollowDetailSendOtherModalVisible,         //转给他人modal是否显示
    leadsFollowDetailSendOtherModalButtonLoading,   //转给他人modal按钮是否加载
    leadsFollowDetailSendOtherModalStaffMessage,    //转给他人modal选择销售下拉列表内容
    leadsFollowDetailSendOtherModalWetherShowAlert, //当前员工leads数分配过后是否已超标，超标显示提示信息并且不可提交

    LeadsFollowDetailSendOtherModalSelectOnChange,  //销售员工下拉列表onChange事件
    LeadsFollowDetailSendOtherModalSubmit,          //转给他人modal提交
    LeadsFollowDetailSendOtherModalCancel,          //转给他人modal关闭
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {

    /*员工信息渲染*/
    let staffContent = [];
    if(leadsFollowDetailSendOtherModalStaffMessage && leadsFollowDetailSendOtherModalStaffMessage.length > 0){
        staffContent = leadsFollowDetailSendOtherModalStaffMessage.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' }>{ item.name + '' }</Option>
            );
        })
    }

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors) => {
            if (!!errors) {
                return;
            }
            let data = getFieldsValue();

            //销售员工已有分配数+即将分配数<=最大分配数的时候才能提交
            if(!leadsFollowDetailSendOtherModalWetherShowAlert){
                LeadsFollowDetailSendOtherModalSubmit(data);
            }
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        LeadsFollowDetailSendOtherModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '转给他人',
        maskClosable : false,
        visible : leadsFollowDetailSendOtherModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={leadsFollowDetailSendOtherModalButtonLoading}
                    loading={leadsFollowDetailSendOtherModalButtonLoading}
                    style={{marginLeft:20}}>保存</Button>
        ],
        className : 'LeadsFollowDetailSendOtherModal'
    };

    return (
        <Modal {...modalOpts}>
            <Form>
                <FormItem
                    label = "选择销售"
                    {...formItemLayout}
                >
                    {getFieldDecorator('seller', {
                        rules : [
                            { required : true , message : '请选择销售' }
                        ]
                    })(
                        <Select placeholder = '请选择销售'
                                size = 'default'
                                allowClear
                                showSearch
                                optionFilterProp = "children"
                                notFoundContent = "未找到"
                                onChange = { LeadsFollowDetailSendOtherModalSelectOnChange }>
                            { staffContent || [] }
                        </Select>
                    )}
                </FormItem>
                <QueueAnim
                    type={['top', 'top']}
                    ease={['easeOutQuart', 'easeInOutQuart']}>
                    { leadsFollowDetailSendOtherModalWetherShowAlert ?
                        <div className={styles.leads_follow_modals_alert_message} key='leads_follow_modals_alert_message_reject'>
                            <span>温馨提示&nbsp;</span>
                            <span>
                                该员工名单数已达上限，请重新处理
                            </span>
                        </div>
                        :
                      leadsFollowDetailSendOtherModalWetherShowAlert == false ?
                        <div className={styles.leads_follow_modals_alert_message} key='leads_follow_modals_alert_message_allow'>
                            <span>温馨提示&nbsp;</span>
                            <span>
                                可以分配给该员工
                            </span>
                        </div>
                        :
                        null
                    }
                </QueueAnim>
            </Form>
        </Modal>
    );
};

export default Form.create()(LeadsFollowDetailSendOtherModal);
