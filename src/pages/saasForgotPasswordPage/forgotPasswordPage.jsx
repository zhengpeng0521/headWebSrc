import React from 'react';
import { connect } from 'dva';
import ForgotPasswordComponent 	from '../../components/loginComponent/saasForgotPassword/ForgotPasswordComponent';
import styles from '../saasLoginLess/LoginPage.less';

function ForgotPasswordPage({dispatch, saas_forgot_password}) {

    let {
        initData,           //window._init_data
		codeStateString,
		codeDisabled,
		touchCode,
		nextStep,
		previousStep,
		MerchantList,

    } = saas_forgot_password;

	function dp(name, param) {
		dispatch({
			type : `saas_forgot_password/${name}`,
			payload : {
				...param
			}
		})
    }

	let props = {
		dp,
        initData,           //window._init_data
		codeStateString,
		codeDisabled,
		touchCode,
		nextStep,
		previousStep,
		MerchantList,
	};

    let bgImgUrl = !!initData && !!initData.bgImg ? `url(${initData.bgImg}) 0% 0% / cover no-repeat` : 'url(https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5) 0% 0% / cover no-repeat';

    return (
		<div className={styles.login_base_box} style = {{ background : bgImgUrl }}>
			<ForgotPasswordComponent {...props} />
            { !!initData && !!initData.tenantId ?
                <div className={styles.foot_content}>
                    <div className={styles.foot_text}>技术支持：杭州闪宝科技有限公司</div>
                    <div className={styles.foot_text}>服务热线： 0571-56000069      联系地址： 杭州市滨江区海威大厦18F</div>
                </div>
                :
                <div className={styles.foot_content}>
                    <div className={styles.foot_text}>杭州闪宝科技有限公司  浙ICP备1501166号-1</div>
                    <div className={styles.foot_text}>联系方式： 0571-56000069      联系地址： 杭州市滨江区海威大厦18F</div>
                </div>
            }
		</div>
    );
}


function mapStateToProps({ saas_forgot_password }) {
  return { saas_forgot_password };
}

export default connect(mapStateToProps)(ForgotPasswordPage);
