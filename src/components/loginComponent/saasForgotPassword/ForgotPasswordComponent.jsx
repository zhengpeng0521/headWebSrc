import React from 'react';
import styles from './ForgotPasswordComponent.less';
import { Link } from 'dva/router';
import {Input,Icon,message,Form,Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

function ForgotPasswordComponent ({

	dp,
    initData,           //window._init_data
	codeStateString,
	codeDisabled,
	touchCode,
	nextStep,
	previousStep,
	MerchantList,

	form: {
        getFieldDecorator,
        getFieldValue,
		getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }

}) {

	let data = getFieldsValue();

	let reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;

	const formItemLayout = {wrapperCol: { span: 24 }};

	const codeLayout = {wrapperCol: { span: 16 }}

	//校检手机号
	function checkPhone(rule, value, callback){
		let phone = value&&value.replace(/\s/g, "");
		if (!reg.test(phone)) {
			 callback('请输入正确的手机号码');
			dp('updateState', {codeDisabled : true});
		} else {
			callback();
			dp('updateState', {codeDisabled : false});
		}
	}

	//获取验证码
	function getVerification() {

		if(codeDisabled) {
			return;
		}

		let s = 60;
		let clearTime = false;
		let time = setInterval(function() {
			if (--s == 0) {
				clearInterval(time);
				dp('updateState', {codeStateString : '点击重新获取', codeDisabled : false, touchCode : false})
			} else {
				if(clearTime == false) {
					clearTime = true;
					dp('getVerificationCode', {phone : data.mobile&&data.mobile.replace(/\s/g, "")});
				}
				dp('updateState', {codeStateString : `${s}s后重新获取`, codeDisabled : true, touchCode : true})
			}
		}, 1000);
	}

	//验证验证码获取当前手机关联的商户列表
	function verifyMobile(e) {
		e.preventDefault();
		validateFields((err, fieldsValue) => {
		  	if((fieldsValue.mobile != undefined && fieldsValue.mobile != '') && (fieldsValue.code != undefined && fieldsValue.code != '')) {

				if(fieldsValue.mobile.length != 11) {
					return message.error('请输入正确的手机号码');
				}
				if(fieldsValue.code.length < 4) {
					return message.error('请输入正确的验证码');
				}
				if(fieldsValue.code.length >= 4) {
                    //如果是三级域名，则需要通过租户ID查询当前域名下租户信息；否则查询该手机号下所有租户列表
                    if(!!initData && !!initData.tenantId){
                        data.tenantId = initData.tenantId;
                    }
                    dp('changePassword', { data });
				}
		  	}
		})
		resetFields(["merchants"]);
		resetFields(["pwd"]);
		resetFields(["confirmPwd"]);
	}
	//打开登录页面
	function login() {
		window.location.href = BASE_URL + '/login';
	}

	//打开注册页面
	function registration() {
		window.location.href = BASE_URL + '/orgApplyController/redirectPage/3';
	}

	//上一步
	function previousNext() {
		dp('updateState', {nextStep : false, previousStep : !previousStep});
	}

	let defaultOrgKey = undefined;

	if(MerchantList&&MerchantList.length  == 1) {
		defaultOrgKey = MerchantList&&MerchantList[0].id;
	}

	//保存修改密码
	function save(e) {
		e.preventDefault();
		validateFields((err, fieldsValue) => {
		  	if((fieldsValue.pwd != undefined && fieldsValue.pwd != '') && (fieldsValue.confirmPwd != undefined && fieldsValue.confirmPwd != '') && (fieldsValue.merchants != undefined && fieldsValue.merchants != '')) {

				if(fieldsValue.confirmPwd !== fieldsValue.pwd) {
					return message.error('输入密码不一致');
				}
				if(fieldsValue.confirmPwd.length < 6 || fieldsValue.pwd.length < 6) {
					return message.error('密码长度不符合');
				}
				if(fieldsValue.confirmPwd.length > 12 || fieldsValue.pwd.length > 12) {
					return message.error('密码长度不符合');
				}
				dp('saveNewPassWord', {data : data});
		  	}
		})
	}

	let sty = codeDisabled ? "getVCCode_f1f1f1" : "vertifyBtn";

	let styBox = nextStep ? styles.page1_move : previousStep ? styles.page1_previous : styles.page1;

	let styBoxNext = nextStep ? styles.page2_move : previousStep ? styles.page2_previous : styles.page2;

	return  (
		<div className="saas_forgotPassword">
			<div className={styles.saas_forgotPassword_box}>
					<div className={styles.resetPaassword}>密码重置</div>
				{
						nextStep ?
						<div className={styles.previous_bg_color} onClick={() => previousNext()}>
							<div className={styles.previous} onClick={() => previousNext()}></div>
						</div> : ''
					}
				<div className={styBox}>
					<div className={styles.input_phone_box}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('mobile', {
							rules: [
								{required: true, message: '请输入手机号码'},
								{validator : checkPhone}],
						})(
							<Input placeholder="手机号码" type="number" name="mobile"/>
						)}
						</FormItem>
					</div>
					<div className={styles.input_code_box}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('code', {
							rules: [{
								required: true,
								min : 4,
								message: '请输入验证码',
							}],
						})(
							<Input type="number" style={{width : '100%', height : '32px'}} placeholder="验证码" />
						)}
						</FormItem>
					</div>
					<div className={sty} onClick={() => getVerification()}>{codeStateString}</div>
                    {/*<div className={sty} >{codeStateString}</div>*/}
					<div className={styles.next} onClick={verifyMobile}>下一步</div>
				</div>

				<div className={styBoxNext}>


					<div className={styles.input_merchants_box}>
                        {/*三级域名下默认选中当前用户的租户id，并且置灰其余所有租户选项*/}
                        { !!initData && initData.tenantId ?
                            <FormItem {...formItemLayout} hasFeedback>
                                {getFieldDecorator('merchants', {
                                    initialValue : initData.tenantId,
                                    rules: [{
                                        required: nextStep,
                                        message: '请选择商户',
                                    }],
                                })(
                                 <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="请选择商户"
                                    optionFilterProp="children"
                                  >
                                    {
                                        MerchantList&&MerchantList.map((item, index) => {
                                            return <Option key={index} value={item.id} disabled = { initData.tenantId == item.id ? false : true }>{item.name}</Option>
                                        })
                                    }
                                  </Select>
                                )}
						    </FormItem>
                            :
                            <FormItem {...formItemLayout} hasFeedback>
                                {getFieldDecorator('merchants', {
                                    initialValue : defaultOrgKey,
                                    rules: [{
                                        required: nextStep,
                                        message: '请选择商户',
                                    }],
                                })(
                                 <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="请选择商户"
                                    optionFilterProp="children"
                                  >
                                    {
                                        MerchantList&&MerchantList.map((item, index) => {
                                            return <Option key={index} value={item.id}>{item.name}</Option>
                                        })
                                    }
                                  </Select>
                                )}
                            </FormItem>
                        }
					</div>
					<div className={styles.input_new_pwd_box}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('pwd', {
							rules: [
								{required: nextStep, message: '请输入6-12位密码', min : 6, max : 12}],
						})(
							<Input placeholder="新密码" type="password" />
						)}
						</FormItem>
					</div>
					<div className={styles.input_new_pwd_box}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('confirmPwd', {
							rules: [
								{required: nextStep, message: '请再次输入密码', min : 6, max : 12}],
						})(
							<Input placeholder="确认密码" type="password" />
						)}
						</FormItem>
					</div>
					<div className={styles.save} onClick={save}>保存</div>
				</div>

				<div className={styles.login_registered}>
					<div className={styles.login} onClick={login}>返回登录</div>
				</div>
			</div>
		</div>
	)
}

export default Form.create({})(ForgotPasswordComponent);
