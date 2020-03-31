/**
 * 圣诞模板的首页 渲染组件
 *
 */
import React from 'react';
import { Button, Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Pagination } from 'antd';

let FormItem = Form.Item;

let SummerCultivatePageDesignComponent = Form.create()(React.createClass({
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
		form.setFieldsValue({ "actiTitle"   : detailData.actiTitle });
		form.setFieldsValue({ "expTitle"    : detailData.expTitle });
		form.setFieldsValue({ "expContent"  : detailData.expContent });
		form.setFieldsValue({ "orgIntro"    : detailData.orgIntro });
		form.setFieldsValue({ "orgContent1" : detailData.orgContent1 });
		form.setFieldsValue({ "orgContent2" : detailData.orgContent2 });
		form.setFieldsValue({ "orgContent3" : detailData.orgContent3 });
		form.setFieldsValue({ "couTitle"    : detailData.couTitle });
		form.setFieldsValue({ "couContent"  : detailData.couContent });
		form.setFieldsValue({ "conTitle"    : detailData.conTitle });
		form.setFieldsValue({ "conContent"  : detailData.conContent });
		form.setFieldsValue({ "codeImgUrl"  : detailData.codeImgUrl });
		form.setFieldsValue({ "remark"      : detailData.remark });
		form.setFieldsValue({ "apply"       : detailData.apply });

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
		let contact      = form.getFieldValue('contact');
		let course_intro = form.getFieldValue('course_intro');
		let seqNo        = this.state.detailData.seqNo;
		let detailData = {
			type        : 'Page1Component',
			seqNo       : seqNo,
			headImgUrl  : formData.headImgUrl,
			orgTitle    : formData.orgTitle,
			actiTitle   : formData.actiTitle,
			expTitle    : formData.expTitle,
			expContent  : formData.expContent,
			orgIntro    : formData.orgIntro,
			orgContent1 : formData.orgContent1,
			orgContent2 : formData.orgContent2,
			orgContent3 : formData.orgContent3,
			couTitle    : formData.couTitle,
			couContent  : formData.couContent,
			conTitle    : formData.conTitle,
			conContent  : formData.conContent,
			codeImgUrl  : formData.codeImgUrl,
			remark      : formData.remark,
			apply       : formData.apply,

			orgImgs : [
				{ imgurl : formData.orgImgUrl1 },
				{ imgurl : formData.orgImgUrl2 },
				{ imgurl : formData.orgImgUrl3 },
			]
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
		if( fileList && fileList.length > 3 ){
			message.error( '只能上传三张图片' );
			return false;
		}
		let form = this.props.form;
		form.setFieldsValue({ 'orgImgUrl1' : "" });
		form.setFieldsValue({ 'orgImgUrl2' : "" });
		form.setFieldsValue({ 'orgImgUrl3' : "" });
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


	//上传二维码图片操作
	codeImgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({ 'codeImgUrl' : fileUrl })
				message.success( `${ info.file.name }上传成功` );
			}else if (info.file.status === "error"){
				message.error( `${ info.file.name }上传失败` );
			}
		} else if ( info.fileList.length <= 0 ){
			this.props.form.setFieldsValue({ 'codeImgUrl' : '' });
		}
		this.setState({
			codeFileList : fileList
		});
	},
	codeImgBeforeUpload( file ){
		let imgUrlList = this.props.form.getFieldValue('codeImgUrl');
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
		let formItemLayoutWithoutLabel = {
			wrapperCol : { span : 18, offset : 4 }
		}

		//机构名称属性
		let orgTitleProps = getFieldProps('orgTitle' , {
			validate : [{
				rules : [
					{ required  : true , message : '请输入机构名称, 不超过20字', min : 1, max : 20 },
					{ validator : this.checkOrgTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//活动标题属性
		let actiTitleProps = getFieldProps('actiTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 30 , message : '请输入活动标题(1 ~ 30字)' },
					{ validator : this.checkActTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//活动说明
		let expTitleProps = getFieldProps('expTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入活动标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//活动说明内容
		let expContentProps = getFieldProps('expContent', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 200 , message : '请输入内容, 不超过200字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//机构简介属性
		let orgIntroProps = getFieldProps('orgIntro', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//机构简介内容
		let orgContent1Props = getFieldProps('orgContent1', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 30 , message : '请输入内容, 不超过30字' },
					{ validator : this.checkActTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});
		let orgContent2Props = getFieldProps('orgContent2', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 30 , message : '请输入内容, 不超过30字' },
					{ validator : this.checkActTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});
		let orgContent3Props = getFieldProps('orgContent3', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 30 , message : '请输入内容, 不超过30字' },
					{ validator : this.checkActTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//课程简介属性
		let couTitleProps = getFieldProps('couTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//课程简介内容属性
		let couContentProps = getFieldProps('couContent', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 200 , message : '请输入内容, 不超过200字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//联系我们属性
		let conTitleProps = getFieldProps('conTitle', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 8 , message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		})

		//联系我们内容属性
		let conContentProps = getFieldProps('conContent', {
			validate : [{
				rules : [
					{ required : true , min : 1 , max : 200 , message : '请输入内容, 不超过200字' },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//备注属性
		let remarkProps = getFieldProps('remark', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 15, message : '请输入备注, 不超过15字' },
					{ validator : this.checkRemark }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//我要报名
		let applyTitleProps = getFieldProps('apply', {
			validate : [{
				rules : [
					{ required : true, min : 1, max : 8, message : '请输入标题, 不超过8字' },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//logo图片属性
		let shareImgProps = getFieldProps('headImgUrl', {
			validate : [{
				rules : [
					{ required : true, message : '请上传图片' }
				],
				trigger : ['onBlur' , 'onChange']
			}]
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

		//二维码图片
		let codeImgProps = getFieldProps('codeImgUrl', {
			validate : [{
				rules : [
					{required : true, message : '请上传图片'}
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let defaultCodeImgFileList = [];
		if(this.state.detailData && this.state.detailData.codeImgUrl){
			defaultCodeImgFileList.push({
				  uid    : -1,
				  name   : 'xxx.png',
				  status : 'done',
				  url    : this.state.detailData.codeImgUrl
	    	});
		}
		let uploadCodeImgProps = {
			name         : 'file',
			// action       : BASE_URL+'/uploadController/upload',
			action: '/thinknode/upload/image',
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
						<Input placeholder = "第一张图片URL" type= "hidden" { ...getFieldProps( 'orgImgUrl1' ) }/>
						<Input placeholder = "第二张图片URL" type= "hidden" { ...getFieldProps( 'orgImgUrl2' ) }/>
						<Input placeholder = "第三张图片URL" type= "hidden" { ...getFieldProps( 'orgImgUrl3' ) }/>
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
						label = "活动标题"
						help = '活动标题, 不超过30字' >
						<Input size = 'default' placeholder = '请输入活动标题' { ...actiTitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题一'
						help = '标题一, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...expTitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容一'
						help = '输入回车键/enter即可换行, 不超过200字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...expContentProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题二'
						help = '标题二, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...orgIntroProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容二'
						help = '不超过30字'
					>
						<Input size = 'default' placeholder = '请输入内容' { ...orgContent1Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayoutWithoutLabel }
						label = ''
						help = '不超过30字'
					>
						<Input size = 'default' placeholder = '请输入内容' { ...orgContent2Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayoutWithoutLabel }
						label = ''
						help = '不超过30字'
					>
						<Input size = 'default' placeholder = '请输入内容' { ...orgContent3Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "图片"
						help = '最多上传3张图片, 图片大小 ≤ 1M, 支持png,jpeg,gif格式'
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
						label = '标题三'
						help = '标题三, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...couTitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容三'
						help = '输入回车键/enter即可换行, 不超过200字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...couContentProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题四'
						help = '标题四, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...conTitleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容四'
						help = '输入回车键/enter即可换行, 不超过200字'
					>
						<Input size = 'default' type = "textarea" placeholder = '请输入内容' { ...conContentProps } />
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
						label = '备注'
						help = '备注, 不超过15字'
					>
						<Input size = 'default' placeholder = '请输入备注' { ...remarkProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题五'
						help = '标题五, 不超过8字'
					>
						<Input size = 'default' placeholder = '请输入标题' { ...applyTitleProps } />
					</FormItem>
					<FormItem wrapperCol={{ offset: 19 }}>
						<Button style = {{ marginLeft : '7px'}} size="default" type = "primary" onClick={ this.saveInstance } >保存</Button>
					</FormItem>
				</Form>
			</div>
		);
	},

}));

export default SummerCultivatePageDesignComponent;
