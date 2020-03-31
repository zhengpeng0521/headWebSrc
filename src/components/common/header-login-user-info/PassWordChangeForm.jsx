import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Checkbox, Upload, Icon } from 'antd';
import VeryCodeButton from '../../../pages/common/very-code-button/VeryCodeButton';
import style from './PassWordChangeForm.less';

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


/*密码重置modal*/
const PassWordChangeForm = ({
    passWordChangeModalVisible,             //修改密码modal是否显示
    passWordChangeModalButtonLoading,       //修改密码modal按钮加载状态

    PassWordChangeModalSubmit,              //密码重置提交
    PassWordChangeModalCancel,              //密码重置modal关闭

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
            if(getFieldValue('newPassword') != getFieldValue('confirmPassword')){
                message.error('新密码与确认新密码不一致，请修改');
                return;
            }
            PassWordChangeModalSubmit(data);
            resetFields();
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        PassWordChangeModalCancel();
        resetFields();
    }

    //模态框的属性
    let modalOpts = {
        title: '重置密码',
        maskClosable : false,
        visible : passWordChangeModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={passWordChangeModalButtonLoading}
                    loading={passWordChangeModalButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_password_change_modal'
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

    return (
        <Modal {...modalOpts}>
            <Form className='zj_password_change_form'>
                <FormItem
                    label="原密码"
                    {...formItemLayout}
                >
                    {getFieldDecorator('oldPassword', {
                        rules: [
                            { required: true, message: '请输入原密码' },{validator: checkPassWord},
                        ],
                    })(
                        <Input type="password" placeholder='请输入原密码' size='default'/>
                    )}
                </FormItem>
                <FormItem
                    label="新密码"
                    {...formItemLayout}
                >
                    {getFieldDecorator('newPassword', {
                        rules: [
                            { required: true, message: '请输入新密码(6-12位)', min : 6 , max : 12 },{validator: checkPassWord},
                        ],
                    })(
                        <Input type="password" placeholder='请输入新密码(6-12位)' size='default'/>
                    )}
                </FormItem>
                <FormItem
                    label="确认新密码"
                    {...formItemLayout}
                >
                    {getFieldDecorator('confirmPassword', {
                        rules: [
                            { required: true, message: '请确认新密码(6-12位)' , min : 6 , max : 12 },{validator: checkPassWord},
                        ],
                    })(
                        <Input type="password" placeholder='请确认新密码(6-12位)' size='default'/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
};

export default Form.create()(PassWordChangeForm);
