import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, DatePicker } from 'antd';
import moment from 'moment';
//import style from './FollowRecordCreate.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './VisitRecordCreate.less';
let Option = Select.Option;
let FormItem = Form.Item;

function VisitRecordCreate({
    visitRecordCreateVisible,
	visitRecordInfo,
	studentList,
	id,
	stuId,
	orgId,
	source,
	visitRecordBtnLoading,

	cancelAddVisitRecord,
	confirmAddVisitRecord,

	TenantSelectOnSelect,

    form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	}

}){

	let visitTime = undefined;
	if( !!visitRecordInfo && !!visitRecordInfo.visitTime ){
		visitTime = moment( new Date( visitRecordInfo.visitTime ))
	}
    //改变校区时清空所选课程
    function TenantSelectOnSelectAction( value ){
        setFieldsValue({ stuId    : undefined });
        if( !!value ){
            TenantSelectOnSelect( value );
        }
    };

    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 432,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
        disabled     : !!stuId
    };

    function cancelAddVisitRecordAction(){
        resetFields();
        cancelAddVisitRecord();
    };

    function confirmAddVisitRecordAction(){
        validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
                return
            }
            confirmAddVisitRecord( values );
            cancelAddVisitRecordAction();
        })
    }

    let formItemLayout = {
        labelCol : { span : 4 },
		wrapperCol : { span : 20 }
    }

	/*校验跟进记录 字数*/
	function checkContent( rule, value, callback ){
		if((/^[\s]{1,200}$/.test(value))){
			callback("不能全为空格")
    	} else {
    		callback();
    	}
	}

	function range(start, end) {
		const result = [];
  		for (let i = start; i < end; i++) {
    		result.push(i);
  		}
  		return result;
	}

	function disabledDate( current ) {
		return current && current.valueOf() < Date.now() - 24*60*60*1000;
	}

	function disabledDateTime() {
    	return {
			disabledSeconds: () => range( 0, 60 )
		};
	}

	return(
       <Modal
            className = "zj_yhwu_visit_plan_modal"
            visible = { visitRecordCreateVisible }
            title = '到访计划'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelAddVisitRecordAction }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { cancelAddVisitRecordAction } >取消</Button>,
				<Button
					style = {{ marginLeft : '20px' }}
					key = "confirmAddFollowUpRecordAction"
					type = "primary"
					onClick = { confirmAddVisitRecordAction }
					loading = { visitRecordBtnLoading }
					disabled = { visitRecordBtnLoading }
					>确定</Button>
			]}
        >
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进人'
                    style = {{ lineHeight : '32px' , marginBottom : 8 }}
                >
                    { visitRecordInfo.sellerName || '' }
                </FormItem>
                { !!visitRecordCreateVisible &&
                    <FormItem
                        label = "所属校区"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('orgId', {
                            initialValue : visitRecordInfo.orgId && visitRecordInfo.orgId + '' || orgId || '',
                            rules : [
                                { required : true, message : '请选择校区' }
                            ]
                        })(
                            <TenantOrgSelect { ...tenantOrgSelectProps } />
                        )}
                    </FormItem>
                }
                <FormItem
                    { ...formItemLayout }
                    label = { source == '2' ? '跟进名单' : '跟进学员' }
                >
                    { getFieldDecorator('stuId', {
                        initialValue : visitRecordInfo.stuId || stuId || undefined,
                        rules : [
                            { required : true, message : source == '2' ? '请选择跟进名单' : '请选择跟进学员'},
                        ]
                    })(
                        <Select
                            allowClear
                            showSearch
							optionFilterProp = 'children'
                            placeholder = { source == '2' ? '请选择跟进名单' : '请选择跟进学员' }
                            notFoundContent = { source == '2' ? '没有名单' : '没有学员' }
                            disabled = { !!stuId }
                            size = 'default'
                        >
                            {
                                studentList && studentList.map(function( item, index ){
                                    return ( <Option value = { item.stuId } key = { 'visit_stu_' + item.stuId }>{ item.stuName }</Option> )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
				<FormItem
                    { ...formItemLayout }
                    label = '到访时间'
                >
                    { getFieldDecorator('visitTime', {
                        initialValue : visitTime || undefined,
                        rules : [
							{ type : 'object', required : true, message : '请选择到访时间' }
                        ]
                    })(
                        <DatePicker
					  		showTime
							disabledDate = { disabledDate }
							style = {{ width : '100%' }}
							size = 'default'
					  		format = 'YYYY-MM-DD HH:mm'
							placeholder = '选择到访时间'
						/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '到访内容'
                >
                    { getFieldDecorator('content',{
                        initialValue : visitRecordInfo.content || undefined,
                        rules : [
							{ required : true, message : '限200字', max : 200 },
							{ validator : checkContent }
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请输入到访内容(限200字)' autosize = {{ minRows : 4 , maxRows : 4 }}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
	)
};

export default Form.create({})(VisitRecordCreate);
