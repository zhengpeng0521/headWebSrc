import React from 'react';
import styles from './ModuleSaved.less';
import {Modal, Button, Input, message} from 'antd';
import QRCode from 'qrcode.react';

function ModuleSaved ({
    visible,
    moduleName, //模板实例名称
    moduleInstUrl,//模板实例的链接
    onClose, //关闭窗口
    onEditAgain,//再次编辑
}) {

    //复制地址
    function copyLink(){
        var copyobject=document.getElementById("moduleInstUrlInput");
        copyobject.select();
        document.execCommand("Copy");
        message.success('复制成功');
    };

    return (
        <Modal
          title='保存成功'
          visible={visible}
          onCancel={onClose}
          footer={null}
        >
          <div className={styles.module_saved_cont}>
              <div className={styles.success_icon_cont}>
                  <div className={styles.success_icon_div}>
                      <img src='//img.ishanshan.com/gimg/img/3a464f934e2fa8db9d2e10bd601404b8' className={styles.success_icon}/>
                      <div className={styles.success_icon_anim}></div>
                  </div>
              </div>

              <div className={styles.success_text_cont}>
                  【{moduleName}】 活动模板已保存成功
              </div>

              <div className={styles.module_inst_qrcode}>
                  <QRCode value = { moduleInstUrl || '' } size = { 120 } />
                  <div className={styles.qrcode_msg}>
                      微信扫一扫, 预览效果
                  </div>
              </div>

              <div className={styles.module_inst_url}>
                  <Input value={moduleInstUrl} className={styles.module_url_input} id='moduleInstUrlInput'/>
                  <Button type="ghost" className={styles.module_url_btn} onClick={copyLink}>复制</Button>
              </div>

              <div className={styles.module_saved_bars}>
                  <Button type="primary" className={styles.module_saved_bar_btn} onClick={onClose}>关闭</Button>
                  <Button type="primary" className={styles.module_saved_bar_btn} onClick={onEditAgain}>再次编辑</Button>
              </div>
          </div>
        </Modal>
    );
}

export default ModuleSaved;
