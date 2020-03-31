import React from 'react';
import { connect } from 'dva';
import RegisteredComponent 	from '../../components/loginComponent/saasRegistered/RegisteredComponent';
import RegisteredSuccessComponent 	from '../../components/loginComponent/saasRegistered/RegisteredSuccessComponent';
import styles from '../saasLoginLess/LoginPage.less';

function RegisteredPage({dispatch, saas_registered}) {

    let {

		showRegisteredSuccress,
		codeStateString_r,
		codeDisabled,
		touchCode,
		schoolTypeArr,
        formConfiguration,

    } = saas_registered;
	function dp(name, param) {
		dispatch({
			type : `saas_registered/${name}`,
			payload : {
				...param
			}
		})
	}

	let props = {
		dp,
		showRegisteredSuccress,
		codeStateString_r,
		codeDisabled,
		touchCode,
		schoolTypeArr,
        formConfiguration,
	};

    return (
		<div className={styles.login_base_box} style = {{ background : 'url(https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5) 0% 0% / cover no-repeat' }}>
			{showRegisteredSuccress ? <RegisteredSuccessComponent {...props} /> : <RegisteredComponent {...props} /> }
            <div className={styles.foot_content}>
                <div className={styles.foot_text}>杭州闪宝科技有限公司  浙ICP备1501166号-1</div>
                <div className={styles.foot_text}>联系方式： 0571-56000069      联系地址： 杭州市滨江区海威大厦18F</div>
            </div>
		</div>
    );
}


function mapStateToProps({ saas_registered }) {
  return { saas_registered };
}

export default connect(mapStateToProps)(RegisteredPage);
