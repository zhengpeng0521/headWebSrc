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
		form.setFieldsValue({ "headImgUrl"  : detailData.headImgUrl });
		form.setFieldsValue({ "orgTitle"    : detailData.orgTitle });
		form.setFieldsValue({ "headTitle"   : detailData.headTitle });
		form.setFieldsValue({ "subTitle"    : detailData.subTitle });
		form.setFieldsValue({ "title1"      : detailData.title1 });
		form.setFieldsValue({ "content1"    : detailData.content1 });
		form.setFieldsValue({ "title2"      : detailData.title2 });
		form.setFieldsValue({ "title3"      : detailData.title3 });
		form.setFieldsValue({ "title4"      : detailData.title4 });
		form.setFieldsValue({ "content4"    : detailData.content4 });
		form.setFieldsValue({ "title5"      : detailData.title5 });
		form.setFieldsValue({ "title6"      : detailData.title6 });
		//活动报名时间
		let initActiTime = [];
		if ( !!detailData && detailData.actiStartTime && detailData.actiStartTime != ''){
			initActiTime.push(moment(new Date( detailData.actiStartTime )))
		};
		if( !!detailData && detailData.actiEndTime && detailData.actiEndTime != '' ){
			initActiTime.push( moment(new Date( detailData.actiEndTime )) );
		}
		form.setFieldsValue({ 'actiTime' : initActiTime });
		//主体进程
		let mainProcess = detailData.mainProcess;
		mainProcess.map(function( value, index ){
			let configItemTitle = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			me.props.form.setFieldsValue({ [configItemTitle] : mainProcess[index].label });
			me.props.form.setFieldsValue({ [configItemDetail]: mainProcess[index].value });
		});

		//详情摘要
		let details = detailData.details;
		details.map( function( value, index ){
			let detailConfigItemTitle = `detailConfigItemTitle-${ index }`;
			me.props.form.setFieldsValue({ [detailConfigItemTitle] : details[index] });
		});

		//机构环境照片
		let orgImgs = detailData.orgImgs;
		orgImgs.map(function( value, index ){
			let orgImage = `orgImgUrl${ index + 1 }`;
			me.props.form.setFieldsValue({ [ orgImage ] : orgImgs[ index ].imgurl });
		});

		window.timer = setInterval( function(){
			me.onChildPreview();
		}, 200 );
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
		let mainProcess  = form.getFieldValue('mainProcess');
		let details      = form.getFieldValue('details');
		let seqNo        = this.state.detailData.seqNo;
		let detailData = {
			type        : 'Page1Component',
			seqNo       : seqNo,
			headImgUrl  : formData.headImgUrl,
			orgTitle    : formData.orgTitle,
			headTitle   : formData.headTitle,
			subTitle    : formData.subTitle,
			title1      : formData.title1,
			content1    : formData.content1,
			title2      : formData.title2,
			title3      : formData.title3,
			title4      : formData.title4,
			content4    : formData.content4,
			title5      : formData.title5,
			title6      : formData.title6,
			actiStartTime : !!formData.actiTime && formData.actiTime.length > 0 && formData.actiTime[0].format('YYYY-MM-DD'),
			actiEndTime : !!formData.actiTime && formData.actiTime.length > 0 && formData.actiTime[1].format('YYYY-MM-DD'),
			mainProcess : mainProcess.map((value,index) =>{
				return { label : formData[`configItemTitle-${index}`] , value : formData[`configItemDetail-${index}`]}
			}),
			details     : details.map( (value, index ) => {
				return formData[`detailConfigItemTitle-${ index }`];
			}),
			orgImgs : [
				{ imgurl : formData.orgImgUrl1 },
				{ imgurl : formData.orgImgUrl2 },
				{ imgurl : formData.orgImgUrl3 },
				{ imgurl : formData.orgImgUrl4 },
				{ imgurl : formData.orgImgUrl5 },
			]
		};
		this.props.onChildPreview( detailData, seqNo );
	},

	//删除当前页
	onRemove(){
		let seqNo = this.state.detailData.seqNo;
		this.props.onRemove(seqNo);
	},

	//删除详情摘要配置项
	deleteDetailsConfigItem( removeKey ){
		let me = this;
		let { form } = this.props;
		let details = form.getFieldValue('details') || [];
		if ( details.length === 1 ) {
	      return;
	    }
		let newDetails = [];
		details && details.length > 0 && details.map(function( item , index ){
    		if( index !== removeKey ){
    			newDetails.push(item)
    		}
    	});
    	form.setFieldsValue({ 'details' : newDetails });
    	let detailData = form.getFieldValue('details');
    	detailData.map(function( value, index ){
    		let detailsConfigItemTitle = `detailConfigItemTitle-${ index }`;
    		form.setFieldsValue({ [ detailsConfigItemTitle ] : detailData[ index ]});
    	})
	},

	addDetailsConfigItem(){
		let addItem = '';
	    let { form } = this.props;
	    let details = form.getFieldValue('details');
	    let nextDetails = details.concat( addItem );
	    form.setFieldsValue({
	      details: nextDetails,
	    });
	},

	//删除主体流程配置项
  	deleteConfigItem( removeKey ){
  		let { form } = this.props;
  		let me = this;
	    let mainProcess = form.getFieldValue('mainProcess') || [];
		if ( mainProcess.length === 1 ) {
	      return;
	    }
	    let newMainProcess = [];
	    mainProcess && mainProcess.length > 0 && mainProcess.map(function( item , index ){
    		if( index !== removeKey ){
    			newMainProcess.push(item)
    		}
    	});
    	form.setFieldsValue({ 'mainProcess' : newMainProcess })
	    let detailData = form.getFieldValue('mainProcess');
	    detailData.map(function(value,index){
			let configItemTitle  = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			me.props.form.setFieldsValue({ [configItemTitle]: detailData[index].label });
			me.props.form.setFieldsValue({ [configItemDetail]: detailData[index].value });
		});
  	},

  	addConfigItem(){
  		let addItem = { label : '', value : '' };
	    let { form } = this.props;
	    let mainProcess = form.getFieldValue('mainProcess');
	    let nextMainProcess = mainProcess.concat(addItem);
	    form.setFieldsValue({
	      mainProcess : nextMainProcess,
	    });
  	},

	//上传logo图片的操作
	imgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if( info.file.status === "done" ){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({ 'headImgUrl' : fileUrl })
				message.success( `${info.file.name}上传成功` );
			}else if ( info.file.status === "error" ){
				message.error( `${info.file.name}上传失败` );
			}
		} else if ( info.fileList.length <=0 ){
			this.props.form.setFieldsValue({ 'headImgUrl' : '' });
		}
		this.setState({ fileList });
	},
	imgBeforeUpload(file){
		let imgUrlList = this.props.form.getFieldValue( 'headImgUrl' );
		if(imgUrlList && imgUrlList.length > 0){
			message.error( '只能上传一张图片' );
			return false;
		}
		if(file.size > 1048576){
			message.error( '图片不能大于1M' );
			return false;
		};
		if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')){
	        message.error( '只能上传 .JPG .PNG .gif文件哦!' );
	        return false;
	    }
		return true;
	},
	imgHandleOnPreview( file ){
		this.setState({
			imagePriview        : file.url || file.thumbUrl,
	       	imagePriviewVisible : true,
		})
	},
	cancelImagePreview(){
		this.setState({
			imagePriviewVisible : false
		})
	},

	//上传机构环境图片的操作
	orgImgHandleChange( info ){
		let fileList = info.fileList;
		if( fileList && fileList.length > 5 ){
			message.error( '只能上传5张图片' );
			return false;
		}
		let form = this.props.form;
		form.setFieldsValue({ 'orgImgUrl1' : "" });
		form.setFieldsValue({ 'orgImgUrl2' : "" });
		form.setFieldsValue({ 'orgImgUrl3' : "" });
		form.setFieldsValue({ 'orgImgUrl4' : "" });
		form.setFieldsValue({ 'orgImgUrl5' : "" });
		if( info.fileList.length > 0 ){
			fileList.map(function( value, index ){
				let orgImage = `orgImgUrl${ index + 1 }`;
				let fileUrl = ( value.response ? value.response.data.url : value.url );
				form.setFieldsValue({ [orgImage] : fileUrl || "" })
			})
			if(info.file.status === "done"){
				message.success(`${ info.file.name }上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${ info.file.name }上传失败`);
			}
		}
		this.setState({ orgFileList : fileList });
	},
	orgImgBeforeUpload(file){
		if(file.size > 1048576){
			message.error( '图片不能大于1M' );
			return false;
		}
		if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')){
	        message.error('只能上传 .JPG .PNG .gif文件哦!');
	        return false;
	    }
		return true;
	},
	orgImgHandleOnPreview( file ){
		this.setState({
			organImagePreview        : file.url||file.thumbUrl,
	       	organImagePreviewVisible : true,
		})
	},

	//校验标题字数限制
	checkTitle( rule, value, callback ){
		if((/^[\s]{ 1, 10 }$/.test(value))){
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

	//校验主标题字数
	checkHeadTitle( rule, value, callback ){
		if((/^[\s]{ 1, 5 }$/.test(value))){
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

	//校验配置项字数限制
	checkConfigItemTitle( rule, value, callback ){
		if((/^[\s]{1,4}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
		this.importValueToKeys();
	},
	importValueToKeys (){
		let length = this.props.form.getFieldValue('mainProcess').length;
		let mainProcess = [];
		for ( let index = 0 ; index < length ; index ++ ){
			let configItemTitle  = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			let addItem = { label : this.props.form.getFieldValue(configItemTitle), value : this.props.form.getFieldValue(configItemDetail) };
			mainProcess = mainProcess.concat(addItem);
			this.props.form.setFieldsValue({ 'mainProcess' : mainProcess });
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

	//校验课程介绍配置项
	checkDetailConfigItemTitle( rule, value, callback ){
		callback();
		let length = this.props.form.getFieldValue('details').length;
		let details = [];
		for ( let index = 0 ; index < length ; index ++ ){
			let detailConfigItemTitle  = `detailConfigItemTitle-${ index }`;
			let addItem = this.props.form.getFieldValue(detailConfigItemTitle);
			details = details.concat(addItem);
			this.props.form.setFieldsValue({ 'details' : details });
		}
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

	render () {
		let { designData, recordData } = this.props;
		let { detailData } = this.state;

		let self = this;
		let { getFieldValue, getFieldProps, getFieldError, isFieldValidating } = this.props.form;

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
		let formItemLayoutWithoutLabel = {
			wrapperCol : { span : 14, offset : 10 }
		}

		let formItemLayoutWithoutLabel1 = {
			wrapperCol : { span : 18, offset : 4 }
		}
		getFieldProps('mainProcess',{
			initialValue : this.state.detailData.mainProcess,
		});

		getFieldProps('details',{
			initialValue : this.state.detailData.details,
		});

		//机构名称属性
		let orgTitleProps = getFieldProps('orgTitle' , {
			validate : [{
				rules : [
					{ required  : true , message : '请输入机构名称, 不超过12字', min : 1, max : 12 },
					{ validator : this.checkOrgTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//主标题属性
		let headTitleProps = getFieldProps('headTitle', {
			validate : [{
				rules : [
					{ required : true , min : 3, max : 5, message : '请输入主标题(3 ~ 5字)' },
					{ validator : this.checkHeadTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//副标题属性
		let subTitleProps = getFieldProps('subTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 15, message : '请输入活动标题, 不超过8字' },
					{ validator : this.checkSubTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//活动时间
		let actiTimeProps = getFieldProps('actiTime', {
//			validate : [{
//			}]
		});

		//标题一属性
		let title1Props = getFieldProps('title1', {
			validate : [{
				rules : [
					{ required : true , min : 1, max : 10, message : '请输入标题, 不超过10字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//内容一属性
		let content1Props = getFieldProps('content1', {
			validate : [{
				rules : [
					{ required : true , min : 1, max : 200, message : '请输入内容, 不超过200字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//标题二属性
		let title2Props = getFieldProps('title2', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 10, message : '请输入标题, 不超过10字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//标题三属性
		let title3Props = getFieldProps('title3', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 10, message : '请输入标题, 不超过10字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//标题四属性
		let title4Props = getFieldProps('title4', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 10, message : '请输入标题, 不超过10字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//内容四属性
		let content4Props = getFieldProps('content4', {
			validate : [{
				rules : [
					{ required : true , min : 1, max : 200, message : '请输入内容, 不超过200字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//标题五属性
		let title5Props = getFieldProps('title5', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 10, message : '请输入标题, 不超过10字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//标题六属性
		let title6Props = getFieldProps('title6', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 10, message : '请输入标题, 不超过10字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//logo图片属性
		let shareImgProps = getFieldProps('headImgUrl', {
			validate : [{
				rules : [
					{ required : true, message : '请上传图片' }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//详情摘要可配置项
		let mainProcess = getFieldValue('mainProcess');
		let mainProcessComponents = mainProcess.map(( value,index ) =>{
			let configTitleProps = getFieldProps(`configItemTitle-${index}`,{
				validate : [{
					rules : [
						{ required : true , message : '不超过4字', min : 1, max : 4 },
						{ validator : this.checkConfigItemTitle }
					],
					trigger : ['onBlur' , 'onChange']
				}]
			});

			let configDetailProps = getFieldProps(`configItemDetail-${index}`,{
				validate : [{
					rules : [
						{ required : true , message : '不超过30字', min : 1, max : 30 },
						{ validator : this.checkConfigItemDetail }
					],
					trigger : ['onBlur' , 'onChange']
				}]
			});

			return (
				<div>
					<FormItem
						  style = {{ display : 'inline-block', width : '29%', marginLeft : '26px' }}
						  {...(index === 0 ? formItemLayout1 : formItemLayoutWithoutLabel)}
						  label={index === 0 ? '配置项' : '' }
						  required={ true }
						  key={ index }
						>
							<Input size = 'default' placeholder = "不能为空, 不超过4字" { ...configTitleProps } style = {{ width : '100%' }} />
					</FormItem>
					<FormItem
						style = {{ display : 'inline-block', width : '66%' }}
						{ ...formItemLayout2 }
						label = ''
						key = { index + '_' }
					>
						<Input size = 'default' placeholder = "不能为空, 不超过30字" { ...configDetailProps } style = {{ marginLeft : '8px', width : '77%' }} />
						<Icon
							className = "delete-button"
							type = "minus-circle-o"
							disabled = { mainProcess.length == 1 }
							onClick = { this.deleteConfigItem.bind( this , index ) }/>
					</FormItem>
				</div>
			)
		});

		//主体流程可配置项
		let details = getFieldValue('details');
		let detailsComponents = details.map(( value , index ) => {
			let detailConfigTitleProps = getFieldProps(`detailConfigItemTitle-${index}`,{
				validate : [{
					rules : [
						{ required : true , message : '不超过12字', min : 1, max : 12 },
						{ validator : this.checkDetailConfigItemTitle }
					],
					trigger : [ 'onBlur' , 'onChange' ]
				}]
			});
			return (
				<FormItem
			          { ...( index === 0 ? formItemLayout : formItemLayoutWithoutLabel1 ) }
			          label = { index === 0 ? '配置项' : '' }
			          required = { true }
			          key = { index }
			        >
		            	<Input size = 'default' placeholder = "不能为空" { ...detailConfigTitleProps } style = {{ width : '92%' }} />
		          <Icon
		            className = "delete-button"
		            type = "minus-circle-o"
		            disabled = { details.length == 1 }
		            onClick = { this.deleteDetailsConfigItem.bind( this , index ) }/>
		        </FormItem>
			)
		});

		let defaultFileList = [];
		if( this.state.detailData && this.state.detailData.headImgUrl ){
			defaultFileList.push({
				  uid    : -1,
				  name   : 'xxx.png',
				  status : 'done',
				  url    : this.state.detailData.headImgUrl
	    	});
		}
		let uploadImgProps = {
			name         : 'file',
			// action       : BASE_URL+'/uploadController/upload',
			action: '/thinknode/upload/image',
			listType     : 'picture-card',
			fileList     : this.state.fileList ? this.state.fileList : defaultFileList,
			onChange     : this.imgHandleChange,
			beforeUpload : this.imgBeforeUpload,
	    	onPreview    : this.imgHandleOnPreview,
		};

		//机构环境图片
		let defaultOrgImgFileList = [];
		if( this.state.detailData && this.state.detailData.orgImgs ){
			let me = this;
			detailData.orgImgs.map(function( item ,index ){
				if ( item.imgurl ){
					defaultOrgImgFileList.push({
						uid    : -(index),
						status : 'done',
						url    : me.state.detailData.orgImgs[ index ].imgurl
					})
				}
			})
		};
		let uploadOrgImgProps = {
			name         : 'file',
			// action       : BASE_URL + '/uploadController/upload',
			action: '/thinknode/upload/image',
			listType     : 'picture-card',
			fileList     : this.state.orgFileList ? this.state.orgFileList : defaultOrgImgFileList,
			onChange     : this.orgImgHandleChange,
			beforeUpload : this.orgImgBeforeUpload,
			onPreview    : this.orgImgHandleOnPreview,
		}

		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem>
						<Input placeholder = "第一张图片URL" type= "hidden" { ...getFieldProps( 'orgImgUrl1' ) } />
						<Input placeholder = "第二张图片URL" type= "hidden" { ...getFieldProps( 'orgImgUrl2' ) } />
						<Input placeholder = "第三张图片URL" type= "hidden" { ...getFieldProps( 'orgImgUrl3' ) } />
						<Input placeholder = "第四张图片URL" type= "hidden" { ...getFieldProps( 'orgImgUrl4' ) } />
						<Input placeholder = "第五张图片URL" type= "hidden" { ...getFieldProps( 'orgImgUrl5' ) } />
					</FormItem>
					<FormItem { ...formItemLayout }
							  label = "logo"
							  help = "请上传logo图片, 图片大小 ≤ 1M, 支持png,jpeg,gif格式"
					>
						<Upload { ...shareImgProps } { ...uploadImgProps }>
							<Icon type = "plus"/>
							<Modal visible = { this.state.imagePriviewVisible } footer = { null } onCancel = { this.cancelImagePreview }>
								<img src={ this.state.imagePriview } style = {{ width : 450, height : 400 }} />
							</Modal>
						</Upload>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "机构名称"
						help = '机构名称, 不超过12字'
					>
						<Input size = 'default' placeholder = "请输入机构名称" { ...orgTitleProps }/>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "主标题"
						help = '主标题, 3~5字' >
						<Input size = 'default' placeholder = '请输入主标题' { ...headTitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '副标题'
						help = '副标题, 不超过15字'
					>
						<Input size = 'default' placeholder = '请输入副标题' { ...subTitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '活动时间'
					>
						<RangePicker style = {{ width : '100%' }} size = 'default' format = 'YYYY-MM-DD' placeholder = {['开始时间', '结束时间']} { ...actiTimeProps } onOpenChange = { this.onOpenChange }/>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题一'
						help = '标题一, 不超过10字'
					>
						<Input size = 'default' placeholder = '请输入标题一' { ...title1Props } />
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
						help = '标题二, 不超过10字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...title2Props } />
					</FormItem>
					{ mainProcessComponents }
					<FormItem {...formItemLayout}>
			          <Button size = 'default' type="dashed" onClick={ this.addConfigItem } style={{ width: '100%' , marginLeft: '85px' }} disabled = { mainProcess.length >= 3 }>
			            <Icon type="plus" /> 新增
			          </Button>
			        </FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题三'
						help = '标题三, 不超过10字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...title3Props } />
					</FormItem>
					{ detailsComponents }
					<FormItem { ...formItemLayout } >
						<Button size = 'default' type = "dashed" onClick={ this.addDetailsConfigItem } style={{ width: '100%' , marginLeft: '85px' }} disabled = { details.length >= 10 }>
							<Icon type = "plus" /> 新增
						</Button>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题四'
						help = '标题四, 不超过10字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...title4Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容四'
						help = '输入回车键/enter即可换行, 不超过200字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...content4Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题五'
						help = '标题五, 不超过10字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...title5Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "图片"
						help = '最多上传5张图片, 图片大小 ≤ 1M, 支持png,jpeg,gif格式'
					>
						<Upload { ...uploadOrgImgProps }>
							<Icon type="plus"/>
							<Modal visible={ this.state.organImagePreviewVisible } footer={ null } onCancel={ this.organCancelImagePreview }>
								<img src={ this.state.organImagePreview } style={{ width : 450, height : 400 }}/>
							</Modal>
						</Upload>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题六'
						help = '标题六, 不超过10字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...title6Props } />
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
