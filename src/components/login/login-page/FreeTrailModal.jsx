import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Checkbox, Upload, Icon } from 'antd';
import style from './FreeTrailModal.less';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};


/*免费试用modal*/
const FreeTrailModal = ({
    freeTrailModalVisible,              //免费试用modal是否显示
    freeTrailModalButtonLoading,        //免费试用modal按钮是否在加载状态
    freeTrailModalSchoolTypeData,                   //免费试用modal选择机构类型下拉列表数据

    FreeTrailModalSubmit,               //免费试用提交
    FreeTrailModalCancel,               //免费试用modal关闭

    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
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

            FreeTrailModalSubmit(data);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        FreeTrailModalCancel();
        resetFields();
    }

    //模态框的属性
    let modalOpts = {
        title: '申请注册',
        maskClosable : false,
        visible : freeTrailModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={freeTrailModalButtonLoading}
                    loading={freeTrailModalButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_free_trail_modal'
    };

    let schoolType = [];
    if(freeTrailModalSchoolTypeData && freeTrailModalSchoolTypeData.length > 0){
        schoolType = freeTrailModalSchoolTypeData.map((item,index) => {
            return(
                <Option value={item.value} key={index}>{item.name}</Option>
            );
        })
    }

    /*检验联系方式*/
    function checkMobile(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(!(/^1[0-9]{10}$/.test(value))){
            callback(new Error('请输入正确的手机号'));
        }else{
            callback();
        }
    }

    //表单校验
    function check(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('输入内容不能为空'));
        }else{
            callback();
        }
    }

    return (
        <div>
            <Modal {...modalOpts}>
                <Form horizontal className='zj_free_trail_form'>
                    <FormItem
                        label="机构名称"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('orgName', {
                            rules: [
                                { required: true, message: '请填写机构名称' },{validator: check},
                            ],
                        })(
                            <Input type="text" placeholder='请填写机构名称' size='default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label="手机号"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('tel', {
                            rules: [
                                { required: true, message: '请填写手机号' },{validator: checkMobile},
                            ],
                        })(
                            <Input type="text" placeholder='请填写手机号' size='default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label="姓名"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('userName', {
                            rules: [
                                { required: true, message: '请填写姓名' },{validator: check},
                            ],
                        })(
                            <Input type="text" placeholder='请填写姓名' size='default'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="学校类型"
                    >
                        {getFieldDecorator('schoolType',{
                            rules : [
                                { required : true , message : '请选择学校类型' }
                            ]
                        })(
                            <Select
                                placeholder="请选择学校类型"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                notFoundContent="未找到"
                                size='default'>
                                { schoolType || [] }
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
};

export default Form.create()(FreeTrailModal);
