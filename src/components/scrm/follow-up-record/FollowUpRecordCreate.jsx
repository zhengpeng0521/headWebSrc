import React from 'react';
import { Form, Modal ,Button , Popconfirm ,Icon, Select ,Upload,Input   } from 'antd';
import style from './FollowUpRecordCreate.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
let Option = Select.Option;
let Dragger = Upload.Dragger;
let FormItem = Form.Item;

function FollowUpRecordCreate({
    followUpRecordModalVisible,
    followUpRecordInfo,
    followUpTypeList,
    studentList,
    parentIdList,
    stuId,
    orgId,

    cancelAddFollowUpRecord,
    confirmAddFollowUpRecord,
    studentChange,

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
        width        : 375,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
        disabled     : !!stuId
    };

    function cancelAddFollowUpRecordAction(){
        resetFields();
        cancelAddFollowUpRecord();
    };

    function confirmAddFollowUpRecordAction(){
        validateFieldsAndScroll( (err, values ) => {
            if( !!err ){
                return
            }
            confirmAddFollowUpRecord( values );
            cancelAddFollowUpRecordAction();
        })
    }

    let formItemLayout = {
        labelCol : { span : 4 },
		wrapperCol : { span : 18 }
    }
	return(
       <Modal
            className = "yhwu_follow_up_modal"
            visible = { followUpRecordModalVisible }
            title = '跟进记录'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelAddFollowUpRecordAction }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { cancelAddFollowUpRecordAction } >取消</Button>,
				<Button key = "confirmAddFollowUpRecordAction" type = "primary" onClick = { confirmAddFollowUpRecordAction } >确定</Button>
			]}
        >
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进人'
                >
                    <span style = {{ lineHeight : '32px' }}>
                        { followUpRecordInfo.uName || '' }
                    </span>
                </FormItem>
                { !!followUpRecordModalVisible &&
                    <FormItem
                        label = "所属校区"
                        { ...formItemLayout }
                    >
                        { getFieldDecorator('orgId', {
                            initialValue :followUpRecordInfo.orgId && followUpRecordInfo.orgId + '' || orgId || '',
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
                    label = '跟进学员'
                >
                    { getFieldDecorator('stuId', {
                        initialValue : followUpRecordInfo.stuId || stuId || undefined,
                        rules : [
                            { required : true, message : '请选择跟进学员' },
                        ]
                    })(
                        <Select
                            placeholder = '请选择跟进学员'
                            notFoundContent = "没有学员"
                            showSearch
                            allowClear
                            size = 'default'
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
                        initialValue : followUpRecordInfo.parentId || undefined,
                        rules : [
                        ]
                    })(
                        <Select
                            placeholder = '请选择跟进家长'
                            notFoundContent = "没有家长"
                            showSearch
                        >
                            {
                                parentIdList && parentIdList.map(function( item, index ){
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
                        initialValue : followUpRecordInfo.type || undefined,
                        rules : [
                            { required : true, message : '请选择跟进方式' },
                        ]
                    })(
                        <Select
                            showSearch
                            notFoundContent = { '没有跟进方式' }
                            placeholder = '请选择跟进方式'
                        >
                            {
                                followUpTypeList && followUpTypeList.map(function( item, index　){
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
                        initialValue : followUpRecordInfo.content || '',
                        rules : [
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请输入跟进内容' />
                    )}
                </FormItem>
            </Form>
        </Modal>
	)
};

export default Form.create({})(FollowUpRecordCreate);
