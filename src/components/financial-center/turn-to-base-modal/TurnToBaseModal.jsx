import React from 'react';
import { Modal , Form , Spin , Button , Input } from 'antd';
import VeryCodeButton from '../../../pages/common/very-code-button/VeryCodeButton';
import styles from './TurnToBaseModal.less';
const FormItem = Form.Item;
const formItemLayout = {
   labelCol : { span: 4 },
   wrapperCol: { span: 20 },
};
/*转给总部modal*/
function TurnToBaseModal({
    turnToBaseModalVisible,             //是否显示
    turnToBaseModalLoading,             //modal加载状态
    turnToBaseModalButtonLoading,       //modal提交按钮加载状态
    TurnToBaseModalClose,               //关闭modal
    verificationCodeFun,                //点击获取验证码
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
}){

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            console.info('values',values)
            if (!!errors) {
                return;
            }
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        TurnToBaseModalClose();
    }

    //模态框的属性
    let modalOpts = {
    title : '转给总部' ,
    maskClosable : false,
    visible : turnToBaseModalVisible,
    closable : true,
    width : 550,
    onOk: handleComplete,
    onCancel : handleCancel,
    footer : [
        <Button key = "cancel" type = "ghost" onClick = { handleCancel }>取消</Button>,
        <Button key = "submit" type = "primary"
                onClick = { handleComplete }
                disabled = { turnToBaseModalButtonLoading }
                loading = { turnToBaseModalButtonLoading }
                style = {{ marginLeft : 10 }}>确认</Button>
    ],
    className : 'online_account_turn_to_base'
  };

    //整数
    function checkNum(rule, value, callback){
        if(value && value != '') {
	      if(!(/^[0-9]\d*$/.test(value))){
	          callback('请填写整数');
	        } else {
	          callback();
	        }
	    } else {
	      callback();
	    }
    }

    return (
        <Modal {...modalOpts}>
            <Spin spinning = { turnToBaseModalLoading }>
                <div className = { styles.money }>
                    <FormItem
                        label="金额"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('pids',{
                            initialValue : ''
                        })(
                            <Input placeholder = '请输入金额' size = 'default'/>
                        )}
                    </FormItem>
                    <a style = {{ marginLeft : 10 }}>全部转进</a>
                </div>
                <FormItem
                    { ...formItemLayout }
                    label = "安全认证手机"
                >
                    { getFieldDecorator('mentionPhone')(
                        <Input placeholder = '请输入安全认证手机' disabled size = 'default'/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "验证码"
                >
                    { getFieldDecorator('mentionPhoneVal' , {
                        rules : [
                            { required : true , message : '请输入验证码' },
                            { validator: checkNum },
                        ],
                    })(
                        <div>
                            <Input size = 'default' style = {{ width : 140 }} placeholder = '请输入验证码'/>
                            <VeryCodeButton onClick = { verificationCodeFun } />
                        </div>
                    )}
                </FormItem>
            </Spin>
        </Modal>
    );
}

export default Form.create()(TurnToBaseModal);
