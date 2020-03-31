import React from 'react';
import {  } from 'antd';
import styles from './DomainNameSettingThird.less';

/*域名设置 第三步 审核成功等待支付*/
function DomainNameSettingThird({
    hostName,                           //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示)
}) {

    return(
        <div className={styles.all}>
            <div className={styles.domain_block}>
                <div className={styles.domain_block_before}></div>
                <div className={styles.domain_block_content}>域名设置</div>
            </div>
            <div className={styles.domain_name}>
                <span style = {{ color : '#5d9cec' }}>登录域名：</span>{ hostName + '.saas.ishanshan.com' }
            </div>
            <div className={styles.domain_alert}>
                域名审核通过！工作人员将在24内联系您，完成支付即可使用个性化域名
            </div>
        </div>
    );
}

export default DomainNameSettingThird;
