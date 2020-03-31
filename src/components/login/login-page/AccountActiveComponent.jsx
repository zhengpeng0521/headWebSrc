import React from 'react';
import styles from './AccountActiveComponent.less';
import {Modal,Input,Icon,Button,Alert,message,Spin,Form,} from 'antd';
import VeryCodeButton from '../../../pages/common/very-code-button/VeryCodeButton';
const FormItem = Form.Item;

function AccountActiveComponent ({visible, loading, tenantId, account, password,codeBtnLoading,
    sendVerifyCode,accountActiveAction,closeAccountActive,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    let formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 },
    };

    /*激活账号*/
    function accountActive() {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            accountActiveAction(values);
        });
    }

    return (
        <Modal
            title="激活账号"
            visible={visible}
            maskClosable={false}
            closable={true}
            onClose={closeAccountActive}
            style={{top: '20vh'}}
            width={380}
            footer={null}>
            <Spin tip="正在激活..." spinning={loading}>
                <div className={styles.account_active_cont}>
                    <Form>

                       <FormItem
                              {...formItemLayout}
                              label="账号"
                        >
                        {getFieldDecorator('mobile', {
                            initialValue: account,
                          })(
                            <Input placeholder="请输入账号" disabled={true}/>
                          )}
                        </FormItem>

                        <FormItem
                              {...formItemLayout}
                              label="验证码"
                        >
                        {getFieldDecorator('verifyCode', {
                            rules: [{
                              required: true, message: '请输入验证码',
                            }],
                          })(
                            <Input placeholder="请输入验证码" style={{width: 100}}/>
                          )}
                            <VeryCodeButton onClick={()=>sendVerifyCode(account)} />
                        </FormItem>

                        <div className={styles.active_btn_cont}>
                            <Button type="primary" loading={loading} className={styles.active_btn} onClick={()=>accountActive()}>激活账号</Button>
                        </div>

                    </Form>
                </div>
            </Spin>
        </Modal>
    );
}

export default Form.create()(AccountActiveComponent);
