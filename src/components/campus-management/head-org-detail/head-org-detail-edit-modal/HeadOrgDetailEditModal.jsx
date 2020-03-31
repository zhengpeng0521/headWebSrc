import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader , Spin } from 'antd';
import TreeSelectStructure from '../../../common/new-component/tree-select-structure/TreeSelectStructure';
import styles from './HeadOrgDetailEditModal.less';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
   labelCol : { span: 4 },
   wrapperCol: { span: 20 },
};

/*校区信息编辑modal*/
const HeadOrgDetailEditModal = ({
    baseInformationData,                    //基本信息数据
    editModalVisible,                       //modal是否显示
    editModalLoading,                       //modal加载状态
    editModalButtonLoading,                 //modal按钮加载状态
    EditModalSubmit,                        //编辑提交
    EditModalClose,                         //关闭modal
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            values.tenantId = baseInformationData.tenantId || '';
            values.orgId = baseInformationData.orgId || '';
            if(!values.tenantId || !values.orgId){
                return message.warn('请重新获取校区信息');
            }
            EditModalSubmit(values);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        EditModalClose();
    }

    //模态框的属性
    let modalOpts = {
    title : '编辑校区' ,
    maskClosable : false,
    visible : editModalVisible,
    closable : true,
    width : 550,
    onOk: handleComplete,
    onCancel : handleCancel,
    footer : [
        <Button key = "cancel" type = "ghost" onClick = { handleCancel }>取消</Button>,
        <Button key = "submit" type = "primary"
                onClick = { handleComplete }
                disabled = { editModalButtonLoading }
                loading = { editModalButtonLoading }
                style = {{ marginLeft : 10 }}>保存</Button>
    ],
    className : 'head_org_detail_edit_modal'
  };

    function checkDepart(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('部门名称不能为空'));
        }else if(value.length>10){
            callback(new Error('部门名称不能超过10位'));
        }else{
            callback();
        }
    }

    return (
        <Modal {...modalOpts}>
            <Spin spinning = { editModalLoading }>
                <FormItem
                    label = "校区名称"
                    style = {{ lineHeight : '32px' }}
                    {...formItemLayout}>
                    { baseInformationData.orgName || '--' }
                </FormItem>
                <FormItem
                    label = "所属部门"
                    {...formItemLayout}
                    >
                    {getFieldDecorator('deptId', {
                        initialValue : baseInformationData.deptId || undefined,
                        rules: [
                            { required : true, message: '请选择所属部门' },
                        ],
                    })(
                        <TreeSelectStructure width = '100%'/>
                    )}
                </FormItem>
            </Spin>
        </Modal>
    );
};

export default Form.create()(HeadOrgDetailEditModal);
