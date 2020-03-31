import React , { PropTypes }from 'react';
import styles from './Registeredh5Component.less';
import { Link } from 'dva/router';
import positionArr from '../saasRegistered/CascaderAddressOptions'
import {Input,Icon,Cascader,Carousel,message, Form, Select,} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

function RegisteredComponent ({

	dp,
	codeDisabled,
	codeStateString,
	touchCode,
	submitSuccess,
	richText,
	schoolTypeArr,
    formConfiguration,
    formList,
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

	var stringReg = /^(?=.*\d.*\b)/;
	//检测是否输入手机以及联系人
	if((data.presonMobile&&data.presonMobile.length > 0&&data.presonMobile!=undefined) && (data.preson&&data.preson.length > 0&&data.preson!=undefined)) {

		let nameCheck = false;
		let phoneCheck = false;

		//姓名验证
		let name = data.preson&&data.preson.replace(/\s/g, "");

		if(name.length > 0) {
			if (stringReg.test(name)) {
				nameCheck = false;
			} else {
				nameCheck = true;
			}
		}
		//手机验证
		let phone = data.presonMobile&&data.presonMobile.replace(/\s/g, "");
		if(phone.length > 0) {
			if (!reg.test(phone)) {
				phoneCheck = false;
			} else {
				phoneCheck = true;
			}
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
				dp('updateState', {codeStateString : '重新获取', codeDisabled : false, touchCode : false})
			} else {
				if(clearTime == false) {
					clearTime = true;
					dp('getVerificationCode', {phone : data.presonMobile&&data.presonMobile.replace(/\s/g, "")});
				}
				dp('updateState', {codeStateString : `${s}s后重发`, codeDisabled : true, touchCode : true})
			}
		}, 1000);
	}

	//点击外链
	function touchLink() {
		window.open(richText.link || 'www.ishansahn.com');
	}

	const formItemLayoutCode = {
	  	wrapperCol: { span: 24 },
	};

	const formItemLayout = {
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 12 },
		},
	};

