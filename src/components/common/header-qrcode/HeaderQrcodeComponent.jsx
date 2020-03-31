import React from 'react';
import styles from './HeaderQrcodeComponent.less';
import {Popover} from 'antd';

function HeaderQrcodeComponent ({qrcodeSrc}) {

    let content = (
        <div className={styles.qrcode_content}>
           <img src={qrcodeSrc} width="100%" height="100%"/>
       </div>
    );
    return (
        <Popover content={content} title={null} trigger="hover" overlayClassName="common_header_qrcode_popover">
            <div className={styles.header_qrcode_cont} >
                帮助
            </div>
        </Popover>

    );
}

export default HeaderQrcodeComponent;
