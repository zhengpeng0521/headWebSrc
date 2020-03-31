import React from 'react';
import { Modal, Button, Form, Select, Input } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TenantOrgSelect from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './AddUseClassModal.less';

const FormItem = Form.Item;
const Option = Select.Option;

function AddUseClassModal({
	orgId,                        //选中第一个校区
	visible,                      //新增消课记录 是否显示

	vipCardId,                    //所选学员的会员卡号

	stuIdList,                    //拥有会员卡的学员下拉列表
	courseList,                   //消课课程下拉列表
	selectedCourse,               //选中所需消课的课程
	addUseClassBtnLoading,        //表单提交后 按钮变loading状态

	//方法
	cancelAddUseClass,            //取消新增消课记录
	confirmAddUseClass,           //确认新增消课记录

	TenantSelectOnSelect,         //选择校区
	selectStuId,                  //选择有会员卡的学员
	selectCourse,                 //选择消课课程

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

	let formItemLayout = {
		labelCol   : { span : 4 },
		wrapperCol : { span : 20 }
	}

	//校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 434,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
    };

	//选择校区清空数据
	function TenantSelectOnSelectAction( value ){
		setFieldsValue({ 'stuId'     : undefined });
		setFieldsValue({ 'courseId'  : undefined });
		if( !!value ){
			TenantSelectOnSelect( value )
		}
	}

	//选择学员清空数据
	function selectStuIdAction( value, props ){
		setFieldsValue({ 'courseId' : undefined });
		selectStuId( value, props )
	}

	/*确认新增消课记录*/
	function confirmAddUseClassAction(){
		validateFieldsAndScroll(( err, values ) => {
			if( !!err ){
				return;
			}
			let courseInfo = [];
			!!values.courseId && values.courseId.map(function( item, index ){
				courseInfo.push({
					courseId  : item,
					courseNum : getFieldValue( 'course_num_' + item )
				})
			})
			let params = {
				stuId      : values.stuId,
				cardId     : values.cardId,
				reason     : values.reason,
				orgId      : values.orgId,
				courseInfo : JSON.stringify(courseInfo),
			}
			confirmAddUseClass( params )
		})
	}

	//关窗之后所调用的清空表单方法
	function afterClose(){
		resetFields();
	}


	//校验消课原因
	function checkReason( rule, value, callback ){
		if((/^[\s]{1,200}$/.test(value))){
			callback("不能全为空格")
    	} else {
    		callback();
    	}
	}

	//所选课程
	let selectedCourseComponents = [];
	!!selectedCourse && selectedCourse.map(function( item, index ){
		//校验输入的消课课时数
		function checkNum( rule, value, callback){
			if( !(/^[0-9]+(.[0-9]{1,2})?$/.test( value ))){
				callback('请精确到小数点后2位')
			}
			let left = item.periodLeft;
			if( value > left ){
				callback('不能超过可消课时数')
			}else{
				callback();
			}
		}
		selectedCourseComponents.push(
			<QueueAnim
				key = { 'selected_course_' + index }
				type = {[ 'top', 'top' ]}
				ease = {[ 'easeOutQuart', 'easeInOutQuart' ]}
			>
				<FormItem
					key = { 'selected_course_form_item_' + index }
					{ ...formItemLayout }
					help = '可精确到小数点后2位, 不能超过可消课时数'
					label = { item.courseName }
				>
					{ getFieldDecorator('course_num_' + item.courseId, {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请输入消课课时数' },
							{ validator : checkNum }
						]
					})(
						<Input size = 'default' placeholder = { '可消' + item.periodLeft + '课时, 已锁定' + item.periodFreeze + '课时' } />
					)}
				</FormItem>
			</QueueAnim>
		)
	})

	return (
		<Modal
			className = 'add_use_class_modal'
			width = '550px'
			title = '新增消课记录'
			visible = { visible }
			maskClosable = { false }
			onCancel = { cancelAddUseClass }
			afterClose = { afterClose }
          	footer = {[
				<Button key = 'use_class_cancel' onClick={ cancelAddUseClass }>取消</Button>,
				<Button
					style = {{ marginLeft : '20px' }}
					key = 'use_class_confirm'
					type = 'primary'
					onClick = { confirmAddUseClassAction }
					loading = { addUseClassBtnLoading }
					disabled = { addUseClassBtnLoading }
				>确定</Button>
			]}
		>
			<Form>
				<FormItem
					label = "所属校区"
					{ ...formItemLayout }
				>
					{ getFieldDecorator('orgId',{
						initialValue : orgId,
						rules : [
							{ required : true, message : '请选择校区' }
						]
					})(
						<TenantOrgSelect { ...tenantOrgSelectProps } />
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '消课学员'
				>
					{ getFieldDecorator('stuId', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '选择消课学员' }
						]
					})(
						<Select
							showSearch
							size = 'default'
							placeholder = '请选择学员'
                            optionFilterProp = 'children'
                            notFoundContent = '暂无学员信息'
							onSelect = { selectStuIdAction }
						>
							{ !!stuIdList && stuIdList.map(function( item, index ){
								return ( <Option key = { 'use_class_stu_' + item.stuId } value = { item.stuId } cardId = { item.cardId } >{ item.name }</Option> )
							})}
						</Select>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '会员卡号'
				>
					{ getFieldDecorator('cardId', {
						initialValue : vipCardId,
					})(
						<span style = {{ position : 'relative', top : '8px', color : '#999' }}>{ vipCardId || '请先选择学员' }</span>
					)}
				</FormItem>
				<FormItem
					{ ...formItemLayout }
					label = '消课课程'
				>
					{ getFieldDecorator('courseId', {
						initialValue : undefined,
						rules : [
							{ required : true, message : '请选择要消课的课程' }
						]
					})(
						<Select
							showSearch
							mode = 'multiple'
							size = 'default'
							placeholder = '请选择要消课的课程'
							optionFilterProp = 'children'
							notFoundContent = '暂无课程信息'
							onChange = { selectCourse }
						>
							{ !!courseList && courseList.map( function( item, index ){
								return ( <Option key = { 'add_use_class_course_' + item.courseId } value = { item.courseId } >{ item.courseName }</Option> )
							})}
						</Select>
					)}
				</FormItem>
				{/*选中的消课课程 数组*/}
				{ selectedCourseComponents }
				{/*选中的消课课程 数组*/}
				<FormItem
					{ ...formItemLayout }
					label = '消课原因'
                    extra = '温馨提示：手动消课将无法将课时统计到相应的课程和老师，会影响部分统计数据准确性，请慎用'
				>
					{ getFieldDecorator('reason', {
						initialValue : undefined,
						rules : [
                            { required : false , message : '不能超过200个字符' , max : 200 },
							{ validator : checkReason }
						]
					})(
						<Input type = 'textarea' placeholder = '请输入消课原因(限200字)' autosize = {{ minRows : 3 , maxRows : 4 }}/>
					)}
				</FormItem>
			</Form>
		</Modal>
	)
}

export default Form.create({})(AddUseClassModal);
