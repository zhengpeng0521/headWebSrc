import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, DatePicker } from 'antd';
import moment from 'moment';
import style from './FollowRecordCreate.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
let Option = Select.Option;
let FormItem = Form.Item;

function FollowUpRecordCreate({
    followRecordCreateVisible,
	followRecordInfo,
	followTypeList,
	studentList,
	parentList,
	id,
	stuId,
	orgId,
	source,

    cancelAddFollowRecord,
	confirmAddFollowRecord,
	studentChange,

	TenantSelectOnSelect,

	followRecordBtnLoading,

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

	let nextFollowTime = undefined;
	if( !!followRecordInfo && !!followRecordInfo.nextFollowTime ){
		nextFollowTime = moment( new Date(followRecordInfo.nextFollowTime ))
	}
    //改变校区时清空所选课程
    function TenantSelectOnSelectAction( value ){
        setFieldsValue({ stuId    : undefined });
        setFieldsValue({ parentId : undefined });
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

    function cancelAddFollowRecordAction(){
        resetFields();
        cancelAddFollowRecord();
    };

    function confirmAddFollowRecordAction(){
        validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
                return
            }
            confirmAddFollowRecord( values );
            cancelAddFollowRecordAction();
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

	function disabledDateTime() {
		return {
			disabledSeconds: () => range( 0, 60 )
		};
	}

	function disabledDate(current) {
		return current && current.valueOf() < Date.now() - 24*60*60*1000;
	}

	return(
       <Modal
            className = "zj_yhwu_follow_up_modal"
            visible = { followRecordCreateVisible }
            title = '跟进记录'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelAddFollowRecordAction }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { cancelAddFollowRecordAction } >取消</Button>,
				<Button
					key = "confirmAddFollowUpRecordAction"
					type = "primary"
					onClick = { confirmAddFollowRecordAction }
					style = {{ marginLeft : '20px' }}
					loading = { followRecordBtnLoading }
					disabled = { followRecordBtnLoading }
					>确定</Button>
			]}
        >
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进人'
                    style = {{ lineHeight : '32px' , marginBottom : 8 }}
                >
                    { followRecordInfo.uName || '' }
                </FormItem>
                { !!followRecordCreateVisible &&
                    <FormItem
                        label = "所属校区"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('orgId', {
                            initialValue :followRecordInfo.orgId && followRecordInfo.orgId + '' || orgId || '',
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
                        initialValue : followRecordInfo.stuId || stuId || undefined,
                        rules : [
                            { required : true, message : source == '2' ? '请选择跟进名单' : '请选择跟进学员' },
                        ]
                    })(
                        <Select
                            placeholder = { source == '2' ? '请选择跟进名单' : '请选择跟进学员' }
                            notFoundContent = { source == '2' ? '没有名单' : '没有学员' }
                            showSearch
                            allowClear
                            size = 'default'
							optionFilterProp = 'children'
                            onChange = { studentChange }
                            disabled = { !!stuId }
                        >
                            {
                                studentList && studentList.map(function( item, index ){
                                    return ( <Option value = { item.stuId } key = { 'follow_up_stu_' + item.stuId }>{ item.stuName }</Option> )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进家长'
                >
                    { getFieldDecorator('parentId',{
                        initialValue : followRecordInfo.parentId || undefined,
                        rules : [
							{ required : source == '2', message : '请选择跟进家长' }
                        ]
                    })(
                        <Select
                            size = 'default'
                            showSearch
                            placeholder = '请选择跟进家长'
                            notFoundContent = "没有家长"
							optionFilterProp = 'children'
							disabled = { !!stuId }
                        >
                            {
                                parentList && parentList.map(function( item, index ){
                                    return ( <Option value = { item.id } key = { 'follow_up_parent_' + item.id }>{ item.name }</Option> )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进方式'
                >
                    { getFieldDecorator( 'type', {
                        initialValue : followRecordInfo.type || undefined,
                        rules : [
                            { required : true, message : '请选择跟进方式' },
                        ]
                    })(
                        <Select
                            size = 'default'
                            showSearch
							optionFilterProp = 'children'
                            notFoundContent = { '没有跟进方式' }
                            placeholder = '请选择跟进方式'
                        >
                            {
                                followTypeList && followTypeList.map(function( item, index　){
                                    return ( <Option value = { item.key } key = { 'follow_up_' + item.index }>{ item.value }</Option> )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进内容'
                >
                    { getFieldDecorator('content',{
                        initialValue : followRecordInfo.content || undefined,
                        rules : [
							{ required : true, message : '限200字', max : 200 },
							{ validator : checkContent }
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请输入跟进内容(限200字)' autosize = {{ minRows : 4 , maxRows : 4 }}/>
                    )}
                </FormItem>
				<FormItem
                    { ...formItemLayout }
                    label = '下次跟进'
                >
                    { getFieldDecorator('nextFollowTime',{
                        initialValue : nextFollowTime || undefined,
                        rules : [
							{ type : 'object' }
                        ]
                    })(
                        <DatePicker
					  		showTime
							disabledDate = { disabledDate }
							size = 'default'
							style = {{ width : '100%' }}
					  		format = 'YYYY-MM-DD HH:mm'
							placeholder = '选择下次跟进时间'
						/>
                    )}
                </FormItem>
            </Form>
        </Modal>
	)
};

export default Form.create({})(FollowUpRecordCreate);
