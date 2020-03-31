/**
 * 圣诞模板的首页 渲染组件
 *
 */
import React from 'react';
import {Button,Row, Col,Input,Select,Icon,Modal ,Form ,Upload,message,Checkbox,Pagination} from 'antd';

let FormItem = Form.Item;

let OrganCommonPageDesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData  			: this.props.detailData,
			hasPrev      			: this.props.hasPrev,
			hasNext      			: this.props.hasNext,
			pageTotal    			: this.props.pageTotal,
			hasDelete   			: this.props.hasDelete,
			initFlg      			: false,
			imagePriview        	: '',                                        //预览上传图片url
			imagePriviewVisible 	: false,                                     //是否预览图片
			fileList                : null,
			codeImagePreview    	: '',
			codeImagePreviewVisible : false,
			codeFileList       		: null,
			organImagePreview       : '',
			organImagePreviewVisible: false,
			organFileList           : null,


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
		form.setFieldsValue({ "head_imgUrl"  : detailData.head_imgUrl });
		form.setFieldsValue({ "code_imgUrl"  : detailData.code_imgUrl });
		form.setFieldsValue({ "title"        : detailData.title });
		form.setFieldsValue({ "organIntro"   : detailData.intro });
		form.setFieldsValue({ "course_intro" : detailData.course_intro });
		form.setFieldsValue({ "contact"      : detailData.contact });
		//联系方式
		let contact = detailData.contact;
		contact.map(function( value , index ){
			let configItemTitle = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			me.props.form.setFieldsValue({ [configItemTitle] : contact[index].label });
			me.props.form.setFieldsValue({ [configItemDetail]: contact[index].value });
		});
		//课程介绍
		let course_intro = detailData.course_intro;
		course_intro.map(function(value , index){
			let courseConfigItemTitle = `courseConfigItemTitle-${index}`;
			me.props.form.setFieldsValue({ [courseConfigItemTitle] : course_intro[index] });
		});
		//机构环境照片
		let organImgs = detailData.organImgs;
		organImgs.map(function( value , index ){
			let organImage = `organImage${index+1}`;
			me.props.form.setFieldsValue({ [organImage] : organImgs[index].imgurl });
		});

		window.timer = setInterval(function(){
			me.onChildPreview();
		},200);
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
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let contact = form.getFieldValue('contact');
		let course_intro = form.getFieldValue('course_intro');
		let seqNo = this.state.detailData.seqNo;
		let detailData = {
			type : 'Page1Component',
			seqNo : seqNo,
			title : formData.title,
			intro : formData.organIntro,
			head_imgUrl : formData.head_imgUrl,
			code_imgUrl : formData.code_imgUrl,
			course_intro : course_intro.map((value , index ) => {
				return formData[`courseConfigItemTitle-${index}`];
			}),
			contact : contact.map((value,index) =>{
				return { label : formData[`configItemTitle-${index}`] , value : formData[`configItemDetail-${index}`]}
			}),
			organImgs : [
				{ imgurl : formData.organImage1 },
				{ imgurl : formData.organImage2 },
				{ imgurl : formData.organImage3 },
				{ imgurl : formData.organImage4 }
			]

		};
		this.props.onChildPreview(detailData , seqNo);
	},
	//上一页
	onPrev(seqNo){
		let form = this.props.form;
		form.validateFieldsAndScroll((error,value)=>{
			if(!!error){
				return;
			}else{
				this.props.onPrev(seqNo);
			}
		})
		this.onChildPreview()
	},

	//下一页
	onNext(seqNo){
		let form = this.props.form;
		form.validateFieldsAndScroll((error,value)=>{
			if(!!error){
				return;
			}else{
				this.props.onNext(seqNo);
			}
		})
		this.onChildPreview();
	},

	//删除当前页
	onRemove(){
		let seqNo = this.state.detailData.seqNo;
		this.props.onRemove(seqNo);
	},

	//删除课程介绍配置项
	deleteCourseConfigItem( removeKey ){
		let me = this;
		let { form } = this.props;
		let course_intro = form.getFieldValue('course_intro') || [];
		let newCourse_introt = [];
		course_intro && course_intro.length > 0 && course_intro.map(function( item , index ){
    		if( index !== removeKey ){
    			newCourse_introt.push(item)
    		}
    	});
    	form.setFieldsValue({ 'course_intro' : newCourse_introt });
    	let detailData = form.getFieldValue('course_intro');
    	detailData.map(function( value , index ){
    		let courseConfigItemTitle = `courseConfigItemTitle-${index}`;
    		form.setFieldsValue({ [courseConfigItemTitle] : detailData[index]});
    	})
	},
	addCourseConfigItem(){
		let addItem = '';
	    let { form } = this.props;
	    let course_intro = form.getFieldValue('course_intro');
	    let nextcourse_intro = course_intro.concat(addItem);
	    form.setFieldsValue({
	      course_intro: nextcourse_intro,
	    });
	},

	//删除联系方式配置项
  	deleteConfigItem( removeKey ){
  		let { form } = this.props;
  		let me = this;
	    let contact = form.getFieldValue('contact') || [];
	    let newcontact = [];
	    contact && contact.length > 0 && contact.map(function( item , index ){
    		if( index !== removeKey ){
    			newcontact.push(item)
    		}
    	});
    	form.setFieldsValue({ 'contact' : newcontact })
	    let detailData = form.getFieldValue('contact');
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
	    let contact = form.getFieldValue('contact');
	    let nextcontact = contact.concat(addItem);
	    form.setFieldsValue({
	      contact : nextcontact,
	    });
  	},

	//上传图片的操作
	imgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({'head_imgUrl' : fileUrl})
				message.success(`${info.file.name}上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`);
			}
		} else if (info.fileList.length <=0){
			this.props.form.setFieldsValue({'head_imgUrl' : ''});
		}
		this.setState({fileList});
	},
	imgBeforeUpload(file){
		let imgUrlList = this.props.form.getFieldValue('head_imgUrl');
		if(imgUrlList && imgUrlList.length > 0){
			message.error('只能上传一张图片');
			return false;
		}
		if(file.size > 1048576){
			message.error('图片不能大于1M');
			return false;
		};
		if (!(file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif')){
	        message.error('只能上传 .JPG .PNG .gif文件哦!');
	        return false;
	    }
		return true;
	},
	imgHandleOnPreview(file){
		this.setState({
			imagePriview: file.url||file.thumbUrl,
	       	imagePriviewVisible: true,
		})
	},
	cancelImagePreview(){
		this.setState({
			imagePriviewVisible : false
		})
	},

	//上传机构环境图片的操作
	organImgHandleChange(info){
		let fileList = info.fileList;
		if(fileList && fileList.length > 4){
			message.error('只能上传四张图片');
			return false;
		}
		let form = this.props.form;
		form.setFieldsValue({ "organImage1" : "" });
		form.setFieldsValue({ "organImage2" : "" });
		form.setFieldsValue({ "organImage3" : "" });
		form.setFieldsValue({ "organImage4" : "" });
		if(info.fileList.length > 0){
			fileList.map(function( value, index ){
				let organImage = `organImage${ index + 1 }`;
				let fileUrl = (value.response ? value.response.data.url : value.url );
				form.setFieldsValue({ [organImage] : fileUrl || "" })
			})
			if(info.file.status === "done"){
				message.success(`${info.file.name}上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`);
			}
		}
		this.setState({ organFileList : fileList });
	},
	organImgBeforeUpload(file){
		if(file.size > 1048576){
			message.error('图片不能大于1M');
			return false;
		}
		if (!(file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif')){
	        message.error('只能上传 .JPG .PNG .gif文件哦!');
	        return false;
	    }
		return true;
	},
	organImgHandleOnPreview( file ){
		this.setState({
			organImagePreview : file.url||file.thumbUrl,
	       	organImagePreviewVisible: true,
		})
	},

	//上传二维码图片操作
	codeImgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({'code_imgUrl' : fileUrl})
				message.success(`${info.file.name}上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`);
			}
		} else if (info.fileList.length <=0){
			this.props.form.setFieldsValue({'code_imgUrl' : ''});
		}
		this.setState({
			codeFileList : fileList
		});
	},
	codeImgBeforeUpload(file){
		let imgUrlList = this.props.form.getFieldValue('code_imgUrl');
		if(imgUrlList && imgUrlList.length > 0){
			message.error('只能上传一张图片');
			return false;
		}
		if(file.size > 1048576){
			message.error('图片不能大于1M');
			return false;
		};
		if (!(file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif')){
	        message.error('只能上传 .JPG .PNG .gif文件哦!');
	        return false;
	    }
		return true;
	},
	codeImgHandleOnPreview(file){
		this.setState({
			codeImagePreview        : file.url||file.thumbUrl,
	       	codeImagePreviewVisible : true,
		})
	},
	codeCancelImagePreview(){
		this.setState({
			codeImagePreviewVisible : false
		})
	},

	//校验标题字数限制
	checkTitle( rule, value, callback ){
		if(!(/^[^\n]{1,8}$/.test(value))){
    		callback('不能超过8个字符');
    	}else if((/^[\s]{1,8}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},
	//校验配置项字数限制
	checkConfigItemTitle( rule, value, callback ){
		if(!(/^[^\n]{1,2}$/.test(value))){
    		callback('不能超过2个字符');
    	}else if((/^[\s]{1,2}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
		this.importValueToKeys();
	},
	importValueToKeys (){
		let length = this.props.form.getFieldValue('contact').length;
		let contact = [];
		for ( let index = 0 ; index < length ; index ++ ){
			let configItemTitle  = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			let addItem = { label : this.props.form.getFieldValue(configItemTitle), value : this.props.form.getFieldValue(configItemDetail) };
			contact = contact.concat(addItem);
			this.props.form.setFieldsValue({ 'contact' : contact });
		}
	},

	//检验配置项详情
	checkConfigItemDetail( rule, value, callback ){
		callback();
		this.importValueToKeys();
	},

	//校验课程介绍配置项
	checkCourseConfigItemTitle( rule, value, callback ){
		callback();
		let length = this.props.form.getFieldValue('course_intro').length;
		let course_intro = [];
		for ( let index = 0 ; index < length ; index ++ ){
			let courseConfigItemTitle  = `courseConfigItemTitle-${index}`;
			let addItem = this.props.form.getFieldValue(courseConfigItemTitle);
			course_intro = course_intro.concat(addItem);
			this.props.form.setFieldsValue({ 'course_intro' : course_intro });
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
		let formItemLayoutWithOutLabel = {
			wrapperCol : { span : 18 , offset : 4 }
		}

        getFieldProps('contact',{
			initialValue : this.state.detailData.contact,
		});

        getFieldProps('course_intro',{
			initialValue : this.state.detailData.course_intro,
		});

		//标题属性
		let titleProps = getFieldProps('title' , {
			validate : [{
				rules : [
					{ required : true , message : '请输入标题'},
					{ validator : this.checkTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//机构简介
		let organIntroProps = getFieldProps('organIntro' , {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 70 , message : '请输入简介(1 ~ 70字)' }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//logo图片属性
		let shareImgProps = getFieldProps('head_imgUrl',{
			validate : [{
				rules : [
					{ required : true, message : '请上传图片' }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let defaultFileList = [];
		if(this.state.detailData && this.state.detailData.head_imgUrl){
			defaultFileList.push({
				  uid : -1,
				  name: 'xxx.png',
				  status: 'done',
				  url: this.state.detailData.head_imgUrl
	    	});
		}
		let uploadImgProps = {
			name : 'file',
			// action : BASE_URL+'/uploadController/upload',
			action: '/thinknode/upload/image',
			listType : 'picture-card',
			fileList : this.state.fileList ? this.state.fileList : defaultFileList,
			onChange : this.imgHandleChange,
			beforeUpload : this.imgBeforeUpload,
	    	onPreview : this.imgHandleOnPreview,
		};

		//机构环境图片
		let defaultOrganImgFileList = [];
		if( this.state.detailData && this.state.detailData.organImgs ){
			let me = this;
			detailData.organImgs.map(function( item ,index ){
				if (item.imgurl){
					defaultOrganImgFileList.push({
						uid : -(index),
						status : 'done',
						url : me.state.detailData.organImgs[index].imgurl
					})
				}
			})
		};
		let uploadorganImgProps = {
			name : 'file',
			// action: BASE_URL + '/uploadController/upload',
			action: '/thinknode/upload/image',
			listType : 'picture-card',
			fileList : this.state.organFileList ? this.state.organFileList : defaultOrganImgFileList,
			onChange : this.organImgHandleChange,
			beforeUpload : this.organImgBeforeUpload,
			onPreview : this.organImgHandleOnPreview,
		}

		//二维码图片
		let codeImgProps = getFieldProps('code_imgUrl',{
			validate : [{
				rules : [
					{required : true, message : '请上传图片'}
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let defaultCodeImgFileList = [];
		if(this.state.detailData && this.state.detailData.code_imgUrl){
			defaultCodeImgFileList.push({
				  uid: -1,
				  name: 'xxx.png',
				  status: 'done',
				  url: this.state.detailData.code_imgUrl
	    	});
		}
		let uploadCodeImgProps = {
			name : 'file',
			// action : BASE_URL+'/uploadController/upload',
			action: '/thinknode/upload/image',
			listType : 'picture-card',
			fileList : this.state.codeFileList ? this.state.codeFileList : defaultCodeImgFileList,
			onChange : this.codeImgHandleChange,
			beforeUpload : this.codeImgBeforeUpload,
	    	onPreview : this.codeImgHandleOnPreview,
		};

		//课程介绍可配置项
		let course_intro = getFieldValue('course_intro');
		let course_formItems = course_intro.map((value , index) => {
			let courseConfigTitleProps = getFieldProps(`courseConfigItemTitle-${index}`,{
				validate : [{
					rules : [
						{ required : true , message : '请输入标题'},
						{ validator : this.checkCourseConfigItemTitle }
					],
					trigger : [ 'onBlur' , 'onChange' ]
				}]
			});
			return (
				<FormItem
			          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
			          label={ index === 0 ? '课程介绍' : '' }
			          required={true}
			          key={index}
			        >
		            	<Input size = 'default' placeholder = "标题 , 不能为空" { ...courseConfigTitleProps } style = {{ width : '88%' }} />
		          <Icon
		            className="delete-button"
		            type="minus-circle-o"
		            disabled = { course_intro.length === 1 }
		            onClick = { this.deleteCourseConfigItem.bind( this , index ) }/>
		        </FormItem>
			)
		});
		//联系方式可配置项
		let contact = getFieldValue('contact');
		let formItems = contact.map((value,index) =>{
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
			          label={index === 0 ? '联系方式' : ''}
			          required={ true }
			          key={ index }
			        >
		            	<Input size = 'default' placeholder = "标题 , 不能为空" { ...configTitleProps } style = {{ width : '28%' }} />
		            	<Input size = 'default' placeholder = "详情 , 不能为空" { ...configDetailProps } style = {{ marginLeft : '8px', width : '60%' }} />
		          <Icon
		            className="delete-button"
		            type="minus-circle-o"
		            disabled = { contact.length === 1 }
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
					<FormItem>
						<Input placeholder = "第一张图片URL" type= "hidden" {...getFieldProps('organImage1')}/>
						<Input placeholder = "第二张图片URL" type= "hidden" {...getFieldProps('organImage2')}/>
						<Input placeholder = "第三张图片URL" type= "hidden" {...getFieldProps('organImage3')}/>
						<Input placeholder = "第四张图片URL" type= "hidden" {...getFieldProps('organImage4')}/>
					</FormItem>
					<FormItem {...formItemLayout}
							  label="logo"
							  help="请上传logo图片, 图片大小 ≤ 1M, 支持png,jpeg,gif格式"
					>
						<Upload {...shareImgProps} {...uploadImgProps}>
							<Icon type="plus"/>
							<Modal visible = { this.state.imagePriviewVisible } footer = { null } onCancel = { this.cancelImagePreview }>
								<img alt = "example" src={ this.state.imagePriview } style={{ width : 450, height:400 }} />
							</Modal>
						</Upload>
					</FormItem>
					<FormItem {...formItemLayout} label = "标题" help = '标题, 不超过8字' >
						<Input placeholder="请输入主标题" { ...titleProps }/>
					</FormItem>
					<FormItem { ...formItemLayout } label="机构简介" help = '机构简介, 不超过70字' >
						<Input className="page5-content-textarea" type="textarea" placeholder = '请输入机构简介' { ...organIntroProps } />
					</FormItem>
					<FormItem { ...formItemLayout } label = "机构环境" >
						<Upload { ...uploadorganImgProps }>
							<Icon type="plus"/>
							<Modal visible={ this.state.organImagePreviewVisible } footer={ null } onCancel={ this.organCancelImagePreview }>
								<img alt = "example" src={ this.state.organImagePreview } style={{ width : 450, height : 400 }}/>
							</Modal>
						</Upload>
					</FormItem>
					{ course_formItems }
					<FormItem { ...formItemLayout } >
						<Button size = 'default' type = "dashed" onClick={ this.addCourseConfigItem } style={{ width: '100%' , marginLeft: '85px' }} disabled = { course_intro.length >= 3 }>
							<Icon type = "plus" /> 新增
						</Button>
					</FormItem>
					<FormItem {...formItemLayout}
							  label = "二维码"
							  help = "只能上传1张图, 图片大小 ≤ 1M, 支持png,jpeg,gif格式" >
						<Upload {...codeImgProps} {...uploadCodeImgProps}>
							<Icon type="plus"/>
							<Modal visible = { this.state.codeImagePreviewVisible } footer = { null } onCancel = { this.codeCancelImagePreview }>
								<img alt = "example" src = { this.state.codeImagePreview } style = {{ width : 450 , height : 400 }}/>
							</Modal>
						</Upload>
					</FormItem>
					{ formItems }
			        <FormItem {...formItemLayout}>
			          <Button size = 'default' type="dashed" onClick={ this.addConfigItem } style={{ width: '100%' , marginLeft: '85px' }} disabled = { contact.length >= 3 }>
			            <Icon type="plus" /> 新增
			          </Button>
			        </FormItem>
					<FormItem wrapperCol={{ offset: 19 }}>
						<Button style = {{ marginLeft : '7px'}} size="default" type = "primary" onClick={ this.saveInstance } >保存</Button>
					</FormItem>
				</Form>
			</div>
		);
	},

}));

export default OrganCommonPageDesignComponent;
