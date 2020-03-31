/**
 * 第二页 渲染组件
 *
 */
import React from 'react';
import { Button, Input, Icon, Modal, Form, Upload, message, Pagination, Popconfirm } from 'antd';
let PageChange = require( '../pageChange' );

let FormItem = Form.Item;

let EnglishTwoPage3DesignComponent = Form.create()(React.createClass({
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
		form.setFieldsValue({ "page2Title"    : detailData.title });
		form.setFieldsValue({ "correctAnswer" : detailData.correctAnswer });
		form.setFieldsValue({ "correctSort"   : detailData.correctSort });
		form.setFieldsValue({ "errorAnswer1"  : detailData.errorAnswer1 });
		form.setFieldsValue({ "errorAnswer2"  : detailData.errorAnswer2 });
		form.setFieldsValue({ "errorSort1"    : detailData.errorSort1 });
		form.setFieldsValue({ "errorSort2"    : detailData.errorSort2 });
		window.timer = setInterval(function(){
			me.onChildPreview();
		}, window.refreshTimes || 200 );

	},

	//答案排序
	sort( prop ){
		 return function( a, b ){
			let value1 = a[prop];
			let value2 = b[prop];
			return value1 - value2;
		}
	},

	//预览
	onChildPreview(){
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let seqNo = this.state.detailData.seqNo;
		let type = this.state.detailData.type;
		let sorts = [
			{ text : formData.correctAnswer, sort : formData.correctSort, state : '1' },
			{ text : formData.errorAnswer1 , sort : formData.errorSort1 , state : '0' },
			{ text : formData.errorAnswer2 , sort : formData.errorSort2 , state : '0' }
		];
		let answers = sorts.sort( this.sort( 'sort' ));

		let detailData = {
			type          : 'Page3Component',
			seqNo         : seqNo,
			title         : formData.page2Title,
			correctAnswer : formData.correctAnswer,
			correctSort   : formData.correctSort,
			errorAnswer1  : formData.errorAnswer1,
			errorAnswer2  : formData.errorAnswer2,
			errorSort1    : formData.errorSort1,
			errorSort2    : formData.errorSort2,
			answers       : answers
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

	//校验标题字数限制
	checkTitle( rule, value, callback ){
		if((/^[\s]{ 1, 30 }$/.test(value))){
			callback( "不能为空格" )
    	} else {
    		callback();
    	}
	},

	//答案字数限制
	checkAnswer( rule, value, callback ){
		if((/^[\s]{ 1, 15 }$/.test(value))){
			callback( "不能为空格" )
    	} else {
    		callback();
    	}
	},

	checkSort( rule, value, callback ){
		if( !( /^[1-3]$/.test( value ) ) ){
			callback( '只能填写1,2,3' )
		}else{
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
		};

		//标题属性
		let titleProps = getFieldProps('page2Title',{
			validate : [{
				rules : [
					{ required : true , message : '请输入标题', min : 1, max : 30 },
					{ validator : this.checkTitle }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//答案属性
		let correctAnswerProps = getFieldProps('correctAnswer',{
			validate : [{
				rules : [
					{ required : true, message : '请输入正确答案, 不超过15字', min : 1, max : 15 },
					{ validator : this.checkAnswer }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		let errorAnswer1Props = getFieldProps('errorAnswer1',{
			validate : [{
				rules : [
					{ required : true, message : '请输入错误答案, 不超过15字', min : 1, max : 15 },
					{ validator : this.checkAnswer }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		let errorAnswer2Props = getFieldProps('errorAnswer2',{
			validate : [{
				rules : [
					{ required : true, message : '请输入错误答案, 不超过15字', min : 1, max : 15 },
					{ validator : this.checkAnswer }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		//排序值属性
		let correctSortProps = getFieldProps('correctSort', {
			validate : [{
				rules : [
					{ required : true, message : '请输入排序值, 只能填写1,2,3' },
					{ validator : this.checkSort }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		let errorSort1Props = getFieldProps('errorSort1', {
			validate : [{
				rules : [
					{ required : true, message : '请输入排序值, 只能填写1,2,3' },
					{ validator : this.checkSort }
				],
				trigger : [ 'onBlur' , 'onChange' ]
			}]
		});

		let errorSort2Props = getFieldProps('errorSort2', {
			validate : [{
				rules : [
					{ required : true, message : '请输入排序值, 只能填写1,2,3' },
					{ validator : this.checkSort }
				],
				trigger : [ 'onBlur' , 'onChange' ]
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
						help = '标题, 不超过30字'
					>
						<Input size = 'default' placeholder = "请输入标题" { ...titleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '正确答案'
						help = '15字以内'
					>
						<Input size = 'default' placeholder = '请输入正确答案, 15字以内' { ...correctAnswerProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '排序值'
						help = '答案所处位置排序值, 只能填写1,2,3'
					>
						<Input size = 'default' style = {{ width : '120px' }} { ...correctSortProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '错误答案'
						help = '15字以内'
					>
						<Input size = 'default' placeholder = '请输入错误答案, 15字以内' { ...errorAnswer1Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '排序值'
						help = '答案所处位置排序值, 只能填写1,2,3'
					>
						<Input size = 'default' style = {{ width : '120px' }} { ...errorSort1Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '错误答案'
						help = '15字以内'
					>
						<Input size = 'default' placeholder = '请输入错误答案, 15字以内' { ...errorAnswer2Props } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = '排序值'
						help = '答案所处位置排序值, 只能填写1,2,3'
					>
						<Input size = 'default' style = {{ width : '120px' }} { ...errorSort2Props } />
					</FormItem>
					<FormItem wrapperCol={{ offset : 16 }}>
						<Popconfirm title = "确认删除当前页?" onConfirm = { this.onRemove } okText = "确认" cancelText = "取消">
							<Button style = {{ marginLeft : '14px' }} size = "default" disabled = { this.state.hasDelete }><Icon style = {{ marginTop : '-3px', verticalAlign : 'middle' }} type="delete" />删除当前页</Button>
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

export default EnglishTwoPage3DesignComponent;
