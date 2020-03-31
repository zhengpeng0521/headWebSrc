import React from 'react';
import {  } from 'antd';
import styles from './DomainNameSettingSecond.less';

/*域名设置 第二步 等待审核*/
function DomainNameSettingSecond({
    hostName,                           //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示)
}) {

    return(
        <div className={styles.all}>
            <div className={styles.domain_name}>
                <span style = {{ color : '#5d9cec' }}>登录域名：</span>{ hostName + '.saas.ishanshan.com' }
            </div>
            <div className={styles.domain_alert}>
                该域名正在审核中，请耐心等待；或者拨打400-660-5733加速审核
            </div>
        </div>
    );
}

export default DomainNameSettingSecond;
