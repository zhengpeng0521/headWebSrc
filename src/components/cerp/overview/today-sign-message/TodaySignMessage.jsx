import React from 'react';
import { Button , Select } from 'antd';
import styles from './TodaySignMessage.less';
const Option = Select.Option;

/*今日签到信息*/
const TodaySignMessage = ({
    todaySignMessage,                       //今日签到信息
}) => {

    let today = {};
    for(let i in todaySignMessage){
        if(todaySignMessage[i] == null){
            todaySignMessage[i] = 0;
        }
        today[i] = parseFloat(todaySignMessage[i])
    }

    return (
        <div className={styles.today_all}>
            <div>今日签到信息</div>
            <div className={styles.block_area}>
                <div className={styles.attend_course}>
                    <div className={styles.attend_course_title}>上课</div>
                    <div className={styles.data}>
                        <div><span>预约</span><span>{ today.skTotal || 0 }</span></div>
                        <div><span>已签</span><span>{ (today.skrs + today.qjrs + today.kkrs) || 0 }</span></div>
                        <div><span>上课</span><span>{ today.skrs || 0 }</span></div>
                        <div><span>请假</span><span>{ today.qjrs || 0 }</span></div>
                        <div><span>旷课</span><span>{ today.kkrs || 0 }</span></div>
                    </div>
                </div>
                <div className={styles.make_up}>
                    <div className={styles.make_up_title}>补课</div>
                    <div className={styles.data}>
                        <div><span>预约</span><span>{ today.bkTotal || 0 }</span></div>
                        <div><span>已签</span><span>{ (today.bkrs + today.bkqj + today.bkkk) || 0 }</span></div>
                        <div><span>补课</span><span>{ today.bkrs || 0 }</span></div>
                        <div><span>请假</span><span>{ today.bkqj || 0 }</span></div>
                        <div><span>旷课</span><span>{ today.bkkk || 0 }</span></div>
                    </div>
                </div>
                <div className={styles.audition}>
                    <div className={styles.audition_title}>试听</div>
                    <div className={styles.data}>
                        <div><span>预约</span><span>{ today.stTotal || 0 }</span></div>
                        <div><span>已签</span><span>{ (today.strs + today.stkk) || 0 }</span></div>
                        <div><span>试听</span><span>{ today.strs || 0 }</span></div>
                        <div><span>缺席</span><span>{ today.stkk || 0 }</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodaySignMessage;
