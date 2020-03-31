import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Checkbox, Upload, Icon } from 'antd';
import style from './PassWordRecoverySecondStepModal.less';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 18,
    },
};
const formItemInLineLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};


/*密码重置modal*/
const PassWordRecoverySecondStepModal = ({
    passWordRecoverySecondStepModalVisible,          //密码重置modal是否显示
    passWordRecoverySecondStepModalButtonLoading,    //密码重置modal按钮是否在加载状态
    tenantArray,                                     //租户下拉列表数组

    PassWordRecoverySecondStepModalSubmit,           //密码重置提交
    PassWordRecoverySecondStepModalCancel,           //密码重置modal关闭

    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors) => {
            if (!!errors) {
                return;
            }
            if(getFieldValue('newPassword') != getFieldValue('confirmPassword')){
                message.error('新密码与确认新密码不一致，请修改');
                return;
            }
            let data = getFieldsValue();
            PassWordRecoverySecondStepModalSubmit(data);
            resetFields();
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        PassWordRecoverySecondStepModalCancel();
        resetFields();
    }

    //模态框的属性
    let modalOpts = {
        title: '密码重置',
        maskClosable : false,
        visible : passWordRecoverySecondStepModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={passWordRecoverySecondStepModalButtonLoading}
                    loading={passWordRecoverySecondStepModalButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_password_recovery_second_step_modal'
    };

    /*检验联系方式*/
    function checkMobile(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(!(/^1[0-9]{10}$/.test(value))){
            callback(new Error('请输入正确的手机号'));
        }else{
            callback();
        }
    }

    /*检验密码是否有空格*/
    function checkPassWord(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('密码不能为空'));
        }else if(value.indexOf(" ") >= 0){
            callback(new Error('密码中不能包含空格'));
        }else{
            callback();
        }
    }

    /*将租户数组放到下拉列表中*/
    let tenant = [];
    if(tenantArray && tenantArray.length > 0){
        tenant = tenantArray.map((item,index) => {
            return(
                <Option key={index} value={item.id}>{item.name}</Option>
            );
        })
    }

    return (
        <div>
            <Modal {...modalOpts}>
                <Form horizontal className='zj_password_recovery_second_step_form'>
                    <FormItem
                        label="商户"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('tenantId', {
                            rules: [
                                { required: true, message: '请选择商户' }
                            ],
                        })(
                            <Select
                                type="password"
                                placeholder='请选择商户'
                                size='default'
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                notFoundContent="未找到">
                                { tenant || [] }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label="新密码"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('newPassword', {
                            rules: [
                                { required: true, message: '请输入新密码' },{validator: checkPassWord},
                            ],
                        })(
                            <Input type="password" placeholder='请输入新密码' size='default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label="确认新密码"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('confirmPassword', {
                            rules: [
                                { required: true, message: '请确认新密码' },{validator: checkPassWord},
                            ],
                        })(
                            <Input type="password" placeholder='请确认新密码' size='default' />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
};

export default Form.create()(PassWordRecoverySecondStepModal);
