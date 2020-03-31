import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Popover, Radio, DatePicker } from 'antd';
import styles from './LeadsFollowLeadsDispatchModal.less';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 17,
    },
};

/*leads分配modal*/
const LeadsFollowLeadsDispatchModal = ({
    leadsFollowLeadsDispatchOrgList,   //校区列表
    leadsFollowLeadsDispatchModalVisible,       //分配modal是否显示
    leadsFollowLeadsDispatchModalButtonLoading, //分配modal按钮是否加载状态

    LeadsFollowLeadsDispatchModalSubmit,        //分配modal提交
    LeadsFollowLeadsDispatchModalCancel,        //分配modal关闭

    LeadsFollowLeadsDispatchModalSelectOnChange,  //下拉框选择

    leadsFollowTableSelectedRowKeys,            //多选框选中项的id,若无id，则取到当前索引
    leadsFollowTableSelectedRows,               //多选框选中的项的对象数组

    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {

    /*校区列表*/
    let OrgList = [];
    if(leadsFollowLeadsDispatchOrgList && leadsFollowLeadsDispatchOrgList.length > 0){
        OrgList = leadsFollowLeadsDispatchOrgList.map((item,index) => {
            return(
                <Option key = { item.id + '' } value = { item.id + '' }>{ item.name + '' }</Option>
            );
        })
    }
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            LeadsFollowLeadsDispatchModalSubmit(values);

        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        LeadsFollowLeadsDispatchModalCancel();
    }


        //模态框的属性
    let modalOpts = {
        title: '分配名单',
        maskClosable : false,
        visible : leadsFollowLeadsDispatchModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}
                disabled={leadsFollowLeadsDispatchModalButtonLoading}
                loading={leadsFollowLeadsDispatchModalButtonLoading}
                >取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={leadsFollowLeadsDispatchModalButtonLoading}
                    loading={leadsFollowLeadsDispatchModalButtonLoading}
                    style={{marginLeft:20}}>确认</Button>
        ],
        className : 'LeadsFollowLeadsDispatchModal'
    };

    return (
        <Modal {...modalOpts}>
            <div className={styles.leads_follow_modals_alert_message_intro}>
               请为已选中的 {leadsFollowTableSelectedRows.length } 个名单分配校区

            </div>
            <Form>
                <FormItem
                    label = "请选择校区"
                    {...formItemLayout}
                >
                    {getFieldDecorator('orgId', {
                        rules : [
                            { required : true , message : '请选择校区' }
                        ]
                    })(
                        <Select placeholder = '请选择校区'
                                size = 'default'
                                allowClear
                                showSearch
                                optionFilterProp = "children"
                                notFoundContent = "未找到">
                            { OrgList || [] }
                        </Select>
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
};

export default Form.create()(LeadsFollowLeadsDispatchModal);
