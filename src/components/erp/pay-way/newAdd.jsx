import React from 'react';
import { Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

function payWayAdd({
    loading,
    addFormVisible,
    formLoading,
    payWayCancel,
    payWaySubmit,
    formType,

    selectContent,
    selectChange,
    modalValue,             //每次改变下拉框获得名称
    modalValueId,             //每次改变下拉框获得名称

   //打开校区选择框
    selectOrgs,
    onOpenSelectOrgModal,
    selectModalVisible,     //校区选择框是否可见
    onSelectOrgModalClose,  //关闭校区选择框
    afterSelectOrgModal,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
        setFieldsValue,
    },
  }){

    //获取下拉框数据
    let children  = [];
    if(selectContent && selectContent.length > 0){
        children = selectContent.map((item,index) => {
             return (<Option value={item.key} key={item.key}>{item.value}</Option>);
        });
    }


    function afterSelectOrgModalSubmit( org_select ){
        setFieldsValue({ 'orgs' : org_select });
        afterSelectOrgModal(org_select);
    };
    //校区选择框属性
    let tenantOrgSelectProps = {
        visible: selectModalVisible,
        onClose: onSelectOrgModalClose,
        afterSubmit: afterSelectOrgModalSubmit,
        init_org_select: selectOrgs,         //数组形式的后台数据存放
    };


   //点击取消 按钮
    function handleCancel(e){
        e.preventDefault();
        resetFields();
		payWayCancel();
	};

    //点击保存
    function handleComplete(e){
        e.preventDefault();
        let organs="";
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }

            let data = getFieldsValue();

            let orgs = data.orgs;
            if(orgs && orgs.length > 0) {
                orgs.map(function(item) {
                    organs += item + ',';
                });
                organs = organs.substring(0,organs.length-1);
            }

            data.organs = organs;
            delete data.orgs;
            delete data.key;
            data.paymentkey = modalValueId;
            data.paymentvalue = modalValue;
            resetFields();
            payWaySubmit(data);   //点击保存提交
        });
    };


    let modalOpts = {
        title: '新增支付方式',
        visible : addFormVisible,
        maskClosable : true,
        closable : true,
        width : 500,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
                <Button key='cancel' onClick={handleCancel} size='default' type='ghost'>取消</Button>,
                <Button key="submit" onClick={handleComplete}  size="default"  type='primary' disabled={formLoading} loading={formLoading}>保存</Button>
        ],
    };

    return (

            <Modal {...modalOpts}>
                <Form>
                    <FormItem
                      {...formItemLayout}
                      label="支付方式名称"
                      hasFeedback
                    >
                      {getFieldDecorator('key', {
                        rules: [{
                          required: true, message: '请输入支付方式名称!',
                        }],
                      })(
                        <Select style={{width:'240px'}} onChange={selectChange}>
                            { children || [] }
                         </Select>
                      )}
                    </FormItem>

                     <FormItem
                      {...formItemLayout}
                     label="账号/卡号"
                      hasFeedback
                    >
                      {getFieldDecorator('acctNo', {
                        rules: [{
                          required: true, message: '请输入账号/卡号!',
                        }],
                      })(
                        <Input style={{width:'240px'}} />
                      )}
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label="费率"
                      hasFeedback
                    >
                      {getFieldDecorator('rate', {
                        rules: [{
                          required: true, message: '请输入费率!',
                        }],
                      })(
                        <Input style={{width:'240px'}} />
                      )}
                    </FormItem>
                     <FormItem
                        { ...formItemLayout }
                        label = "覆盖校区"
                     >
                    <span style = {{ 'color' : '#5D9CEC', 'marginRight' : '10px' }}>{ selectOrgs && selectOrgs.length || '0' }校区</span>
                     { getFieldDecorator('orgs',{
                        initialValue : '',
                        rules : [
                            { required : true , message : '请选择校区' }
                        ]
                    })(
                        <Button type="primary" size = "small" onClick = { onOpenSelectOrgModal } >选择校区</Button>
                    )}
                </FormItem>
                </Form>
                <TenantOrgSelect { ...tenantOrgSelectProps }/>

            </Modal>

    );
};

export default Form.create()(payWayAdd);
