import React, {PropTypes} from 'react';
import { connect } from 'dva';
import LoginComponent from '../../../components/login/login-page/LoginComponent';
import FreeTrailModal from '../../../components/login/login-page/FreeTrailModal';                                   //免费试用表单
import PassWordRecoveryFirstStepModal from '../../../components/login/login-page/PassWordRecoveryFirstStepModal';   //密码重置表单第一步
import PassWordRecoverySecondStepModal from '../../../components/login/login-page/PassWordRecoverySecondStepModal'; //密码重置表单第二步

function LoginPage({dispatch, loginPageModel}) {

    let {
        account,
        password,
        loginType,
        loginModalVisible,
        loading,
        errMsg,
        tenantSeelctVisible,
        tenantList,

        /*免费试用表单*/
        freeTrailModalVisible,                          //免费试用modal是否显示
        freeTrailModalButtonLoading,                    //免费试用modal按钮是否在加载状态
        freeTrailModalSchoolTypeData,                   //免费试用modal选择机构类型下拉列表数据

        /*密码重置第一步表单*/
        passWordRecoveryFirstStepModalVisible,          //密码重置第一步modal是否显示
        passWordRecoveryFirstStepModalButtonLoading,    //密码重置第一步modal按钮是否在加载状态
        mobileAndCodeObject,                            //保存手机号和验证码

        /*密码重置第二步表单*/
        passWordRecoverySecondStepModalVisible,         //密码重置第二步modal是否显示
        passWordRecoverySecondStepModalButtonLoading,   //密码重置第二步modal按钮是否在加载状态
        tenantArray,                                    //租户下拉列表数组

    } = loginPageModel;

    function onLoginSubmit(account, password) {
        dispatch({
            type: 'loginPageModel/onLogin',
            payload: {
                account, password
            }
        });
    }

    /*选择商户时*/
    function tenantSelect(record) {
        if(record.activeStatus == '1') {
            dispatch({
                type: 'loginPageModel/onLogin',
                payload: {
                    account, password,
                    tenantId: record.tenantId,
                }
            });
        } else {
            dispatch({
                type : 'accountActiveModel/show',
                payload : {
                    tenantId: record.tenantId,
                    account, password,
                }
            });
        }
    }

    function closeTenantSelect() {
        dispatch({
            type : 'loginPageModel/closeTenantSelect',
        });
    }

    /*免费试用表单*/
        /*打开免费试用modal获取机构类型成功后打开modal*/
        let OpenFreeTrailModal = function(){
            dispatch({
                type:'loginPageModel/GetSchoolType',
            });
        }

        /*免费试用modal提交*/
        let FreeTrailModalSubmit = function(data){
            dispatch({
                type:'loginPageModel/SendFreeTrailRequest',
                payload:{
                    ...data
                }
            });
        }

        /*关闭免费试用modal*/
        let FreeTrailModalCancel = function(){
            dispatch({
                type:'loginPageModel/updateState',
                payload:{
                    freeTrailModalVisible : false
                }
            })
        }

    /*密码重置第一步表单*/
        /*打开密码重置第一步modal*/
        let OpenPasswordRecoveryModal = function(){
            dispatch({
                type:'loginPageModel/updateState',
                payload:{
                    passWordRecoveryFirstStepModalVisible : true
                }
            })
        }

        /*点击发送验证码*/
        let PassWordRecoveryFirstStepModalGetVeryCode = function(mobile){
            dispatch({
                type:'veryCodeButtonModel/sendVerifyCode',
                payload:{
                    mobile
                }
            });
        }

        /*密码重置modal提交*/
        let PassWordRecoveryFirstStepModalSubmit = function(data){
            dispatch({
                type:'loginPageModel/PassWordRecoveryFirstStep',
                payload:{
                    ...data
                }
            });
        }

        /*关闭密码重置modal*/
        let PassWordRecoveryFirstStepModalCancel = function(){
            dispatch({
                type:'loginPageModel/updateState',
                payload:{
                    passWordRecoveryFirstStepModalVisible : false,
                }
            })
        }

    /*密码重置第二步表单*/
        /*密码重置第二步modal提交*/
        let PassWordRecoverySecondStepModalSubmit = function(data){
            dispatch({
                type:'loginPageModel/PassWordRecoverySecondStep',
                payload:{
                    ...data,
                    ...mobileAndCodeObject
                }
            });
        }

        /*关闭密码重置modal*/
        let PassWordRecoverySecondStepModalCancel = function(){
            dispatch({
                type:'loginPageModel/updateState',
                payload:{
                    passWordRecoverySecondStepModalVisible : false,
                }
            })
        }

    let loginpageProps = {
        loginType,
        loginModalVisible,
        onLoginSubmit,
        loading,
        errMsg,
        tenantSeelctVisible,
        tenantList,
        tenantSelect,
        OpenFreeTrailModal,             //打开免费试用表单
        OpenPasswordRecoveryModal,      //打开密码重置表单

        closeTenantSelect,
    };

    /*免费试用表单属性*/
    let freeTrailModalProps = {
        freeTrailModalVisible,              //免费试用modal是否显示
        freeTrailModalButtonLoading,        //免费试用modal按钮是否在加载状态
        freeTrailModalSchoolTypeData,                   //免费试用modal选择机构类型下拉列表数据

        FreeTrailModalSubmit,               //免费试用提交
        FreeTrailModalCancel,               //免费试用modal关闭
    }

    /*密码重置第一步表单属性*/
    let passWordRecoveryFirstStepModalProps = {
        passWordRecoveryFirstStepModalVisible,          //密码重置第一步modal是否显示
        passWordRecoveryFirstStepModalButtonLoading,    //密码重置第一步modal按钮是否在加载状态

        PassWordRecoveryFirstStepModalGetVeryCode,      //点击获取验证码
        PassWordRecoveryFirstStepModalSubmit,           //密码重置第一步提交
        PassWordRecoveryFirstStepModalCancel,           //密码重置第一步modal关闭
    }

    /*密码重置第二步表单属性*/
    let passWordRecoverySecondStepModalProps = {
        passWordRecoverySecondStepModalVisible,          //密码重置第二步modal是否显示
        passWordRecoverySecondStepModalButtonLoading,    //密码重置第二步modal按钮是否在加载状态
        tenantArray,                                     //租户下拉列表数组

        PassWordRecoverySecondStepModalSubmit,           //密码重置第二步提交
        PassWordRecoverySecondStepModalCancel,           //密码重置第二步modal关闭
    }

    return (
        <div>
            <LoginComponent {...loginpageProps} />
            { freeTrailModalVisible == true ? <FreeTrailModal {...freeTrailModalProps} /> : null }
            { passWordRecoveryFirstStepModalVisible == true ? <PassWordRecoveryFirstStepModal {...passWordRecoveryFirstStepModalProps}/> : null }
            { passWordRecoverySecondStepModalVisible == true ? <PassWordRecoverySecondStepModal {...passWordRecoverySecondStepModalProps}/> : null }
        </div>
    );
}


function mapStateToProps({ loginPageModel }) {
  return { loginPageModel };
}

export default connect(mapStateToProps)(LoginPage);
