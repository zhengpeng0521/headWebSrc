import React from 'react';
import styles from './EditClassInfoModal.less';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm, TimePicker, Popover } from 'antd';
import { BlockPicker } from 'react-color';
import moment from 'moment';
const FormItem = Form.Item;
let Option = Select.Option;

function EditClassInfoModal({
	editClassInfoVisible,
	editClassInfoObj,
	userList,
	roomList,

	classInfoCreateCancel,
	classInfoCreateConfirm,

	form: {
		getFieldDecorator,
		validateFields,
		getFieldValue,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
		setFieldsValue
	}
}){
    const formItemLayout = {
		labelCol	: { span: 4 },
      	wrapperCol	: { span: 19 },
    };

	const formItemLayoutTwo = {
		labelCol : { span : 8 },
		wrapperCol : { span : 14 }
	}

	/*确认修改信息*/
	function classInfoCreateConfirmAction(){
		validateFieldsAndScroll( ( err, values ) =>{
			if( !!err ){
				return;
			}
			for(let i in values.mtids){
                for(let j in values.atids){
                    if(values.mtids[i] == values.atids[j]){
                        message.error('主教和助教不能包含同一人');
                        return;
                    }
                }
            }
			values.atids = !!values.atids && values.atids.join(',') || undefined;
			values.mtids = !!values.mtids && values.mtids.join(',') || undefined;
			values.startTime = !!values.startTime && values.startTime.format('HH:mm');
			values.endTime = !!values.endTime && values.endTime.format('HH:mm');
			classInfoCreateConfirm( values )
		})
	}

	function afterClose(){
		resetFields();
	}

	//排课颜色选择器
    let scheduleColorPick = (
        <BlockPicker
            triangle = 'hide'
            color = { getFieldValue('color') || '#1dafe4' }
            colors = {[
                '#523d87', '#8e4090', '#db3387', '#e776c8', '#7976e7',
                '#1dafe4', '#0b7a3b', '#169f4e', '#97c24a', '#fbbc3c',
                '#e76d39', '#d62436', '#d9c585', '#9e612f', '#772c1d'
            ]}
            onChangeComplete = { scheduleColorChange } />
    );

    function scheduleColorChange(color) {
        setFieldsValue({'color': color.hex});
    }

	/*校验最大人数*/
	function checkMaxNum( rule, value, callback ){
		if( !(/^[1-9][0-9]*$/.test( value )) ){
			callback('只能输入正整数' )
		}else{
			callback()
		}
	}

	return(
		<Modal
			className = 'cerp_edit_class_info_modal'
			title = "修改信息"
			visible = { editClassInfoVisible }
			width = '550px'
			onCancel = { classInfoCreateCancel }
			maskClosable = { false }
			afterClose = { afterClose }
			footer = {[
				<Button key = "cancel" onClick = { classInfoCreateCancel } >取消</Button>,
				<Button key = "confirm" type = "primary" onClick = { classInfoCreateConfirmAction } style = {{ marginLeft : 20 }}>保存</Button>
			]}
		>
        	<Form>
				<div className = { styles.form_left }>
					<FormItem
						{ ...formItemLayoutTwo }
						label = '标题'
					>
						{ getFieldDecorator('title', {
							initialValue : editClassInfoObj.cpTitle || undefined,
							rules : [
								{ required : true, message : '请输入标题' },
							]
						})(
							<Input size = 'default' style = {{ width : 150 }} placeholder = '请输入标题' />
						)}
					</FormItem>
					<FormItem
						label = "主教"
						{ ...formItemLayoutTwo }
					>
						{ getFieldDecorator('mtids', {
							initialValue : !!editClassInfoObj.mtids && editClassInfoObj.mtids.split(',') || undefined,
							rules : [
								{ required : true, message : '请选择主教' }
							]
						})(
							<Select
								showSearch
								size = 'default'
								notFoundContent = "未找到"
								optionFilterProp = "children"
								placeholder = '请选择主教'
								style = {{ width : 150 }}
								multiple = { true }
							>
								{ userList && userList.map(function( item, index ){
									return ( <Option key = { 'cerp_class_main_teacher_' + item.userId } value = { item.userId + '' } >{ item.userName }</Option> )
								})}
							</Select>
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayoutTwo }
						label = '教室'
					>
						{ getFieldDecorator('roomId', {
							initialValue : editClassInfoObj.roomId || undefined,
							rules : [
								{ required : true, message : '请选择教室' }
							]
						})(
							<Select
								showSearch
								size = 'default'
								notFoundContent = "未找到"
								optionFilterProp="children"
								placeholder = '请选择教室'
								style = {{ width : 150 }}
							>
								{ roomList && roomList.map(function( item, index ){
									return ( <Option key = { 'cerp_class_main_roomId_' + item.id } value = { item.id + '' } >{ item.name }</Option> )
								})}
							</Select>
						)}
					</FormItem>
					<FormItem
						label = "上课时间"
						{ ...formItemLayoutTwo }
					>
						{ getFieldDecorator('startTime',{
							initialValue : moment( editClassInfoObj.startTime, 'HH:mm') || undefined,
							rules : [
								{ required : true, message : '请输入上课时间' }
							]
						})(
							<TimePicker size = 'default' style = {{ width : 150 }} format = 'HH:mm' placeholder = '上课时间' />
						)}
					</FormItem>
				</div>
				<div className = { styles.form_right }>
					<FormItem
						{ ...formItemLayoutTwo }
						label = '颜色'
					>
						{getFieldDecorator('color', {
							initialValue: editClassInfoObj.color || '#1dafe4',
							rules : [
								{ required : true, message : '请选择颜色' , whitespace : true },
							]
						})(
							<Popover content = { scheduleColorPick } title = { null } trigger = "click" >
								<div style = {{ backgroundColor : getFieldValue('color'), width : 150, height : 30, color : '#fff', borderRadius : 5, textAlign : 'center', cursor : 'pointer', lineHeight : '30px' }} >
									可点击更改
								</div>
							</Popover>
						)}
					</FormItem>
					<FormItem
						label = '助教'
						{ ...formItemLayoutTwo }
					>
						{ getFieldDecorator('atids', {
							initialValue : !!editClassInfoObj.atids && editClassInfoObj.atids.split(',') || undefined,
						})(
							<Select
								showSearch
								size = 'default'
								notFoundContent = "未找到"
								optionFilterProp="children"
								placeholder = '请选择助教'
								style = {{ width : 150 }}
								multiple = { true }
							>
								{ userList && userList.map(function( item, index ){
									return ( <Option key = { 'cerp_class_main_teacher_' + item.userId } value = { item.userId + '' } >{ item.userName }</Option> )
								})}
							</Select>
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayoutTwo }
						label = '上课人数'
					>
						{ getFieldDecorator('maxNum', {
							initialValue : editClassInfoObj.maxNum || undefined,
							rules : [
								{ required : true, message : '请输入最大上课人数' },
								{ validator : checkMaxNum }
							]
						})(
							<Input size = 'default' placeholder = '请输入最大上课人数' />
						)}
					</FormItem>
					<FormItem
						label = "下课时间"
						{ ...formItemLayoutTwo }
					>
						{ getFieldDecorator('endTime', {
							initialValue : moment( editClassInfoObj.endTime, 'HH:mm') || undefined,
							rules : [
								{ required : true, message : '请输入下课时间' }
							]
						})(
							<TimePicker size = 'default' style = {{ width : 150 }} format = 'HH:mm' placeholder = '下课时间' />
						)}
					</FormItem>
				</div>
			</Form>
		</Modal>
    )
}

export default Form.create()(EditClassInfoModal);
