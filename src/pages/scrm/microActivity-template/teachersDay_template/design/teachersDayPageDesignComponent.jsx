/**
 * 夏令营首页 渲染组件
 *
 */
import React from 'react';
import moment from 'moment';
import { Button, Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Pagination, DatePicker } from 'antd';

let FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;

let SummerCampPageDesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData  			: this.props.detailData,
			hasPrev      			: this.props.hasPrev,
			hasNext      			: this.props.hasNext,
			pageTotal    			: this.props.pageTotal,
			hasDelete   			: this.props.hasDelete,
			initFlg      			: false,

			imagePriview        	: '',                     //预览logo图片
			imagePriviewVisible 	: false,                  //logo图片visible
			fileList                : null,                   //logo fileList

			codeImagePreview    	: '',                     //预览二维码图片
			codeImagePreviewVisible : false,                  //二维码图片visible
			codeFileList       		: null,                   //二维码 fileList

			orgImagePreview         : '',                     //机构环境图片url
			orgImagePreviewVisible  : false,                  //机构环境图片visible
			orgFileList             : null,                   //机构环境 fileList
		}
	},

	componentWillReceiveProps(nextProps) {
		let detailData = this.state.detailData;
		this.setState({
			detailData : nextProps.detailData,
			hasPrev    : nextProps.hasPrev,
			hasNext    : nextProps.hasNext,
			pageTotal  : nextProps.pageTotal,
			hasDelete  : nextProps.hasDelete
		})
		if ( (nextProps.formVisible && this.props.formVisible !== nextProps.formVisible) || !this.state.initFlg ){

			this.initFormData( detailData );
			this.setState({
				initFlg : true
			});
		}
	},

	//初始化表单值
	initFormData( detailData ){
		let me = this;
		let form = this.props.form;
		form.setFieldsValue({ "oneTitle"  		: detailData.oneTitle });
		form.setFieldsValue({ "oneSubTitle"    	: detailData.oneSubTitle });
		form.setFieldsValue({ "twoTitle"    	: detailData.twoTitle });
		form.setFieldsValue({ "twosubTitle"     : detailData.twosubTitle });
		form.setFieldsValue({ "twoContent"      : detailData.twoContent });
		form.setFieldsValue({ "threeTitle"      : detailData.threeTitle });
		form.setFieldsValue({ "threeContent"    : detailData.threeContent });
		form.setFieldsValue({ "forTitle"      	: detailData.forTitle });
		form.setFieldsValue({ "keys" 			: detailData.intro});

		detailData.intro.map(function(value,index){
			let configItemTitle = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			form.setFieldsValue({ [configItemTitle]: detailData.intro[index].label });
			form.setFieldsValue({ [configItemDetail]: detailData.intro[index].value });
		});
		
		
		window.timer = setInterval( function(){
			me.onChildPreview();
		}, window.refreshTimes || 200);
	},

	//保存实例
	saveInstance(){
		this.props.form.validateFieldsAndScroll((error,value)=>{
			if(!!error){
				return;
			}else{
				clearInterval(window.timer);
				this.onChildPreview();
				this.props.saveInstance();
			}
		})
	},
	
	//预览
	onChildPreview(){
		let form         = this.props.form;
		let formData     = form.getFieldsValue();
		let seqNo        = this.state.detailData.seqNo;
		let keys		 = form.getFieldValue('keys');
		let detailData = {
			type        	: 'Page1Component',
			seqNo       	: seqNo,
			oneTitle  		: formData.oneTitle,
			oneSubTitle    	: formData.oneSubTitle,
			twoTitle    	: formData.twoTitle,
			twosubTitle     : formData.twosubTitle,
			twoContent      : formData.twoContent,
			threeTitle      : formData.threeTitle,
			threeContent    : formData.threeContent,
			forTitle     	: formData.forTitle,
			intro 			: keys&&keys.map((value,index) =>{
				return { label : formData[`configItemTitle-${index}`] , value : formData[`configItemDetail-${index}`]}
			})
		};
		this.props.onChildPreview( detailData, seqNo );
	},

	//删除当前页
	onRemove(){
		let seqNo = this.state.detailData.seqNo;
		this.props.onRemove(seqNo);
	},

	cancelImagePreview(){
		this.setState({
			imagePriviewVisible : false
		})
	},

	//校验标题字数限制
	checkTitle( rule, value, callback ){
		if((/^[\s]{ 1, 8 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//校验内容字数限制
	checkContent( rule, value, callback ){
		if((/^[\s]{ 1, 200 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//校验机构名称字数限制
	checkOrgTitle( rule, value, callback ){
		if((/^[\s]{ 1, 12 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},
	
	//校验机构名称字数限制
	checkOrgName( rule, value, callback ){
		if((/^[\s]{ 1, 20 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//校验主标题字数
	checkHeadTitle( rule, value, callback ){
		if((/^[\s]{ 1, 20 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//校验副标题字数
	checkSubTitle( rule, value, callback ){
		if((/^[\s]{ 1, 15 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//检验配置项详情
	checkConfigItemDetail( rule, value, callback ){		
		if((/^[\s]{1,30}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
		this.importValueToKeys();
	},

	onOpenChange( status ){
		let me = this;
		if( !!status ){
			clearInterval( window.timer );
			window.timer = null;
		}else{
			window.timer = setInterval( function(){
				me.onChildPreview();
			}, 200 );
		}
	},

	//校验配置项字数限制
	checkConfigItemTitle( rule, value, callback ){
		if(!(/^[^\n]{1,4}$/.test(value))){
    		callback('不能超过4个字符');
    	}else if((/^[\s]{1,4}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
		this.importValueToKeys();
	},

	importValueToKeys (){
		let length = this.props.form.getFieldValue('keys').length;
		let keys = [];
		for ( let index = 0 ; index < length ; index ++ ){
			let configItemTitle  = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			let addItem = { label : this.props.form.getFieldValue(configItemTitle), value : this.props.form.getFieldValue(configItemDetail) };
			keys = keys.concat(addItem);
			this.props.form.setFieldsValue({ 'keys' : keys });
		}
	},
	
	//删除配置项
  	deleteConfigItem(index){
  		let { form } = this.props;
  		let me = this;
	    let keys = form.getFieldValue('keys');
	    if (keys.length === 1) {
	      return;
	    }
	    form.setFieldsValue({
	      keys: keys.filter(function(value,key,arr){
	      	return key !== index
	      })
	    });
	    let detailData = form.getFieldValue('keys');
	    detailData.map(function(value,index){
			let configItemTitle  = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			me.props.form.setFieldsValue({ [configItemTitle]: detailData[index].label });
			me.props.form.setFieldsValue({ [configItemDetail]: detailData[index].value });
		})
  	},
  	addConfigItem(){
  		let addItem = { label : '', value : '' };
	    const { form } = this.props;
	    const keys = form.getFieldValue('keys');
	    const nextKeys = keys.concat(addItem);
	    form.setFieldsValue({
	      keys: nextKeys,
	    });
  	},
	
	render () {
		let { designData, recordData } = this.props;
		let { detailData } = this.state;

		let self = this;
		let { getFieldValue, getFieldProps, getFieldError, isFieldValidating } = this.props.form;

		getFieldProps('keys',{
			initialValue : this.state.detailData.intro,
		})
		//表单元素布局属性
		let formItemLayout = {
			labelCol : { span : 4 },
			wrapperCol : { span : 18 }
		};
		let formItemLayout1 = {
			labelCol : { span : 10 },
			wrapperCol : { span : 14 }
		};
		let formItemLayout2 = {
			wrapperCol : { span : 24 }
		};
		let formItemLayoutWithOutLabel = {
			wrapperCol : { span : 18, offset : 4 }
		};

		//机构名称属性
		let orgTitleProps = getFieldProps('oneTitle' , {
			validate : [{
				rules : [
					{ required  : true , message : '请输入机构名称, 不超过20字', min : 1, max : 20 },
					{ validator : this.checkOrgName }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//主标题属性
		let oneSubTitleProps = getFieldProps('oneSubTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1, max : 20, message : '请输入主标题(不超过20字)' },
					{ validator : this.checkHeadTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//标题一属性
		let twoTitle1Props = getFieldProps('twoTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1, max : 8, message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})
			
		//副标题标题一属性
		let twoSubTitle1Props = getFieldProps('twosubTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1, max : 12, message : '请输入标题, 不超过12字' },
					{ validator : this.checkOrgTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})
		
		//内容一属性
		let content1Props = getFieldProps('twoContent', {
			validate : [{
				rules : [
					{ required : true , min : 1, max : 200, message : '请输入内容, 不超过200字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//标题二属性
		let threeTitleProps = getFieldProps('threeTitle', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 8, message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//内容四属性
		let content2Props = getFieldProps('threeContent', {
			validate : [{
				rules : [
					{ required : true , min : 1, max : 200, message : '请输入内容, 不超过200字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//标题五属性
		let fourTitleProps = getFieldProps('forTitle', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 8, message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})
		
		//可配置项
		let keys = getFieldValue('keys');
		let formItems = keys&&keys.map((value,index) =>{
			let configTitleProps = getFieldProps(`configItemTitle-${index}`,{
				validate : [{
					rules : [
						{ required : true , message : '请输入标题'},
						{ validator : this.checkConfigItemTitle }
					],
					trigger : ['onBlur' , 'onChange']
				}]
			});
			let configDetailProps = getFieldProps(`configItemDetail-${index}`,{
				validate : [{
					rules : [
						{ required : true , message : '请输入详情'},
						{ validator : this.checkConfigItemDetail }
					],
					trigger : ['onBlur' , 'onChange']
				}]
			});
			return (
				<FormItem
			          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
			          label={index === 0 ? '配置项' : ''}
			          required={true}
			          key={index}
			        >
		            	<Input size = 'default' placeholder="标题 , 不能为空" {...configTitleProps} style={{width:'28%'}} />
		            	<Input size = 'default' placeholder="详情 , 不能为空" {...configDetailProps} style={{ marginLeft:'8px', width:'60%'}} />
		          <Icon
		            className="delete-button"
		            type="minus-circle-o"
		            disabled={ keys.length === 1 }
		            onClick = { this.deleteConfigItem.bind( this , index ) }/>
		        </FormItem>
			)
		});
		
		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem
						{ ...formItemLayout }
						label = "机构名称"
						help = '机构名称, 不超过20字'
					>
						<Input size = 'default' placeholder = "请输入机构名称" { ...orgTitleProps }/>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "主标题"
						help = '主标题, 不超过20字' >
						<Input size = 'default' placeholder = '请输入主标题' { ...oneSubTitleProps } />
					</FormItem>
					{formItems}
			        <FormItem {...formItemLayout}>
			          <Button size = 'default' type="dashed" onClick={ this.addConfigItem } style={{ width: '100%' , marginLeft: '85px' }} disabled = { keys.length >= 3}>
			            <Icon type="plus" /> 新增
			          </Button>
			        </FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题一'
						help = '标题一, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题一' { ...twoTitle1Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '副标题'
						help = '副标题, 不超过12字'
					>
						<Input size = 'default' placeholder = '请输入副标题' { ...twoSubTitle1Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容一'
						help = '输入回车键/enter即可换行, 不超过200字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...content1Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题二'
						help = '标题二, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...threeTitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容二'
						help = '输入回车键/enter即可换行, 不超过200字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...content2Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题三'
						help = '标题三, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...fourTitleProps } />
					</FormItem>
					<FormItem wrapperCol={{ offset: 19 }}>
						<Button style = {{ marginLeft : '7px'}} size="default" type = "primary" onClick={ this.saveInstance } >保存</Button>
					</FormItem>
				</Form>
			</div>
		);
	},

}));

export default SummerCampPageDesignComponent;
