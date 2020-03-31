import React , { PropTypes }from 'react';
import styles from './RegisteredComponent.less';
import positionArr from './CascaderAddressOptions'
import { Link } from 'dva/router';
import {Input, Icon, Cascader, message, Form, Select,} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

function RegisteredComponent ({

	dp,
	codeStateString_r,
	codeDisabled,
	touchCode,
	schoolTypeArr,
    formConfiguration,
 
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

	const formItemLayout = {wrapperCol: { span: 24 }};

	const codeLayout = {wrapperCol: { span: 16 }}

	let reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;

	var stringReg = /^(?=.*\d.*\b)/;

	//校检用户名
	function checkName(rule, value, callback) {
		let name = value&&value.replace(/\s/g, "");
		if (stringReg.test(name)) {
			 callback('姓名不能包含数字');
		} else {
			 callback();
		}
	}

	//校检手机号
	function checkPhone(rule, value, callback){
		let phone = value&&value.replace(/\s/g, "");
		if (!reg.test(phone)) {
			 callback('请输入正确的手机号码');
		} else {
			 callback();
		}
	}

	//检测是否输入手机以及联系人
	if((data.personPhone&&data.personPhone.length > 0) && (data.personName&&data.personName.length > 0)) {

		let nameCheck = false;
		let phoneCheck = false;

		//姓名验证
		let name = data.personName.replace(/\s/g, "");
		if (stringReg.test(name)) {
			nameCheck = false;
		} else {
			nameCheck = true;
		}
		//手机验证
		let phone = data.personPhone.replace(/\s/g, "");
		if (!reg.test(phone)) {
			phoneCheck = false;
		} else {
			phoneCheck = true;
		}

		if(nameCheck&&phoneCheck) {
			if(codeDisabled && !touchCode) {
				dp('updateState', {codeDisabled : false});
			}
		} else {
			if(!codeDisabled) {
				dp('updateState', {codeDisabled : true});
			}
		}
	} else {
		if(!codeDisabled) {
			dp('updateState', {codeDisabled : true});
		}
	}

	//登陆
	function login() {
		window.location.href = BASE_URL + '/login';
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
				dp('updateState', {codeStateString_r : '点击重新获取', codeDisabled : false, touchCode : false})
			} else {
				if(clearTime == false) {
					clearTime = true;
					dp('getVerificationCode', {phone : data.personPhone.replace(/\s/g, "")});
				}
				dp('updateState', {codeStateString_r : `${s}s后重新获取`, codeDisabled : true, touchCode : true})
			}
		}, 1000);
	}

	//申请注册
	function applicationRegistration(e) {
		e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            let city = data.city;
            if(city != undefined && city.length>0){
                data.city = city.join(' ');
            }
			dp('registration', {data : data});
		});
	}
    let bannerLeft = [];
	let sty = codeDisabled ? "getVCCode_f1f1f1" : "vertifyBtn";
    let cityRequire = true;
    let addressRequire = true;
    let orgNeedRequire = true;
    formConfiguration && formConfiguration.length > 0 && formConfiguration.map(function(item ,index){
        if(item.require == '1'){
            if(item.name == 'city'){
                cityRequire = false;
            }else if(item.name == 'address'){
                addressRequire = false;
            }else if(item.name == 'orgNeed'){
                orgNeedRequire = false;
            }
        }
        if(item.hide == "1"){
           if(item.name == 'orgName'){
                bannerLeft.push(
                   <div key = {index} className={styles.input_organ_box}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('orgName', {
							rules: [{
								required: true,
								message: '机构名称输入有误,4-16个字符',
							}],
						})(
							<Input placeholder="机构(必填)" />
						)}
						</FormItem>
					</div>
                )
            }else if(item.name == 'tel'){
                bannerLeft.push(
                    <div key = {index} style={{height:'86px'}}>
                        <div className={styles.input_phone_box}>
                            <FormItem {...formItemLayout} hasFeedback>
                                {getFieldDecorator('personPhone', {
                                rules: [
                                    {required: true, message: '请输入联系人电话',},
                                    {validator : checkPhone}],
                            })(
                                <Input placeholder="联系电话(必填)" type="number" name="mobile" />
                            )}
                            </FormItem>
					   </div>
                        <div className={styles.input_code_box}>
                            <FormItem {...formItemLayout} hasFeedback>
                                {getFieldDecorator('verificationCode', {
                                rules: [{
                                    required: true,
                                    min : 4,
                                    message: '请输入验证码',
                                }],
                            })(
                                <Input type="number" style={{width : '100%', height : '32px'}} placeholder="验证码"  />
                            )}
                            </FormItem>
                        </div>
                        <div className={sty} >{codeStateString_r}</div>
                    </div>
                )
            }else if(item.name == 'userName'){
                bannerLeft.push(
                    <div  key = {index} className={styles.input_person_box}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('personName', {
							rules: [
								{required: true, message: '请输入联系人姓名',},
								{validator : checkName}
							],
						})(
							<Input placeholder="联系人(必填)" type="text" />
						)}
						</FormItem>
					</div>
                )
            }else if(item.name == 'city'){
                bannerLeft.push(
                   <div key = {index} className={styles.input_city_box} key = {index}>
                        <FormItem  {...formItemLayout} hasFeedback>
                            {getFieldDecorator('city', {
                                rules: [{
                                    required: !cityRequire,
                                    message: '请输入机构详细地址',
							 }],
                            })(
                                <Cascader style={{width:'100%',height:'32px',background:'#f1f1f1'}} placeholder={cityRequire ? "详细地址(选填)" : "详细地址(必填)"} options={positionArr} changeOnSelect size='default'/>
                            )}
                        </FormItem>
                    </div>
                )
            }else if(item.name == 'orgType'){
                bannerLeft.push(
                   <div key = {index} className={styles.input_organ_type}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('organType', {
							rules: [{
								required: true,
								message: '请选择机构类型',
							}],
						})(
							 <Select
								showSearch
								style={{ width: '100%' }}
								placeholder="机构类型(必填)"
								optionFilterProp="children"
							  >
								{
									schoolTypeArr&&schoolTypeArr.map((item, index) => {
										return <Option key={index} value={item.value}>{item.name}</Option>
									})
								}
							  </Select>
						)}
						</FormItem>
					</div>
                )
            }else if(item.name == 'address'){
                bannerLeft.push(
                    <div key = {index} className={styles.input_address_box}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('address', {
							rules: [{
								required: !addressRequire,
								message: '请输入邮箱',
							}],
						})(
							<Input placeholder={addressRequire ? "邮箱(选填)" : "邮箱(必填)"} />
						)}
						</FormItem>
					</div>
                )
            }else if(item.name == 'orgNeed'){
                bannerLeft.push(
                   <div key = {index} className={styles.input_demand_box}>
						<FormItem {...formItemLayout} hasFeedback>
							{getFieldDecorator('demand', {
                            rules: [{
								required: !orgNeedRequire,
								message: '请输入机构需求',
							}],
						})(
							<Input placeholder={orgNeedRequire ? "机构需求(选填)" : "机构需求(必填)"} />
						)}
						</FormItem>
					</div>
                )
            }
        }
    })
	/*<div className={styles.common_logo}></div>*/

	return  (
		<div className="saas_registered">
			<div className={styles.saas_registered_box}>
				<p className={styles.common_company} style={{paddingTop : '40px'}}>闪闪管家</p>
				<div className={styles.common_company_info}>一站式早教管理云平台</div>
				<div className={styles.box_content}>
                    {bannerLeft}
				</div>
				<div id="registered_pc" className={styles.registration} onClick={applicationRegistration}>申请注册</div>
				<div className={styles.login_base_box}>
					<div className={styles.login_text} onClick={() => login()}>已有账号，直接
						<div className={styles.login} onClick={() => login()}>登录</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Form.create({})(RegisteredComponent);
