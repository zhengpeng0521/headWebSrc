import React from 'react';
import styles from './KoubeiAuthValidatePageComponent.less';
import {Card} from 'antd';
import QRCode from 'qrcode.react';

function KoubeiAuthValidatePageComponent ({
    authStatus,alipayAuthUrl,
}) {

    return (
        <div className={styles.koubei_auth_validate_cont} >
            <div className={styles.modal_content}>
                <div className={styles.qrcode_content}>
                    <QRCode key="koubei_goods_share_qrcode"
                         className={styles.koubei_goods_share_qrcode}
                          value={alipayAuthUrl}
                          size={250}
                          level="M"
                      />
                </div>

                <div className={styles.href_content}>
                    <a href={alipayAuthUrl} target="_blank">订阅口碑插件</a>
                </div>
                <div className={styles.qrcode_image_desc}>
                {authStatus == '' || authStatus == 'UNBUY' ? '请用支付宝扫描上方二维码或者点击链接订阅口碑插件'
                    : qrcodeType == 'AUTHED' ? '授权信息失效或者未签约,请用支付宝扫描上方二维码或者点击链接完成授权'
                    : ''
                }
                </div>
            </div>
        </div>
    );
}


export default KoubeiAuthValidatePageComponent;
