import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import SecuritySettingsComponent from '../../../components/system/security-settings/SecuritySettingsComponent';

function SecuritySettingsPage({ dispatch, securitySettingsModel }){
    let {
        phoneNumState,
        tel,
        settingModalShow,
        seetingStep,
        tiedupShow,
        vCodeSate,
        havePhone,
        haveSettingTel,

    } = securitySettingsModel;

    //设置安全手机号
    function settingBtn(){
        dispatch({
            type:'securitySettingsModel/updateState',
            payload:{
                settingModalShow : true,
            }
        });
    }

    //关闭安全设置手机号
    function closeSettingModal(){
        dispatch({
            type:'securitySettingsModel/updateState',
            payload:{
                settingModalShow : false,
            }
        });
        window.very_code_button_status_stop = true;
    }

    //提交设置安全手机号
    function submitSettingModal(tel,value){
        dispatch({
            type: 'securitySettingsModel/submitAction',
            payload : {
                tel : tel,
                vCode : value,
                behavior : 0,

            },
        });
        window.very_code_button_status_stop = true;
    }

    //改绑弹框
    function tiedupFun(){
        dispatch({
            type: 'securitySettingsModel/updateState',
            payload : {
                tiedupShow : true,
            },
        });
    }

    //关闭改绑弹框
    function CancelTiedup(){
        dispatch({
            type: 'securitySettingsModel/updateState',
            payload : {
                tiedupShow : false,
                seetingStep : 0,
                havePhone : false
            },
        });
        dispatch({
            type : 'securitySettingsModel/getCheckPhoneNum',
            payload : {

            }
        });
        window.very_code_button_status_stop = true;
    }

    //下一步
    function ModalOperation(type,value){
        if( type == 'first_next'){  //第一步>下一步
            dispatch({
                type: 'securitySettingsModel/nextStep',
                payload : {
                    ...value,
                    behavior : 1,
                    step : 0,
                },
            });
            window.very_code_button_status_stop = true;
//            if( vCodeSate == 1){
//                dispatch({
//                    type: 'securitySettingsModel/updateState',
//                    payload : {
//                        seetingStep : 1,
//                    },
//                });
//            }
        }else if( type == 'second_next'){  //第二步>下一步
            dispatch({
                type: 'securitySettingsModel/nextStep1',
                payload : {
                    ...value,
                    behavior : 1,
                    step : 1,
                },
            });
//            if( vCodeSate == 2){
//                dispatch({
//                    type: 'securitySettingsModel/updateState',
//                    payload : {
//                        seetingStep : 2,
//                    },
//                });
//            }
        }
    }

    //获取验证码
    function getVcode(value){
        dispatch({
            type: 'securitySettingsModel/verificationCodeFun',
            payload : {
                mobile : value,
            },
        });
    }

    function sendVeryCode(mobile) {
        dispatch({
            type: 'veryCodeButtonModel/sendVerifyCode',
            payload : {
                mobile,
            },
        });
    }

    //
    function checkPhone(value){
        dispatch({
            type: 'securitySettingsModel/updateState',
            payload : {
                havePhone : value,
            },
        });
    }

    function checkSettingPhone(value){
        dispatch({
            type: 'securitySettingsModel/updateState',
            payload : {
                haveSettingTel : value,
            },
        });
    }

    let SecuritySettingsProps = {
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
    };


    return (
        <SecuritySettingsComponent { ...SecuritySettingsProps } />
    )
};

function mapStateToProps ({ securitySettingsModel }){
	return { securitySettingsModel };
};

export default connect( mapStateToProps )( SecuritySettingsPage );
