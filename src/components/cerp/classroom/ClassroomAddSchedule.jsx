import React from 'react';
import QueueAnim from 'rc-queue-anim';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import style from '../course-manage/course-manage-add-or-edit/CourseManageCreate.less';
import { Button , Modal , Form , Input , Select, Radio, InputNumber  } from 'antd';
let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;

function ClassroomAddSchedule({
	//confirmEditFrom,
    addSchduleVisible,
    cancelAddSchdule,
    //打开校区选择框
    selectOrgs, onOpenSelectOrgModal, selectModalVisible, onSelectOrgModalClose, afterSelectOrgModal,

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
        setFieldsValue({ 'orgId' : org_select.join(',') });
        afterSelectOrgModal(org_select);
    };

    //校区选择框属性
    let tenantOrgSelectProps = {
        visible    : selectModalVisible,
        onClose    : onSelectOrgModalClose,
        afterSubmit: afterSelectOrgModalSubmit,
        init_org_select: selectOrgs,
        width : 390,
    };

	//表单布局
	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 19 }
	};

	//保存新建课程
	function confirmAddSchduleAction(){
		validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }


        });
	};

	//取消新建课程
	function cancelAddSchduleAction(){
        resetFields();
        cancelAddSchdule();
	};


	return (
        <Modal
            className = "yhwu_course_modal_content"
            title = "添加排课"
            visible = { addSchduleVisible }
            width = '550px'
            onCancel = { cancelAddSchduleAction }
            maskClosable = { false }
            footer = {[
                <Button key = "confirm" type = "primary" onClick = { confirmAddSchduleAction } >生成</Button>,
            ]}
        >
            <Form>
                <div className = "yhwu_base_setting" >
                    <span>课程信息</span>
                </div>
                <FormItem
                    label="所属校区"
                    {...formItemLayout}
                    style={{lineHeight:'12px'}}
                >
                    {getFieldDecorator('orgId',{
                        initialValue : '',
                        rules : [
                            { required : true , message : '请选择校区'}
                        ]
                    })(
                        <TenantOrgFilter {...tenantOrgSelectProps}/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "课程名称"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('title',{
                        initialValue : '',
                        rules : [
                            { required : true , message : '请输入课程名称' }
                        ]
                    })(
                        <Select style={{width:'390px'}}>
                            { [] }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "主教"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('mainTeacher',{
                        initialValue : '',
                        rules : [
                            { required : true , message : '请输入主教名称' }
                        ]
                    })(
                        <Select style={{width:'390px'}}>
                            { [] }
                        </Select>
                    )}
                </FormItem>
               <FormItem
                    { ...formItemLayout }
                    label = "助教"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('subTeacher',{
                        initialValue : '',
                        rules : [
                            { required : true , message : '请输入助教名称' }
                        ]
                    })(
                        <Select style={{width:'390px'}}>
                            { [] }
                        </Select>
                    )}
                </FormItem>


                <FormItem
                    { ...formItemLayout }
                    label = "教室"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('classRoom' , {
                        initialValue : '',
                        rules : [
                            { required : true, message : '教室' }
                        ],
                    })(
                        <Select style={{width:'390px'}}>
                            { [] }
                        </Select>
                    )}
                </FormItem>
                <div className = "yhwu_base_setting" >
                    <span>人数上限设置</span>
                </div>
                <FormItem
                    { ...formItemLayout }
                    label = "上课人数"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('goToClass',{
                        initialValue : '',
                        rules : [
                            { required : true , message : '请输入上课人数' }
                        ]
                    })(
                        <InputNumber  min={0} style = {{ width : '390px'}} placeholder = "请输入上课人数" size='default'/>
                    )}
                </FormItem>


                <FormItem
                    { ...formItemLayout }
                    label = "试听人数"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('testNum' , {
                        initialValue : '',
                        rules : [
                            { required : true, message : '请输入试听人数' }
                        ],
                    })(
                        <InputNumber min={0} style = {{ width : '390px' }} placeholder = '填写试听人数' size='default'/>
                    )}
                </FormItem>

                <div className = "yhwu_base_setting" >
                    <span>时间设置</span>
                </div>
                <FormItem
                    { ...formItemLayout }
                    label = "排课方式"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('testNum' , {
                        initialValue : '',
                        rules : [
                            { required : true, message : '请输入试听人数' }
                        ],
                    })(
                         <RadioGroup style={{marginTop:'10px'}}>
                            <Radio value={1}>单选</Radio>
                            <Radio value={2}>循环</Radio>
                          </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "上课日期"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('goToClassData' , {
                        initialValue : '',
                        rules : [
                            { required : true, message : '请输入上课日期' }
                        ],
                    })(
                        <Select style={{width:'390px'}}>
                            { [] }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "上课时间"
                    style={{lineHeight:'12px'}}
                >
                    { getFieldDecorator('goToClassTime' , {
                        initialValue : '',
                        rules : [
                            { required : true, message : '请输入上课时间' }
                        ],
                    })(
                        <Select style={{width:'390px'}}>
                            { [] }
                        </Select>
                    )}
                </FormItem>




            </Form>
            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </Modal>
	)
}

export default Form.create({})(ClassroomAddSchedule);
