import React from 'react';
import { Form, Button, Input ,Modal ,} from 'antd';
import style from './CommunicationRecordCreate.less';
const FormItem = Form.Item;

function CommunicationRecordCreate({
    communicationRecordVisible,
    communicationContent,

    confirmAddCommunicationRecord,
    cancelAddCommunicationRecord,
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
    //确定新增沟通记录
    function confirmAddCommunicationRecordAction(){
        let values = getFieldsValue();
        confirmAddCommunicationRecord(values);
    };
    //取消新增沟通记录
    function cancelAddCommunicationRecordAction(){
        resetFields();
        cancelAddCommunicationRecord();
    };
    return (
        <Modal
            className = 'yhwu_modal_communication_record'
            visible = { communicationRecordVisible }
            width = '550px'
            closable = { false }
			maskClosable = { false }
            footer = { null }
        >
            <Form>
                <FormItem>
                    { getFieldDecorator('communicationRecord',{
                        initialValue : '' || communicationContent,
                        rules : [
                            { required : 'true', message : '请输入沟通记录' }
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请输入沟通记录...' />
                    )}
                </FormItem>
                <div className = 'yhwu_search_btn_group'>
                    <Button onClick = { confirmAddCommunicationRecordAction } type = 'primary' >确定</Button>
                    <Button onClick = { cancelAddCommunicationRecordAction } style = {{ marginLeft : '10px' }} >取消</Button>
                </div>
            </Form>
        </Modal>
    )
}
export default Form.create({})(CommunicationRecordCreate);
