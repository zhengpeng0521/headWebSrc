import React from 'react';
import QueueAnim from 'rc-queue-anim';
import TenantOrgSelect from '../../../../pages/common/tenant-org-select/TenantOrgSelect';
import TenantOrgFilter from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import style from './CourseManageCreate.less';
import { Button , Modal , Form , Input , Select, Radio ,InputNumber} from 'antd';
import { BlockHelp } from '../../../common/new-component/NewComponent';
let FormItem = Form.Item;
let Option = Select.Option;
let RadioGroup = Radio.Group;

function CourseManageCreate({
    classOrder,             //新增编辑时课阶课系内容
	confirmEditFrom,
    cancelEditForm,
	editFormVisible,
    ageType,   //新增编辑年龄类型
    courseInfo,

    ChangeAgeType,          //年龄类型onChange事件

    //打开校区选择框
    selectOrgs, onOpenSelectOrgModal, selectModalVisible, onSelectOrgModalClose, afterSelectOrgModal,
    remindEditStatus,

    modalButtonLoading,

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

    function changeAgeType(e){
        if(!!getFieldValue('minMa')){
            setFieldsValue({ 'minMa' : undefined });
        }
        if(!!getFieldValue('maxMa')){
            setFieldsValue({ 'maxMa' : undefined });
        }
        if(!!getFieldValue('minYe')){
            setFieldsValue({ 'minYe' : undefined });
        }
        if(!!getFieldValue('maxYe')){
            setFieldsValue({ 'maxYe' : undefined });
        }
        ChangeAgeType(e.target.value)
	}

    let minMax = '';
    let maxMax = '';
    if( courseInfo.minMa == undefined || courseInfo.minMa == null ){
        minMax = ''
    }else{
        minMax = courseInfo.minMa
    }

    if( courseInfo.maxMa == undefined || courseInfo.maxMa == null ){
        maxMax = ''
    }else{
        maxMax = courseInfo.maxMa
    }
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
        width : 394,
    };

	//表单布局
	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 20 }
	};

	//保存新建课程
	function confirmCreateFormAction(){
		validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            values.id = courseInfo.id;
            values.orgId = courseInfo.orgId;
            confirmEditFrom(values);
        });
	};

	//取消新建课程
	function cancelCreateFormAction(){
        resetFields();
        cancelEditForm();
	};

     function validator(rule, value, callback) {
        if (!/^(0|[1-9][0-9]*)$/.test(value)) {
            callback(new Error('月龄需为整数'));
        }else {
            callback();
        }

	}
    function checkCourseNum(rule, value, callback) {
        if(value == '' || value == undefined || value == null){
            callback();
        }else if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
            callback(new Error('数字格式不正确'));
        }else {
            callback();
        }
	}

	return (
        <Modal
            className = "zj_yhwu_course_manage_modal"
            title = "课程信息"
            visible = { editFormVisible }
            width = '550px'
            onCancel = { cancelCreateFormAction }
            maskClosable = { false }
            footer = {[
                <Button key = "cancel" onClick = { cancelCreateFormAction } >取消</Button>,
                <Button key = "confirm" type = "primary" onClick = { confirmCreateFormAction } loading = { modalButtonLoading } disabled = { modalButtonLoading } style = {{ marginLeft : 20 }}>保存</Button>,
            ]}
        >
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label = "课程名称"
                >
                    { getFieldDecorator('title',{
                        initialValue : courseInfo.title || '',
                        rules : [
                            { required : true , message : '请输入课程名称' }
                        ]
                    })(
                        <Input placeholder = "输入课程名称" size='default'/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = "选择课系"
                >
                    { getFieldDecorator('groupId',{
                        initialValue : courseInfo.groupId || undefined,
                        rules : [
                            { required : true , message : '请选择课系' }
                        ]
                    })(
                        <Select
                            notFoundContent = "未找到"
                            showSearch
                            size = 'default'
                            placeholder = '请选择课系'
                            optionFilterProp="children">
                            { classOrder && classOrder.length > 0 ?
                                classOrder.map(function(item,index){
                                    return(
                                        <Option value = { item.id + '' } key = { item.id + '' }>{ item.name + '' }</Option>
                                    )
                                })
                                :
                                []
                            }
                        </Select>
                    )}
                </FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '学员大小'
				>
					{ getFieldDecorator('ageType', {
						initialValue : !!courseInfo.ageType && courseInfo.ageType + '' || undefined,
						rules : [
							{ required : true, message : '请选择学员大小' }
						]
					})(
						<RadioGroup style = {{ marginTop : '6px' }} onChange = {(e) => changeAgeType(e)}>
							<Radio value = '1'>月龄</Radio>
							<Radio value = '2'>年龄</Radio>
						</RadioGroup>
					)}
				</FormItem>
				{ ageType == '1' ?
					<div style = {{ marginBottom : 10 }}>
						<FormItem
							{ ...formItemLayout }
							label = "最小月龄"
							style = {{ marginBottom : 10 }}
						>
							{ getFieldDecorator('minMa' , {
								initialValue : courseInfo.minMa + '' || undefined,
								rules : [
									{ required : true, message : '请输入最小上课月龄' },
									{ validator :  validator },
								],
							})(
								<InputNumber style = {{ width : 180 }} min={0} placeholder = '最小上课月龄' size='default'/>
							)}
						</FormItem>
						<FormItem
							{ ...formItemLayout }
							label = "最大月龄"
							>
								 { getFieldDecorator('maxMa' , {
									initialValue : courseInfo.maxMa || undefined,
									rules : [
										{ required : true, message : '请输入最大上课月龄' },
										{ validator :  validator },
									],
								})(
									<InputNumber style = {{ width : 180 }} min={1} placeholder = '最大上课月龄' size='default'/>
								)}
						</FormItem>
					</div>
					:
                    ageType == '2' ?
                        <div style = {{ marginBottom : 10 }}>
                            <FormItem
                                { ...formItemLayout }
                                label = "最小年龄"
                                style = {{ marginBottom : 10 }}
                            >
                                { getFieldDecorator('minYe' , {
                                    initialValue : Math.floor( courseInfo.minMa / 12 ) + '' || undefined,
                                    rules : [
                                        { required : true, message : '请输入最小上课年龄' },
                                        { validator :  validator },
                                    ],
                                })(
                                    <InputNumber style = {{ width : 180 }} min = { 0 } placeholder = '最小上课年龄' size='default'/>
                                )}

                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label = "最大年龄"
                            >
                                { getFieldDecorator('maxYe' , {
                                    initialValue : Math.ceil(courseInfo.maxMa / 12) || undefined,
                                     rules : [
                                        { required : true, message : '请输入最大上课年龄' },
                                        { validator :  validator },
                                    ],
                                })(
                                    <InputNumber style = {{ width : 180 }} min = { 1 } placeholder = '最大上课年龄' size='default'/>
                                )}
                            </FormItem>
                        </div>
                    :
                    null
				}
                <FormItem
                    { ...formItemLayout }
                    label = "每节消耗"
                    extra = '非负数，可精确到小数点后2位'
                >
                    { getFieldDecorator('cost' , {
                        initialValue : courseInfo.cost + '' || '',
                        rules : [
                            { required : true, message : '填写每节课程所需的课时数' },
                            { validator :  checkCourseNum },
                        ],
                    })(
                        <InputNumber style = {{ width : 180 }} min={0} placeholder = '填写每节课程所需的课时数' size='default'/>
                    )}
                </FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '耗课类型'
				>
					{ getFieldDecorator('cutType', {
						initialValue : !!courseInfo && courseInfo.cutType || undefined,
						rules : [
							{ required : true, message : '请选择耗课类型' }
						]
					})(
						<RadioGroup style = {{ marginTop : '6px' }} >
							<Radio value = '0'>可消耗专用课时，也可消耗通用课时</Radio>
							<Radio value = '1'>只消耗专用课时</Radio>
						</RadioGroup>
					)}
				</FormItem>
				<div style = {{ position : 'absolute', top : '335px', right : '75px' }}>
					<BlockHelp content = { <div><div>1.第一种方式，适用于当前课程消课先扣减专用课时，再扣减通用课时的情况</div><div>2.第二种方式，适用于该课程消课时候仅扣减专用课时</div></div>} />
				</div>
                <FormItem
                    { ...formItemLayout }
                    label = "课程介绍"
					style = {{ marginBottom : '0' }}
                >
                    { getFieldDecorator('intro' , {
                        initialValue : courseInfo.intro || '',
                        rules : [],
                    })(
                        <Input type = "textarea" placeholder = '填写课程相对应的介绍信息...' autosize = {{ minRows : 3 , maxRows : 4 }}/>
                    )}
                </FormItem>
            </Form>
            { remindEditStatus ? <div style={{width:'100%',textAlign:'center',color:'red'}}>最大月龄不能小于或等于最小月龄</div>
                    : null
            }

            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </Modal>
	)
}

export default Form.create({})(CourseManageCreate);
