/**
 * 分享页面 渲染组件
 *
 */
import React from 'react';
import {Button,Row, Col,Input,Select,Icon,Modal ,Form ,Upload,message,Checkbox, Popconfirm, tabs } from 'antd';

let FormItem = Form.Item;

let MainDesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData          : this.props.detailData || "",
			mainData            : this.props.mainData || "",
			imagePriview        : '',                                        //预览上传图片url
			imagePriviewVisible : false,                                   //是否预览图片
			fileList            : null,
			musicFileList       : null,
			initFlg             : false,
		}
	},
	componentWillReceiveProps(nextProps) {
		let mainData = this.state.mainData;
		let me = this;
		this.setState({
			detailData : nextProps.detailData,
			mainData   : nextProps.mainData,
		});

		if ( (nextProps.formVisible && this.props.formVisible !== nextProps.formVisible) || !this.state.initFlg ){
			if( nextProps.activityId ){
				serviceRequest( BASE_URL+"/microActivity/getActivity", { id : nextProps.activityId }, function(res) {
					let mainData = res.data.activityData.mainData;
					mainData = JSON.parse(mainData);
					clearInterval(window.timer);
					me.initFormData( mainData );
				});
			}else{
				this.initFormData( mainData );
			}
			this.setState({
				initFlg             : true,
				fileList            : null,
				musicFileList       : null,
			});
		}
	},

	//初始化表单值
	initFormData( mainData ){
		let form = this.props.form;
		let me = this;
		form.setFieldsValue({"activityName"        : mainData.name});
		form.setFieldsValue({"backgroundMusic"     : mainData.bg_music});
		form.setFieldsValue({"backgroundMusicName" : mainData.bg_name});       //背景音乐名
		form.setFieldsValue({"shareTitle"          : mainData.share_config.title});
		form.setFieldsValue({"shareImage"          : mainData.share_config.imgurl});
		form.setFieldsValue({"shareContent"        : mainData.share_config.intro});

		window.timer = setInterval(function(){
			me.onPreview();
		},window.refreshTimes || 200);
	},

	//校验微活动/分享标题名称
	checkActivityName(rule, value, callback){
		if(!(/^[^\n]{1,10}$/.test(value))){
    		callback('字数不能多于10个');
    	}else if((/^[\s]{1,10}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//校验分享内容
	checkShareContent(rule, value, callback){
		if(!(/^[^\n]{1,50}$/.test(value))){
    		callback('字数不能多于50个');
    	}else if((/^[\s]{1,50}$/.test(value))){
			callback("不能全为空格")
    	} else {
    		callback();
    	}
	},

	//上传图片的操作
	imgHandleChange(info){
		let fileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				this.props.form.setFieldsValue({'shareImage' : fileUrl})
				message.success(`${info.file.name}上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`);
			}
		} else if (info.fileList.length <=0){
			this.props.form.setFieldsValue({'shareImage' : ''});
		}
		this.setState({fileList});
	},
	imgBeforeUpload(file){
		let imgUrlList = this.props.form.getFieldValue('shareImage');
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

	//上传背景音乐属性
	musicHandleChange(info){
		let musicFileList = info.fileList;
		if(info.fileList.length > 0){
			if(info.file.status === "done"){
				let fileUrl = info.file.response.data.url;
				let musicName = info.file.name;
				this.props.form.setFieldsValue({ 'backgroundMusic'     : fileUrl});
				this.props.form.setFieldsValue({ 'backgroundMusicName' : musicName })
				message.success(`${info.file.name}上传成功`)
			} else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`)
			}
		}else if (info.fileList.length <=0 ){
			this.props.form.setFieldsValue({'backgroundMusic' : ''})
		}
		this.setState({ musicFileList });
	},
	musicBeforeUpload(file){
		let musicUrlList = this.props.form.getFieldValue('backgroundMusic');
		if(musicUrlList && musicUrlList.length > 0){
			message.error('只能上传一段音频');
			return false;
		}
		if(file.size > 5242880){
			message.error('音乐不能大于5M');
			return false;
		}
		return true;
	},

	//点击继续按钮
	onContinue(){
		clearInterval(window.timer)
		let form = this.props.form;
		form.validateFieldsAndScroll((error,value)=>{
			if(!!error){
				return;
			}else{
				this.props.onContinue();
			}
		})
		this.onPreview();
	},
	//预览
	onPreview(){
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let mainData = {
			name : formData.activityName,
			bg_music : formData.backgroundMusic,
			bg_name  : formData.backgroundMusicName,
			share_config : {
				title : formData.shareTitle,
				imgurl: formData.shareImage,
				intro : formData.shareContent,
			}
		};
		this.props.onPreview(mainData);
	},
	render () {
		let test = this.props.form.getFieldsValue();

		let { detailData , mainData } = this.state;

		let self = this;

		let { getFieldValue, getFieldProps, getFieldError, isFieldValidating } = this.props.form;

		//表单元素布局属性
		let formItemLayout = {
			labelCol : { span : 4 },
			wrapperCol : { span : 18 }
		};
		//校区属性
		let areaProps = getFieldProps('area',{
			initialValue : this.props.currentSelectCampus,
			validate : [{
				rules : [
					{ required : true , message : '请输入校区'},
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});
		//微活动名称属性
		let activityNameProps = getFieldProps('activityName',{
			validate: [{
		        rules: [
		          { required: true , message : '输入微传单名称' },
		          { validator : this.checkActivityName }
		        ],
		        trigger: ['onBlur', 'onChange'],
		    }]
		});

		//背景音乐属性
		let musicDefaultFileList = [];
		if( this.state.mainData ){
			musicDefaultFileList.push({
				  uid: -2,
				  name: this.state.mainData.bg_name,
				  status: 'done',
				  url: this.state.mainData.bg_music
	    	});
		};

		let backgroundMusicProps = {
			name : 'file',
			// action : BASE_URL+'/fileUpload/mp3',
			action: '/thinknode/upload/file',
			accept: "audio/*",
			fileList : this.state.musicFileList ? this.state.musicFileList : musicDefaultFileList,
			onChange : this.musicHandleChange,
			beforeUpload : this.musicBeforeUpload,
		};

		//分享标题属性
		let shareTitleProps = getFieldProps('shareTitle',{
			validate :[{
				rules : [
					{required : true, message : '请输入分享标题'},
					{validator : this.checkActivityName}
				],
				trigger : ['onBlur','onChange']
			}]
		});

		//分享图片属性
		let shareImgProps = getFieldProps('shareImage',{
			validate : [{
				rules : [
					{required : true, message : '请上传图片'}
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let defaultFileList = [];
		if(this.state.mainData && this.state.mainData.share_config){
			defaultFileList.push({
				  uid: -1,
				  name: 'xxx.png',
				  status: 'done',
				  url: this.state.mainData.share_config.imgurl
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

		//分享内容属性
		let shareContentProps = getFieldProps('shareContent',{
			validate : [{
				rules : [
					{ required : true , message : '请输入分享内容'},
					{ validator : this.checkShareContent}
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});
		return (
			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>基础设置</span>
					</div>
					<FormItem>
						<Input type="hidden" {...getFieldProps('backgroundMusicName')} />
					</FormItem>
					<FormItem {...formItemLayout} label = "校区" >
						<Input size = 'default' placeholder = "请输入校区" disabled {...areaProps}/>
					</FormItem>
					<FormItem {...formItemLayout} label = "名称" help = '微传单名称, 不超过10字' >
						<Input size = 'default' placeholder = "输入微传单的名称,字数不多于10个" {...activityNameProps}/>
					</FormItem>
					<FormItem {...formItemLayout} label = "背景音乐">
						<Upload {...getFieldProps('backgroundMusic')} {...backgroundMusicProps} >
							<Button type="ghost">
	      						<Icon type="upload" />点击上传
	    					</Button>
						</Upload>
					</FormItem>
					<div className="share-setting base-setting">
						<span>分享设置</span>
					</div>

					<FormItem {...formItemLayout} label = "分享标题" help = '分享标题, 不超过10字' >
						<Input size = 'default' placeholder = "请输入分享标题, 不超过10字" {...shareTitleProps} />
					</FormItem>
					<FormItem {...formItemLayout}
							  label="分享图片"
							  help = "只能上传1张图, 图片大小 ≤ 1M, 支持png,jpeg,gif格式"
					>
						<Upload {...shareImgProps} {...uploadImgProps}>
							<Icon type="plus"/>
							<Modal visible={this.state.imagePriviewVisible} footer={null} onCancel={this.cancelImagePreview}>
								<img alt="example" src={ this.state.imagePriview } style={{width : 450, height : 400}}/>
							</Modal>
						</Upload>
					</FormItem>
					<FormItem { ...formItemLayout } label = "分享简介" help = '分享简介, 不超过50字' >
						<Input size = 'default' type = "textarea" placeholder = "请输入分享后的内容介绍，不超过50字" { ...shareContentProps } />
					</FormItem>

					<FormItem wrapperCol = {{ offset : 18 }} >
						<Button size = 'default' type = "primary" style={{ marginLeft : '1px' }} onClick = {this.onContinue}>继续<Icon style = {{ marginTop : '-3px', verticalAlign : 'middle' }} type="arrow-right" /></Button>
					</FormItem>
				</Form>
			</div>
		);
	},
}));

export default MainDesignComponent;
