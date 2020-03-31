import React from 'react';
import { Modal, Input, Button, message } from 'antd';
import styles from './WxActivityQrModal.less'
import QRCode from 'qrcode.react';

function WxActivityQrModal({

    attrQrCodeShow,
    attrQrUrl,
    funcCloseModal,

}) {

    //拷贝链接
    function copyLink() {
        var copyobject = document.getElementById("copy-content");
        copyobject.select();
        document.execCommand("Copy");
        message.success('复制成功');
    }

    //关闭modal
    function closeModal() {
        funcCloseModal && funcCloseModal();
    }
 
    return (
        <Modal
            visible={attrQrCodeShow}
            maskClosable={true}
            width='330px'
            onCancel={closeModal}
            footer={null}
        >
            <QRCode value={attrQrUrl || ''} size={300} />
            <p style={{ marginBottom: '10px' }} className={styles.qr_p}>请用微信扫一扫</p>
            <Input style={{ width: '72%' }} type='text' id='copy-content' value={attrQrUrl} />
            <Button type='primary' style={{ width: '26%', marginLeft: '2%' }} id="copyLink" onClick={copyLink}>复制</Button>
        </Modal>
    )
}

export default WxActivityQrModal;
