import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader } from 'antd';
import styles from './StaffManageAddOrEditSector.less';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
   labelCol : { span: 4 },
   wrapperCol: { span: 20 },
};

/*组织架构新增部门modal*/
const StaffManageAddOrEditSector = ({
    allOrganList,                           //左边组织架构数据作为下拉列表数据
    addOrEditSectorModalType,               //新增编辑部门类型('add'/'edit')
    addOrEditSectorModalVisible,            //新增编辑部门modal是否显示
    addOrEditSectorModalButtonLoading,      //新增编辑部门modal按钮是否在加载状态
    addOrEditSectorModalData,               //编辑部门时回填数据

    AddOrEditSectorModalSubmit,             //新增编辑部门提交
    AddOrEditSectorModalCancel,             //新增编辑部门modal关闭

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
        validateFieldsAndScroll((errors) => {
            if (!!errors) {
                return;
            }
            let data = getFieldsValue();
            if(addOrEditSectorModalType == 'edit'){
                data.id = addOrEditSectorModalData.value;
                if(data.id == (data.pids)[(data.pids).length-1]){
                    message.error('上级部门不可以是自身');
                    return;
                }
            }
            (data.pids).splice(1, 0, -1);
            data.pids = JSON.stringify(data.pids);
            AddOrEditSectorModalSubmit(data,addOrEditSectorModalType);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        AddOrEditSectorModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title : addOrEditSectorModalType == 'add'? '新增部门' : '编辑部门',
        maskClosable : false,
        visible : addOrEditSectorModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key = "cancel" type = "ghost" onClick = { handleCancel }>取消</Button>,
            <Button key = "submit" type = "primary"
                    onClick = { handleComplete }
                    disabled = { addOrEditSectorModalButtonLoading }
                    loading = { addOrEditSectorModalButtonLoading }
                    style = {{ marginLeft : 10 }}>保存</Button>
        ],
        className : 'zj_add_or_edit_sector_modal'
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
            <Form>
                <FormItem
                    label="上级部门"
                    {...formItemLayout}
                >
                    {getFieldDecorator('pids', {
                        initialValue:addOrEditSectorModalType == 'edit' && addOrEditSectorModalData.default ? addOrEditSectorModalData.default : '',
                        rules: [
                            { type:'array', required: true, message: '请选择上级部门' },
                        ],
                    })(
                        <Cascader placeholder='请选择上级部门' options={allOrganList} changeOnSelect size='default'/>
                    )}
                </FormItem>
                <FormItem
                    label="部门名称"
                    {...formItemLayout}
                >
                    {getFieldDecorator('departmentName', {
                        initialValue:addOrEditSectorModalType == 'edit' && addOrEditSectorModalData.label ? addOrEditSectorModalData.label : '',
                        rules: [
                            { required: true, message: '请填写部门名称' },{validator: checkDepart},
                        ],
                    })(
                        <Input type="text" placeholder='请填写部门名称' size='default'/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
};

export default Form.create()(StaffManageAddOrEditSector);
