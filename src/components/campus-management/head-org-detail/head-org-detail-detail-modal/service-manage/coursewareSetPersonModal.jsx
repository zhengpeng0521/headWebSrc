import React from 'react';
import { Button , Modal , Form , Input , Select, Radio ,message ,Spin } from 'antd';
let FormItem = Form.Item;
let Option = Select.Option;

function CoursewareSetPersonModal({
    cancelCourseSetPerson, //取消
    confirmCourseSetPerson, //确认
    courseSetPersonList,   //课件可见人列表
    courseSetPersonVisible, //是否可见
    courseSetPersonLoading, //按钮加载状态
    courseSetPersonModalLoading,
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
	//表单布局
	let formItemLayout = {
		labelCol : { span : 6},
		wrapperCol : { span : 17 }
	};

	//保存
	function confirmCourseSetPersonAction(){
		validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            if((values.userId).length==0){
                message.error('请选择可见人');
                return ;
            }
            values.userId = (values.userId).join(',');
            confirmCourseSetPerson(values);
            resetFields();
        });
	};

    let personList = [];
    if(courseSetPersonList && courseSetPersonList.length > 0){
        personList = courseSetPersonList.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' }>{ item.name + '' }</Option>
            );
        })
    }
    //下拉框选择
    function handleChange(){

    }
	return (
        <Modal
            title = "课件可见人"
            visible = { courseSetPersonVisible }
            width = '400px'
            onCancel = { cancelCourseSetPerson }
            maskClosable = { false }
            footer = {[
                <Button key = "cancel" onClick = { cancelCourseSetPerson } >取消</Button>,
                <Button
                    key = "confirm"
                    type = "primary"
                    onClick = { confirmCourseSetPersonAction }
                    disabled = { courseSetPersonLoading }
                    loading = { courseSetPersonLoading }
                    >保存</Button>,
            ]}
        >
            <Spin spinning = { courseSetPersonModalLoading }>
            <Form>

                <FormItem
                    { ...formItemLayout }
                    label = "课件可见人"
                >
                    { getFieldDecorator('userId',{
                        initialValue : undefined,

                    })(
                        <Select
                            mode = 'multiple'
                            notFoundContent = "未找到"
                            showSearch
                            allowClear
                            size = 'default'
                            placeholder = '请选择课件可见人'
                            optionFilterProp="children"
                            style = {{ width : 220 }}>
                            { personList || [] }
                        </Select>
                    )}
                </FormItem>

            </Form>
            </Spin>
        </Modal>
	)
}

export default Form.create()(CoursewareSetPersonModal);
