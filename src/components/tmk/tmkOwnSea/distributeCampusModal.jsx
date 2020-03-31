import React from "react"
import {
    Form,
    Modal,
    Button,
    Select,
    Spin,
} from "antd"
import TenantOrgFilter from '../../../pages/common/tmk-org-select/TenantOrgFilter';

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 20
    }
}

/*分配校区modal*/
const distributeModal = ({
    distributeModalVisible, //分配校区modal是否显示
    distributeModalLoading, //分配校区modal加载状态
    distributeModalButtonLoading, //分配校区modal按钮加载状态
    distributeModalCancel, // 取消
    distributeModalSubmit, // 确定
    orgId, // 分配校区
    selectModalVisible, // 校区选择框是否可见
    selectOrgs, // 机构选择- 选择的机构列表
    afterSelectOrgModal,
    onSelectOrgModalClose,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll
    }
}) => {
    function afterSelectOrgModalSubmit( org_select ){
        setFieldsValue({ 'orgId' : org_select.join(',') });
        afterSelectOrgModal(org_select);
    };
    //校区选择框属性
    let tenantOrgSelectProps = {
        visible    : selectModalVisible,
        onClose    : onSelectOrgModalClose,
        afterSubmit: afterSelectOrgModalSubmit,
        init_org_select: selectOrgs,
        width : 390
    };
    /* 确定 */
    function handleComplete(e) {
        e.preventDefault()
        validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return
            }
            distributeModalSubmit(values, resetFields)
        })
    }
    /* 取消 */
    function handleCancel(e) {
        e.preventDefault()
        resetFields()
        distributeModalCancel()
    }

    /*检验是否只输入了空格*/
    function checkWetherSpace(rule, value, callback) {
        if (value == "" || value == undefined || value == null) {
            callback()
        } else if (/^[\s]*$/.test(value)) {
            callback(new Error("请输入跟进内容，限制30字"))
        } else {
            callback()
        }
    }

    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 24 * 60 * 60 * 1000
    }

    //模态框的属性
    let modalOpts = {
        title: "分配校区",
        maskClosable: false,
        visible: distributeModalVisible,
        closable: true,
        width: 600,
        onOk: handleComplete,
        onCancel: handleCancel,
        footer: [
            <Button key="cancel" type="ghost" onClick={handleCancel}>
                取消
            </Button>,
            <Button
                key="submit"
                type="primary"
                onClick={handleComplete}
                disabled={distributeModalLoading}
                loading={distributeModalLoading}
                style={{ marginLeft: 20 }}>
                确定
            </Button>
        ],
        className: "card_transform_course_modal"
    }

    return (
        <Modal {...modalOpts}>
            <Spin spinning={distributeModalLoading}>
                <Form>
                    <FormItem label="分配校区" {...formItemLayout}>
                        {getFieldDecorator("orgId", {
                            initialValue: orgId || undefined,
                            rules: [
                                { required: true, message: "请选择分配校区" }
                            ]
                        })(
                            <TenantOrgFilter {...tenantOrgSelectProps}/>
                        )}
                    </FormItem>
                </Form>
            </Spin>
        </Modal>
    )
}

export default Form.create()(distributeModal)
