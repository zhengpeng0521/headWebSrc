/**
 * 公用模板的首页 渲染组件
 *
 */
import React from 'react';
import {Button,Row, Col,Input,Select,Icon,Modal ,Form ,Upload,message,Checkbox, Popconfirm} from 'antd';
let PageChange = require('./pageChange');

let FormItem = Form.Item;
let Page2DesignComponent = Form.create()(React.createClass({
	getInitialState() {
		return {
			detailData : this.props.detailData,
			hasPrev : this.props.hasPrev,
			hasNext : this.props.hasNext,
			pageTotal : this.props.pageTotal,
			hasDelete : this.props.hasDelete,
			initFlg : false,
		}
	},

  	componentWillReceiveProps(nextProps) {
  		let detailData = this.state.detailData;
		this.setState({
			detailData : nextProps.detailData,
			hasPrev : nextProps.hasPrev,
			hasNext : nextProps.hasNext,
			pageTotal : nextProps.pageTotal,
			hasDelete : nextProps.hasDelete
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
		form.setFieldsValue({"page2Title" : detailData.title});
		form.setFieldsValue({"keys" : detailData.intro});
		detailData.intro.map(function(value,index){
			let configItemTitle = `configItemTitle-${index}`;
			let configItemDetail = `configItemDetail-${index}`;
			form.setFieldsValue({ [configItemTitle]: detailData.intro[index].label });
			form.setFieldsValue({ [configItemDetail]: detailData.intro[index].value });
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
			type : 'Page2Component',
			seqNo : seqNo ,
			title : formData.page2Title ,
			intro : keys.map((value,index) =>{
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
	//校验配置项字数限制
	checkConfigItemTitle( rule, value, callback ){
		if(!(/^[^\n]{1,4}$/.test(value))){
    		callback('不能超过4个字符');
    	}else if((/^[\s]{1,4}$/.test(value))){
			callback("不能为空格")
    	} else {
    		callback();
    	}
		this.importValueToKeys();
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
			wrapperCol  :{ span : 18 }
		};
		let formItemLayoutWithOutLabel = {
			wrapperCol : {span : 18 , offset : 4 }
		}

        getFieldProps('keys',{
			initialValue : this.state.detailData.intro,
		});

		//活动标题属性
		let titleProps = getFieldProps('page2Title',{
			initialValue : "圣诞活动介绍",
			validate : [{
				rules : [
					{ required : true , message : '请输入标题'},
					{ validator : this.checkTitle }
				],
				trigger : ['onBlur' , 'onChange']
			}]
		});

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
		            	<Input size = 'default' placeholder="标题 , 不能为空" {...configTitleProps} style={{width:'28%'}} />
		            	<Input size = 'default' placeholder="详情 , 不能为空" {...configDetailProps} style={{ marginLeft:'8px', width:'60%'}} />
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
					<FormItem {...formItemLayout} label="标题" help = '标题, 不能超过8字' >
						<Input size = 'default' placeholder="请输入标题" {...titleProps}/>
					</FormItem>
					{formItems}
			        <FormItem {...formItemLayout}>
			          <Button size = 'default' type="dashed" onClick={ this.addConfigItem } style={{ width: '100%' , marginLeft: '85px' }} disabled = { keys.length >= 4}>
			            <Icon type="plus" /> 新增
			          </Button>
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
								pageTotal = {this.state.pageTotal}/>
				</Form>
			</div>
		);
	},

}));

export default Page2DesignComponent;
