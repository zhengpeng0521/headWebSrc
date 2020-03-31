import React from 'react';
import { Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

function editMaterialManage({
    loading,
    editFormVisible,
    formLoading,
    editMaterialManageCancel,
    editMaterialManageSubmit,

    modalAllContent,        //初进编辑页面的原始数据

    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
    },
  }){

   //点击取消 按钮
    function editHandleCancel(e){
        e.preventDefault();
        resetFields();
		editMaterialManageCancel();
	};

    //点击保存
    function editHandleComplete(e){
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            let data = getFieldsValue();
            data.id = modalAllContent.id;
            data.tenantId = '127';

            editMaterialManageSubmit(data);   //点击保存提交
        });
    };

    let tenantOrgFilterProps = {
        width : 302,
    }

    let modalOpts = {
        title: '编辑支付方式',
        visible : editFormVisible,
        maskClosable : true,
        closable : true,
        width : 550,
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
                    { editFormVisible == true ?
                        <FormItem
                          {...formItemLayout}
                          label="所属校区"
                        >
                          {getFieldDecorator('orgId', {
                                initialValue : modalAllContent.orgId + '',
                                rules: [{
                                  required: true, message: '请选择校区',
                                }],
                          })(
                            <TenantOrgFilter {...tenantOrgFilterProps}/>
                          )}
                        </FormItem>
                        :
                        null
                    }

                    <FormItem
                      {...formItemLayout}
                      label="产品名称"
                    >
                      {getFieldDecorator('name', {
                        initialValue: modalAllContent.name,
                        rules: [{
                          required: true, message: '请输入产品名称!',
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
                         initialValue: modalAllContent.describes,
                      })(
                         <Input type="textarea" rows={4} />
                      )}
                    </FormItem>
                     <FormItem
                      {...formItemLayout}
                     label="标准价格"
                    >
                      {getFieldDecorator('price', {
                       initialValue: modalAllContent.price,
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
                    >
                      {getFieldDecorator('stock', {
                        initialValue: modalAllContent.stock,
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
                    >
                      {getFieldDecorator('unit', {
                        initialValue: modalAllContent.unit,
                        rules: [{
                          required: true, message: '请输入产品单位!',
                        }],
                      })(
                        <Input size='default'/>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="状态"
                    >
                      {getFieldDecorator('status', {
                        initialValue : modalAllContent.status+'',
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

export default Form.create()(editMaterialManage);
