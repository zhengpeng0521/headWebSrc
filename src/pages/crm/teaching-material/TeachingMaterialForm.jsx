import React from 'react';
import { connect } from 'dva';
import TeachingMaterialFormComponent from '../../../components/crm/teaching-material/TeachingMaterialFormComponent';

function TeachingMaterialForm({dispatch, teachingMaterialFormModel}) {

	let {
        visible,                 //表单窗口是否显示
        loading,
        paymentList,
        formData,
        createOrgId,

		teachingMaterialBtnLoading
    } = teachingMaterialFormModel;

    //关闭表单界面
    function onClose() {
        dispatch({
           type: 'teachingMaterialFormModel/onClose',
        });
    }

    function refreshList() {
        dispatch({
           type: 'teachingMaterialModel/queryList',
        });
    }

    //关闭表单界面
    function onSubmit(params, closeForm) {
        dispatch({
           type: 'teachingMaterialFormModel/onSubmit',
            payload: {
                params,
                afterSubmit: refreshList,
                closeForm,
            }
        });
    }

    let componProps = {
        visible,loading,
        paymentList,
        formData,
        createOrgId,
		teachingMaterialBtnLoading,
        onClose,onSubmit,
    };

    return (
        <TeachingMaterialFormComponent {...componProps} />
    );
}

function mapStateToProps({ teachingMaterialFormModel }) {
  	return { teachingMaterialFormModel };
}

export default connect(mapStateToProps)(TeachingMaterialForm);
