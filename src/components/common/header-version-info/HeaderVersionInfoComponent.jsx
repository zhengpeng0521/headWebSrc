import React from 'react';
import styles from './HeaderVersionInfoComponent.less';

function HeaderVersionInfoComponent () {

    return (
        <div className={styles.header_version_info}>
            <div className={styles.header_version_info_content}>
                <div className={styles.version_label}>
                    版本号
                </div>
                <div className={styles.version_no}>
                    3.0.0
                </div>
            </div>
        </div>
    );
}

export default HeaderVersionInfoComponent;
