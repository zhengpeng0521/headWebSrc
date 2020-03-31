import { Form, Input, Modal, Button, Icon, message, Select, InputNumber} from 'antd';
import React from 'react';
import styles from './ClassesManagementComponent.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
	labelCol: {span: 3,},
  	wrapperCol: {span: 14,},
};

function ClassesMgrEditModal({
	showAddStudentModal,
	handleCancelSourceModal,
	handleOkSourceModal,
	campusList,
	courseList,
	teacherList,
	toDealBishopTeacherList,
	toDealTaTeacherList,
	consumptionCourse,
	changePerNumFun,
	cnum,
	pnum,
	ctype,
	btnLoading,
	remainingOptionalTeacherList,
	getCampusIdFun,
	updataParamterFunciton,
	selectBishopTeacherIds,
	selecttTaTeacherIds,

    form: {getFieldDecorator,validateFields,getFieldsValue,resetFields,getFieldValue,setFieldsValue,validateFieldsAndScroll,},
}) {

	let obj = getFieldsValue();

	//选择课程关联总课程和消耗课时
	function selectCourse(option, value) {
		setFieldsValue({'progress' 	 : 0,})
		changePerNumFun(value.props.perNum, value.props.cnum, value.props.ctype || 0);
	}

	function bishopSelectTeacher(value, option) {
		updataParamterFunciton({selectBishopTeacherIds : value})
	}
	
	function bishopDeselectTeacher(value) {
		updataParamterFunciton({selectBishopTeacherIds : value})
	}

	function taSelectTeacher(value, option) {
		updataParamterFunciton({selecttTaTeacherIds : value})
	}
	
	function taDeselectTeacher(value) {
		updataParamterFunciton({selecttTaTeacherIds : value})
	}
	
    function handleCancel() {
        handleCancelSourceModal();
        resetFields();
    }
	
	function handleOk (e) {
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return;
			} else {
				handleOkSourceModal(getFieldsValue());
			}
		})
	}
	
	function closeModal() {
		resetFields();
	}
	
	function validator(rule, value, callback) {
        if(value == '' || value == undefined || value == null){
            callback();
        }else if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
            callback(new Error('数字格式不正确'));
        }else {
            callback();
        }
	}
	
	//选择校区id
	function selectTenantOrg(id) {
		resetFields([
			'courseName' : undefined,
			'progress' 	 : undefined,
		])
		getCampusIdFun(id);
	}

    //模态框的属性
    let modalOpts = {
        title	: '班级信息',
        maskClosable : false,
        visible : showAddStudentModal,
        width 	: 900,
        onOk	: handleOk,
        onCancel: handleCancel,
		wrapClassName : 'addClassesModal',
		afterClose : closeModal,
        footer 	: [
            <Button key="cancle" type="ghost" size="default" onClick={handleCancel}> 取 消 </Button>,
            <Button key="submit" type="primary" size="default" disabled = { btnLoading } loading = { btnLoading }
                onClick={handleOk}
			>保存</Button>
        ],
        className : 'erp_class_management_modal'
    };
	
	let tenantProps = {
		width : 350,
	}

    let org;
	/*取到第一个校区(默认校区)ID*/
    if(window._init_data.firstOrg != undefined){
        org = window._init_data.firstOrg;                //获取选择校区下的第一间校区

    }

  return (
	  <Modal {...modalOpts} style={{position:'relative'}}>
		  <Form style={{marginTop:10}} className='zj_Form'>
			<FormItem
			  label="所属校区："
			  {...formItemLayout}
			  style={{marginBottom:'20px',lineHeight:'12px'}}

			>
			  {getFieldDecorator('suoshuxiaoqu', {
                  initialValue : org.key || '',
                  rules: [

				  { required: true, message: '所属校区未填写' },
				],
			  })(
					<TenantOrgSelect {...tenantProps} onChange={selectTenantOrg}/>					
			  )}
			</FormItem>

			<FormItem
			  label="所属课程："
			  {...formItemLayout}
			  style={{marginBottom:'20px',lineHeight:'12px'}}
			>
			  {getFieldDecorator('courseName', {
				rules: [
				  { required: true, message: '所属课程未填写' },
				],
			  })(
					<Select 
						placeholder="请填写所属课程" 
						style={{width : 350}}
						onSelect={selectCourse}
						labelInValue={true}
                        size='default'
					>
						{
							courseList&&courseList.length>0
								? courseList.map(function(item, index) {
									return <Option 
											   value={item.id}
											   perNum={item.perNum}
											   cnum={item.cnum}
											   ctype={item.courseType}
											   key={index}>{item.title}</Option>
								}) 
								: <Option key={null} disabled>未选择校区或没有课程</Option>
						}
					</Select>
			  )}
			</FormItem>
		</Form>
		  {
			ctype===2? 
				  <Form layout = 'inline' className='zj_Form'>
							<FormItem
								label="当前进度："
								labelCol={{span: 12}}
								wrapperCol={{span: 12}}
								style={{ marginBottom : '20px' , marginLeft : '7px'}}
							>
							  {getFieldDecorator('progress', {
									initialValue : 0,
									rules: [
										{ required: true, message: '当前进度未填写' },
									],
							  })(
									<InputNumber
										min={0}
										max={ctype===2&&obj.progress > cnum ? cnum : 100000} 
										placeholder='请填写当前进度' 
										style={{width:125}} 
                                        size='default'
									/>
							  )}
							</FormItem>

							<FormItem
								label="总进度："
								labelCol={{span: 12}}
								wrapperCol={{span: 12}}
								style={{marginBottom:'20px',lineHeight:'12px'}}
							>
							  {getFieldDecorator('maxProgress', {
									initialValue : cnum || 0,
							  })(
									<InputNumber disabled min={0} max={100000} placeholder='请填写总进度' style={{width:137}} size='default'/>
							  )}
							</FormItem>
				  </Form>
				:
                null
		  }
		  <Form style={{marginTop:'0px'}} className='zj_Form'>
			  <FormItem
				  label="班级名称："
				  {...formItemLayout}
				  style={{marginBottom:'20px',lineHeight:'12px'}}
				>
			  {getFieldDecorator('name', {
					initialValue:"",
					rules: [
					  	{ required: true, message: '班级名称未填写' },
					],
			  })(
					<Input type="text" placeholder='请填写班级名称' style={{width:350}} size='default'/>
			  )}
			</FormItem>

			<FormItem
				  label="主教："
				  {...formItemLayout}
				  style={{marginBottom:'20px',lineHeight:'12px'}}
			>
			  {getFieldDecorator('bishop', {
//					initialValue: tempRemainingOptionalTeacherList,
					rules: [
					  	{ required: true, message: '请选择主教老师' },
					],
			  })(
					<Select
						mode = 'multiple'
						style={{ width: 350 }}
						placeholder="请选择主教老师"
						onChange={bishopSelectTeacher}
						onDeselect={bishopDeselectTeacher}
                        size='default'
					  >
						{
							toDealBishopTeacherList&&toDealBishopTeacherList.length>0?toDealBishopTeacherList.map((item, index) => {
								let b = false;
								selecttTaTeacherIds&&selecttTaTeacherIds.length>0&&selecttTaTeacherIds.map((items, index) => {
									if(`${item.userId}` == items) {
										b = true;
										return;
									}
								})
								return <Option
										   value={`${item.userId}`}
										   disabled={b}
										   key={index} >{item.userName}</Option>
							}) : <Option disabled key={null}>暂无主教老师</Option>
						}
					  </Select>
			  )}
			</FormItem>
			
			<FormItem
			  	label="助教："
			  	{...formItemLayout}
			  	style={{marginBottom:'20px', fontSize : '12px',lineHeight:'12px'}}
			>
			  {getFieldDecorator('ta', {
//					initialValue: tempRemainingOptionalTeacherList,
					rules: [
					  	{ required: false, message: '请选择助教老师' },
					],
			  })(
					<Select
						mode = 'multiple'
						style={{ width: 350 }}
						placeholder="请选择助教老师"
						onChange={taSelectTeacher}
						onDeselect={taDeselectTeacher}
                        size='default'
					  >
						{
							toDealTaTeacherList&&toDealTaTeacherList.length>0?toDealTaTeacherList.map((item, index) => {
								let b = false;
								selectBishopTeacherIds&&selectBishopTeacherIds.length>0&&selectBishopTeacherIds.map((items, index) => {
									if(`${item.userId}` == items) {
										b = true;
										return;
									}
								})
								return <Option
										   value={`${item.userId}`}
										   disabled={b}
										   key={index} >{item.userName}</Option>
							})  : <Option disabled key={null} >暂无助教老师</Option>
						}
					  </Select>
			  )}
			</FormItem>

			<FormItem
				  label="最大人数："
				  {...formItemLayout}
			>
			  {getFieldDecorator('shangkerenshu', {
					initialValue: 1,
					rules: [
						{ required: true, message: '最大上课人数未填写' },
					],
			  })(
					<InputNumber min={1} placeholder='请填写最大上课人数' style={{width:350}} size='default'/>
			  )}
			</FormItem>
		  </Form>
          <div style={{ display:'flex' , flexWarp:'nowrap'}}>
              <FormItem
                    label='消耗课时：'
                    labelCol={{span: 12}}
                    wrapperCol={{span: 25}}
                    style={{marginLeft:-52,minWidth:320}}
                >
                  {getFieldDecorator('one', {
                        initialValue: pnum || 0,
                        rules: [
                            {required: true, message: '上课未填写'},
                            {validator: validator},
                        ],
                  })(
                        <Input
                            addonBefore="上课"
                            addonAfter="课时/节"
                            style={{width:150}}
                            size='default'
                        />
                  )}
                </FormItem>
                <FormItem>
                        {getFieldDecorator('two', {
                            initialValue: 0,
                            rules: [
                                {required: true, message: '请假未填写'},
                                {validator: validator},
                            ],
                        })(
                            <Input
                                addonBefore="请假"
                                addonAfter="课时/节"
                                style={{width:150}}
                                size='default'
                            />
                        )}
                </FormItem>
                <FormItem
				  	style={{marginLeft:10}}
				>
				  	{getFieldDecorator('three', {
						initialValue: 0,
						rules: [
					  		{required: true, message: '补课未填写'},
							{validator: validator},
						],
				  	})(
						<Input
							addonBefore="补课"
							addonAfter="课时/节"
							style={{width:150}}
                            size='default'
						/>
				  	)}
				</FormItem>
                <FormItem
				  	style={{marginLeft:10}}
				>
				  	{getFieldDecorator('four', {
						initialValue: 0,
						rules: [
							{required: true, message: '旷课未填写'},
							{validator: validator},
						],
				  	})(
						<Input
							addonBefore="旷课"
							addonAfter="课时/节"
							style={{width:150}}
                            size='default'
						/>
				  )}
				</FormItem>
          </div>
	  </Modal>
  );
};

export default Form.create()(ClassesMgrEditModal);
