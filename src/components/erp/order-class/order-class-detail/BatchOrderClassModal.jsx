import React from 'react';
import { Form, Modal, Button, Select, message, Radio, DatePicker, Popover } from 'antd';
import { NullData } from '../../../common/new-component/NewComponent';
import BatchCourseTable from '../../../common/new-component/manager-list/ManagerList';
import moment from 'moment';
import styles from './BatchOrderClassModal.less';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function BatchOrderClassModal({

	batchOrderClassVisible,
	startDate,
	endDate,
	batchLoading,
	batchCourseList,
	studentList,
	classList,
	batchVipDetailInfo,
	currentItem,
	selectedRows,
	selectedRowKeys,

	cancelbatchOrderClass,
	confirmBatchOrderClass,

	startTimeChange,
	endTimeChange,
	studentChange,
	batchSelectClass,           //选择班级得到班级学员
	batchOrderClassStuList,

	rowSelectChange,

	periodExpend,
	periodLeft,

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

	let courseAgeType = !!currentItem && currentItem.courseAgeType;

	function afterClose(){
		resetFields();
	}

	/*确认约课*/
	function confirmbatchOrderClassAction(){
		validateFieldsAndScroll(( err, values ) =>{
			if( !!err ){
				return;
			}
			confirmBatchOrderClass( values )
		})
	}

	//上课日期选择器时间范围限制
    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 24*60*60*1000;
    }

	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 20 }
	}

	let batchCourseTableProps = {
		table : {
            NullDataHeight : 200,
            loading       : batchLoading,
            dataSource    : batchCourseList,
			height        : document.body.clientHeight - 332,
//			xScroll       : 1266,
            columns : [
                {
					dataIndex : 'studyDate',
					key       : 'studyDate',
					title     : '日期',
					width     : 132,
					render    : ( text, record ) => (
						<span>{ record.studyDate + '(' + record.weekDay + ')' }</span>
					)
				},{
					dataIndex : 'time',
					key       : 'time',
					title     : '时间段',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { record.startTime + '~' + record.endTime } trigger = 'hover' >
							{ record.startTime + '~' + record.endTime }
						</Popover>
					)
				},{
					dataIndex : 'courseName',
					key       : 'courseName',
					title     : '课程名称',
					width     : 91,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'mtNames',
					key       : 'mtNames',
					title     : '主教',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'atNames',
					key       : 'atNames',
					title     : '助教',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'roomName',
					key       : 'roomName',
					title     : '教室',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'cost',
					key       : 'cost',
					title     : '消耗课时',
					width     : 96,
				},{
					dataIndex : 'num',
					key       : 'num',
					title     : '上课人数',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ record.num + '/' + record.maxNum }</span>
					)
				},{
					dataIndex : 'tryNum',
					key       : 'tryNum',
					title     : '试听人数',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ record.tryNum + '/' + record.maxTryNum }</span>
					)
				}
            ],
			rowSelection : {
                selectedRowKeys  : selectedRowKeys,
                onChange         : rowSelectChange,
            }
         },
	}

	return(
       <Modal
		    className = 'batch_order_modal'
            visible = { batchOrderClassVisible }
            title = '批量约课'
            maskClosable = { false }
            width = '1000px'
            onCancel = { cancelbatchOrderClass }
		   	afterClose = { afterClose }
            footer = {[
				<Button key = "cancelbatchOrderClass" onClick = { cancelbatchOrderClass } >取消</Button>,
				<Button style = {{ marginLeft : '10px' }} key = "confirmbatchOrderClassAction" type = "primary" onClick = { confirmbatchOrderClassAction } >确定</Button>
			]}
        >
			<div className = 'batch_order_tips'>
				<p>第一步 : 请选择【开始】与【结束】时间</p>
				<p>第二步 : 列表数据中选择具体课程</p>
				<p>第三步 : 最后点击【提交】</p>
			</div>
			<div className = 'batch_course_info'>
				<div className = 'batch_course_info_head'>课程信息</div>
				<p>课程名称 : <span>{ !!currentItem && currentItem.courseName || '' }</span></p>
				<p style = {{ marginBottom : '20px' }}>星期 : <span>{ !!currentItem && currentItem.weekDay || '' }</span></p>
				<div className = 'batch_course_info_head'>预约周期</div>
				{ !!batchOrderClassVisible &&
					<div className = 'batch_course_time'>
						<div className = 'batch_course_time_item'>
							<FormItem
								label = '开始'
								labelCol = {{ span : '5' }}
								wrapperCol = {{ span : '18' }}
							>
								<DatePicker
									defaultValue = { moment( new Date( startDate ) )}
									disabledDate = { disabledDate }
									style = {{ width : '150px' }}
									onChange = { startTimeChange }
									size = 'default' />
							</FormItem>
						</div>
						<div className = 'batch_course_time_item'>
							<FormItem
								label = '结束'
								labelCol = {{ span : '5' }}
								wrapperCol = {{ span : '18' }}
							>
								<DatePicker
									defaultValue = { moment( new Date( endDate ) )}
									disabledDate = { disabledDate }
									style = {{ width : '150px' }}
									onChange = { endTimeChange }
									size = 'default' />
							</FormItem>
						</div>
					</div>
				}
			</div>
			<div className = 'batch_order_vip_info'>
				<div className = 'batch_course_info_head'>会员信息</div>
				<FormItem style = {{ marginBottom : '0', marginLeft : '10px' }}>
					{ getFieldDecorator('type', {
						initialValue : '1' || undefined,
						rules : [
							{ required : true, message : '请选择类型' }
						]
					})(
						<RadioGroup style = {{ marginTop : '6px' }}>
							<Radio value = '1'>预约学员</Radio>
							<Radio value = '2'>预约班级</Radio>
						</RadioGroup>
					)}
				</FormItem>
				{ getFieldValue('type') == '1' ?
					<div>
						<Form style = {{ marginTop : '10px' }}>
							<FormItem
								label = '会员名'
								labelCol = {{ span : '7' }}
								wrapperCol = {{ span : '16' }}
							>
								{ getFieldDecorator('stuId', {
									initialValue : undefined,
									rules : [
										{ required : true, message : '会员名必选' }
									]
								})(
									<Select
										size = 'default'
										showSearch = { true }
										optionFilterProp = 'children'
										onChange = { studentChange }
									>
										{ !!studentList && studentList.map(function( item, index ){
											return ( <Option key = {'batch_order_stu_' + item.stuId } value = { item.stuId } >{ (item.stuName || '') + ( courseAgeType == '1' ? ( ' ( ' + item.month + '月)') : ( ' ( ' + Math.floor(item.month / 12) + '岁)' ) ) }</Option> )
										})}
									</Select>
								)}
							</FormItem>
						</Form>
						<p>会员卡号 : <span>{ !!batchVipDetailInfo && !!getFieldValue('stuId') && batchVipDetailInfo.cardId  || '' }</span></p>
						<p>可用课时 : <span>{ !!batchVipDetailInfo && !!getFieldValue('stuId') && batchVipDetailInfo.periodAvailable || 0 }</span></p>
						<p>使用课时 : <span>{ periodExpend.toFixed(2) || 0 }</span></p>
						<p>预计剩余 : <span>{ !!batchVipDetailInfo && !!getFieldValue('stuId') && batchVipDetailInfo.periodAvailable && (batchVipDetailInfo.periodAvailable - periodExpend).toFixed(2) || 0 }</span></p>
					</div>
					:
					<div>
						<Form style = {{ marginTop : '10px' }} >
							<FormItem
								label = '班级名称'
								labelCol = {{ span : '7' }}
								wrapperCol = {{ span : '16' }}
							>
								{ getFieldDecorator('clsId', {
									initialValue : undefined,
									rules : [
										{ required : true, message : '请选择班级' }
									]
								})(
									<Select
										size = 'default'
										showSearch = { true }
										optionFilterProp = 'children'
										onSelect = { batchSelectClass }
									>
										{ !!classList && classList.map(function( item, index ){
											return ( <Option key = {'batch_order_stu_' + item.clsId } value = { item.clsId } >{ item.clsName }</Option> )
										})}
									</Select>
								)}
							</FormItem>
							<FormItem
								label = '班级成员'
								labelCol = {{ span : '6' }}
								wrapperCol = {{ span : '17' }}
							>
								<div className = { styles.class_order_stu_list } >
									{
										batchOrderClassStuList &&　batchOrderClassStuList.map(function( item, index ){
											return ( <span className = { styles.class_order_stu_list_item } key = { 'class_order_stu_list_item_' + index }>{ item.name + ' ( 可用课时 : ' + item.periodAvailable + ' )' }</span> )
										})
									}
								</div>
							</FormItem>
						</Form>
					</div>
				}
			</div>
			<div className = 'batch_order_course_table'>
                { batchCourseList && batchCourseList.length > 0 ?
                    <BatchCourseTable { ...batchCourseTableProps } />
                    :
                    <NullData height = '100%'/>
                }
			</div>
			<Form className = 'batch_order_fix' >
				<FormItem
					{ ...formItemLayout }
					label = '是否固定位'
				>
					{ getFieldDecorator('fix',{
						initialValue : '0',
					})(
						<RadioGroup>
							<Radio value = '0' >否</Radio>
							<Radio value = '1' >是</Radio>
						</RadioGroup>
					)}
				</FormItem>
			</Form>
        </Modal>
	)
};

export default Form.create({})(BatchOrderClassModal);
