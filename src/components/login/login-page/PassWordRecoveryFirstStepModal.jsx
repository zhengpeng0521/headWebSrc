import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Checkbox, Upload, Icon } from 'antd';
import VeryCodeButton from '../../../pages/common/very-code-button/VeryCodeButton';
import style from './PassWordRecoveryFirstStepModal.less';

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
const PassWordRecoveryFirstStepModal = ({
    passWordRecoveryFirstStepModalVisible,          //密码重置modal是否显示
    passWordRecoveryFirstStepModalButtonLoading,    //密码重置modal按钮是否在加载状态

    PassWordRecoveryFirstStepModalGetVeryCode,      //点击获取验证码
    PassWordRecoveryFirstStepModalSubmit,           //密码重置提交
    PassWordRecoveryFirstStepModalCancel,           //密码重置modal关闭

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
            let data = getFieldsValue();
            PassWordRecoveryFirstStepModalSubmit(data);
            resetFields();
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        PassWordRecoveryFirstStepModalCancel();
        resetFields();
    }

    //模态框的属性
    let modalOpts = {
        title: '密码重置',
        maskClosable : false,
        visible : passWordRecoveryFirstStepModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={passWordRecoveryFirstStepModalButtonLoading}
                    loading={passWordRecoveryFirstStepModalButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_password_recovery_first_step_modal'
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

    //表单校验
    function check(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('验证码不能为空'));
        }else{
            callback();
        }
    }

    //获取验证码时检验手机号
    function CheckVeryCode(mobile){
        if(mobile == '' || mobile == null || mobile == undefined || /^[\s]*$/.test(mobile)){
            message.error('手机号不能为空');
        }else{
            PassWordRecoveryFirstStepModalGetVeryCode(mobile)
        }
    }

    return (
        <div>
            <Modal {...modalOpts}>
                <Form horizontal className='zj_password_recovery_first_step_form'>
                    <FormItem
                        label="手机号"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('mobile', {
                            rules: [
                                { required: true, message: '请输入手机号' },{validator: checkMobile},
                            ],
                        })(
                            <Input type="text" placeholder='请输入手机号' size='default'/>
                        )}
                    </FormItem>
                </Form>
                <Form inline>
                    <FormItem
                        label="验证码"
                        {...formItemInLineLayout}
                        style={{ marginLeft : 20 }}
                    >
                        {getFieldDecorator('verifyCode', {
                            rules: [
                                { required: true, message: '请输入验证码' },{validator: check},
                            ],
                        })(
                            <Input type="text" placeholder='请输入验证码' size='default' style={{ width : 200 }}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemInLineLayout}
                    >
                        <VeryCodeButton
                            onClick={() => CheckVeryCode(getFieldValue('mobile'))}/>
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
};

export default Form.create()(PassWordRecoveryFirstStepModal);
