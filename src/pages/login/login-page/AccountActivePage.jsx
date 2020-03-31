import React, {PropTypes} from 'react';
import { connect } from 'dva';
import AccountActiveComponent from '../../../components/login/login-page/AccountActiveComponent';

function AccountActivePage({dispatch, accountActiveModel}) {

    let {visible, loading, tenantId, account, password,codeBtnLoading,} = accountActiveModel;

    /*发送验证码*/
    function sendVerifyCode(mobile) {
        dispatch({
            type: 'veryCodeButtonModel/sendVerifyCode',
            payload: {
                mobile,
            }
        });
    }

    /*激活账号*/
    function accountActiveAction(params) {
        dispatch({
            type: 'accountActiveModel/accountActiveAction',
            payload: {
                ...params,
            }
        });
    }

     function closeAccountActive() {
        dispatch({
            type: 'accountActiveModel/closeAccountActive',
        });
    }

    let componentProps = {
        visible, loading, tenantId, account, password,codeBtnLoading,
        sendVerifyCode,accountActiveAction,closeAccountActive,
    };
    return (
        <AccountActiveComponent {...componentProps} />
    );
}

AccountActivePage.propTypes = {
  accountActiveModel: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ accountActiveModel }) {
  return { accountActiveModel };
}

export default connect(mapStateToProps)(AccountActivePage);