//	let sty = codeDisabled ? styles.h5_code_f1f1f1 : 'vertifyBtn';
	let sty = codeDisabled ? styles.h5_code_f1f1f1 : styles.h5_code_5d9cec;

	let over = submitSuccess ? {
		overflow :'hidden',
	} : '';

	let props ={
		dp,
		submitSuccess,
	};
    let bannerLeft = [];
    let bannerPut = [];
    let cityRequire = true;
    let addressRequire = true;
    let orgNeedRequire = true;
    let bannerfull = formConfiguration;

    //申请注册
	function applicationRegistration(e) {
		e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            for(var item in values){
                if(item == 'orgName'){
                   if(values.orgName === undefined || values.orgName === '') {
                        return	 message.error('请填写机构名称', 2);
                    }
                }else if(item == 'preson'){
                     if(values.preson === undefined || values.preson === '') {
                        return	 message.error('请填写联系人', 2);
                    }

                }else if(item == 'presonMobile'){
                    if(values.presonMobile === undefined || values.presonMobile === '') {
                        return	 message.error('请填写联系电话', 2);
                    }
                }else if(item == 'verificationCode'){
                   if(values.verificationCode === undefined || values.verificationCode === '') {
                        return	 message.error('请填写验证码', 2);
                    }

                }else if(item == 'orgType'){
                   if(values.orgType === undefined || values.orgType === '') {
                        return	 message.error('请选择机构类型', 2);
                    }

                }else if(item == 'city'){
                    if(!cityRequire){
                        if(values.city === undefined || values.city === '') {
                            return	 message.error('请填写所在地址', 2);
                        }
                    }
                }else if(item == 'oegAddress'){
                   if(!addressRequire){
                      if(values.oegAddress === undefined || values.oegAddress === '') {
                        return	 message.error('请填写邮箱', 2);
                      }
                   }

                }else if(item == 'orgDemand'){
                    if(!orgNeedRequire){
                        if(values.orgDemand === undefined || values.orgDemand === '') {
                            return	 message.error('请填写机构需求', 2);
                        }

                    }
                }
            }
            let city = data.city;
            if(city != undefined && city.length>0){
                data.city = city.join(' ');
            }
			dp('registration', {data : data});
		});
	}
    if(bannerfull && bannerfull.length != 0){
        bannerfull && bannerfull.length > 0 && bannerfull.map(function(item ,index){
        if(item.require == "1"){
            if(item.name == 'city'){
                cityRequire = false
            }else if(item.name == 'address'){
                addressRequire = false
            }else if(item.name == 'orgNeed'){
                orgNeedRequire = false
            }
        }
        if(item.hide == "1"){
           if(item.name == 'orgName'){
                bannerLeft.push(
                  <div key={index} className={styles.h5_content_item_box} key = {index}>
						<div className={styles.h5_label}>机构名称</div>
						<div className={styles.h5_input}>
						   <FormItem {...formItemLayout}>
							  {getFieldDecorator('orgName', {

							  })(
								   <Input style={{width:'100%'}} placeholder="请输入机构名称(必填)" />
							   )}
							</FormItem>
						</div>
					</div>
                )
            }else if(item.name == 'userName'){
                bannerLeft.push(
                    <div key={index} className={styles.h5_content_item_box} key = {index}>
						<div className={styles.h5_label}>联系人</div>
						<div className={styles.h5_input}>
						   <FormItem {...formItemLayout}>
							  {getFieldDecorator('preson', {

							  })(
								   <Input style={{width:'100%'}} placeholder="请输入联系人(必填)" />
							   )}
							</FormItem>
						</div>
					</div>
                )
            }else if(item.name == 'tel'){
                bannerLeft.push(
                    <div key = {index}>
                        <div className={styles.h5_content_item_box}>
                            <div className={styles.h5_label}>联系电话</div>
                            <div className={styles.h5_input}>
                               <FormItem {...formItemLayout}>
                                  {getFieldDecorator('presonMobile', {

                                  })(
                                       <Input style={{width:'100%'}} placeholder="请输入联系电话(必填)" type="number" />
                                   )}
                                </FormItem>
                            </div>
					   </div>

                        <div className={styles.h5_content_item_box}>
                            <div className={styles.h5_label}>验证码</div>
                            <div className={styles.h5_input_code}>
                                <FormItem {...formItemLayoutCode}>
                                    {getFieldDecorator("verificationCode", {

                                    })(
                                        <Input placeholder="请输入验证码" type="number" />
                                    )}
                                </FormItem>
                            </div>
							<div className={sty} onClick={() => getVerification()}>{codeStateString}</div>
                        </div>
                    </div>
                )
            }else if(item.name == 'city'){
                bannerLeft.push(
                     <div key={index}  className={styles.h5_content_item_box} key = {index}>
						<div className={styles.h5_label}>详细地址</div>
						<div className={styles.h5_input}>
						   <FormItem {...formItemLayout}>
							  {getFieldDecorator('city', {
                            })(
                               <Cascader style={{width:'100%',height: '87px',width: '100%',fontSize: '28px',border: '0',}} placeholder={cityRequire ? "详细地址(选填)" : "详细地址(必填)"} options={positionArr} changeOnSelect size='default'/>
                            )}
							</FormItem>
						</div>
					</div>
                )
            }else if(item.name == 'orgType'){
                bannerLeft.push(
                    <div key = {index}>
                        <div className={styles.h5_clearance}></div>

                        <div className={styles.h5_content_item_box}>
                            <div className={styles.h5_label}>机构类型</div>
                            <div className={styles.h5_input}>
                               <FormItem {...formItemLayout}>
                                  {getFieldDecorator('orgType', {

                                  })(
                                        <Select style={{width:'100%'}}
                                            placeholder="请选择机构类型(必填)"
                                        >
                                            {
                                                schoolTypeArr&&schoolTypeArr.map((item, index) => {
                                                    return <Option key={index} value={item.value} className={styles.h5_option}>{item.name}</Option>
                                                })
                                            }
                                        </Select>
                                  )}
                                </FormItem>
                            </div>
                        </div>
                    </div>
                )
            }else if(item.name == 'address'){
                bannerLeft.push(
                    <div key={index}  className={styles.h5_content_item_box} key = {index}>
						<div className={styles.h5_label}>邮箱</div>
						<div className={styles.h5_input}>
						   <FormItem {...formItemLayout}>
							  {getFieldDecorator('oegAddress', {

							  })(
								   <Input style={{width:'100%'}} placeholder={addressRequire ? "请输入邮箱(选填)" : "请输入邮箱(必填)"} />
							   )}
							</FormItem>
						</div>
					</div>
                )
            }else if(item.name == 'orgNeed'){
                bannerLeft.push(
                  <div key={index}  className={styles.h5_content_item_box} key = {index}>
						<div className={styles.h5_label}>机构需求</div>
						<div className={styles.h5_input}>
						   <FormItem {...formItemLayout}>
							  {getFieldDecorator('orgDemand', {

							  })(
								   <Input style={{width:'100%'}} placeholder={orgNeedRequire ? "机构需求(选填)" : "机构需求(必填)"} />
							   )}
							</FormItem>
						</div>
					</div>
                )
            }
        }
    })
    }

    var num = 0;

   formList  && formList.length>0 && formList.map(function(item,index){

       (item.bannerImg != '') && (item.bannerImg != null) ? num++ : num;

        bannerPut.push(
            <div key = {index} style={{width:'100%',height:'280px'}}>
                 <a href={item.bannerUrl} style={{width:'100%',height:'280px'}}>
                    <div style={{background:'url('+item.bannerImg+') no-repeat',backgroundSize:'100% 100%',width:'100%',height:'100%'}}>
                    </div>
                </a>
            </div>
        )
    });
    if(window._initcarousel == undefined) {
        window._initcarousel = true;
        bannerPut.push(
            <div key='-1' style={{width:'100%',height:'280px'}}></div>
        );
    }

    if(bannerPut && bannerPut.length == 0) {
        bannerPut.push(
            <div key='-1' style={{width:'100%',height:'280px'}}></div>
        );
    }
	return  (
		<div className="saas_registered_h5" style={submitSuccess ? {overflow :'hidden'} : {}}>
			<div className={styles.h5_registered_box}>
                {(num > 0) ?
                    <div className={styles.h5_banner}
                    >
                        <Carousel autoplay dots='false' >
                            {bannerPut}
                        </Carousel>
                    </div>
                    : ''
                }
				<div className={styles.h5_clearance}></div>
				<div style={{background : 'white'}}>
					{bannerLeft}
				</div>
				<div className={styles.h5_link} onClick={() => touchLink()}>{richText&&richText.link_text || '快点我啊'}></div>
				<div id="registered" className={styles.h5_registered} onClick={applicationRegistration}>申请注册</div>
				{submitSuccess ? <SuccessComponent {...props}/> : ''}
			</div>
		</div>
	)
}

function SuccessComponent ({
	dp,
	submitSuccess,
}) {

	function touchGoHome() {
		if(returnUrl&&returnUrl.length > 0) {
			window.location.href = returnUrl;
		} else {
			window.location.href = 'http://www.ishanshan.com';
		}
	}

	return (
		<div className={styles.h5_mask}>
			<div className={styles.h5_success}>
                <div className={styles.h5_icon}></div>
                <div className={styles.h5_success_text}>长按关注，获取更多招生神奇</div>
                <div className={styles.h5_success_text}>闪闪小二将在24h内与您会师</div>
                <div className={styles.h5_success_text}>敬请期待</div>
                <div className={styles.h5_go_home} onClick={() => touchGoHome()}>知道了</div>
			</div>
		</div>
	)
}

export default Form.create({})(RegisteredComponent);
