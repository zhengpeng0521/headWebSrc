import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, DatePicker } from 'antd';
import moment from 'moment';
import style from './EditFollowRecord.less';
import TenantOrgFilter from '../../../../../../pages/common/tenant-org-filter/TenantOrgFilter';
let Option = Select.Option;
let FormItem = Form.Item;
const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 20 }
}

function EditFollowRecord({
    leadsFollowWay,                                     //跟进方式
    leadsFollowFastSearchFollowState,                   //快捷搜索栏跟进状态下拉列表内容，还可以用来格式化跟进状态
    leadsFollowDetailLeadMessage,                       //选中leads名单查看详情时当前人的信息
    leadsFollowFollowRecordEditVisible,                 //跟进记录编辑modal是否显示
    leadsFollowFollowRecordEditButtonLoading,           //跟进记录编辑modal按钮是否加载
    leadsFollowFollowRecordEditContent,                 //跟进记录编辑回填数据

    LeadsFollowFollowRecordEditCancel,                  //跟进记录modal关闭
    LeadsFollowFollowRecordEditSubmit,                  //跟进记录modal提交

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


    let way = [];       //跟进方式
    let status = [];    //跟进状态

	let key = undefined;
	!!leadsFollowWay && leadsFollowWay.map(function( item, index ){
		if( leadsFollowFollowRecordEditContent.type == item.value ){
			key = item.key + '';
		}
	})
    //格式化跟进方式
    if(leadsFollowWay && leadsFollowWay.length > 0){
        way = leadsFollowWay.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' }>{ item.value + '' }</Option>
            );
        })
    }

    //格式化跟进状态
    if(leadsFollowFastSearchFollowState && leadsFollowFastSearchFollowState.length > 0){
        status = leadsFollowFastSearchFollowState.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' }>{ item.value + '' }</Option>
            );
        })
    }

    function handleCancel(){
        resetFields();
        LeadsFollowFollowRecordEditCancel();
    };

    function handleComplete(e){
        e.preventDefault();
        validateFieldsAndScroll((err, values ) => {
            if( !!err ){
                return
            }
            values.id = leadsFollowFollowRecordEditContent.id;
            values.source = '2';
            LeadsFollowFollowRecordEditSubmit(values);
        })
    }

    /*检验是否只输入了空格*/
    function checkWetherSpace(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('跟进内容不能为空'));
        }else{
            callback();
        }
    }

	return(
       <Modal
            className = "leadsfollow_follow_record_edit_modal"
            visible = { leadsFollowFollowRecordEditVisible }
            title = '编辑跟进记录'
            maskClosable = { false }
            width = { 550 }
            onOK = { handleComplete }
            onCancel = { handleCancel }
            footer = {[
				<Button key = "cancelAddFollowUpRecordAction" onClick = { handleCancel } >取消</Button>,
				<Button
                    key = "confirmAddFollowUpRecordAction"
                    type = "primary"
                    style = {{ marginLeft : 20 }}
                    loading = { leadsFollowFollowRecordEditButtonLoading }
                    disabled = { leadsFollowFollowRecordEditButtonLoading }
                    onClick = { handleComplete } >确定</Button>
			]}
        >
            <Form>
                <FormItem
                    label = "所属校区"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('orgId', {
                        initialValue : leadsFollowFollowRecordEditContent.orgId + '' || undefined,
                        rules : [
                            { required : true, message : '请选择校区' }
                        ]
                    })(
                        <TenantOrgFilter width = { 432 } disabled = { true }/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '名单姓名'
                >
                    { getFieldDecorator('stuId', {
                        initialValue : leadsFollowFollowRecordEditContent.stuId + '' || undefined,
                        rules : [
                            { required : true, message : '请选择名单姓名' }
                        ]
                    })(
                        <Select disabled = { true } placeholder = '请选择名单姓名' size = 'default'>
                            <Option value = { leadsFollowFollowRecordEditContent.stuId + '' }>{ leadsFollowFollowRecordEditContent.stuName + '' }</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进家长'
                >
                    { getFieldDecorator('parentId', {
                        initialValue : leadsFollowFollowRecordEditContent.parentId + '' || undefined,
                        rules : [
                            { required : true, message : '请选择跟进家长' }
                        ]
                    })(
                        <Select disabled = { true } placeholder = '请选择跟进家长' size = 'default'>
                            <Option value = { leadsFollowFollowRecordEditContent.parentId + '' }>{ leadsFollowFollowRecordEditContent.parentName + '' }</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '跟进人'
                >
                    { getFieldDecorator('uid', {
                        initialValue : leadsFollowFollowRecordEditContent.uid + '' || undefined,
                        rules : [
                            { required : true, message : '请选择跟进人' }
                        ]
                    })(
                        <Select disabled = { true } placeholder = '请选择跟进人' size = 'default'>
                            <Option value = { leadsFollowFollowRecordEditContent.uid + '' }>{ leadsFollowFollowRecordEditContent.uname + '' }</Option>
                        </Select>
                    )}
                </FormItem>
                { !leadsFollowFollowRecordEditContent.callType ?
                        <FormItem
                            { ...formItemLayout }
                            label = '跟进方式'
                        >
                            { getFieldDecorator('type', {
                                initialValue : key || undefined,
                                rules : [
                                    { required : true, message : '请选择跟进方式' }
                                ]
                            })(
                                <Select
                                    notFoundContent = "未找到"
                                    showSearch
                                    allowClear
                                    size = 'default'
                                    placeholder = '请选择跟进方式'>
                                    { way || [] }
                                </Select>
                            )}
                        </FormItem>
                    :
                        <FormItem
                            { ...formItemLayout }
                            label = '跟进方式'
                        >
                            { getFieldDecorator('type', {
                                initialValue : 'phone' || undefined,
                                rules : [
                                    { required : true, message : '请选择跟进方式' }
                                ]
                            })(
                                <Select
                                    disabled = { true }
                                    notFoundContent = "未找到"
                                    showSearch
                                    allowClear
                                    size = 'default'
                                    placeholder = '请选择跟进方式'>
                                    { way || [] }
                                </Select>
                            )}
                        </FormItem>
                    }


                <FormItem
                    { ...formItemLayout }
                    label = '跟进内容'
                >
                    { getFieldDecorator('content', {
                        initialValue : leadsFollowFollowRecordEditContent.content + '' || undefined,
                        rules : [
                            { required : true, message : '限200字' , max: 200 },
                            { validator : checkWetherSpace }
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请填写跟进内容(限200字)' autosize = {{ minRows : 4 , maxRows : 4 }}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
	)

};
export default Form.create()(EditFollowRecord);
