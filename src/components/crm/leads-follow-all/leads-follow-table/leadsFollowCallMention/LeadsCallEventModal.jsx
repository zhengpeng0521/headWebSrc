import React from 'react';
import { Upload, Steps, Tabs, Modal, Button } from 'antd';
import styles from './LeadsCallEventModal.less';

function LeadsCallEventModal({
	leadsCallEventVisible,
	leadsCallEventAgree,
    leadsCallEventFalseType,
}){
    let modalOpts = {
        title: '呼叫异常',
        maskClosable : false,
        visible : leadsCallEventVisible,
        closable : true,
        width : 350,
        onOk: leadsCallEventAgree,
        onCancel : leadsCallEventAgree,
        footer : [
            <Button key="submit" type="primary" size="default"
                    onClick = { leadsCallEventAgree }>我知道了</Button>
        ],
        className : 'leads_call_event_modal'
    };
	return (
		<Modal {...modalOpts} style={{zIndex:'2000000000'}}>
            {
                leadsCallEventFalseType =='0'?
                    <div style={{height:'200px',padding:'70px 20px 0 20px',lineHeight:'30px',fontSize:'14px'}}>
                        未开通外呼服务，请联系管理员开通~
                    </div>
                :leadsCallEventFalseType =='1'?
                    <div style={{height:'200px',padding:'70px 20px 0 20px',lineHeight:'30px',fontSize:'14px'}}>
                        您的账号未开通坐席，请联系管理员开通~
                    </div>
                :leadsCallEventFalseType =='2'?
                    <div style={{height:'200px',padding:'70px 20px 0 20px',lineHeight:'30px',fontSize:'14px'}}>
                        您的账号可用剩余时长不足，请联系管理员~
                    </div>
                :leadsCallEventFalseType =='3'?
                    <div style={{height:'200px',padding:'70px 20px 0 20px',lineHeight:'30px',fontSize:'14px'}}>
                        您的坐席已过期，请联系管理员续费~
                    </div>
                : null
            }

			<div>

			</div>
		</Modal>
    )
}

export default LeadsCallEventModal;
