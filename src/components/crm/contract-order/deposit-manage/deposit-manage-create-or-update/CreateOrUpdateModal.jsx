import React from 'react';
import { Form, Modal, Button , Spin , Select , Input } from 'antd';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';
import styles from './CreateOrUpdateModal.less';
import TenantOrgSelect from '../../../../../pages/common/tenant-org-filter/TenantOrgFilter';
const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 20 }
}
const FormItem = Form.Item;
const Option = Select.Option;

//新建订金
function CreateOrUpdateModal({
    createOrUpdateModalVisible,         //modal是否显示
    createOrUpdateModalLoading,         //modal加载状态
    createOrUpdateModalButtonLoading,   //modal按钮加载状态
    createOrUpdateModalStu,             //modal所属学员
    paymentMethod,                      //收款方式

    OrgOnChange,                        //校区选择onChange获取所属学员
    CreateOrUpdateModalSubmit,          //modal提交
    CreateOrUpdateModalCancel,          //modal关闭
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

    //提交
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            CreateOrUpdateModalSubmit(values);
        });
    }

    //关闭
    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        CreateOrUpdateModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '新建订金',
        maskClosable : false,
        visible : createOrUpdateModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={createOrUpdateModalButtonLoading}
                    loading={createOrUpdateModalButtonLoading}
                    style={{marginLeft:20}}>保存</Button>
        ],
        className : 'create_or_update_deposit'
    };

    /*检验金额是否合法*/
    function checkMoney(rule, value, callback){
        if(isNaN(value)){
            callback('金额不合法');
        }else if(value < 0){
            callback('金额不能小于0');
        }else{
            callback();
        }
    }

	return(
        <Modal {...modalOpts}>
            <Spin spinning = { createOrUpdateModalLoading }>
                <FormItem
                    label = '所属校区'
                    { ...formItemLayout }
                    style = {{ marginBottom : createOrUpdateModalStu && createOrUpdateModalStu.length > 0 ? 10 : 0 }}
                >
                    { getFieldDecorator('orgId', {
                        rules : [
                            { required : true, message : '请选择校区' }
                        ]
                    })(
                        <TenantOrgSelect width = { 432 } onChange = { OrgOnChange }/>
                    )}
                </FormItem>
                <QueueAnim
                    type={['top', 'top']}
                    ease={['easeOutQuart', 'easeInOutQuart']}>
                    { createOrUpdateModalStu && createOrUpdateModalStu.length > 0 ?
                        <Form>
                            <FormItem
                                label = '所属学员'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('stuId', {
                                    rules : [
                                        { required : true, message : '请选择所属学员' }
                                    ]
                                })(
                                    <Select placeholder = '请选择所属学员'
                                        size = 'default'
                                        allowClear
                                        showSearch
                                        optionFilterProp = "children"
                                        notFoundContent = "未找到"
                                        style = {{ width : 160 }}>
                                        { createOrUpdateModalStu && createOrUpdateModalStu.length > 0 ? createOrUpdateModalStu.map(function(item,index){
                                            return(
                                                <Option value = { item.stuId + '' } key = { item.stuId + '' }>{ item.stuName }</Option>
                                            )
                                        }) : [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = '订金金额'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('money', {
                                    rules : [
                                        { required : true, message : '请输入订金金额' },
                                        { validator : checkMoney }
                                    ]
                                })(
                                    <Input size = 'default' placeholder = '请输入订金金额'/>
                                )}
                            </FormItem>
                            <FormItem
                                label = '收款方式'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('paId', {
                                    rules : [
                                        { required : true, message : '请选择收款方式' }
                                    ]
                                })(
                                    <Select placeholder = '请选择收款方式'
                                        size = 'default'
                                        allowClear
                                        showSearch
                                        optionFilterProp = "children"
                                        notFoundContent = "未找到"
                                        style = {{ width : 160 }}>
                                        { paymentMethod && paymentMethod.length > 0 ? paymentMethod.map(function(item,index){
                                            return(
                                                <Option value = { item.key + '' } key = { item.key + '' }>{ item.label }</Option>
                                            )
                                        }) : [] }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label = '流水号'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('realSerialNumber')(
                                    <Input size = 'default' placeholder = '请输入流水号'/>
                                )}
                            </FormItem>
                            <FormItem
                                label = '备注'
                                { ...formItemLayout }
                            >
                                { getFieldDecorator('remarks')(
                                    <Input type = 'textarea' placeholder = '请输入备注' autosize = {{ minRows : 3 , maxRows : 4 }}/>
                                )}
                            </FormItem>
                        </Form>
                        :
                        null
                    }
                </QueueAnim>
            </Spin>
        </Modal>
	)
};

export default Form.create()(CreateOrUpdateModal);
