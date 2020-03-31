import React from 'react';
import styles from './ClassCreateForm.less';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm, message } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TenantOrgFilter from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
const FormItem = Form.Item;
let Option = Select.Option;

function ClassCreateForm({
	createVisible,
	orgId,
	userList,
	courseList,
	classInfo,
	btnLoading,

	classCreateCancel,
	classCreateConfirm,

	form: {
		getFieldDecorator,
		validateFields,
		getFieldValue,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
		setFieldsValue,
	}
}){
 	/*校区选择框属性*/
    let TenantOrgFilterProps = {
        width    : 432,
		disabled : true
    };

    const formItemLayout = {
		labelCol	: { span: 4 },
      	wrapperCol	: { span: 20 },
    };

	/*确认新增班级*/
	function classCreateConfirmAction(){
		validateFieldsAndScroll( ( err, values ) =>{
			if( !!err ){
				return;
			}
			//处理主教和助教
            for(let i in values.mainTeacherIds){
                for(let j in values.assistantTeacherIds){
                    if(values.mainTeacherIds[i] == values.assistantTeacherIds[j]){
                        message.error('主教和助教不能包含同一人');
                        return;
                    }
                }
            }

			let mainTeacherIds = !!values.mainTeacherIds ? values.mainTeacherIds.join(',') : '';
			let assistantTeacherIds = !!values.assistantTeacherIds ? values.assistantTeacherIds.join(',') : '';
			values.mainTeacherIds = mainTeacherIds;
			values.assistantTeacherIds = assistantTeacherIds;
			values.maxNum = Number( values.maxNum );
			classCreateConfirm( values )
		})
	}

	/*选择课程*/
	function selectCourseAction( value, option ){
		let num = option.props.num;
		let name = option.props.name;
		let str = name + ' ' + Number( num + 1 ) + '班';
		setFieldsValue({ 'name' : str })
	}

	function afterClose(){
		resetFields();
	}

	/*校验跟进记录 字数*/
	function checkRemark( rule, value, callback ){
		if( !(/^[^\n]{1,200}$/.test(value)) ){
    		callback('不能超过200个字符');
    	}else if((/^[\s]{1,200}$/.test(value))){
			callback("不能全为空格")
    	} else {
    		callback();
    	}
	}

	/*校验最大人数*/
	function checkMaxNum( rule, value, callback ){
		if( !(/^[1-9][0-9]*$/.test( value )) ){
			callback('只能输入正整数' )
		}else{
			callback()
		}
	}

	let mainTeacherArr = !!classInfo.mainTeacherIds && classInfo.mainTeacherIds.split(',');
	let assiTeacherArr = !!classInfo.assistanTeacherIds && classInfo.assistanTeacherIds.split(',');

	return(
		<Modal
			className = 'cerp_class_create_modal'
			title = "班级信息"
			visible = { createVisible }
			width = '550px'
			onCancel = { classCreateCancel }
			maskClosable = { false }
			afterClose = { afterClose }
			footer = {[
				<Button key = 'cancel' onClick = { classCreateCancel } >取消</Button>,
				<Button key = 'confirm' type = 'primary' onClick = { classCreateConfirmAction } style = {{ marginLeft : 20 }} disabled = { btnLoading } loading = { btnLoading } >
					保存
				</Button>,
			]}
		>
        	<Form>
				<FormItem
					{ ...formItemLayout }
					label = '所属校区'
				>
					{ getFieldDecorator('orgId',{
						initialValue : orgId || undefined,
						rules : [
							{ required : true, message : '请选择所属校区' }
						]
					})(
						<TenantOrgFilter { ...TenantOrgFilterProps } />
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '所属课程'
				>
					{ getFieldDecorator('courseId', {
						initialValue : classInfo.courseId || undefined,
						rules : [
							{ required : true, message : '请选择所属课程' }
						]
					})(
						<Select
							disabled = { !!classInfo.clsId }
							size = 'default'
							showSearch
							placeholder = '请选择所属课程'
							notFoundContent = "没有所属课程"
							optionFilterProp = 'children'
							onSelect = { selectCourseAction }
						>
							{ !!courseList && courseList.map(function( item, index ){
								return ( <Option key = { 'cerp_class_course_' + item.id } value = { item.id } name = { item.title } num = { item.couClassNum } >{ item.title }</Option> )
							})}
						</Select>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '班级名称'
				>
					{ getFieldDecorator('name', {
						initialValue : classInfo.name || undefined,
						rules : [
							{ required : true, message : '请输入班级名称' }
						]
					})(
						<Input size = 'default' placeholder = '请输入班级名称' />
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '主教'
				>
					{ getFieldDecorator('mainTeacherIds', {
						initialValue : mainTeacherArr || undefined,
						rules : [
							{ required : true, message : '请选择主教' }
						]
					})(
						<Select
							showSearch
							size = 'default'
							placeholder = '请选择主教'
							notFoundContent = "没有主教"
							optionFilterProp = 'children'
							mode = 'multiple'
						>
							{ userList && userList.map(function( item, index ){
								return ( <Option key = { 'cerp_class_main_teacher_' + item.userId } value = { item.userId + '' } >{ item.userName }</Option> )
							})}
						</Select>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '助教'
				>
					{ getFieldDecorator('assistantTeacherIds', {
						initialValue : assiTeacherArr || undefined,
					})(
						<Select
							showSearch
							size = 'default'
							placeholder = '请选择助教'
							notFoundContent = '没有助教'
							optionFilterProp = 'children'
							mode = 'multiple'
						>
							{ userList && userList.map(function( item, index ){
								return ( <Option key = { 'cerp_class_assi_teacher_' + item.userId } value = { item.userId + '' } >{ item.userName }</Option> )
							})}
						</Select>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '人数上限'
				>
					{ getFieldDecorator('maxNum', {
						initialValue : classInfo.maxNum || undefined,
						rules : [
							{ required : true, message : '请输入人数上限' },
							{ validator : checkMaxNum }
						]
					})(
						<Input size = 'default' placeholder = '请输入人数上限' />
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '备注'
					style = {{ marginBottom : '0' }}
				>
					{ getFieldDecorator('remarks', {
						initialValue : classInfo.remarks || undefined,
						rules : [
							{ validator : checkRemark }
						]
					})(
						<Input size = 'default' type = 'textarea' placeholder = '请输入备注' />
					)}
				</FormItem>
			</Form>
		</Modal>
    )
}

export default Form.create()(ClassCreateForm);
