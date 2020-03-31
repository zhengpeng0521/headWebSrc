import React from 'react';
import { Upload, Steps, Tabs, Modal, Button } from 'antd';


function CallPhoneModal({
	CallPhoneModalVisible,
	CallPhoneModalSure,
}){

	return (
		<Modal
            title = '拨打中...'
			className = "user_agreement_modal"
            visible = { CallPhoneModalVisible }
            maskClosable = { false }
            closable = { false }
            width = '550px'
            footer = {[
				<Button type = "primary" key="submit" onClick = { CallPhoneModalSure } style={{backgroundColor:'red'}}>
					挂断
				</Button>
			]}
		>

			<div style={{height:'200px',padding:'70px 25px 0 25px',lineHeight:'30px',fontSize:'14px',textAlign:'center'}}>
                <p>通话中...</p>
                <p style={{color:'red'}}>*通话期间请勿刷新或关闭页面,通话结束后请点击下方按钮挂断</p>
			</div>
		</Modal>
    )
}

export default CallPhoneModal;
