import React from 'react';
import { Form, Modal, Input, Button } from 'antd';
import style from './WxActivityRemarkModal.less';
const FormItem = Form.Item;

function WxActivityRemarkModal({
    remark,
    remarkModalVisible,

    cancelAddRemark,
    confirmAddRemark,
    form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	}
}){

    //确认新增
    function confirmAddRemarkAction(){
        validateFieldsAndScroll( ( err, value ) => {
            if( !!err ){
                return;
            };
            confirmAddRemark( value );
        })
    };

    //模态框关闭后的回调
    function afterClose(){
        resetFields();
    };

	return(
       <Modal
            className = "yhwu_wx_remark_modal"
            visible   = { remarkModalVisible }
            title     = '添加备注'
            maskClosable = { false }
            width     = '400px'
            onCancel  = { cancelAddRemark }
            afterClose = { afterClose }
            footer    = {[
				<Button key = "cancelAddClassPackage"  onClick = { cancelAddRemark } >取消</Button>,
				<Button key = "confirmAddClassPackage" type = "primary" onClick = { confirmAddRemarkAction } >保存</Button>
			]}
        >
            <Form>
                <FormItem>
                    { getFieldDecorator('remark',{
                        initialValue : remark || '',
                        rules : [
                            { required : true, message : '请填写备注信息' }
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请填写备注信息...' size = 'default' />
                    )}
                </FormItem>
            </Form>
        </Modal>
	)
};

export default Form.create({})(WxActivityRemarkModal);
