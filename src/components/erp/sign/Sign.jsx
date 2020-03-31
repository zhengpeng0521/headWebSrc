import React from 'react';
import styles from './Sign.less';
import { Select, Modal, Form, Input, DatePicker, Radio, InputNumber, Rate, Button } from 'antd';
import moment from 'moment';
import PrintComponent from '../../common/print/Print';
import {do_print} from '../../../utils/printUtils';
import {getNowFormatDate} from '../../../utils/timeUtils';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function SignComponent ({
	obj,
	form : {
        getFieldDecorator,
		setFieldsValue,
		getFieldsValue,
	},
 }) {

	//获取校区数据
	let campusData 	= ["一区", "二区", "三区"];
	//获取课程数据
	let courseData	= ["课程1", "课程2", "课程3", "课程4"];
	//获取班级数据
	let classData 	= ["班级1", "班级2", "班级3"];
	//获取老师数据
	let teacherData = ["老师1", "老师2", "老师3"];
	//获取列表数据
	let listData	= [	{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '德华,贾帅', 'student' : '5'},
					   	{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
					  	{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'},
						{'title' : '[博士音乐课]一期班级 17:00~18:00','teacher' : '张三,贾帅', 'student' : '3'}];
	
	let studentSignData	= [{'title' : '[博士音乐课]一期班级 17:00~18:00','student' : '德华'},
						   {'title' : '[博士音乐课]一期班级 17:00~18:00','student' : '张三'},
						   {'title' : '[博士音乐课]一期班级 17:00~18:00','student' : '贾帅'}];
	
	let paymentItemData = [ {'material' : '铅笔', 'number' : '1支', 'preferential' : '减免500元折扣 9.9折', 'paid_in' : '100'},
							{'material' : '练习本', 'number' : '21本', 'preferential' : '减免500元折扣 9.9折', 'paid_in' : '30'},];
	let paymentItemArr = [];
	
	
	
	
	
	//选择校区结果
	function selectCampus(value) {
  		//console.log(`selected ${value}`);
	}
	//选择课程结果
	function selectCourse(value) {
  		//console.log(`selected ${value}`);
	}
	//选择班级结果
	function selectClass(value) {
  		//console.log(`selected ${value}`);
	}
	//选择老师结果
	function selectTeacher(value) {
  		//console.log(`selected ${value}`);
	}
	//签到取消按钮
	function signCancel() {
		obj.showOrHidSignModalFunction();
	}
	//签到明细确定按钮
	function signDetailCancel() {
		obj.showOrHidSignDetailModalFunction();
	}
	//签到明细取消按钮
	function signDetailOk() {
		obj.showOrHidSignDetailModalFunction();
	}
	//签到按钮
	function handleSign() {
		obj.showSignDetailFunction();
	}
	//签到所有（批量）
	function selectAllRadio(e) {
		setFieldsValue({'radio-group': e.target.value});
		listData&&listData.length>0?listData.map(function(item, index) {
			let name = `sign-radio-group${index}`;
			setFieldsValue({[name] : e.target.value});
		}) : '';
	}
	//签到所有（单个）
	function selectASingleRadio() {
		setFieldsValue({'sign-radio-group': null});
	}
	
	//打印
	function print() {
		do_print('pay_cost');		
	}

				//需要删除的
				let a = true;
				function touchButton() {
					obj.showOrHidSignModalFunction();
				}
	
	

	
	let campusArr  	= [];
	let courseArr 	= [];
	let classArr 	= [];
	let teacherArr 	= [];
	let listArr 	= [];
	let studentHaveClassArr = [];	
		
	const signFormItemLayout = {
		labelCol	: { span: 4 },
      	wrapperCol	: { span: 9 },
    };
	
	const formItemLayout = {
		labelCol	: { span: 4 },
      	wrapperCol	: { span: 12 },
    };
	
	const selectFormItemLayout = {
		labelCol	: { span: 4 },
      	wrapperCol	: { span: 15 },
    };
	
	const config = {
		initialValue : moment(getNowFormatDate(), dateFormat),
      	rules: [{ type: 'object', required: true, message: '请选择时间！' }],
    };
		
	campusData&&campusData.length>0?campusData.map(function(item, index) {
		return campusArr.push(<Option key={index} value={item}>{item}</Option>);
	}) : '';
	
	courseData&&courseData.length>0?courseData.map(function(item, index) {
		return courseArr.push(<Option key={index} value={item}>{item}</Option>);
	}) : '';
	
	classData&&classData.length>0?classData.map(function(item, index) {
		return classArr.push(<Option key={index} value={item}>{item}</Option>);
	}) : '';
	
	teacherData&&teacherData.length>0?teacherData.map(function(item, index) {
		return teacherArr.push(<Option key={index} value={item}>{item}</Option>);
	}) : '';
	
	listData&&listData.length>0?listData.map(function(item, index) {
		return listArr.push(
			<div key={index} className={styles.list_base_div}>
				<Button type="primary" className={styles.sign} onClick={handleSign}>签到</Button>
				<p className={styles.list_title}>{item.title}</p>
				<p className={styles.list_teacherName}>{item.teacher}</p>
				<p className={styles.list_studentNum}>学员:{item.student}</p>
			</div>);
	}) : '';
	
	/*同一个FormItem里面不要同时使用多个getFieldDecorator（无法进行验证）*/
	studentSignData&&studentSignData.length>0?studentSignData.map(function(item, index) {
		return studentHaveClassArr.push(
			<div key = {index}>
				<FormItem
					{...selectFormItemLayout}
					label={item.student}
					key={index}
				>
					<div className="select_group_div">
						{getFieldDecorator(`sign-radio-group${index}`)(
							<RadioGroup onChange={selectASingleRadio}>
								<Radio value={1}>上课</Radio>
								<Radio value={2}>请假</Radio>
								<Radio value={3}>旷课</Radio>
								<Radio value={4}>补课</Radio>
							</RadioGroup>
						)}
						
						<span className={styles.consumption}> 消耗课时 :</span>
						
						{getFieldDecorator(`sign-consumption-course${index}`, { initialValue: 1 })(
							<InputNumber min={0} max={10} style={{width : 72}} />
						)}
						
						{getFieldDecorator(`sign-memo${index}`)(
							<Input  placeholder="备注" style={{width: "80%"}} />
						)}
						
						{getFieldDecorator(`sign-rate${index}`)(
							<Rate />
						)}						
					</div>
				</FormItem>
			</div>);
	}) : '';
		
	let list_name = listArr.length > 5 ? styles.list_packaging_narrow : styles.list_packaging_narrow;
	
	return (
		<div className="sign_base" onClick={touchButton}>
			点击我
			<Modal	title="学员签到" 
					visible={obj.showOrHiddenSignModalState}
					onCancel={signCancel}				
					footer=""
					width={800}
					wrapClassName="sign_wrap_class_name"
				>
				<div className="base_content">
					<Form style={{width: '50%', float: 'left'}}>
						<FormItem
							{...signFormItemLayout}
          					label="校区"	
						>
							{getFieldDecorator('sign-date-campus')(
								<Select
									showSearch
									placeholder="全部"
									optionFilterProp="children"
									onChange={selectCampus}
									filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								  >
									{campusArr}
								</Select>
						  	)}
						</FormItem>
					</Form>
					
					<Form style={{width: '50%', float: 'left'}}>
						<FormItem
							{...signFormItemLayout}
          					label="课程"	
						>
							{getFieldDecorator('sign-date-course')(
								<Select
									showSearch
									placeholder="全部"
									optionFilterProp="children"
									onChange={selectCampus}
									filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								  >
									{courseArr}
								</Select>
						  	)}
						</FormItem>
					</Form>
					
					<Form style={{width: '50%', float: 'left'}}>
						<FormItem
							{...signFormItemLayout}
          					label="班级"	
						>
							{getFieldDecorator('sign-date-class')(
								<Select
									showSearch
									placeholder="全部"
									optionFilterProp="children"
									onChange={selectCampus}
									filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								  >
									{classArr}
								</Select>
						  	)}
						</FormItem>
					</Form>
					
					<Form style={{width: '50%', float: 'left'}}>
						<FormItem
							{...signFormItemLayout}
          					label="校区"	
						>
							{getFieldDecorator('sign-date-teacher')(
								<Select
									showSearch
									placeholder="全部"
									optionFilterProp="children"
									onChange={selectCampus}
									filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								  >
									{teacherArr}
								</Select>
						  	)}
						</FormItem>
					</Form>
					
					<div className={styles.clearance} />
					
					<div className={styles.clearance_line} />
					
					<div className={list_name}>{listArr}</div>
				</div>

			</Modal>
			
			<Modal	title="签到详情" 
					visible={obj.showOrHiddenSignDetailModalState}
			  		onOk={signDetailOk} 
					onCancel={signDetailCancel}
					okText="保存"
					width={800}
					wrapClassName="sign_modal_base_div"	
			>
				<div className="sign_detail_div">
					<Form>
						<FormItem
							{...formItemLayout}
          					label="老师"	
						>
							{getFieldDecorator('sign-detail-date-teacher')(
								<Input />
						  	)}
						 	
						</FormItem>
						
						<FormItem
							{...formItemLayout}
          					label="签到时间"	
						>
							{getFieldDecorator('sign-detail-date-time-picker', config)(
							
								a ? <DatePicker 
										showTime 
										format="YYYY-MM-DD HH:mm:ss" 
										disabled
										style={{width : 385}}
									/> 
								  : <DatePicker 
										showTime 
										format="YYYY-MM-DD HH:mm:ss" 
										style={{width : 385}} 
									/>
						  	)}
						</FormItem>
						
						<FormItem
						  	{...formItemLayout}
						  	label="批量签到"
						>
						  	{getFieldDecorator('sign-detail-radio-group')(
								<RadioGroup onChange={selectAllRadio}>
							  	<Radio value={1}>上课</Radio>
							  	<Radio value={2}>请假</Radio>
							  	<Radio value={3}>旷课</Radio>
								<Radio value={4}>补课</Radio>
								</RadioGroup>
							)}
						</FormItem>
						
						{studentHaveClassArr}
						
						<FormItem
						  	{...formItemLayout}
						  	label="上课内容"
						>
						  	{getFieldDecorator('sign-detail-course-content')(
								 <Input type="textarea" autosize={{ minRows: 2, maxRows: 8 }} />
							)}
						</FormItem>
						
						<FormItem
						  	{...formItemLayout}
						  	label="课后作业"
						>
						  	{getFieldDecorator('sign-detail-homework-after-class')(
								 <Input type="textarea" autosize={{ minRows: 2, maxRows: 8 }} />
							)}
						</FormItem>
						
						<FormItem
						  	{...formItemLayout}
						  	label="备注"
						>
						  	{getFieldDecorator('sign-detail-note')(
								 <Input type="textarea" autosize={{ minRows: 2, maxRows: 8 }} />
							)}
						</FormItem>
						
						{/*<div className={styles.saveButton}><Button>保存</Button></div>*/}
					</Form>
				</div>
			</Modal>
			
			{
			<Modal
				title="缴费信息" 
				visible={true}
				okText="保存"
				width={800}
				wrapClassName=""
				footer=""
				id="ji"
			>
				<PrintComponent />
				<div style={{textAlign : 'center', marginTop : 15, clear: 'left', padding:10}}>
					<Button onClick={print}>打印</Button>
				</div>
			</Modal>
			}
		</div>
    );
}

export default Form.create({})(SignComponent);
