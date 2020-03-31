import React from 'react';
import styles from './KoubeiGoodsShareModal.less';
import QRCode from 'qrcode.react';
import {Modal,Select} from 'antd';
import QueueAnim from 'rc-queue-anim';

let Option = Select.Option;

function KoubeiGoodsShareModal ({
    visible,orgList,goodsShareUrl,onCloseClick,selectOrg,changeSelectOrg,
}) {



    return (
        <Modal
            title='口碑商品分享'
            visible={visible}
            maskClosable={false}
            closable={true}
            onCancel={onCloseClick}
            width={435}
            footer={null}
        >

            <div className={styles.koubei_goods_share_cont}>
                <p className={styles.share_text}>分享门店选择(分享出去产生的订单会属于此门店)</p>

                <Select
                    style={{ width: '100%' }}
                    placeholder="请选择一个门店"
                    notFoundContent="没有营业中的门店"
                    value={selectOrg}
                    onChange={changeSelectOrg}
                  >
                    {orgList && orgList.map(function(orgItem, orgIndex) {
                        return (
                            <Option key={'org_select_opt_' + orgIndex} value={orgItem.key}>{orgItem.label}</Option>
                        )
                    })}
                </Select>

                <QueueAnim
                    type={['bottom', 'bottom']} >
                    {(goodsShareUrl && goodsShareUrl != '' ) ?
                    <div className={styles.share_qrcode_cont}>
                        <QRCode key="koubei_goods_share_qrcode"
                              value={goodsShareUrl}
                              size={300}
                              level="M"
                              className={styles.koubei_goods_share_qrcode}
                          />
                    </div>
                    : null
                    }
                </QueueAnim>

            </div>

        </Modal>
    );
}

export default KoubeiGoodsShareModal;
