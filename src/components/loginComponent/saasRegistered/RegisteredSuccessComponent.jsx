import React from 'react';
import styles from './RegisteredSuccessComponent.less';
import {message} from 'antd';

function RegisteredSuccessComponent ({

	dp,
	showRegisteredSuccress,

}) {

	function move_website() {
		if(returnUrl&&returnUrl.length > 0) {
			window.location.href = returnUrl;
		} else {
			dp('updateState', {showRegisteredSuccress : !showRegisteredSuccress});
		}
	}

	return (
		<div className="saas_registered_success">
			<div className={styles.saas_registered_success_box}>
				<div className={styles.saas_registered_success_header}></div>
				<div className={styles.saas_registered_success_text1}>恭喜您成功入驻闪闪大本营</div>
				<div className={styles.saas_registered_success_text2}>闪闪小二将在24h内与您会师</div>
				<div className={styles.saas_registered_success_text2}>敬请期待</div>
				<div className={styles.saas_registered_success_move_website} onClick={() => move_website()}>知道了</div>

			</div>
		</div>
	)
}

export default RegisteredSuccessComponent;
