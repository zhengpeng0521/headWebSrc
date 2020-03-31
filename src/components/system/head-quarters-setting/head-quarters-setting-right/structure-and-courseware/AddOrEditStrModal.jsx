import React from 'react';
import { Modal, Button, Form, Input, message, Spin } from 'antd';
import styles from './AddOrEditStrModal.less';
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

/*新增编辑组织架构modal*/
const AddOrEditStrModal = ({
    treeType,                               //类型('structure'/'courseware')
    addOrEditTreeModalType,                 //modal类型create/create_son/update/delete
    addOrEditTreeModalVisible,              //modal是否显示
    addOrEditTreeModalLoading,              //modal加载状态
    addOrEditTreeModalButtonLoading,        //modal按钮加载状态
    addOrEditTreeModalData,                 //modal编辑时回填数据
    AddOrEditTreeModalSubmit,               //modal提交
    AddOrEditTreeModalClose,                //modal关闭
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll,
    },
  }) => {

    function handleComplete(e,type){
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            if(addOrEditTreeModalType == 'update' || addOrEditTreeModalType == 'delete'){
                values.id = !!addOrEditTreeModalData ? addOrEditTreeModalData.id : undefined;
            }else if(addOrEditTreeModalType == 'create_son'){
                values.pid = !!addOrEditTreeModalData ? addOrEditTreeModalData.id : undefined;
            }
            AddOrEditTreeModalSubmit(values)
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        AddOrEditTreeModalClose();
    }

    let commonLabel = treeType == 'structure' ? '部门' : treeType == 'courseware' ? '分类' : '';
    let formatTitle = addOrEditTreeModalType == 'create' ? `添加${commonLabel}` :
                      addOrEditTreeModalType == 'create_son' ? `添加子${commonLabel}（当前${commonLabel}：${addOrEditTreeModalData.name}）` :
                      addOrEditTreeModalType == 'update' ? `编辑${commonLabel}` : ''

    //模态框的属性
    let modalOpts = {
        title : formatTitle,
        maskClosable : false,
        visible : addOrEditTreeModalVisible,
        closable : true,
        width : 550,
        onCancel : handleCancel,
        footer : [
            <Button key = "cancel" type = "ghost" onClick = { handleCancel }>取消</Button>,
            <Button key = "submit" type = "primary"
                    onClick = { handleComplete }
                    disabled = { addOrEditTreeModalButtonLoading }
                    loading = { addOrEditTreeModalButtonLoading }
                    style = {{ marginLeft : 10 }}>确定</Button>
        ],
        className : 'head_quarters_setting_add_or_edit_structre'
    };

    return (
        <Modal {...modalOpts}>
            <Spin spinning = { addOrEditTreeModalLoading }>
                <FormItem
                    label = { commonLabel + '名称' }
                    {...formItemLayout}
                >
                    {getFieldDecorator('name',{
                        initialValue : addOrEditTreeModalType == 'update' && !!addOrEditTreeModalData && !!addOrEditTreeModalData.name ? addOrEditTreeModalData.name : undefined,
                        rules : [
                            { required : true , message : `请输入${commonLabel}名称` , whitespace : true },
                        ]
                    })(
                        <Input placeholder = { `请输入${commonLabel}名称` } size = 'default' onPressEnter = { handleComplete }/>
                    )}
                </FormItem>
            </Spin>
        </Modal>
    );
};

export default Form.create()(AddOrEditStrModal);
