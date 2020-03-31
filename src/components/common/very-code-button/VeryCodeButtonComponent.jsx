import React from 'react';
import styles from './VeryCodeButtonComponent.less';
import {Button} from 'antd';

function VeryCodeButtonComponent ({waitTime, onClick, className, style, btnType, }) {
    return (
       <div className={className || styles.very_code_button_cont} style={style || {} }>
           <Button type={btnType || "ghost"} loading={waitTime > 0}  disabled={waitTime > 0} className={styles.verify_code_btn} onClick={()=>onClick()}>{waitTime == 0 ? '发送验证码' : waitTime + '秒后重发'}</Button>
       </div>
    );
}

export default VeryCodeButtonComponent;
