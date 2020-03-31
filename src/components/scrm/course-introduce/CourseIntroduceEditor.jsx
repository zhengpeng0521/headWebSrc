import React from 'react';
import { Form, Modal ,Button , Popconfirm ,Icon, Select ,Upload,Input, message, Checkbox } from 'antd';
import RichEditor from '../../common/rich-editor/RichEditor';
let FormItem = Form.Item;

function CourseIntroduceEditor({

    courseIntroduceEditorVisible,
    htmlDetail,

    confirmAddCourseEditor,
    cancelAddCourseEditor,

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

    //确认新建课程
    function confirmCourseEditorAction(){
        let htmlDetail = UE.getEditor('parent_notice_cont_richeditor').getContent();
        setFieldsValue({ htmlDetail });
        validateFieldsAndScroll( ( err, value ) => {
             if( !!err ){
                 return;
             };
             confirmAddCourseEditor( value );
             resetFields();
         });
    };

    //取消新建课程
    function cancelCourseEditorAction(){
        resetFields();
        cancelAddCourseEditor();
    };

	return(
       <Modal
            className = "yhwu_follow_up_modal"
            visible = { courseIntroduceEditorVisible }
            title = { '课程详情' }
            maskClosable = { false }
            closable = { false }
            width = '550px'
            footer = {[
				<Button key = "cancelAddCourseIntroduce"  onClick = { cancelCourseEditorAction } >取消</Button>,
				<Button key = "confirmAddCourseIntroduce" type = "primary" onClick = { confirmCourseEditorAction } >保存</Button>
			]}
        >
            <Form>
                <FormItem>
                       {
                            getFieldDecorator('htmlDetail', {
                                initialValue: htmlDetail,
                                rules: [{
                                    required: true, message: '请输入课程详情',
                                }],
                            })(
                                <RichEditor UEId="parent_notice_cont_richeditor" />
                            )
                        }
                </FormItem>
            </Form>
        </Modal>
	)
};

export default Form.create({})(CourseIntroduceEditor);
