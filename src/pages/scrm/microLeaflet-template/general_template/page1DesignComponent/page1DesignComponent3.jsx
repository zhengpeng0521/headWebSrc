/**
 * 音乐模板渲染首页
 *
 */
import React from 'react';
import { Button,Row, Col, Input, Select, Icon, Modal, Form, Upload, message, Checkbox, Pagination, Popconfirm } from 'antd';
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
			fileList                : null,
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
		form.setFieldsValue({ "page1Title"       : detailData.title });
		form.setFieldsValue({ "page1SubTitle"    : detailData.sub_title });
		form.setFieldsValue({ "keys"             : detailData.content });
		detailData.content.map(function( value, index ){
			let configItemDetail = `configItemDetail-${index}`;
			form.setFieldsValue({ [configItemDetail]: detailData.content[index] });
		});
		window.timer = setInterval(function(){
			me.onChildPreview();
		}, window.refreshTimes || 200 );
	},

	//删除配置项
  	deleteConfigItem( index ){
  		let { form } = this.props;
  		let me = this;
	    let keys = form.getFieldValue('keys');
	    if( keys.length === 1 ) {
	    	return;
	    }
	    form.setFieldsValue({
			keys : keys.filter(function( value, key, arr ){
				return key !== index
			})
	    });
	    let detailData = form.getFieldValue('keys');
	    detailData.map( function( value, index ){
			let configItemDetail = `configItemDetail-${index}`;
			me.props.form.setFieldsValue({ [configItemDetail]: detailData[index] });
		})
  	},
  	addConfigItem(){
  		let addItem = '';
	    const { form } = this.props;
	    const keys = form.getFieldValue( 'keys' );
	    const nextKeys = keys.concat( addItem );
	    form.setFieldsValue({
			keys : nextKeys,
	    });
  	},

	//预览
	onChildPreview(){
		let form = this.props.form;
		let formData = form.getFieldsValue();
		let seqNo = this.state.detailData.seqNo;
		let keys = form.getFieldValue('keys');
		let detailData = {
			type  : 'Page1Component',
			seqNo : seqNo,
			title : formData.page1Title,
			sub_title : formData.page1SubTitle,
			content : keys.map(( value, index ) => {
				return formData[`configItemDetail-${index}`];
			}),
		};
		this.props.onChildPreview( detailData, seqNo);
	},

	//上一页
	onPrev(seqNo){
		let form = this.props.form;
		form.validateFieldsAndScroll(( error, value ) => {
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
		if((/^[\s]{ 1, 20 }$/.test(value))){
			callback( "不能为空格" )
    	} else {
    		callback();
    	}
	},

	//检验配置项详情
	checkConfigItemDetail( rule, value, callback ){
		callback();
		this.importValueToKeys();
	},

	importValueToKeys (){
		let length = this.props.form.getFieldValue('keys').length;
		let keys = [];
		for ( let index = 0 ; index < length ; index ++ ){
			let configItemDetail = `configItemDetail-${index}`;
			let addItem = this.props.form.getFieldValue(configItemDetail);
			keys = keys.concat(addItem);
			this.props.form.setFieldsValue({ 'keys' : keys });
		}
	},

	render () {
		let { designData, recordData } = this.props;
		let { detailData } = this.state;

		let self = this;
		let { getFieldValue, getFieldProps, getFieldError, isFieldValidating } = this.props.form;

		getFieldProps('keys', {
			initialValue : this.state.detailData.content
		});

		//表单元素布局属性
		let formItemLayout = {
			labelCol : { span : 4 },
			wrapperCol : { span : 18 }
		};
		let formItemLayoutWithOutLabel = {
			wrapperCol : { span : 18 , offset : 4 }
		}

		//机构名称属性
		let titleProps = getFieldProps('page1Title',{
			validate : [{
				rules : [
					{ required : true , message : '请输入机构名称', min : 1, max : 20 },
					{ validator : this.checkTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		//标题属性
		let subTitleProps = getFieldProps('page1SubTitle',{
			validate : [{
				rules : [
					{ required : true , message : '请输入副标题', min : 1, max : 20 },
					{ validator : this.checkTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

		let defaultFileList = [];
		if(this.state.detailData && this.state.detailData.head_imgUrl){
			defaultFileList.push({
				  uid : -1,
				  name : 'xxx.png',
				  status : 'done',
				  url : this.state.detailData.head_imgUrl
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

		//可配置项
		let keys = getFieldValue('keys');
		let formItems = keys.map(( value, index ) => {

			let configDetailProps = getFieldProps(`configItemDetail-${ index }`,{
				validate : [{
					rules : [
						{ required : true, message : '配置项(1 ~ 20字)', min : 1, max : 20 },
						{ validator : this.checkConfigItemDetail }
					],
					trigger : ['onBlur', 'onChange']
				}]
			});
			return (
				<FormItem
			          { ...( index === 0 ? formItemLayout : formItemLayoutWithOutLabel ) }
			          label = { index === 0 ? '配置项' : '' }
			          required = { true }
			          key = { index }
			        >
		            	<Input size = 'default' placeholder = "配置项(1 ~ 20字)" { ...configDetailProps } style = {{ marginLeft : '8px', width : '88%' }} />
		          <Icon
		            className = "delete-button"
		            type = "minus-circle-o"
		            disabled = { keys.length === 1 }
		            onClick = { this.deleteConfigItem.bind( this, index ) }/>
		        </FormItem>
			)
		});

		return (

			<div className="templet-instance-form-content">
				<Form horizontal style={{width:'100%'}}>
					<div className="base-setting">
						<span>页面设置</span>
					</div>
					<FormItem
						{ ...formItemLayout }
						label = "机构名称"
						help = '机构名称, 不超过20字'
					>
						<Input size = 'default' placeholder = "请输入机构名称" { ...titleProps } />
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "标题"
						help = '标题, 不超过20字'
					>
						<Input size = 'default' placeholder = "请输入副标题"  { ...subTitleProps }/>
					</FormItem>
					{formItems}
			        <FormItem {...formItemLayout}>
						<Button size = 'default' type = "dashed" onClick={ this.addConfigItem } style={{ width: '100%' , marginLeft: '85px' }} disabled = { keys.length >= 3 }>
			            	<Icon type="plus" /> 新增
			          	</Button>
			        </FormItem>
					<FormItem
						wrapperCol={{ offset : 16 }}
					>
						<Popconfirm title = "确认删除当前页?" onConfirm = { this.onRemove } okText = "确认" cancelText = "取消">
							<Button style = {{ marginLeft : '13px' }} size = "default" disabled = { this.state.hasDelete }>
								<Icon style = {{ marginTop : '-3px', verticalAlign : 'middle' }} type="delete" />删除当前页
							</Button>
						</Popconfirm>
					</FormItem>
					<PageChange detailData = {detailData}
								hasPrev = { this.state.hasPrev }
								hasNext = {this.state.hasNext}
								onPrev = { this.onPrev }
								onNext = { this.onNext }
								pageTotal = { this.state.pageTotal } />
				</Form>
			</div>
		);
	},

}));

export default Page1DesignComponent;
