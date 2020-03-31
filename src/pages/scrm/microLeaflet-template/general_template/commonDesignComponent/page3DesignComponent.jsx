/**
 * uploadImageArrLength  : 上传图片的个数(默认为1)
 * type					 : 页码 例: Page3Component(必传)
 * titleLength			 : 限制的字数 默认为8
 */
import React from 'react';
import { Button, Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Pagination, Popconfirm } from 'antd';
let PageChange = require('../pageChange');

let FormItem = Form.Item;

let Page4DesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData : this.props.detailData,
			hasPrev    : this.props.hasPrev,
			hasNext    : this.props.hasNext,
			pageTotal  : this.props.pageTotal,
			hasDelete  : this.props.hasDelete,
			initFlg    : false,
			fileList   : null,
			type 	   : this.props.type,
			uploadImageArrLength	: this.props.uploadImageArrLength || 1,
			titleLength : this.props.titleLength || 8,
		}
	},
	componentWillReceiveProps( nextProps ) {
		let detailData = this.state.detailData;
		this.setState({
			detailData : nextProps.detailData,
			hasPrev    : nextProps.hasPrev,
			hasNext    : nextProps.hasNext,
			pageTotal  : nextProps.pageTotal,
			hasDelete  : nextProps.hasDelete,
			type 	   : nextProps.type,
			uploadImageArrLength	: nextProps.uploadImageArrLength,
			titleLength : nextProps.titleLength,
		})
		if ( ( nextProps.formVisible && this.props.formVisible !== nextProps.formVisible ) || !this.state.initFlg ){

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
		form.setFieldsValue({ "title" : detailData.title });
		detailData.img_intro.map(function(value,index){
			let shareImage = `shareImage${index+1}`;
			form.setFieldsValue({ [shareImage] : detailData.img_intro[index].imgurl });
		});

		window.timer = setInterval(function(){
			me.onChildPreview();
		}, 200 );
	},
	//预览
	onChildPreview(){
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let seqNo = this.state.detailData.seqNo;

		let imageArr = [];

		for(let i = 0; i < this.state.uploadImageArrLength; i++) {
			let shareImage = `shareImage${i+1}`;
			imageArr.push({imgurl : formData[shareImage]});
		}

		let detailData = {
			type : this.state.type,
			seqNo : seqNo,
			title  : formData.title,
			img_intro : imageArr,
		};
		this.props.onChildPreview(detailData, seqNo);
	},
	//上传图片的操作
	imgHandleChange(info){
		let fileList = info.fileList;
		if( !!fileList && fileList.length > this.state.uploadImageArrLength ){
			message.error(`只能上传${this.state.uploadImageArrLength || ''}张图片`);
			return false;
		}
		let form = this.state.form;
		this.setState({ fileList });

		for(let i = 0; i < this.state.uploadImageArrLength; i++) {
			let shareImage = `shareImage${i+1}`;
			form.setFieldsValue({[shareImage] : ""});
		}

		if( info.fileList.length > 0 ){
			fileList.map(function( value, index ){
				let shareImage = `shareImage${ index + 1 }`;
				let fileUrl = (value.response ? value.response.data.url : value.url );
				form.setFieldsValue({ [shareImage] : fileUrl || "" })
			})
			if(info.file.status === "done"){
				message.success(`${info.file.name}上传成功`);
			}else if (info.file.status === "error"){
				message.error(`${info.file.name}上传失败`);
			}
		}
		this.setState({ fileList })
	},
	imgBeforeUpload(file){
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
	//校验主标题字数限制
	checkHeadTitle( rule, value, callback ){

		let maxLength = this.state.titleLength;

		if((/^[\s]{1, maxLength}$/.test(value))){
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
			wrapperCol  :{ span : 18 }
		};

		//主标题属性
		let titleProps = getFieldProps('title',{
			validate : [{
				rules : [
					{ required : true , message : '请输入标题', min : 1, max : this.state.titleLength },
					{ validator : this.checkHeadTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let defaultFileList = [];
		if(this.state.detailData && this.state.detailData.img_intro){
			let me = this;
			detailData.img_intro.map(function(value,index){
				if (value.imgurl){
					defaultFileList.push({
						uid: -(index),
						name: 'xxx.png',
						status: 'done',
						url: me.state.detailData.img_intro[index].imgurl
			    	});
				}
			})

		};
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

		let uploadString = `最多上传${this.state.uploadImageArrLength}张图, 图片大小 ≤ 1M, 支持png,jpeg,gif格式`;

		let titleString = `标题, 不能超过${this.state.titleLength}个字`;
		let placeholderTitleString = `请输入标题, 不能超过${this.state.titleLength}个字`;

		let imageInputCount = [];

		for(let i = 0; i < this.state.uploadImageArrLength; i++) {
			imageInputCount.push(i);
		}

		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem>
						{
							imageInputCount&&imageInputCount.map((item, index) => {
								let shareImage = `shareImage${index+1}`;
								return <Input key={index} type= "hidden" {...getFieldProps(shareImage)}/>
							})
						}
					</FormItem>
					<FormItem {...formItemLayout} label = "标题" help = {titleString} >
						<Input size = 'default' placeholder={placeholderTitleString} { ...titleProps } />
					</FormItem>
					<FormItem {...formItemLayout}
							  label="图片"
							  help={uploadString}>
						<Upload {...uploadImgProps}>
							<Icon type="plus"/>
							<Modal visible = { this.state.imagePriviewVisible } footer = { null } onCancel = { this.cancelImagePreview } >
								<img src = { this.state.imagePriview } style = {{ width : 450, height : 400 }}/>
							</Modal>
						</Upload>
					</FormItem>
					<FormItem wrapperCol={{offset: 16}}>
						<Popconfirm title = "确认删除当前页?" onConfirm = { this.onRemove } okText = "确认" cancelText = "取消">
							<Button style = {{ marginLeft : '21px' }} size = "default" disabled = { this.state.hasDelete }><Icon style = {{ marginTop : '-3px', verticalAlign : 'middle' }} type="delete" />删除当前页</Button>
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

export default Page4DesignComponent;
