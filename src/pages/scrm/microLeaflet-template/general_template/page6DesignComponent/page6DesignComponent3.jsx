/**
 * 音乐模板第六页 渲染组件
 *
 */
import React from 'react';
import {Button,Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Pagination, Popconfirm } from 'antd';
let PageChange = require('../pageChange');

let FormItem = Form.Item;

let Page7DesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData  			: this.props.detailData,
			hasPrev      			: this.props.hasPrev,
			hasNext      			: this.props.hasNext,
			pageTotal    			: this.props.pageTotal,
			hasDelete   			: this.props.hasDelete,
			initFlg      			: false,

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
		form.setFieldsValue({"page6Title" : detailData.title});
		form.setFieldsValue({"page6SubTitle" : detailData.subTitle});
		window.timer = setInterval(function(){
			me.onChildPreview();
		}, window.refreshTimes || 200);
	},

	//预览
	onChildPreview(){
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let seqNo = this.state.detailData.seqNo;
		let detailData = {
			type : 'Page6Component',
			seqNo : seqNo,
			title : formData.page6Title,
			subTitle : formData.page6SubTitle,
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
			if( !!error ){
				return;
			}else{
				this.props.onNext( seqNo );
			}
		})
		this.onChildPreview();
	},

	//删除当前页
	onRemove(){
		let seqNo = this.state.detailData.seqNo;
		this.props.onRemove(seqNo);
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

	//校验标题字数限制
	checkTitle( rule, value, callback ){
		if((/^[\s]{ 1, 8 }$/.test(value))){
			callback( "不能为空格" )
    	} else {
    		callback();
    	}
	},
	checkTitle1( rule, value, callback ){
		if((/^[\s]{ 1, 20 }$/.test(value))){
			callback( "不能为空格" )
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
			wrapperCol : { span : 18 , offset : 4 }
		}

		//机构名称属性
		let titleProps = getFieldProps('page6Title',{
			validate : [{
				rules : [
					{ required : true , message : '请输入机构名称', min : 1, max : 8 },
					{ validator : this.checkTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let title1Props = getFieldProps('page6SubTitle',{
			validate : [{
				rules : [
					{ required : true , message : '请输入副标题', min : 1, max : 20 },
					{ validator : this.checkTitle1 }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem
						{ ...formItemLayout }
						label = "标题"
						help = '标题, 不超过8字'
					>
						<Input size = 'default' placeholder = "请输入机构名称" { ...titleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "副标题"
						help = '标题, 不超过20字'
					>
						<Input size = 'default' placeholder = "请输入副标题" { ...title1Props } />
					</FormItem>
					<FormItem wrapperCol={{ offset : 19 }}>
						<Button style = {{ marginLeft : '4px' }} size="default" type = "primary" onClick={ this.saveInstance } >保存</Button>
					</FormItem>
					<PageChange detailData = {detailData}
								hasPrev = { this.state.hasPrev }
								hasNext = { this.state.hasNext }
								onPrev = { this.onPrev }
								onNext = { this.onNext }
								pageTotal = {this.state.pageTotal} />
				</Form>
			</div>
		);
	},

}));

export default Page7DesignComponent;
