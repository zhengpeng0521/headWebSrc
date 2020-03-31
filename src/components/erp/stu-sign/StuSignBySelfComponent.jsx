import React from 'react';
import QueueAnim from 'rc-queue-anim';
import QRCode from 'qrcode.react';
import styles from './StuSignBySelfComponent.less';
import {Modal, Form, Input, Spin, message, Button, Icon,} from 'antd';

function StuSignBySelfComponent ({
    visible,
    stepFlg,
    qrcode,
    stuSignList,
    qrcodeUrl,
    lodopResourceDownloadUrl,
    showSwitch,
    signByQrcode,
    onCloseClick,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    let unInstallProps = {
        visible: visible && !stepFlg,
        onCloseClick,lodopResourceDownloadUrl,
    };

    let signSelfProps = {
        visible: visible && stepFlg,
        qrcode,stuSignList,qrcodeUrl,
        onCloseClick,signByQrcode,
    };
    return (
        <div>
            <div className={styles.sign_self_switch}>
                <div onClick={showSwitch} className={styles.open_sign_self_btn}
                   style={{
                        background: 'url(https://img.ishanshan.com/gimg/img/b24ed856dedb321c8f2d2ed337413114) no-repeat'
                    }}
               >
                    <div className={styles.open_sign_self_btn_text}>
                       <Icon type="scan" className={styles.sign_self_icon}/>
                        <div className={styles.sign_self_text}>扫码签到</div>
                    </div>
                </div>

                <div className={styles.download_cont}>
                    <Button type='primary' className={styles.download_href_btn} onClick={()=>window.open(lodopResourceDownloadUrl)}>下载扫码签到软件</Button>
                </div>
            </div>
            <UnInstallModal {...unInstallProps}/>
            <SignSelfModal {...signSelfProps}/>
        </div>
    );
}

function UnInstallModal ({
    visible,onCloseClick,lodopResourceDownloadUrl,
}) {

    return (
        <Modal
            title="扫码签到软件下载"
            visible={visible}
            maskClosable={false}
            closable={true}
            onCancel={onCloseClick}
            width={550}
            footer={null}>
            <div className={styles.sign_soft_download}>
                <div className={styles.sign_soft_desc_item}>1.请下载<a href={lodopResourceDownloadUrl}>签到软件</a></div>
                <div className={styles.sign_soft_desc_item}>2.安装签到软件</div>
                <div className={styles.sign_soft_desc_item}>3.安装成功后请重新打开签到窗口</div>

                <Button type='primary' size='small' className={styles.close_btn} onClick={onCloseClick}>我知道了</Button>
            </div>
        </Modal>
    );
};

function SignSelfModal ({
    visible,qrcode,stuSignList,qrcodeUrl,onCloseClick,signByQrcode,
}) {

    let titleNode = (
        <div className={styles.sign_self_modal_title}>
            <div className={styles.title_text}>扫码签到功能已开启</div>
            <div className={styles.title_close_btn} onClick={onCloseClick}>
                关闭签到功能<Icon type="poweroff" style={{marginLeft: '8px'}}/>
            </div>
        </div>
    );

    function onQrcodeInputBlur(e,a,b,c) {
        e.target.focus();
    }

    return (
        <Modal
            title={titleNode}
            visible={visible}
            maskClosable={false}
            closable={false}
            onCancel={onCloseClick}
            width={850}
            footer={null}>

            <div className={styles.stu_sign_self_cont}>

               <div className={styles.sign_self_content}>
                   <div className={styles.left_content}>
                       <div className={styles.message_text}>*扫码期间请不要切换到其他网页或软件</div>

                       {!!(stuSignList && stuSignList.length > 0) &&
                       <div className={styles.sign_record_cont}>
                           <div className={styles.sign_record_title_cont}>
                               <div className={styles.record_title_name}>学员姓名</div>
                               <div className={styles.record_title_org}>所在机构</div>
                               <div className={styles.record_title_time}>签到时间</div>
                           </div>

                           <QueueAnim type={[ 'top' , 'bottom' ]} delay={500}>

                           {stuSignList.map(function(recordItem, index) {
                               return (
                                    <div className={styles.sign_record_item_cont} key={'sign_record_item_cont_' + index}>
                                       <div className={styles.record_item_name}>{recordItem.stuName}</div>
                                       <div className={styles.record_item_org}>{recordItem.orgName}</div>
                                       <div className={styles.record_item_time}>{recordItem.signTimeStr}</div>
                                   </div>
                               )
                           })}
                           </QueueAnim>
                       </div>
                       }
                       {!!(stuSignList && stuSignList.length > 0) &&
                       <div className={styles.desc_text}>
                           显示最新5条信息
                       </div>}

                       {!!(stuSignList == undefined || stuSignList.length == 0) &&
                       <div className={styles.no_sign_record_cont}>
                           <img className={styles.no_sign_record_img} src='https://img.ishanshan.com/gimg/img/6ebf9a02f1f172239254d09000cb9d60'/>
                           <div className={styles.no_sign_record_text}>今日没有学员签到</div>
                       </div>
                       }
                   </div>

                   <div className={styles.right_cont}>
                       <div className={styles.title_text_one}>学员查询码</div>
                       <div className={styles.title_text_two}>仅供家长微信使用</div>
                       <div className={styles.qrcode_cont}>
                          <QueueAnim type={[ 'bottom' , 'bottom' ]} delay={500}>
                               <QRCode key="sign_self_qrcode"
                                  value={qrcodeUrl}
                                  size={190}
                                  level="M"
                              />
                           </QueueAnim>
                       </div>
                   </div>
               </div>

               <div className={styles.qrcode_input_cont}>
                  {!!visible &&
                   <Input
                      autoFocus
                      value={qrcode}
                      onChange={signByQrcode}
                      onBlur={onQrcodeInputBlur}
                      placeholder="请扫描二维码进行自主签到"
                    />
                  }
               </div>

            </div>
        </Modal>
    );
};

export default Form.create()(StuSignBySelfComponent);
