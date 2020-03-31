import React from 'react';
import { connect } from 'dva';
import VeryCodeButtonComponent from '../../../components/common/very-code-button/VeryCodeButtonComponent';

/*
 * 发送验证码的按钮组件
 * onClick 点击时的事件主要是为了获取手机号  实现如下
 * dispatch({
 *   type: 'veryCodeButtonModel/sendVerifyCode'
 *   payload: {mobile: '135********'}
 * });
 */
function VeryCodeButton({dispatch, veryCodeButtonModel, onClick, className, style, btnType,}) {

    let {waitTime,} = veryCodeButtonModel;

    let componentProps = {
        waitTime,
        onClick, className, style, btnType,
    };
    return (
        <VeryCodeButtonComponent {...componentProps} />
    );
}

function mapStateToProps({ veryCodeButtonModel }) {
  return { veryCodeButtonModel };
}

export default connect(mapStateToProps)(VeryCodeButton);
