import React from 'react';
import { Form, Modal, Button, Popconfirm, Icon, Select, Upload, Input, DatePicker } from 'antd';
import moment from 'moment';
import style from './AddOrEditVisitingPlanModal.less';
import TenantOrgFilter from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
let Option = Select.Option;
let FormItem = Form.Item;
const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 20 }
}

//新增编辑到访计划modal
function AddOrEditVisitingPlanModal({
    leadsFollowDetailLeadMessage,                       //选中leads名单查看详情时当前人的信息
    leadsFollowVisitingPlanModalType,                   //新增编辑到访计划表单类型('add','edit')
    leadsFollowVisitingPlanModalVisible,                //新增编辑到访计划表单是否显示
    leadsFollowVisitingPlanModalButtonLoading,          //新增编辑到访计划表单按钮是否加载
    leadsFollowVisitingPlanModalContent,                //编辑到访计划时回填数据

    LeadsFollowVisitingPlanModalCancel,                 //到访计划modal关闭
    LeadsFollowVisitingPlanModalSubmit,                 //到访计划modal提交

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
    //到访时间格式化
    let visitTimesInitValue = leadsFollowVisitingPlanModalContent && leadsFollowVisitingPlanModalContent.visitTime ?
                                moment(leadsFollowVisitingPlanModalContent.visitTime, 'YYYY-MM-DD HH:mm:ss') : undefined;
    let visitTimesConfig = {
        initialValue: visitTimesInitValue,
        rules: [{ type: 'object' , required : true , message : '请选择到访时间'}],
    };


    function handleCancel(){
        resetFields();
        LeadsFollowVisitingPlanModalCancel();
    };

    function handleComplete(){
        validateFieldsAndScroll((err, values ) => {
            if( !!err ){
                return
            }

            //如果是编辑 需要传当前到访计划的id
            if(leadsFollowVisitingPlanModalType == 'edit'){
                values.id = leadsFollowVisitingPlanModalContent.id || undefined;
            }

            //格式化到访时间
            if(values.visitTime != '' && values.visitTime != null && values.visitTime != undefined && !/^[\s]*$/.test(values.visitTime)){
                values.visitTime = values.visitTime.format('YYYY-MM-DD HH:mm:ss');
            }

            //来源是leads
            values.source = '1';
            LeadsFollowVisitingPlanModalSubmit(values);
        })
    }

    //时间选择器时间范围限制
    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 24*60*60*100;
    }

    /*检验是否只输入了空格*/
    function checkWetherSpace(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('到访内容不能为空'));
        }else{
            callback();
        }
    }

	return(
       <Modal
            className = "stu_management_visiting_plan_addedit_modal"
            visible = { leadsFollowVisitingPlanModalVisible }
            title = { leadsFollowVisitingPlanModalType == 'add' ? '新增到访计划' : '编辑到访计划' }
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
                    loading = { leadsFollowVisitingPlanModalButtonLoading }
                    disabled = { leadsFollowVisitingPlanModalButtonLoading }
                    onClick = { handleComplete } >确定</Button>
			]}
        >
            <Form>
                <FormItem
                    label = "所属校区"
                    { ...formItemLayout }
                >
                    { getFieldDecorator('orgId', {
                        initialValue : leadsFollowDetailLeadMessage.orgId + '' || undefined,
                        rules : [
                            { required : true, message : '请选择校区' }
                        ]
                    })(
                        <TenantOrgFilter width = { 437 } disabled = { true }/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '名单姓名'
                >
                    { getFieldDecorator('stuId', {
                        initialValue : leadsFollowDetailLeadMessage.id + '' || undefined,
                        rules : [
                            { required : true, message : '请选择名单姓名' }
                        ]
                    })(
                        <Select placeholder = '请填写名单姓名' size = 'default' disabled = { true }>
                            <Option value = { leadsFollowDetailLeadMessage.id }>{ leadsFollowDetailLeadMessage.name }</Option>
                        </Select>
                    )}
                </FormItem>
                { leadsFollowVisitingPlanModalType == 'edit' ?
                    <FormItem
                        { ...formItemLayout }
                        label = '跟进人'
                    >
                        { getFieldDecorator('sellerId', {
                            initialValue : leadsFollowVisitingPlanModalContent.sellerId + '' || undefined,
                            rules : [
                                { required : true, message : '请选择跟进人' }
                            ]
                        })(
                            <Select disabled = { true } placeholder = '请选择跟进人' size = 'default'>
                                <Option value = { leadsFollowVisitingPlanModalContent.sellerId + '' }>{ leadsFollowVisitingPlanModalContent.sellerName + '' }</Option>
                            </Select>
                        )}
                    </FormItem>
                    :
                    null
                }

                <FormItem
                    { ...formItemLayout }
                    label = '到访时间'
                >
                    { getFieldDecorator('visitTime',visitTimesConfig)(
                        <DatePicker
					  		showTime
							style = {{ width : '100%' }}
					  		format = 'YYYY-MM-DD HH:mm'
							placeholder = '选择到访时间'
                            size = 'default'
                            disabledDate = { disabledDate }
						/>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label = '到访内容'
                >
                    { getFieldDecorator('content', {
                        initialValue : leadsFollowVisitingPlanModalType == 'edit' ? leadsFollowVisitingPlanModalContent.content + '' : undefined,
                        rules : [
                            { required : true, message : '请填写跟进内容(最多200字)' , max: 200 },
                            { validator : checkWetherSpace }
                        ]
                    })(
                        <Input type = 'textarea' placeholder = '请填写跟进内容(最多200字)' autosize = {{ minRows : 4 , maxRows : 4 }}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
	)

};
export default Form.create()(AddOrEditVisitingPlanModal);
