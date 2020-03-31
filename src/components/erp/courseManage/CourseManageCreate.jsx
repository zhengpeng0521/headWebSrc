import React from 'react';
import QueueAnim from 'rc-queue-anim';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import style from './CourseManageCreate.less';
import { Button , Modal , Form , Input , Select, Radio } from 'antd';
let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;

function CourseManageCreate({
	confirmCreateForm,
    cancelCreateForm,

	createFormVisible,
    courseInfo,

    //打开校区选择框
    selectOrgs, onOpenSelectOrgModal, selectModalVisible, onSelectOrgModalClose, afterSelectOrgModal,

    modalSubmitModalButtonLoading,      //新增编辑表单按钮加载状态

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

    function afterSelectOrgModalSubmit( org_select ){
        setFieldsValue({ 'orgIds' : org_select.join(',') });
        afterSelectOrgModal(org_select);
    };

    //校区选择框属性
    let tenantOrgSelectProps = {
        visible    : selectModalVisible,
        onClose    : onSelectOrgModalClose,
        afterSubmit: afterSelectOrgModalSubmit,
        init_org_select: selectOrgs,
    };

	//表单布局
	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 19 }
	};

	//保存新建课程
	function confirmCreateFormAction(){
		validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            confirmCreateForm(values);
            resetFields();
        });
	};

	//取消新建课程
	function cancelCreateFormAction(){
        resetFields();
        cancelCreateForm();
	};

	function checkCourseNum(rule, value, callback) {
        if(value == '' || value == undefined || value == null){
            callback();
        }else if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
            callback(new Error('数字格式不正确'));
        }else {
            callback();
        }
	}

	function checkEachNum( rule, value, callback ){
		if( value == '' || value == undefined || value == null ){
			callback();
		}else if( !/^[1-9][0-9]*$/.test( value )){
			callback( '只能输入正整数' )
		}else {
			callback()
		}
	}

	return (
        <Modal
            className = "yhwu_course_modal_content"
            title = "课程信息"
            visible = { createFormVisible }
            width = '550px'
            onCancel = { cancelCreateFormAction }
            maskClosable = { false }
            footer = {[
                <Button key = "cancel" onClick = { cancelCreateFormAction } >取消</Button>,
                <Button
                    key = "confirm"
                    type = "primary"
                    onClick = { confirmCreateFormAction }
                    disabled = { modalSubmitModalButtonLoading }
                    loading = { modalSubmitModalButtonLoading }
                    >保存</Button>,
            ]}
        >
            <Form>
                <div className = "yhwu_base_setting" >
                    <span>基本信息</span>
                </div>
                <FormItem
                    { ...formItemLayout }
                    label = "开课校区"
                    style = {{ lineHeight : '32px' }}
                >
                    <span style = {{ color : '#5D9CEC', marginRight : '10px' }}>{ selectOrgs && selectOrgs.length || '0' }校区</span>
                     { getFieldDecorator('orgIds',{
                        initialValue : selectOrgs.join(',') || '',
                        rules : [
                            { required : true , message : '请选择校区' }
                        ]
                    })(
                        <Button type="primary" size = "small" onClick = { onOpenSelectOrgModal } >选择校区</Button>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "课程名称"
                >
                    { getFieldDecorator('title',{
                        initialValue : courseInfo.title || '',
                        rules : [
                            { required : true , message : '请输入课程名称' , whitespace : true }
                        ]
                    })(
                        <Input style = {{ width : '390px'}} placeholder = "输入课程名称" size='default'/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "课程类型"
                >
                    { getFieldDecorator('courseType',{
                        initialValue : courseInfo.courseType || '1',
                        rules : [
                            { required : true , message : '请选择收费类型'}
                        ]
                    })(
                        <RadioGroup disabled = { courseInfo && courseInfo.payType !== undefined } style = {{ width : '390px'}} >
							<Radio value = "1" >主题式 : 无上课进度, 每节课有独立的主题</Radio>
							<Radio value = "2" >渐进式 : 有上课进度, 例如12年义务教育的课程</Radio>
						</RadioGroup>
                    )}
                </FormItem>
                <QueueAnim
                    type = {[ 'top', 'bottom' ]}
                    ease = {[ 'easeOutQuart', 'easeInOutQuart' ]}
                    style = {{ width : '100%' }}
                >
					{  getFieldValue('courseType') == '2' &&
                        <FormItem
                            key = 'cnum'
                            { ...formItemLayout }
                            label = "课程节数"
                        >
                            { getFieldDecorator('cnum',{
                                initialValue : courseInfo.cnum || undefined,
                                rules : [
                                    { required : true , message : '请输入课时节数'},
									{ validator : checkEachNum }
                                ]
                            })(
                                <Input style = {{ width : '390px' }} placeholder = '请输入课时节数' size='default'/>
                            )}
                        </FormItem>
                    }
			    </QueueAnim>
                <FormItem
                    { ...formItemLayout }
                    label = "每节消耗"
                    extra = '非负数，可精确到小数点后2位'
                >
                    { getFieldDecorator('perNum' , {
                        initialValue : courseInfo.perNum != undefined && courseInfo.perNum != null ? courseInfo.perNum + '' : undefined,
                        rules : [
                            { required : true, message : '填写每节课程所需的课时数' , whitespace : true },
							{ validator : checkCourseNum }
                        ],
                    })(
                        <Input style = {{ width : '390px' }} placeholder = '填写每节课程所需的课时数' size='default'/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "课程介绍"
                >
                    { getFieldDecorator('intro' , {
                        initialValue : courseInfo.intro || '',
                    })(
                        <Input style = {{ width : '390px' }} type = "textarea" placeholder = '填写课程相对应的介绍信息...' autosize = {{ minRows: 3, maxRows: 4 }}/>
                    )}
                </FormItem>
            </Form>
            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </Modal>
	)
}

export default Form.create({})(CourseManageCreate);
