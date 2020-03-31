import React from 'react';
import style from './StudentWorksUpdate.less';
import { Form, Modal, Button, Popconfirm, Icon, Row, Col, Select, Upload, Input } from 'antd';
let Option = Select.Option;
let FormItem = Form.Item;

function StudentWorksUpdate({
	updateWorksModalVisible,
    studentWorkInfo,
    imgUrl,
    stuId,

    tagIdList,
    stuIdList,

    confirmUpdateWorks,
    cancelUpdateWorks,

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

    function confirmUpdateWorksAction(){
        validateFieldsAndScroll(( err, value ) => {
            if( !!err ){
                return
            }
            confirmUpdateWorks( value );
            cancelUpdateWorksAction();
        })
    };

    //取消
    function cancelUpdateWorksAction(){
        resetFields();
        cancelUpdateWorks();
    };

    let formItemLayout = {
        labelCol : { span : 4 },
		wrapperCol : { span : 20 }
    }

	return(
       <Modal
            className = "yhwu_works_update_modal"
            visible = { updateWorksModalVisible }
            title = '学员作品信息'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelUpdateWorks }
            footer = {[
				<Button key = "confirmUpdateStudentWork" type = "primary" onClick = { confirmUpdateWorksAction } >保存</Button>,
				<Button key = "cancelUpdateStudentWork" onClick = { cancelUpdateWorksAction } >取消</Button>
			]}
        >
            <div className = { style.update_content }>
                <div>
                    <img alt="example" width="100%" src= { imgUrl } />
                </div>
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label = '作品分类'
                    >
                        { getFieldDecorator('tagId',{
                            initialValue : studentWorkInfo.tagId || '未分类',
                            rules : [
                                { required : true, message : '请选择分类' }
                            ]
                        })(
                            <Select
                                showSearch
                                placeholder = '请选择分类'
                            >
                                {
                                    tagIdList && tagIdList.map(function(item, index){
                                        return (<Option key = { 'student_work_' + item.key } value = { item.id } >{ item.name }</Option>)
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '所属学员'
                    >
                        { getFieldDecorator('stuId',{
                            initialValue : studentWorkInfo.stuId || '',
                            rules : [
                                { required : true, message : '请选择学员' }
                            ]
                        })(
                            <Select
                                showSearch
                                placeholder = '请选择学员'
                                disabled = { !!stuId }
                            >
                                {
                                    stuIdList && stuIdList.map(function(item, index){
                                        return ( <Option key = { 'student_work_' + item.stuId } value = { item.stuId } >{ item.stuName }</Option> )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = '作品标题'
                    >
                        { getFieldDecorator('title',{
                            initialValue : studentWorkInfo.title || '',
                            rules : [
                                { required : true, message : '请输入标题' }
                            ]
                        })(
                            <Input placeholder = '请输入标题' />
                        )}
                    </FormItem>
                </Form>
            </div>
        </Modal>

	)
};

export default Form.create({})(StudentWorksUpdate);
