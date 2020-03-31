import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import HeaderLoginUserInfoComponent from '../../../components/common/header-login-user-info/HeaderLoginUserInfoComponent';
import PassWordChangeForm from '../../../components/common/header-login-user-info/PassWordChangeForm';

function HeaderLoginUserInfo({dispatch, headerLoginUserInfoModel}) {

    let {
        userImg,userName,

        /*修改密码modal*/
        passWordChangeModalVisible,             //修改密码modal是否显示
        passWordChangeModalButtonLoading,       //修改密码modal按钮加载状态

    } = headerLoginUserInfoModel;

    function loginOut() {

    }

    function updatePassword() {

    }

    /*修改密码点击事件弹出表单*/
    function ChangePassWord(){
        dispatch({
            type:'headerLoginUserInfoModel/updateState',
            payload:{
                passWordChangeModalVisible : true
            }
        });
    }

    /*密码重置提交*/
    function PassWordChangeModalSubmit(data){
        dispatch({
            type:'headerLoginUserInfoModel/ChangePassWord',
            payload:{
                ...data
            }
        });
    }

    /*密码重置modal关闭*/
    function PassWordChangeModalCancel(){
        dispatch({
            type:'headerLoginUserInfoModel/updateState',
            payload:{
                passWordChangeModalVisible : false,
                passWordChangeModalButtonLoading : false,
            }
        });
    }

    let headerLoginUserInfoProps = {
        userImg,userName,
        loginOut,
        updatePassword,
        ChangePassWord,         //修改密码点击事件
    };

    /*修改密码表单属性*/
    let passWordChangeFormProps = {
        passWordChangeModalVisible,             //修改密码modal是否显示
        passWordChangeModalButtonLoading,       //修改密码modal按钮加载状态

        PassWordChangeModalSubmit,              //密码重置提交
        PassWordChangeModalCancel,              //密码重置modal关闭
    };
    return (
        <div style={{float: 'right'}}>
            <HeaderLoginUserInfoComponent {...headerLoginUserInfoProps} />
            { passWordChangeModalVisible == true ? <PassWordChangeForm {...passWordChangeFormProps} /> : null }
        </div>
    );
}

function mapStateToProps({ headerLoginUserInfoModel }) {
  return { headerLoginUserInfoModel };
}

export default connect(mapStateToProps)(HeaderLoginUserInfo);
