/**
 * 圣诞模板的首页 渲染组件
 *
 */
import React from 'react';
import { Button, Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Pagination, Popconfirm } from 'antd';
let PageChange = require('./pageChange');

let FormItem = Form.Item;

let Page5DesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData : this.props.detailData,
			hasPrev    : this.props.hasPrev,
			hasNext    : this.props.hasNext,
			pageTotal  : this.props.pageTotal,
			hasDelete  : this.props.hasDelete,
			initFlg    : false,
			fileList   : null,
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
		form.setFieldsValue({ "page5Title" : detailData.title });
		detailData.img_intro.map(function(value,index){
			let shareImage = `shareImage${index+1}`;
			form.setFieldsValue({ [shareImage] : detailData.img_intro[index].imgurl });
		});

		window.timer = setInterval(function(){
			me.onChildPreview();
		},window.refreshTimes || 200);
	},
	//预览
	onChildPreview(){
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let seqNo = this.state.detailData.seqNo;
		let detailData = {
			type : 'Page5Component',
			seqNo : seqNo,
			title  : formData.page5Title,
			img_intro : [
				{ imgurl : formData.shareImage1 },
				{ imgurl : formData.shareImage2 },
			]
		};
		this.props.onChildPreview(detailData , seqNo);
	},
	//上传图片的操作
	imgHandleChange(info){
		let fileList = info.fileList;
		if( !!fileList && fileList.length > 2){
			message.error('只能上传两张图片');
			return false;
		}
		let form = this.props.form;
		this.setState({ fileList });
		form.setFieldsValue({ "shareImage1" : "" });
		form.setFieldsValue({ "shareImage2" : "" });
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
		if( !!value && value.length > 8 ){
    		callback('不能超过8个字符');
    	}else if((/^[\s]{1,8}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
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
			wrapperCol  :{ span : 18 }
		};

		//主标题属性
		let titleProps = getFieldProps('page5Title',{
			validate : [{
				rules : [
					{ required : true , message : '请输入标题'},
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
			action : BASE_URL+'/uploadController/upload',
			listType : 'picture-card',
			fileList : this.state.fileList ? this.state.fileList : defaultFileList,
			//文件状态改变时的回调
			onChange : this.imgHandleChange,
			beforeUpload : this.imgBeforeUpload,
	    	onPreview : this.imgHandleOnPreview,
		};
		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem>
						<Input placeholder="第一张图片URL" type= "hidden" {...getFieldProps('shareImage1')}/>
						<Input placeholder="第二张图片URL" type= "hidden" {...getFieldProps('shareImage2')}/>
					</FormItem>
					<FormItem {...formItemLayout} label = "标题" help = '标题, 不能超过8字' >
						<Input size = 'default' placeholder="请输入主标题" { ...titleProps } />
					</FormItem>
					<FormItem {...formItemLayout}
							  label="图片"
							  help="最多上传2张图, 图片大小 ≤ 1M, 支持png,jpeg,gif格式">
						<Upload {...uploadImgProps}>
							<Icon type="plus"/>
							<Modal visible={this.state.imagePriviewVisible} footer={null} onCancel={this.cancelImagePreview}>
								<img alt="example" src={this.state.imagePriview} style={{width : 450, height:400}}/>
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

export default Page5DesignComponent;
