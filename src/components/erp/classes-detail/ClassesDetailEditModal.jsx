import React from 'react';
import { Form, Input, Modal, Button, message, Select, InputNumber } from 'antd';
import style from './ClassesDetail.less';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  	labelCol	: {span: 3},
  	wrapperCol	: {span: 14},
};

const ClassesMgrEditModal = ({
    formData,
    formLoading,
    formSubmit,
    formCancel,
    formVisible,
    topList,
	dp,
	selectBishopTeacherIds,
	selecttTaTeacherIds,
	teacherListSelectArr,

	cnum,
	pnum,
	ctype,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {
	
	let costTplArr 	= [];
	let lengthArr 	= Object.keys(topList);
	if( lengthArr && lengthArr.length > 0) {
		costTplArr = !!topList && topList.costTpl.split(',');
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

	//提交修改弹框
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors) => {
            if (errors) {
				return;
			}
			
			//数据处理
			let data 		= getFieldsValue();
			let tpl 		= [data.one, data.two, data.three, data.four].join(',');	
			let taIds 		= data.talaoshi.join(',');
			let bishopIds 	= data.daibanlaoshi.join(',');
			let newData = {
				id 			: topList.id,			//班级ID
				costTpl 	: tpl,					//课时消耗
				bishopIds 	: bishopIds,			//带班老师
				taIds 		: taIds,				//带班老师
				orgId 		: topList.orgId,   		//机构ID
				title 		: data.suoshukecheng, 	//所属课程
				maxStuNum 	: data.shangkerenshu, 	//上课人数
				name 		: data.banjimingcheng,	// 班级名称
				status 		: 2,
				progress    : !!data.progress && Number(data.progress) || undefined,
				maxProgress : !!data.maxProgress && Number(data.maxProgress) || undefined
			}
			formSubmit(newData);
        });
    }
	
	//关闭modal清除数据
	function closeModal() {
		resetFields();
	}

	//取消修改弹框
	function handleCancel(e) {
        e.preventDefault();
        resetFields();
        formCancel();
    }
	
	
	function bishopSelectTeacher(value, option) {
		dp('updateState', {selectBishopTeacherIds : value})
	}
	
	function bishopDeselectTeacher(value) {
		dp('updateState', {selectBishopTeacherIds : value})
	}

	function taSelectTeacher(value, option) {
		dp('updateState', {selecttTaTeacherIds : value})
	}
	
	function taDeselectTeacher(value) {
		dp('updateState', {selecttTaTeacherIds : value})
	}
	
	let bishopChildren 		= [];
	let taChildren 			= [];

	//老师列表
	teacherListSelectArr&&teacherListSelectArr.length>0&&teacherListSelectArr.map(function(item, index) {
		let b = false;
		selecttTaTeacherIds&&selecttTaTeacherIds.map(function(taItem, taIndex) {
			if(`${item.userId}` == taItem) {
				b = true;
				return;
			}
		})		
		bishopChildren.push(<Option key={item.userId} disabled={b} >{item.userName}</Option>);
	})
	
	teacherListSelectArr&&teacherListSelectArr.length>0&&teacherListSelectArr.map(function(item, index) {
		let b = false;
		selectBishopTeacherIds&&selectBishopTeacherIds.map(function(bishopItem, bishopIndex) {
			if(`${item.userId}` == bishopItem) {
				b = true;
				return;
			}
		})		
		taChildren.push(<Option key={item.userId} disabled={b} >{item.userName}</Option>);
	})
	
    //模态框的属性
    let modalOpts = {
        title: '班级信息',
        maskClosable : false,
        visible : formVisible,
        closable : true,
        width : 900,
        onOk: handleComplete,
        onCancel : handleCancel,
		afterClose : closeModal,
		wrapClassName : 'addClassesModal',
        footer : [
            <Button key="cancle" type="ghost" onClick={handleCancel}> 取 消 </Button>,
            <Button key="submit" type="primary"
                onClick={handleComplete}
                disabled={formLoading}
                loading={formLoading}>保存
			</Button>
        ],
        className : 'erp_class_management_modal'
    };

  return (
    	<Modal {...modalOpts} style={{position:'relative'}}>
		  <Form style={{marginTop:10}} className='zj_Form'>
			  <FormItem
				  label="所属校区："
				  {...formItemLayout}
				  style={{marginBottom:'20px'}}
			  >
			  {getFieldDecorator('suoshuxiaoqu', {
					initialValue:topList.orgName  || '',
					rules: [{ required: true, message: '所属校区未填写' },],
			  })(
				<Input type="text" placeholder='请填写所属校区' disabled style={{width:350}} size='default'/>
			  )}
			  </FormItem>

			<FormItem
				label="所属课程："
				{...formItemLayout}
				style={{marginBottom:'20px'}}
			>
			  {getFieldDecorator('suoshukecheng', {
					initialValue:topList.title || '',
					rules: [{ required: true, message: '所属课程未填写' },],
			  })(
					<Input type="text" placeholder='请填写所属课程' disabled style={{width:350}} size='default'/>
			  )}
			</FormItem>
			</Form>
		  {
			topList.courseType == 2 ?
				  <Form layout = 'inline' className='zj_Form'>
							<FormItem
								label="当前进度："
								labelCol={{span: 12}}
								wrapperCol={{span: 12}}
								style={{ marginBottom : '20px' , marginLeft : '7px'}}
							>
							  {getFieldDecorator('progress', {
									initialValue : !!topList && topList.progress || 0,
									rules: [
										{ required: true, message: '当前进度未填写' },
									],
							  })(
									<InputNumber
										min = { 0 }
										max = { topList.courseType == 2 && !!topList && topList.maxProgress }
										placeholder = '请填写当前进度'
										style = {{ width:125 }}
                                        size = 'default'
									/>
							  )}
							</FormItem>
							<FormItem
								label = "总进度："
								labelCol = {{ span: 12 }}
								wrapperCol = {{ span: 12 }}
								style = {{ marginBottom:'20px', lineHeight:'12px' }}
							>
							  {getFieldDecorator('maxProgress', {
									initialValue : !!topList && topList.maxProgress || 0,
							  })(
									<InputNumber disabled min = { 0 } max = { 100000 } placeholder = '请填写总进度' style = {{ width:137 }} size = 'default' />
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
				style={{marginBottom:'20px'}}
			>
			  {getFieldDecorator('banjimingcheng', {
					initialValue:topList.name || '',
					rules: [{ required: true, message: '班级名称未填写' },],
			  })(
				<Input type="text" placeholder='请填写班级名称' style={{width:350}} size='default'/>
			  )}
			</FormItem>

			<FormItem
				label="主教老师："
				{...formItemLayout}
				style={{marginBottom:'20px'}}
			>
			  {getFieldDecorator('daibanlaoshi', {
					initialValue: selectBishopTeacherIds || '',
					rules: [{ required: true, message: '请选择主教老师' },],
			  })(
				<Select
					mode = 'multiple'
					style={{ width: 350 }}
					placeholder="请选择主教老师"
					onChange={bishopSelectTeacher}
					onDeselect={bishopDeselectTeacher}
                    size='default'
				>
					{bishopChildren}
				</Select>
			  )}
			</FormItem>
			  
			  <FormItem
				label="助教老师："
				{...formItemLayout}
				style={{marginBottom:'20px'}}
			>
			  {getFieldDecorator('talaoshi', {
					initialValue: selecttTaTeacherIds || '',
					rules: [{ required: false, message: '请选择助教老师' },],
			  })(
				<Select
					multiple
					style={{ width: 350 }}
					placeholder="请选择助教老师"
					onChange={taSelectTeacher}
					onDeselect={taDeselectTeacher}
                    size='default'
				>
					{taChildren}
				</Select>
			  )}
			</FormItem>

			<FormItem
				label="最大人数："
				{...formItemLayout}
			  	style={{marginBottom:'20px'}}
			>
			  {getFieldDecorator('shangkerenshu', {
					initialValue:topList.maxStuNum || '',
					rules: [{ required: true, message: '最大上课人数未填写' },],
			  })(
				<Input type="text" placeholder='请填写最大上课人数' style={{width:350}} size='default'/>
			  )}
			</FormItem>
      	</Form>

        <Form>
            <div style={{ display:'flex' , flexWarp:'nowrap'}}>
                <FormItem
                    label='消耗课时：'
                    labelCol={{span: 12}}
                    wrapperCol={{span: 25}}
                    style={{marginLeft:-52,minWidth:320}}
                >
                  {getFieldDecorator('one', {
                    initialValue:costTplArr.length>0&&costTplArr[0] || '',
                    rules: [
                        { required: true, message: '上课未填写' },
                        { validator : validator },
                    ],
                  })(
                    <Input addonBefore="上课" addonAfter="课时/节" style={{width:150}} size='default'/>
                  )}
                </FormItem>
                <FormItem
                >
                  {getFieldDecorator('two', {
                    initialValue:costTplArr.length>0&&costTplArr[1] || '',
                    rules: [
                        { required: true, message: '请假未填写' },
                        { validator : validator },
                    ],
                  })(
                    <Input addonBefore="请假" addonAfter="课时/节" style={{width:150}} size='default'/>
                  )}
                </FormItem>
                <FormItem
                  style={{marginLeft:'10px'}}
                >
                  {getFieldDecorator('three', {
                    initialValue:costTplArr.length>0&&costTplArr[2] || '',
                    rules: [
                        { required: true, message: '补课未填写' },
                        { validator : validator },
                    ],
                  })(
                    <Input addonBefore="补课" addonAfter="课时/节" style={{width:150}} size='default'/>
                  )}
                </FormItem>
                <FormItem
                  style={{marginLeft:'10px'}}
                >
                  {getFieldDecorator('four', {
                    initialValue:costTplArr.length>0&&costTplArr[3] || '',
                    rules: [
                        { required: true, message: '旷课未填写' },
                        { validator : validator },
                    ],
                  })(
                    <Input addonBefore="旷课" addonAfter="课时/节" style={{width:150}} size='default'/>
                  )}
                </FormItem>
            </div>
         </Form>
    </Modal>
  );
};

export default Form.create()(ClassesMgrEditModal);
