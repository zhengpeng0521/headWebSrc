import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Popover, Radio } from 'antd';
import style from './GetHoliday.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};

/*请假处理表单*/
const GetHolidayDealModal = ({
    getHolidayDealModalVisible,             //modal是否显示
    getHolidayDealModalButtonLoading,       //modal按钮是否加载状态
    getHolidayDealModalContent,             //modal回填数据(主要用到校区ID和校区name)

    GetHolidayDealModalSubmit,              //请假处理表单提交
    GetHolidayDealModalCancel,              //请假处理表单关闭
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
            data.id = getHolidayDealModalContent.id;
            data.orgId = getHolidayDealModalContent.orgId;
            GetHolidayDealModalSubmit(data);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        GetHolidayDealModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: '请假处理',
        maskClosable : false,
        visible : getHolidayDealModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={getHolidayDealModalButtonLoading}
                    loading={getHolidayDealModalButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_holiday_deal_modal'
   };


    return (
        <div >
            <Modal {...modalOpts}>
                <Form className='zj_holiday_deal_form'>
                    <FormItem
                        label="所属校区"
                        {...formItemLayout}
                        style={{lineHeight:'12px'}}
                    >
                        {getFieldDecorator('orgMessage', {

                        })(
                            <span>{getHolidayDealModalContent.orgName}</span>
                        )}
                    </FormItem>
                    <FormItem
                        label="处理结果"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('status', {
                            rules: [
                                { required: true, message: '请选择处理结果' },
                            ],
                        })(
                            <RadioGroup>
                                <Radio value='3'>同意</Radio>
                                <Radio value='4'>不同意</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        label="备注"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('remark', {
                            initialValue : getHolidayDealModalContent.remark || undefined
                        })(
                            <Input type='textarea' placeholder='请填写备注'/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
};

export default Form.create()(GetHolidayDealModal);
