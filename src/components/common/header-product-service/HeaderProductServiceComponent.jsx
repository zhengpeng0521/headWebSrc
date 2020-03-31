import React from 'react';
import styles from './HeaderProductServiceComponent.less';
import {Modal} from 'antd';

function HeaderProductServiceComponent ({modalVisible, changeModalVisible,}) {

    return (
        <div className={styles.header_product_service} >
            产品与服务
        </div>
    );
}

export default HeaderProductServiceComponent;
