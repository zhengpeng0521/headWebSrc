import React from 'react';
import styles from './ActivationComponent.less';
import { Link } from 'dva/router';
import {Input,Icon,message,Form,Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

function ForgotPasswordComponent ({

	dp,
    initData,           //window._init_data
	codeStateString,
	codeDisabled,
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
					dp('activation', {data : data});
				}
		  	}
		})
	}

	//打开登录页面
	function login() {
		window.location.href = BASE_URL + '/login';
	}

	//打开注册页面
	function registration() {
		window.location.href = BASE_URL + '/orgApplyController/redirectPage/3';
	}

	let defaultOrgKey = undefined;

	let sty = codeDisabled ? "getVCCode_f1f1f1" : "vertifyBtn";

	return  (
		<div className="saas_forgotPassword">
			<div className={styles.saas_forgotPassword_box}>
				<div className={styles.resetPaassword}>账号激活</div>
				<div className={styles.page1_previous}>
					<div className={styles.input_phone_box}>
						<FormItem {...formItemLayout} >
							{getFieldDecorator('mobile', {
							initialValue : mobile || '',
							rules: [
								{required: true, message: '请输入手机号码', min : 11,},
								{validator : checkPhone}],
						})(
							<Input placeholder="手机号码" type="number" name="mobile" disabled={true} />
						)}
						</FormItem>
					</div>
					<div className={styles.input_code_box}>
						<FormItem {...formItemLayout}>
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
					<div className={sty} >{codeStateString}</div>
					<div className={styles.next} onClick={verifyMobile}>激活</div>
				</div>

				<div className={styles.login_registered}>
					<div className={styles.login} onClick={login}>返回登录</div>
				</div>
			</div>
		</div>
	)
}

export default Form.create({})(ForgotPasswordComponent);
