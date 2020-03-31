import React from 'react';
import styles from './HeaderOrgInfoComponent.less';

function HeaderOrgInfoComponent ({imgUrl}) {

    return (
        <div className={styles.header_org_info} >
            <div className={styles.header_org_content}>
                <img src = { imgUrl } />
            </div>
        </div>
    );
}

export default HeaderOrgInfoComponent;
