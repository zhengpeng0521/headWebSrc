/**
 * 圣诞模板的首页 渲染组件
 *
 */
import React from 'react';
import { Button, Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Pagination } from 'antd';

let FormItem = Form.Item;

let SciencePageDesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData  			: this.props.detailData,
			hasPrev      			: this.props.hasPrev,
			hasNext      			: this.props.hasNext,
			pageTotal    			: this.props.pageTotal,
			hasDelete   			: this.props.hasDelete,
			initFlg      			: false,

			imagePriview        	: '',           //预览logo图片
			imagePriviewVisible 	: false,        //logo图片visible
			fileList                : null,         //logo fileList

			codeImagePreview    	: '',           //预览二维码图片
			codeImagePreviewVisible : false,        //二维码图片visible
			codeFileList       		: null,         //二维码 fileList

			orgImagePreview         : '',           //机构环境图片url
			orgImagePreviewVisible  : false,        //机构环境图片visible
			orgFileList             : null,         //机构环境 fileList

			wonderfuImagePreview	: '',
			wonderfuImagePreviewVisible : false,
			wonderFileList			: null,
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

		form.setFieldsValue({ "p1HeadImgUrl" 	: detailData.p1HeadImgUrl });
		form.setFieldsValue({ "p1OrgName" 		: detailData.p1OrgName });
		form.setFieldsValue({ "p1Title" 		: detailData.p1Title });
		form.setFieldsValue({ "p1SubTitle" 		: detailData.p1SubTitle });
		form.setFieldsValue({ "p1Content" 		: detailData.p1Content });
		form.setFieldsValue({ "p2Title" 		: detailData.p2Title });
		form.setFieldsValue({ "p2Content" 		: detailData.p2Content });
		form.setFieldsValue({ "p3Title" 		: detailData.p3Title });
		form.setFieldsValue({ "p3Content" 		: detailData.p3Content });
		form.setFieldsValue({ "p4Title"			: detailData.p4Title });
		form.setFieldsValue({ "p4Content" 		: detailData.p4Content });
		form.setFieldsValue({ "p5Title" 		: detailData.p5Title });
		form.setFieldsValue({ "p5Content" 		: detailData.p5Content });
		form.setFieldsValue({ "p6Title" 		: detailData.p6Title });
		form.setFieldsValue({ "p7Title" 		: detailData.p7Title });
		form.setFieldsValue({ "p7Content" 		: detailData.p7Content });
		form.setFieldsValue({ "p7Remark" 		: detailData.p7Remark });
		form.setFieldsValue({ "p7CodeImgUrl" 	: detailData.p7CodeImgUrl });

		//机构环境照片
		let p3orgImgs = detailData.p3Content;
		p3orgImgs.map(function( value, index ){
			let orgImage = `p3_orgImgUrl${ index + 1 }`;
			me.props.form.setFieldsValue({ [ orgImage ] : p3orgImgs[ index ].imgurl });
		});

		let p5orgImgs = detailData.p5Content;
		p5orgImgs.map(function( value, index ){
			let orgImage = `p5_orgImgUrl${ index + 1 }`;
			me.props.form.setFieldsValue({ [ orgImage ] : p5orgImgs[ index ].imgurl });
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
		let seqNo        = this.state.detailData.seqNo;
		let detailData = {

			type        	: 'Page1Component',
			seqNo       	: seqNo,
			p1HeadImgUrl 	: formData.p1HeadImgUrl,
			p1OrgName 		: formData.p1OrgName,
			p1SubTitle 		: formData.p1SubTitle,
			p1Title 		: formData.p1Title,
			p1Content 		: formData.p1Content,
			p2Title 		: formData.p2Title,
			p2Content 		: formData.p2Content,
			p3Title 		: formData.p3Title,
			p3Content : [
				{ imgurl : formData.p3_orgImgUrl1 },
				{ imgurl : formData.p3_orgImgUrl2 },
				{ imgurl : formData.p3_orgImgUrl3 },
				{ imgurl : formData.p3_orgImgUrl4 },
				{ imgurl : formData.p3_orgImgUrl5 },
				{ imgurl : formData.p3_orgImgUrl6 },
				{ imgurl : formData.p3_orgImgUrl7 },
				{ imgurl : formData.p3_orgImgUrl8 },
				{ imgurl : formData.p3_orgImgUrl9 },
				{ imgurl : formData.p3_orgImgUrl10 },
			],
			p4Title 		: formData.p4Title,
			p4Content 		: formData.p4Content,
			p5Title 		: formData.p5Title,
			p5Content : [
				{ imgurl : formData.p5_orgImgUrl1 },
				{ imgurl : formData.p5_orgImgUrl2 },
				{ imgurl : formData.p5_orgImgUrl3 },
				{ imgurl : formData.p5_orgImgUrl4 },
			],
			p6Title 		: formData.p6Title,
			p7Title 		: formData.p7Title,
			p7Content 		: formData.p7Content,
			p7Remark 		: formData.p7Remark,
			p7CodeImgUrl 	: formData.p7CodeImgUrl,


		};
		this.props.onChildPreview( detailData, seqNo );
	},

	//删除当前页
	onRemove(){
		let seqNo = this.state.detailData.seqNo;
		this.props.onRemove(seqNo);
	},

	//上传logo图片的操作
	imgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if( info.file.status === "done" ){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({ 'p1HeadImgUrl' : fileUrl })
				message.success( `${info.file.name}上传成功` );
			}else if ( info.file.status === "error" ){
				message.error( `${info.file.name}上传失败` );
			}
		} else if ( info.fileList.length <=0 ){
			this.props.form.setFieldsValue({ 'p1HeadImgUrl' : '' });
		}
		this.setState({ fileList });
	},
	imgBeforeUpload(file){
		let imgUrlList = this.props.form.getFieldValue( 'p1HeadImgUrl' );
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

	//上传精彩瞬间的操作
	wonderfulImgHandleChange( info ){
		let fileList = info.fileList;
		if( fileList && fileList.length > 4 ){
			message.error( '只能上传四张图片' );
			return false;
		}
		let form = this.props.form;
		form.setFieldsValue({ 'p5_orgImgUrl1' : "" });
		form.setFieldsValue({ 'p5_orgImgUrl2' : "" });
		form.setFieldsValue({ 'p5_orgImgUrl3' : "" });
		form.setFieldsValue({ 'p5_orgImgUrl4' : "" });

		if( info.fileList.length > 0 ){
			fileList.map(function( value, index ){
				let orgImage = `p5_orgImgUrl${ index + 1 }`;
				let fileUrl = ( value.response ? value.response.data.url : value.url );
				form.setFieldsValue({ [orgImage] : fileUrl || "" })
			})
			if(info.file.status === "done"){
				message.success(`${ info.file.name }上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${ info.file.name }上传失败`);
			}
		}
		this.setState({ wonderFileList : fileList });
	},
	wonderfulImgBeforeUpload(file){
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
	wonderfulImgHandleOnPreview( file ){
		this.setState({
			wonderfuImagePreview        : file.url||file.thumbUrl,
	       	wonderfuImagePreviewVisible : true,
		})
	},
	wonderfulCancelImagePreview(){
		this.setState({
			wonderfuImagePreviewVisible : false
		})
	},

	//上传二维码图片操作
	codeImgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({ 'p7CodeImgUrl' : fileUrl })
				message.success( `${ info.file.name }上传成功` );
			}else if (info.file.status === "error"){
				message.error( `${ info.file.name }上传失败` );
			}
		} else if ( info.fileList.length <= 0 ){
			this.props.form.setFieldsValue({ 'p7CodeImgUrl' : '' });
		}
		this.setState({
			codeFileList : fileList
		});
	},
	codeImgBeforeUpload( file ){
		let imgUrlList = this.props.form.getFieldValue('p7CodeImgUrl');
		if(imgUrlList && imgUrlList.length > 0){
			message.error( '只能上传一张图片' );
			return false;
		}
		if(file.size > 1048576){
			message.error( '图片不能大于1M' );
			return false;
		};
		if (!( file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif' )){
	        message.error( '只能上传 .JPG .PNG .gif文件哦!' );
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

	//上传机构环境图片的操作
	orgImgHandleChange( info ){
		let fileList = info.fileList;
		if( fileList && fileList.length > 10 ){
			message.error( '只能上传十张图片' );
			return false;
		}
		let form = this.props.form;
		form.setFieldsValue({ 'p3_orgImgUrl1' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl2' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl3' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl4' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl5' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl6' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl7' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl8' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl9' : "" });
		form.setFieldsValue({ 'p3_orgImgUrl10' : "" });

		if( info.fileList.length > 0 ){
			fileList.map(function( value, index ){
				let orgImage = `p3_orgImgUrl${ index + 1 }`;
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
	organCancelImagePreview(){
		this.setState({
			organImagePreviewVisible : false
		})
	},


	//校验标题字数限制
	checkTitle( rule, value, callback ){
		if((/^[\s]{ 1,8 }$/.test(value))){
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

	//校验备注字数
	checkRemark( rule, value, callback ){
		if((/^[\s]{ 1, 15 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//校验机构名称字数限制
	checkOrgTitle( rule, value, callback ){
		if((/^[\s]{ 1, 20 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//校验活动标题字数
	checkActTitle( rule, value, callback ){
		if((/^[\s]{ 1, 30 }$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
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
			wrapperCol : { span : 18, offset : 4 }
		}

		//机构名称
		let orgTitleProps = getFieldProps('p1OrgName' , {
			validate : [{
				rules : [
					{ required  : true , message : '请输入机构名称, 不超过20字', min : 1, max : 20 },
					{ validator : this.checkOrgTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//副标题
		let p1SubTitleProps = getFieldProps('p1SubTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 12 , message : '请输入副标题(1 ~ 12字)' },
					{ validator : this.checkActTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//标题
		let p1TitleProps = getFieldProps('p1Title', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//第二页标题
		let page2TitleProps = getFieldProps('p2Title', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//第二页内容
		let p2ContentProps = getFieldProps('p2Content', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 250 , message : '请输入内容, 不超过250字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//第三页标题
		let page3TitleProps = getFieldProps('p3Title', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//第四页标题
		let page4TitleProps = getFieldProps('p4Title', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//第四页内容
		let p4ContentProps = getFieldProps('p4Content', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 250 , message : '请输入内容, 不超过250字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//第五页标题
		let page5TitleProps = getFieldProps('p5Title', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//第六页标题
		let page6TitleProps = getFieldProps('p6Title', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//第七页标题
		let page7TitleProps = getFieldProps('p7Title', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//联系我们内容属性
		let p7ContentProps = getFieldProps('p7Content', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 150 , message : '请输入内容, 不超过150字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//logo图片属性
		let shareImgProps = getFieldProps('p1HeadImgUrl', {
			validate : [{
				rules : [
					{ required : true, message : '请上传图片' }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//二维码提示
		let p7RemarkProps = getFieldProps('p7Remark', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入提示, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//机构头像上传
		let defaultFileList = [];
		if( this.state.detailData && this.state.detailData.p1HeadImgUrl ){
			defaultFileList.push({
				  uid    : -1,
				  name   : 'xxx.png',
				  status : 'done',
				  url    : this.state.detailData.p1HeadImgUrl
	    	});
		}
		let uploadImgProps = {
			name         : 'file',
			// action       : BASE_URL+'/uploadController/upload',
			action : '/thinknode/upload/image',
			listType     : 'picture-card',
			fileList     : this.state.fileList ? this.state.fileList : defaultFileList,
			onChange     : this.imgHandleChange,
			beforeUpload : this.imgBeforeUpload,
	    	onPreview    : this.imgHandleOnPreview,
		};

		//机构环境图片上传
		let defaultOrgImgFileList = [];
		if( this.state.detailData && this.state.detailData.p3Content ){
			let me = this;
			detailData.p3Content.map(function( item ,index ){
				if ( item.imgurl ){
					defaultOrgImgFileList.push({
						uid    : -(index),
						status : 'done',
						url    : me.state.detailData.p3Content[ index ].imgurl
					})
				}
			})
		};
		let uploadOrgImgProps = {
			name         : 'file',
			// action       : BASE_URL + '/uploadController/upload',
			action : '/thinknode/upload/image',
			listType     : 'picture-card',
			fileList     : this.state.orgFileList ? this.state.orgFileList : defaultOrgImgFileList,
			onChange     : this.orgImgHandleChange,
			beforeUpload : this.orgImgBeforeUpload,
			onPreview    : this.orgImgHandleOnPreview,
		}

		//精彩瞬间图片
		let defaultWonderfulImgFileList = [];
		if( this.state.detailData && this.state.detailData.p5Content ){
			let me = this;
			detailData.p5Content.map(function( item ,index ){
				if ( item.imgurl ){
					defaultWonderfulImgFileList.push({
						uid    : -(index),
						status : 'done',
						url    : me.state.detailData.p5Content[ index ].imgurl
					})
				}
			})
		};
		let uploadWonderfulImgProps = {
			name         : 'file',
			// action       : BASE_URL + '/uploadController/upload',
			action : '/thinknode/upload/image',
			listType     : 'picture-card',
			fileList     : this.state.wonderFileList ? this.state.wonderFileList : defaultWonderfulImgFileList,
			onChange     : this.wonderfulImgHandleChange,
			beforeUpload : this.wonderfulImgBeforeUpload,
			onPreview    : this.wonderfulImgHandleOnPreview,
		}

		//二维码图片
		let codeImgProps = getFieldProps('p7CodeImgUrl', {
			validate : [{
				rules : [
					{required : true, message : '请上传图片'}
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//二维码上传
		let defaultCodeImgFileList = [];
		if(this.state.detailData && this.state.detailData.p7CodeImgUrl){
			defaultCodeImgFileList.push({
				  uid    : -1,
				  name   : 'xxx.png',
				  status : 'done',
				  url    : this.state.detailData.p7CodeImgUrl
	    	});
		}
		let uploadCodeImgProps = {
			name         : 'file',
			// action       : BASE_URL+'/uploadController/upload',
			action : '/thinknode/upload/image',
			listType     : 'picture-card',
			fileList     : this.state.codeFileList ? this.state.codeFileList : defaultCodeImgFileList,
			onChange     : this.codeImgHandleChange,
			beforeUpload : this.codeImgBeforeUpload,
	    	onPreview    : this.codeImgHandleOnPreview,
		};

		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl1' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl2' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl3' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl4' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl5' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl6' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl7' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl8' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl9' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p3_orgImgUrl10') }/>

						<Input type= "hidden" { ...getFieldProps( 'p5_orgImgUrl1' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p5_orgImgUrl2' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p5_orgImgUrl3' ) }/>
						<Input type= "hidden" { ...getFieldProps( 'p5_orgImgUrl4' ) }/>
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
						help = '机构名称, 不超过20字'
					>
						<Input size = 'default' placeholder = "请输入机构名称" { ...orgTitleProps }/>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '主标题'
						help = '主标题, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...p1TitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "副标题"
						help = '副标题, 不超过12字' >
						<Input size = 'default' placeholder = '请输入副标题' { ...p1SubTitleProps } />
					</FormItem>

{/*这里第二页*/}
					<FormItem
						{ ...formItemLayout }
						label = '标题二'
						help = '标题二, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...page2TitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容二'
						help = '输入回车键/enter即可换行, 不超过250字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...p2ContentProps } />
					</FormItem>

{/*这里第三页*/}
					<FormItem
						{ ...formItemLayout }
						label = '标题三'
						help = '标题三, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...page3TitleProps } />
					</FormItem>

					<FormItem
						{ ...formItemLayout }
						label = "图片"
						help = '最多上传10张图片, 图片大小 ≤ 1M, 支持png,jpeg,gif格式'
					>
						<Upload { ...uploadOrgImgProps }>
							<Icon type="plus"/>
							<Modal visible={ this.state.organImagePreviewVisible } footer={ null } onCancel={ this.organCancelImagePreview }>
								<img src={ this.state.organImagePreview } style={{ width : 450, height : 400 }}/>
							</Modal>
						</Upload>
					</FormItem>
{/*这里第四页*/}
					<FormItem
						{ ...formItemLayout }
						label = '标题四'
						help = '标题四, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...page4TitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容四'
						help = '输入回车键/enter即可换行, 不超过250字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...p4ContentProps } />
					</FormItem>

{/*这里第五页*/}
				<FormItem
						{ ...formItemLayout }
						label = '标题五'
						help = '标题五, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...page5TitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "图片"
						help = '最多上传4张图片, 图片大小 ≤ 1M, 支持png,jpeg,gif格式'
					>
						<Upload { ...uploadWonderfulImgProps }>
							<Icon type="plus"/>
							<Modal visible={ this.state.wonderfuImagePreviewVisible } footer={ null } onCancel={ this.wonderfulCancelImagePreview }>
								<img src={ this.state.wonderfuImagePreview } style={{ width : 450, height : 400 }}/>
							</Modal>
						</Upload>
					</FormItem>
{/*这里第六页*/}
					<FormItem
						{ ...formItemLayout }
						label = '标题六'
						help = '标题六, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...page6TitleProps } />
					</FormItem>

{/*这里第七页*/}
					<FormItem
						{ ...formItemLayout }
						label = '标题七'
						help = '标题七, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...page7TitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容七'
						help = '输入回车键/enter即可换行, 不超过150字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...p7ContentProps } />
					</FormItem>
					<FormItem {...formItemLayout}
							  label = "二维码"
							  help = "只能上传1张图, 图片大小 ≤ 1M, 支持png,jpeg,gif格式" >
						<Upload {...codeImgProps} {...uploadCodeImgProps}>
							<Icon type="plus"/>
							<Modal visible = { this.state.codeImagePreviewVisible } footer = { null } onCancel = { this.codeCancelImagePreview }>
								<img src = { this.state.codeImagePreview } style = {{ width : 450 , height : 400 }}/>
							</Modal>
						</Upload>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "提示文案"
						help = '标题, 不超过8字'
					>
						<Input size = 'default' placeholder = "请输入二维码文字提示" { ...p7RemarkProps } />
					</FormItem>
					<FormItem wrapperCol={{ offset: 19 }}>
						<Button style = {{ marginLeft : '7px'}} size="default" type = "primary" onClick={ this.saveInstance } >保存</Button>
					</FormItem>
				</Form>
			</div>
		);
	},

}));

export default SciencePageDesignComponent;
