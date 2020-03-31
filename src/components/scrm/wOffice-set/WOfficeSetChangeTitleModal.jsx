import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, message, Radio } from 'antd';
import QueueAnim from 'rc-queue-anim';
let Option = Select.Option;
let FormItem = Form.Item;

function WOfficeSetChangeTitleModal({
	changeTitleModal,
	title,
	linkUrl,
	name,

	cancelChangeTitle,
	confirmChangeTitle,

    form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	},

}){

	function confirmChangeTitleAction(){
		validateFieldsAndScroll( ( err, value ) => {
			if( !!err ){
				return;
			};
			confirmChangeTitle( value );
		});
	};

	function afterClose(){
		resetFields();
	};

	//校验字数
	function checkTitle( rule, value, callback ){
		if(!(/^[^\n]{1,4}$/.test(value))){
    		callback('不能超过4个字符');
    	}else if((/^[\s]{1,4}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	};

	let formItemLayout = {
        labelCol : { span : 4 },
		wrapperCol : { span : 18 }
	};

	return(
       <Modal
            className = "w_office_change_title"
            visible = { changeTitleModal }
            title = '显示项设置'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelChangeTitle }
		   	afterClose = { afterClose }
            footer = {[
				<Button key = "cancelAddClassPackage"  onClick = { cancelChangeTitle } >取消</Button>,
				<Button key = "confirmAddClassPackage" type = "primary" onClick = { confirmChangeTitleAction } >保存</Button>
			]}
        >
            <Form>
                <FormItem
                    label = "显示项名称"
                    { ...formItemLayout }
					extra = '建议字数2~4字, 如无特殊要求, 请使用默认名称'
                >
                    { getFieldDecorator('title',{
                        initialValue : title || '',
                        rules : [
                            { required : true, message : '请输入显示项名称' },
							{ validator : checkTitle }
                        ]
                    })(
                        <Input size = 'default' placeholder = '请输入显示项名称' />
                    )}
                </FormItem>
				{ name == 'otherTab' &&
					<FormItem
						label = "外链地址"
						{ ...formItemLayout }
						help = '链接必须以 http:// 或 https:// 开头'
					>
						{ getFieldDecorator('url',{
							initialValue : linkUrl || '',
							rules : [
								{ required : true, message : '请输入正确的外链地址' }
							]
						})(
							<Input size = 'default' placeholder = '请输入正确的外链地址' />
						)}
					</FormItem>
				}
            </Form>
        </Modal>
	)
};

export default Form.create({})(WOfficeSetChangeTitleModal);
