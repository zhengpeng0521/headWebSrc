import React from 'react';
import { Modal,Popconfirm } from 'antd';
import style from './StudentWxBindModalComponent.less';
import QRCode from 'qrcode.react';

function StudentManageWxcode({
    wxCodeModalVisible,
    closeWxcodeModal,
    url,
	orgName
}){

    return (
        <Modal
            className = "yhwu_wx_modal_content"
            visible = { wxCodeModalVisible }
            title = '微信号绑定'
            footer = { null }
            width = '320px'
            onCancel = { closeWxcodeModal }
        >
			<div style = {{ fontSize : '14px' }}>{ orgName }</div>
            <div className = "wxcode_code" >
                <QRCode value = { url } size = { 220 } />
            </div>
            <div className = "wxcode_footer">
                <p className = "wxcode_footer_item" style = {{ marginTop : '10px', marginBottom : '10px', fontSize : '16px' }} >家长自助绑定流程</p>
                <p className = "wxcode_footer_item" >第一步 : 使用微信扫一扫</p>
                <p className = "wxcode_footer_item" >第二步 : 验证手机号(如果已验证则忽略)</p>
                <p className = "wxcode_footer_item" >第三步 : 关注闪闪微信号完成绑定</p>
            </div>
        </Modal>
    )
}

export default StudentManageWxcode;
