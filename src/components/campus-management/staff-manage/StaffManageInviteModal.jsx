import React from 'react';
import { Button , Modal  , Input ,message } from 'antd';
import styles from './StaffManageInviteModal.less'
function StaffManageInviteModal({
  registerUrl, //邀请链接
  isInviteShow, //是否打开邀请弹窗
  cancelInvitionModal, // 关闭弹窗
}){
   /* 复制链接 */
   function copyLink() {
      let copyobject=document.getElementById("registerUrlInput");
      copyobject.select();
      document.execCommand("Copy");
      message.success('复制成功');
  }

	return (
        <Modal
            className = "zj_yhwu_course_manage_modal"
            title = "邀请注册登录"
            visible = { isInviteShow }
            width = '500px'
            onCancel = { cancelInvitionModal }
            maskClosable = { false }
            footer = {[
                <Button key = "cancel" onClick = { cancelInvitionModal } >取消</Button>,
                <Button key = 'confirm' type = 'primary' onClick = { cancelInvitionModal } style = {{ marginLeft : 20 }}>
					确定
				</Button>,
            ]}
        >
          <div className={styles.inviteRegister}>
              <div>将链接发给小伙伴就可以啦</div>
              <Input value={registerUrl} type = 'text' className={styles.register_url} id='registerUrlInput' readOnly/>
              <Button type="primary" className={styles.module_url_btn} onClick={copyLink}>复制链接</Button>
          </div>
        </Modal>
	)
}

export default StaffManageInviteModal;
