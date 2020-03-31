/**
 * 圣诞模板的首页 渲染组件
 *
 */
import React from 'react';
import {Button,Row, Col,Input,Select,Icon,Modal ,Form ,Upload,message,Checkbox,Pagination, Popconfirm } from 'antd';
let PageChange = require('../pageChange');

let FormItem = Form.Item;

let Page1DesignComponent = Form.create()(React.createClass({
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
			codeImagePreview    	: '',
			codeImagePreviewVisible : false,
			fileList                : null,
			codeFileList       		: null,

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
		let form = this.props.form;
		let me = this;
		form.setFieldsValue({"page1Title" : detailData.title});
		form.setFieldsValue({"page1SubTitle" : detailData.sub_title});
		form.setFieldsValue({"page1TitleImage" : detailData.head_imgUrl});
		form.setFieldsValue({"page1CodeImage" : detailData.code_imgUrl});
		form.setFieldsValue({"keys" : detailData.contact});
		detailData.contact.map(function(value,index){
			let configItemTitle = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			form.setFieldsValue({ [configItemTitle]: detailData.contact[index].label });
			form.setFieldsValue({ [configItemDetail]: detailData.contact[index].value });
		});

		window.timer = setInterval(function(){
			me.onChildPreview();
		},window.refreshTimes || 200);
	},
	//预览
	onChildPreview(){
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let keys = form.getFieldValue('keys');
		let seqNo = this.state.detailData.seqNo;
		let detailData = {
			type : 'Page1Component',
			seqNo : seqNo,
			title : formData.page1Title,
			sub_title : formData.page1SubTitle,
			head_imgUrl : formData.page1TitleImage,
			code_imgUrl : formData.page1CodeImage,
			contact : keys.map((value,index) =>{
				return { label : formData[`configItemTitle-${index}`] , value : formData[`configItemDetail-${index}`]}
			})
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

	//上传图片的操作
	imgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({'page1TitleImage' : fileUrl})
				message.success(`${info.file.name}上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`);
			}
		} else if (info.fileList.length <=0){
			this.props.form.setFieldsValue({'page1TitleImage' : ''});
		}
		this.setState({fileList});
	},
	imgBeforeUpload(file){
		let imgUrlList = this.props.form.getFieldValue('page1TitleImage');
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

	//上传二维码图片操作
	codeImgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({'page1CodeImage' : fileUrl})
				message.success(`${info.file.name}上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`);
			}
		} else if (info.fileList.length <=0){
			this.props.form.setFieldsValue({'page1CodeImage' : ''});
		}
		this.setState({
			codeFileList : fileList
		});
	},
	codeImgBeforeUpload(file){
		let imgUrlList = this.props.form.getFieldValue('page1CodeImage');
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
	//校验副标题字数限制
	checkSubTitle( rule, value, callback ){
		if(!(/^[^\n]{1,25}$/.test(value))){
    		callback('不能超过25个字符');
    	}else if((/^[\s]{1,25}$/.test(value))){
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
	checkConfigItemDetail( rule, value, callback ){
		callback();
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
	render () {
		let { designData, recordData } = this.props;
		let { detailData } = this.state;

		let self = this;
		let {getFieldValue, getFieldProps, getFieldError, isFieldValidating} = this.props.form;

		//表单元素布局属性
		let formItemLayout = {
			labelCol : { span : 4 },
			wrapperCol : { span : 18 }
		};
		let formItemLayoutWithOutLabel = {
			wrapperCol : {span : 18 , offset : 4 }
		}

        getFieldProps('keys',{
			initialValue : this.state.detailData.contact,
		});

		//标题属性
		let titleProps = getFieldProps('page1Title',{
			initialValue : "闪闪圣诞招生活动",
			validate : [{
				rules : [
					{ required : true , message : '请输入标题'},
					{ validator : this.checkTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});
		let subTitleProps = getFieldProps('page1SubTitle',{
			validate : [{
				rules : [
					{ required : true , message : '请输入副标题'},
					{ validator : this.checkSubTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//图片属性
		let shareImgProps = getFieldProps('page1TitleImage',{
			validate : [{
				rules : [
					{required : true, message : '请上传图片'}
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let defaultFileList = [];
		if(this.state.detailData && this.state.detailData.head_imgUrl){
			defaultFileList.push({
				  uid: -1,
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

		//二维码图片
		let codeImgProps = getFieldProps('page1CodeImage',{
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

		//可配置项
		let keys = getFieldValue('keys');
		let formItems = keys.map((value,index) =>{
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
		            	<Input placeholder="标题 , 不能为空" {...configTitleProps} style={{width:'28%'}} />
		            	<Input placeholder="详情 , 不能为空" {...configDetailProps} style={{ marginLeft:'8px', width:'60%'}} />
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
					<FormItem {...formItemLayout}
							  label="logo"
							  help="请上传logo图片">
						<Upload {...shareImgProps} {...uploadImgProps}>
							<Icon type="plus"/>
							<Modal visible={this.state.imagePriviewVisible} footer={null} onCancel={this.cancelImagePreview}>
								<img alt="example" src={this.state.imagePriview} style={{width : 300,height:400}}/>
							</Modal>
						</Upload>
					</FormItem>
					<FormItem {...formItemLayout} label = "主标题" help = '主标题, 不超过8字' >
						<Input size = 'default' placeholder = "请输入主标题" { ...titleProps } />
					</FormItem>
					<FormItem {...formItemLayout} label = "副标题" help = '副标题, 不超过25字' >
						<Input size = 'default' placeholder = "请输入副标题"  { ...subTitleProps }/>
					</FormItem>
					<FormItem {...formItemLayout}
							  label = "二维码"
							  help = "只能上传1张图, 图片大小 ≤ 1M, 支持png,jpeg,gif格式" >
						<Upload {...codeImgProps} {...uploadCodeImgProps}>
							<Icon type="plus"/>
							<Modal visible = { this.state.codeImagePreviewVisible } footer = { null } onCancel = { this.codeCancelImagePreview }>
								<img alt = "example" src = { this.state.codeImagePreview } style = {{ width : 450 , height:400 }}/>
							</Modal>
						</Upload>
					</FormItem>
					{formItems}
			        <FormItem {...formItemLayout}>
			          <Button size = 'default' type="dashed" onClick={ this.addConfigItem } style={{ width: '100%' , marginLeft: '85px' }} disabled = { keys.length >= 3 }>
			            <Icon type="plus" /> 新增
			          </Button>
			        </FormItem>
					<FormItem wrapperCol={{ offset : 16 }}>
						<Popconfirm title = "确认删除当前页?" onConfirm = { this.onRemove } okText = "确认" cancelText = "取消">
							<Button style = {{ marginLeft : '13px' }} size = "default" disabled = { this.state.hasDelete }><Icon style = {{ marginTop : '-3px', verticalAlign : 'middle' }} type="delete" />删除当前页</Button>
						</Popconfirm>
					</FormItem>
					<PageChange detailData = {detailData}
								hasPrev = { this.state.hasPrev }
								hasNext = {this.state.hasNext}
								onPrev = { this.onPrev }
								onNext = { this.onNext }
								pageTotal = {this.state.pageTotal} />
				</Form>
			</div>
		);
	},

}));

export default Page1DesignComponent;
