import React from 'react';
import { Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
};

function payWayEdit({
    loading,
    editFormVisible,
    formLoading,
    editPayWayCancel,
    editPayWaySubmit,
    formType,
    selectContent,

    //打开校区选择框
    selectOrgs,
    onOpenSelectOrgModal,
    selectModalVisible,     //校区选择框是否可见
    onSelectOrgModalClose,  //关闭校区选择框
    afterSelectOrgModal,

    modalAllContent,        //初进编辑页面的原始数据
    selectChange,   //下拉框onchange事件
    modalValue,      //下拉框改变时获得的value
    modalValueId,    //下拉框改变时获得的id
    itemId,             //编辑时当前项的ID

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

    let organs = modalAllContent.organs;
   // let organsarr = organs.split(",");           //初始时organs数组


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
        init_org_select: selectOrgs,
    };


   //点击取消 按钮
    function editHandleCancel(e){
        e.preventDefault();
        resetFields();
		editPayWayCancel();
	};

    //点击保存
    function editHandleComplete(e){
        e.preventDefault();
        let organs="";
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }


            let data = getFieldsValue();

            if(modalValue==""){
                data.paymentvalue = modalAllContent.paymentvalue;
                data.paymentkey = modalAllContent.paymentkey;
            }else{
                data.paymentvalue = modalValue;
                data.paymentkey = modalValueId;
            }

              let orgs = data.orgs;
              if(orgs && orgs.length > 0) {
                 orgs.map(function(item) {
                    organs += item + ',';
                 });
                 organs = organs.substring(0,organs.length-1);
              }

              data.organs = organs;
              delete data.orgs;

              data.id = itemId;                           //编辑时列表id
              data.acctNo = data.number;

              delete data.number;
              delete data.key;

            editPayWaySubmit(data);   //点击保存提交
        });
    };


    let modalOpts = {
        title: '编辑支付方式',
        visible : editFormVisible,
        maskClosable : true,
        closable : true,
        width : 500,
        onOk: editHandleComplete,
        onCancel : editHandleCancel,
        footer : [
                <Button key='cancel' onClick={editHandleCancel} size='default' type='ghost'>取消</Button>,
                <Button key="submit" onClick={editHandleComplete}  size="default"  type='primary' disabled={formLoading} loading={formLoading}>保存</Button>
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
                        initialValue:modalAllContent ? modalAllContent.paymentvalue: '',
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
                      {getFieldDecorator('number', {
                             initialValue:modalAllContent ? modalAllContent.acctNo : '',
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
                            initialValue:modalAllContent ? modalAllContent.rate : '',
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
                        initialValue : "",
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

export default Form.create()(payWayEdit);
