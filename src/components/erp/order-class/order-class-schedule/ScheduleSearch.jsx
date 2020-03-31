import React from 'react';
import Media from 'react-media';
import moment from 'moment';
import { Table, Icon, Form, Input, Select, DatePicker, Button, message, Pagination, Popconfirm ,Radio, TimePicker } from 'antd';
import styles from './ScheduleSearch.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { keys, values, entries } = Object;

function ScheduleSearch({
	onSearch,
	onClear,

	stuIdSelectList,
	courseSelectList,
	classSelectList,
	teachSelectList,

	form : {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll

    }
}){

	//搜索
	function onSearchClick(){
		let values = getFieldsValue();
		values.startTime = (!!values.startTime && moment( values.startTime ).format('HH:mm')) || undefined;
		let query = {};
		for( let [ key, value ] of entries( values ) ){
			if( value != undefined && value != '' ){
				query[ key ] = value;
			}
		}
		onSearch && onSearch( query );
	}

	//重置
	function onClearClick(){
		resetFields();
		!!onClear && onClear();
	}
	return (
		<div className = 'manager_list_search_box'>
			<Form layout = 'inline' className = { styles.search_item } >
				<FormItem>
					{ getFieldDecorator( 'stuId', {
                        initialValue : undefined,
					})(
						<Select
							placeholder = '学员名称'
							showSearch = { true }
							optionFilterProp = 'children'
							style = {{ width : '140px' }}
							size = 'default'
						>
							{ !!stuIdSelectList && stuIdSelectList.map( function( item, index ){
								return (
									<Option key = { 'select_stu_opt_' + item.stuId } value = { item.stuId } >{ item.stuName }</Option>
								)
							})}
						</Select>
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator( 'courseId', {
                        initialValue : undefined,
					})(
						<Select
							showSearch = { true }
							optionFilterProp = 'children'
							placeholder = '课程名称'
							style = {{ width : '140px' }}
							size = 'default'
						>
							{ !!courseSelectList && courseSelectList.map( function( item, index ){
								return (
									<Option key = { 'select_course_opt_' + item.id } value = { item.id } >{ item.title }</Option>
								)
							})}
						</Select>
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator( 'clsId', {
                        initialValue : undefined,
					})(
						<Select
							showSearch = { true }
							optionFilterProp = 'children'
							placeholder = '班级名称'
							style = {{ width : '140px' }}
							size = 'default'
						>
							{ !!classSelectList && classSelectList.map( function( item, index ){
								return (
									<Option key = { 'select_class_opt_' + item.clsId } value = { item.clsId } >{ item.clsName }</Option>
								)
							})}
						</Select>
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator( 'mtid', {
                        initialValue : undefined,
					})(
						<Select
							showSearch = { true }
							optionFilterProp = 'children'
							placeholder = '主教'
							style = {{ width : '140px' }}
							size = 'default'
						>
							{ !!teachSelectList && teachSelectList.map( function( item, index ){
								return (
									<Option key = { 'select_teach_opt_' + item.userId } value = { item.userId + '' } >{ item.userName }</Option>
								)
							})}
						</Select>
					)}
				</FormItem>
				<FormItem>
				{getFieldDecorator('startTime', {
					initialValue : undefined,
				  })(
						<TimePicker size = 'default' style = {{ width : '140px' }} format = "HH:mm" placeholder = '上课时间' />
				  )}
				</FormItem>
			</Form>
			<div className = 'btn_group'>
				<Button size = 'default' type = 'primary' className = 'btn_group_search' onClick = { onSearchClick } >
					<div className = 'search_icon'></div>
				</Button>
				<Button size = 'default' className = 'btn_group_clear' onClick = { onClearClick } >
					<div className = 'reset_icon' ></div>
				</Button>
			</div>

		</div>
	)
}

export default Form.create({})(ScheduleSearch);
