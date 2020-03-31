import React from 'react';
import { Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

function addMaterialManage({
    loading,             //页面加载
    addFormVisible,      //新增显示
    formLoading,         //提交加载
    addMaterialCancel,   //新增取消
    addMaterialSubmit,   //新增提交
    selectContent,       //下拉框内容

    form: {              //表单数据
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
        setFieldsValue,
    },
  }){


   //点击取消 按钮
    function handleCancel(e){
        e.preventDefault();
        resetFields();
		addMaterialCancel();
	};

    //点击保存
    function handleComplete(e){
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            let data = getFieldsValue();
            // data.tenantId = '127';
           addMaterialSubmit(data);   //点击保存提交
           resetFields();
        });
    };
    let tenantOrgFilterProps = {
        width : 302,
    }

    let modalOpts = {
        title: '新增教具列表',
        visible : addFormVisible,
        maskClosable : true,
        closable : true,
        width : 550,
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
                      label="所属校区"
                      hasFeedback
                    >
                      {getFieldDecorator('orgId', {
                            initialValue: "",
                            rules: [{
                              required: true, message: '请选择校区',
                            }],
                      })(
                        <TenantOrgFilter {...tenantOrgFilterProps}/>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="产品名称"
                      hasFeedback
                    >
                      {getFieldDecorator('name', {
                        rules: [{
                          required: true, message: '请输入教具名称!',
                        }],
                      })(
                         <Input size='default'/>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="产品描述"
                    >
                      {getFieldDecorator('describes', {

                      })(
                         <Input type="textarea" rows={4} />
                      )}
                    </FormItem>

                     <FormItem
                      {...formItemLayout}
                     label="标准价格"
                      hasFeedback
                    >
                      {getFieldDecorator('price', {
                        rules: [{
                          required: true, message: '请输入价格!',
                        }],
                      })(
                        <Input size='default'/>
                      )}
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label="库存"
                      hasFeedback
                    >
                      {getFieldDecorator('stock', {
                        rules: [{
                          required: true, message: '请输入库存!',
                        }],
                      })(
                        <Input size='default'/>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="产品单位"
                      hasFeedback
                    >
                      {getFieldDecorator('unit', {
                        rules: [{
                          required: true, message: '请输入单位!',
                        }],
                      })(
                        <Input size='default'/>
                      )}
                    </FormItem>
                     <FormItem
                      {...formItemLayout}
                      label="状态"
                      hasFeedback
                    >
                      {getFieldDecorator('status', {
                        rules: [{
                          required: true, message: '请选择状态！',
                        }],
                      })(
                        <Select placeholder="状态" size='default'>
                            <Option value=""></Option>
                            <Option value="1">上架</Option>
                            <Option value="2">下架</Option>
                        </Select>
                      )}
                    </FormItem>
            </Form>

         </Modal>

    );
};

export default Form.create()(addMaterialManage);
