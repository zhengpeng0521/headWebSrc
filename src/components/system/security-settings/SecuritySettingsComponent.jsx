import React from 'react';
import { Tabs , Form , Modal , Button , Input , Select , Steps , message } from 'antd';
import styles from './SecuritySettingsComponent.less';
import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';
import { AlertModal } from '../../../components/common/new-component/NewComponent';
import CountDown from '../../../components/common/count-down/CountDown';
import VeryCodeButton from '../../../pages/common/very-code-button/VeryCodeButton';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const Step = Steps.Step;

function SecuritySettingsComponent({
    phoneNumState,
    tel,
    settingBtn,
    settingModalShow,
    closeSettingModal,
    submitSettingModal,
    seetingStep,
    tiedupShow,
    tiedupFun,
    CancelTiedup,
    ModalOperation,
    getVcode,
    havePhone,
    checkPhone,
    haveSettingTel,
    checkSettingPhone,

    sendVeryCode,

    form : {
        getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
        getFieldsError,
    },
}) {

    let formItemLayout = {
		labelCol   : { span : 3 },
		wrapperCol : { span : 5 }
	};

    let formItemLayout1 = {
		labelCol   : { span : 4 },
		wrapperCol : { span : 20 }
	};
    //
    function commitSettingModal(){

        let tel = getFieldValue('settingTel')
        let value = getFieldValue('settingVal')
        if(!tel){
            return message.warn('请填写手机号');
        }
        if(!value){
            return message.warn('请填写验证码');
        }

        submitSettingModal(tel,value);

    }
    //整数
    function checkNum(rule, value, callback){
        if(value && value != '') {
	      if(!(/^[0-9]\d*$/.test(value))){
	          callback('请填写的整数');
	        } else {
	          callback();
	        }
	    } else {
	      callback();
	    }
    }

    //第一步下一步
    function ModalOperation1(){
        let value = {
            tel : tel,
            vCode : getFieldValue('FirstVal'),
        }
        if(!value.tel){
            return message.warn('请填写手机号');
        }
        if(!value.vCode){
            return message.warn('请填写验证码');
        }

        ModalOperation('first_next',value);
    }

    //第二步下一步
    function ModalOperation2(){
        let values = {
            tel : getFieldValue('SecondTel'),
            vCode : getFieldValue('SecondVal'),
        }

        if(!values.tel){
            return message.warn('请填写手机号');
        }
        if(!values.vCode){
            return message.warn('请填写验证码');
        }

        ModalOperation('second_next',values);
    }


    let AlertModalProps = {
        visible : settingModalShow,                //提示框是否显示
        title : '设置安全认证手机',                    //提示框标题
        footer : [
            <Button key = "cancel" type = "ghost" onClick = { closeSettingModal }>取消</Button>,
            <Button key = "submit" type = "primary"
                    style = {{ marginLeft:10 }}
                    onClick = { commitSettingModal }>提交</Button>
        ],
        onCancel : closeSettingModal,
        className : 'set_security_mobile_modal'
    }


    let footer = [];
    if(seetingStep == '0'){
        footer = [
            <Button key="submit" type="primary"
                        onClick={ModalOperation1}
                        style={{marginLeft:10}}>下一步</Button>
        ];
    }else if(seetingStep == '1'){
        footer = [
            <Button key="submit" type="primary"
                    onClick={ModalOperation2}
                    style={{marginLeft:10}}>下一步</Button>
        ];
    }else if(seetingStep == '2'){
        footer = [
            <Button key="submit" type="primary"
                    onClick = {CancelTiedup}
                    style={{marginLeft:10}}>完成</Button>
        ];
    }

    let tiedupModalProps = {
        visible : tiedupShow,
        title : '修改安全手机号',
        footer : footer,
        onCancel : CancelTiedup,
        maskClosable : false,
        className : 'set_security_mobile_modal'
    }

    //
    function fristVcode(){
        let value = tel;
        sendVeryCode(value);
    }

    //剑圣 15868129344
    function secondVcode(){
        let value = getFieldValue('SecondTel');
        sendVeryCode(value);
    }

    function settingVcode(){
        let value = getFieldValue('settingTel');
        sendVeryCode(value)
    }

    let telState = tel.substr(0, 3) + '****' + tel.substr(7);

    //第二步 手机号码onChange
    function changeSecondTel(e){
        let value = e.target.value;
        if(!(/^1[0-9]{10}$/.test(value))){
            checkPhone(false)
        }else{
            checkPhone(true)
        }
    }

    //设置安全手机号
    function changeSettingTel(e){
        let value = e.target.value;
        if(!(/^1[0-9]{10}$/.test(value))){
            checkSettingPhone(false)
        }else{
            checkSettingPhone(true)
        }
    }

    //第一步
//    {!!false &&<CountDown onClick={ fristVcode } time={ 5 }/>}
    let FirstStep = [];
    FirstStep.push(
        <Form key = 'first'>
            <FormItem
                { ...formItemLayout1 }
                label = "原手机"
            >
                { getFieldDecorator('FirstTel' , {
                    initialValue : telState,
                    rules : [
                        { required : true },
                    ],
                })(
                    <Input disabled size = 'default' style = {{ width : '100%' }} />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout1 }
                label = "验证码"
            >
                { getFieldDecorator('FirstVal' , {
                    initialValue : '',
                    rules : [
                        { required : true , message : '请输入验证码'},
                        { validator: checkNum },
                    ],
                })(
                    <div style = {{ display : 'flex' , flexWrap : 'nowrap' , justifyContent : 'space-between' }}>
                        <Input size = 'default' style = {{ width : '70%' , marginRight : 20 }} placeholder = '请输入验证码'/>
                        <VeryCodeButton onClick={fristVcode}  />
                    </div>
                )}
            </FormItem>
        </Form>
    )

    //第二步
//    { havePhone ?
//        <CountDown onClick={ secondVcode } time={ 60 }/>
//        :
//        <Button type="primary" disabled >获取验证码</Button>
//     }
    let SecondStep = [];
    SecondStep.push(
        <Form key = 'second'>
            <FormItem
                { ...formItemLayout1 }
                label = "新手机"
            >
                { getFieldDecorator('SecondTel' , {
                    initialValue : '',
                    rules : [
                        { required : true , message : '请输入新手机号'},
                    ],
                })(
                    <Input size = 'default' style = {{ width : '100%' }} onChange={ (e) => changeSecondTel(e) } placeholder = '请输入新手机号'/>
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout1 }
                label = "验证码"
            >
                { getFieldDecorator('SecondVal' , {
                    initialValue : '',
                    rules : [
                        { required : true , message : '请输入验证码' },
                        { validator: checkNum },
                    ],
                })(
                    <div style = {{ display : 'flex' , flexWrap : 'nowrap' , justifyContent : 'space-between' }}>
                        <Input size = 'default' style = {{ width : '70%' }} placeholder = '请输入验证码'/>
                        <VeryCodeButton onClick={secondVcode} />
                    </div>
                )}
            </FormItem>
        </Form>
    )
    //第三步
    let ThirdStep = [];
    ThirdStep.push(
        <div key = 'third' className = {styles.tiedupDiv}>
            改绑成功
        </div>
    )

//    { haveSettingTel ?
//        <CountDown onClick={ settingVcode } time={ 60 }/>
//        :
//        <Button type="primary" disabled >获取验证码</Button>
//    }
    return(
        <div style = {{ marginLeft : -30 , width : 1025 , minWidth : 1025 }}>
            { phoneNumState == 10000 ?
                <div style = {{ padding : '0 20px' }}>
                    <p style={{ marginBottom : '40px' , color : 'red' }}>您还未设置安全认证手机号！此号码极其重要，将保障账号、资金等安全。</p>
                    <Button type="primary" onClick={settingBtn}>设置安全认证手机</Button>
                </div>
                :
                phoneNumState == 9000 ?
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label = "安全认证手机号"
                        style = {{ marginBottom : 30 }}
                    >
                        { getFieldDecorator('tel' , {
                            initialValue : telState,

                        })(
                            <Input size = 'default' disabled/>
                        )}
                    </FormItem>
                    <Button type="primary" style = {{ marginLeft : 30 }} onClick={tiedupFun}>改绑</Button>
                </Form>
                :
                null
            }
            <Modal {...AlertModalProps}>
                <Form>
                    <FormItem
                        { ...formItemLayout1 }
                        label = "手机号"
                    >
                        { getFieldDecorator('settingTel' , {
                            initialValue : undefined,
                            rules : [
                                { required : true , message : '请输入手机号'},
                            ],
                        })(
                            <Input size = 'default' style = {{ width : '100%' }} onChange={ (e) => changeSettingTel(e) } placeholder = '请输入手机号'/>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout1 }
                        label = "验证码"
                    >
                        { getFieldDecorator('settingVal' , {
                            initialValue : undefined,
                            rules : [
                                { required : true , message : '请输入验证码'},
                                { validator: checkNum },
                            ],
                        })(
                            <div style = {{ display : 'flex' , flexWrap : 'nowrap' , justifyContent : 'space-between' }}>
                                <Input size = 'default' style = {{ width : '70%' }} placeholder = '请输入验证码'/>
                                <VeryCodeButton onClick={ settingVcode } />
                            </div>
                        )}
                    </FormItem>
                </Form>
            </Modal>
            { tiedupShow ?
                <Modal {...tiedupModalProps}>
                    <div className='ws_sys_safety_mobile_change_bind'>
                        <Steps current = { seetingStep }>
                            <Step title="验证" />
                            <Step title="新信息" />
                            <Step title="改绑成功" />
                        </Steps>
                        <Tabs defaultActiveKey='0' activeKey={ seetingStep + '' }  size="small">
                            <TabPane tab="123" key='0'>{ seetingStep == '0' ? FirstStep  : null }</TabPane>
                            <TabPane tab="321" key='1'>{ seetingStep == '1' ? SecondStep : null }</TabPane>
                            <TabPane tab="333" key='2'>{ seetingStep == '2' ? ThirdStep : null }</TabPane>
                        </Tabs>
                    </div>
                </Modal>
                :
                null
            }
        </div>
    );
}

export default Form.create()(SecuritySettingsComponent);
