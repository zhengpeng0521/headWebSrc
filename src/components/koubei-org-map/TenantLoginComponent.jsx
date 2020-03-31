/*
 *	口碑门店映射
 * 	租户登陆
 */
import React from 'react';
import { Form, Button, Checkbox, Input, Spin, } from 'antd';
import styles from './TenantLoginComponent.less';

let FormItem = Form.Item;

function TenantLoginComponent ({
	loading,bindTenant,createTenant,
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
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    let btnLayout = {
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14, offset: 6, },
        },
    };

    function onSubmitClick() {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            bindTenant(values);
        });
    }

	return (
		<div className={styles.tenant_login_cont}>
			<div className={styles.top_logo_cont}>
			    <div className={styles.top_logo_content}>
			        <img className={styles.top_logo} src="https://img.ishanshan.com/gimg/img/ffdcdca8c5c1f6810a315be9a1b236ec"/>
			        <div className={styles.top_logo_text_cont}>
			            <div className={styles.top_logo_text_title}>闪闪SAAS系统</div>
			            <div className={styles.top_logo_text_desc}>一站式早教服务云平台</div>
			        </div>
			    </div>
			</div>
			<div className={styles.login_cont}>

			    <div className={styles.login_title}>
			        绑定闪闪账号
			    </div>

			    <div className={styles.login_content}>

			        <div className={styles.login_form_cont}>

			            <Spin spinning={loading} tip='绑定中...'>
			            <Form>

                            <FormItem
                                {...formItemLayout}
                                label="闪闪账号"
                            >
                              {getFieldDecorator('mobile')(
                                <Input />
                              )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="密码"
                            >
                              {getFieldDecorator('password')(
                                <Input type='password' />
                              )}
                            </FormItem>

                            <FormItem
                                {...btnLayout}
                                label=""
                            >
                                <Button type='primary' onClick={onSubmitClick}>绑定并登陆</Button>
                            </FormItem>

                            <FormItem
                                {...btnLayout}
                                label=""
                            >
                                <div className={styles.href_text} onClick={()=>createTenant()}>首次登陆，点击这里进入SAAS</div>
                            </FormItem>

                        </Form>
                        </Spin>
			        </div>

			        <div className={styles.login_info_cont}>
                        <div className={styles.login_info_title}>口碑网 可以进行以下操作</div>
                        <Checkbox checked className='login_info_desc' >免登进入SaaS系统</Checkbox>
                        <Checkbox checked className='login_info_desc' >同步插件功能至口碑网</Checkbox>
                        <Checkbox checked className='login_info_desc' >在闪闪后台统计口碑网数据</Checkbox>
			        </div>
			    </div>
			</div>
		</div>
	)
}

export default Form.create()(TenantLoginComponent);
