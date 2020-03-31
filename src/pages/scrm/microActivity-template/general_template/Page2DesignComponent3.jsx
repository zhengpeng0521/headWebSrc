/**
 * 公用模板 渲染组件
 *
 */
import React from 'react';
import { Button, Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Popconfirm } from 'antd';
let PageChange = require('./pageChange');

let FormItem = Form.Item;
let Page2DesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData : this.props.detailData,
			hasPrev    : this.props.hasPrev,
			hasNext    : this.props.hasNext,
			pageTotal  : this.props.pageTotal,
			hasDelete  : this.props.hasDelete,
			initFlg    : false,
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
		form.setFieldsValue({ "page2Title"    : detailData.title });
		form.setFieldsValue({ "page2Content"  : detailData.content });
		form.setFieldsValue({ 'page2Title2'   : detailData.title2 });
		form.setFieldsValue({ 'page2Content2' : detailData.content2 });
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
			type : 'Page2Component',
			seqNo : seqNo ,
			title : formData.page2Title,
			title2 : formData.page2Title2,
			content : formData.page2Content,
			content2 : formData.page2Content2,
		};
		this.props.onChildPreview( detailData, seqNo );
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

  	//校验标题字数限制
	checkTitle( rule, value, callback ){
		if((/^[\s]{1,8}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
	},

	//校验内容字数限制
	checkContent( rule, value, callback ){
		if((/^[\s]{1, 100}$/.test(value))){
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
		let formItemLayoutWithOutLabel = {
			wrapperCol : {span : 18, offset : 4 }
		}

		//活动标题属性
		let titleProps = getFieldProps('page2Title',{
			validate : [{
				rules : [
					{ required : true , message : '请输入标题', min : 1, max : 8 },
					{ validator : this.checkTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//标题二属性
		let titlePropsTwo = getFieldProps('page2Title2', {
			validate : [{
				rules : [
					{ required : true, message : '请输入标题',  min : 1, max : 8 },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur', 'onChange' ]
			}]
		});

		//内容一属性
		let contentProps = getFieldProps( 'page2Content', {
			validate : [{
				rules : [
					{ required : true, message : '请输入内容', min : 1, max : 100 },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur', 'onChange' ]
			}]
		});

		//内容二属性
		let contentPropsTwo = getFieldProps( 'page2Content2', {
			validate : [{
				rules : [
					{ required : true, message : '请输入内容', min : 1, max : 100 },
					{ validator : this.checkContent }
				],
				trigger : [ 'onBlur', 'onChange' ]
			}]
		});

		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem {...formItemLayout} label="标题一" help = '标题, 不能超过8字' >
						<Input size = 'default' placeholder = "请输入标题" { ...titleProps }/>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容一'
						help = '输入回车键/enter即可换行, 不超过100字'
					>
						<Input type = 'textarea' placeholder = '请输入内容' { ...contentProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '标题二'
						help = '标题, 不超过8字'
					>
						<Input size = 'default' placeholder = "请输入标题" { ...titlePropsTwo }/>
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '内容一'
						help = '输入回车键/enter即可换行, 不超过100字'
					>
						<Input type = 'textarea' placeholder = '请输入内容' { ...contentPropsTwo } />
					</FormItem>
			        <FormItem wrapperCol={{ offset : 16 }}>
						<Popconfirm title = "确认删除当前页?" onConfirm = { this.onRemove } okText = "确认" cancelText = "取消">
							<Button style = {{ marginLeft : '16px' }} size = "default" disabled = { this.state.hasDelete }><Icon style = {{ marginTop : '-3px', verticalAlign : 'middle' }} type="delete" />删除当前页</Button>
						</Popconfirm>
					</FormItem>
					<PageChange detailData = {detailData}
								hasPrev = { this.state.hasPrev }
								hasNext = {this.state.hasNext}
								onPrev = { this.onPrev }
								onNext = { this.onNext }
								pageTotal = { this.state.pageTotal }/>
				</Form>
			</div>
		);
	},

}));

export default Page2DesignComponent;
