/*
 *	软电话
 */
import React from 'react';
import { Input,Icon,Dropdown,Menu,Tag,Modal,} from 'antd';
import FollowUpRecordCreatePage from '../../../pages/scrm/follow-up-record/FollowUpRecordCreatePage';
import styles from './EyebeamComponent.less';

function EyebeamComponent ({
	phoneNumber,phoneState,lineTime,recordVisible,closeRecordModal,
    phoneNumberChange,
    onCallClick,
    eyebeamLogin,
}) {

    function formatTimeLong(time) {
        if(time < 60) {
            return time + ' 秒';
        } else if(time < 3600) {
            let min = parseInt(time / 60);
            let sec = time % 60;
            return min + ' 分 ' + sec + ' 秒';
        } else {
            let hour = parseInt(time / 3600);
            let min = parseInt(time % 3600 / 60);
            let sec = time % 60;
            return hour + ' 时 ' + min + ' 分 ' + sec + ' 秒';
        }
    }

	return (
		<div className={styles.eyebeam_cont}>
           <div className={styles.eyebeam_state_cont}>
                {!!(phoneState == 'ready') && <Tag key='phone_state_ready' color="#87d068">就绪</Tag>}
                {!!(phoneState == 'calling') && <Tag key='phone_state_calling' color="#2db7f5">正在拨号</Tag>}
                {!!(phoneState == 'talking') && <Tag key='phone_state_talking' color="#2db7f5">通话中</Tag>}
                {!!(phoneState == 'finish') && <Tag key='phone_state_finish' color="#F50">结束通话</Tag>}
                {!!(phoneState == 'unline') && <Tag key='phone_state_unline' onClick={()=>eyebeamLogin()} >未连线, 点击连线</Tag>}
           </div>
           <div className={styles.eyebeam_number_cont}>
               <Input placeholder="请输入要打的电话" value={phoneNumber} onChange={phoneNumberChange} />
           </div>
		    <div className={styles.eyebeam_phone_cont}>
		        <Icon type="phone" className={styles.eyebeam_phone} onClick={onCallClick}/>
		        <div className={styles.line_time_cont}>
		            {formatTimeLong(lineTime)}
		        </div>
		    </div>

            <FollowUpRecordCreatePage />
		</div>
	)
}

export default EyebeamComponent;
