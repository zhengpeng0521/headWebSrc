import React from 'react';
import { connect } from 'dva';
import AccountCardFormComponent from '../../../components/system/account-card/AccountCardFormComponent';

function AccountCardForm({dispatch, accountCardFormModel}) {

	let {
        visible,                 //表单窗口是否显示
        loading,
        paymentList,
        formData,
        selectValue,
        orgSelectVisible,

    } = accountCardFormModel;

    //关闭表单界面
    function onClose() {
        dispatch({
           type: 'accountCardFormModel/onClose',
        });
    }

    function refreshList() {
        dispatch({
           type: 'accountCardModel/queryList',
        });
    }

    //关闭表单界面
    function onSubmit(params, closeForm) {
        dispatch({
           type: 'accountCardFormModel/onSubmit',
            payload: {
                params,
                closeForm,
                afterSubmit: refreshList,
            }
        });
    }

    function openSelectOrg() {
        dispatch({
           type: 'accountCardFormModel/updateState',
            payload: {
                orgSelectVisible: true,
            }
        });
    }

    function closeOrgSelect() {
        dispatch({
           type: 'accountCardFormModel/updateState',
            payload: {
                orgSelectVisible: false,
            }
        });
    }

    function onSelectFun(key){
        dispatch({
           type: 'accountCardFormModel/updateState',
            payload: {
                selectValue: key,
            }
        });
    }
    let componProps = {
        visible,loading,
        paymentList,
        formData,
        onClose,onSubmit,

        orgSelectVisible,
        openSelectOrg,
        closeOrgSelect,
        selectValue,
        onSelectFun,
    };

    return (
        <AccountCardFormComponent {...componProps} />
    );
}

function mapStateToProps({ accountCardFormModel }) {
  	return { accountCardFormModel };
}

export default connect(mapStateToProps)(AccountCardForm);
