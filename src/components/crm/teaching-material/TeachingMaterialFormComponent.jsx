import React from 'react';
import styles from './TeachingMaterialFormComponent.less';
import {Modal, Button,Form,Input,Select,InputNumber} from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
let Option = Select.Option;

const FormItem = Form.Item;

function TeachingMaterialFormComponent ({
    visible,                 //表单窗口是否显示
    loading,
    formData,

    onClose,
    onSubmit,
    createOrgId,

	teachingMaterialBtnLoading,

    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    //关闭窗口
    function onCloseClick() {
        resetFields();
        onClose && onClose();
    }
    //保存按钮
    function onSaveClick() {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            onSubmit(values, onCloseClick);
        });
    }

    let formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    let formDataId = formData && formData.id;

    //校验库存
    function checkStock(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('库存数不能为空'));
        }else if(/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/.test(value)){
            callback(new Error('库存数不能为小数'));
        }else{
            callback();
        }
    }

    return (
        <Modal
            className='zj_teaching_material_message'
            title={(formDataId == undefined || formDataId == '') ? '新增物资' : '编辑物资'}
            visible = { visible }
            maskClosable = { false }
            closable = { true }
            width = { 550 }
            onCancel = { onCloseClick }
			footer = {[
				<Button key = "cancelTeachingMaterail"  onClick = { onCloseClick } >取消</Button>,
				<Button
					key = "confirmTeachingMaterail"
					type = "primary"
					onClick = { onSaveClick }
					loading = { teachingMaterialBtnLoading }
					disabled = { teachingMaterialBtnLoading }
                    style = {{ marginLeft : 20 }}
				>保存</Button>
			]}
        >
           <div className={styles.teaching_material_form_cont}>
               <Form>

                    {getFieldDecorator('id', {
                        initialValue: formDataId,
                      })(
                        <Input type="hidden" />
                      )}

                    <FormItem
                          {...formItemLayout}
                          label="所属校区"
                    >
                    {getFieldDecorator('orgId', {
                        initialValue: !(formData && formData.orgId)?(!createOrgId ? "":createOrgId):formData.orgId,
                        rules: [{
                          required: true, message: '请选择所属校区',
                        }],
                      })(
                        <TenantOrgFilter disabled={(getFieldValue('id') != undefined)} width = { 432 }/>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="物资名称"
                    >
                    {getFieldDecorator('name', {
                        initialValue: formData && formData.name,
                        rules: [{
                          required: true, message: '请输入物资名称',
                        }],
                      })(
                        <Input placeholder="请输入物资名称,例如教材、耗材、礼品等" size='default'/>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="物资描述"
                    >
                    {getFieldDecorator('describes', {
                        initialValue: formData && formData.describes,
                      })(
                        <Input type="textarea" placeholder="请输入物资描述" autosize={{ minRows: 3, maxRows: 4 }}/>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="价格"
                    >
                    {getFieldDecorator('price', {
                        initialValue: formData && formData.price,
                        rules: [{
                          required: true, message: '请输入价格',
                        }],
                      })(
                        <InputNumber style={{width: '100%'}} min={0}  step={0.01} size='default'/>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="库存"
                    >
                    {getFieldDecorator('stock', {
                        initialValue: formData && formData.stock,
                        rules: [
                            {required: true, message: '请输入库存'},{validator: checkStock},
                        ],
                      })(
                        <InputNumber style={{width: '100%'}} min={0} step={1} size='default'/>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="销售单位"
                    >
                    {getFieldDecorator('unit', {
                        initialValue: formData && formData.unit,
                        rules: [{
                          required: true, message: '请输入销售单位',
                        }],
                      })(
                        <Input placeholder="请输入销售单位" size='default'/>
                      )}
                    </FormItem>

                    <FormItem
												{...formItemLayout}
												label="状态"
												style = {{ marginBottom : '0' }}
                    >
                    {getFieldDecorator('status', {
                        initialValue: formData && formData.status,
                        rules: [{
                          required: true, message: '请选择状态',
                        }],
                      })(
                        <Select
                            placeholder="请选择状态"
                            style={{width: '100%'}}
                            size='default'>
                            <Option key="status_1" value="1" >上架</Option>
                            <Option key="status_2" value="2" >下架</Option>
                        </Select>
                      )}
                    </FormItem>

               </Form>

           </div>

        </Modal>
    );
}

export default Form.create()(TeachingMaterialFormComponent);
