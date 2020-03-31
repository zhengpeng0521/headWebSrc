import React from 'react';
import { connect } from 'dva';
import LoginComponent 		from '../../components/loginComponent/saasLogin/LoginComponent';
import styles from '../saasLoginLess/LoginPage.less';

function LoginPage({dispatch, saas_login}) {

    let {
        initData,       //window._init_data
		loginAccount,
		loginPassword,
		tenantList,
		showTenantModal,
    } = saas_login;

	function dp(name, param) {
		dispatch({
			type : `saas_login/${name}`,
			payload : {
				...param
			}
		})
	}

	let props = {
		dp,
        initData,       //window._init_data
		loginAccount,
		loginPassword,
		tenantList,
		showTenantModal,
	};

    let bgImgUrl = !!initData && !!initData.bgImg ? `url(${initData.bgImg}) 0% 0% / cover no-repeat` : 'url(https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5) 0% 0% / cover no-repeat';

    return (
		<div className={styles.login_base_box} style = {{ background : bgImgUrl }}>
			<LoginComponent {...props} />
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


function mapStateToProps({ saas_login }) {
  return { saas_login };
}

export default connect(mapStateToProps)(LoginPage);
