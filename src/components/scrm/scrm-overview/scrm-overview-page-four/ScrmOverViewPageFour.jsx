import React from 'react';
import moment from 'moment';
import QRCode from 'qrcode.react';
import { Button , Icon , Card } from 'antd';
import styles from './ScrmOverViewPageFour.less';

/*营销咨询*/
function ScrmOverViewPageFour ({
    scrmMessage,                //营销咨询数据
    scrmMessageHoverIndex,      //营销咨询鼠标悬浮数据索引
    ScrmMessageMouseMove,       //营销咨询鼠标经过事件
    ScrmMessageMouseOut,        //营销咨询鼠标离开事件
    CheckMoreScrmMessage,       //查看更多营销咨询
    wetherScrmMessageExist,     //营销咨询是否有剩余未加载(true(有剩余)/false(加载完毕))
}) {

    let message = [];
    if(scrmMessage && scrmMessage.length > 0){
        message = scrmMessage.map((item,index) => {
            if(item.isNew == '1'){
                if( scrmMessageHoverIndex == index ){
                    return(
                        <div className={styles.scrmMessage} key={index}>
                            <div className={styles.scrmMessagePoint} style={{backgroundColor:'rgba(93,156,236,0.7)'}}></div>
                            <div
                                className={styles.scrmMessageContent}
                                onMouseMove={() => ScrmMessageMouseMove(index)}
                                onMouseOut={() => ScrmMessageMouseOut(index)}>
                                <a href={item.link} target='_blank' className={styles.scrmMessageLink} >{item.title}</a>
                            </div>
                            <div className={styles.scrmMessageHot}>New</div>
                            <div className={styles.scrmMessageDate}>{item.modifyTime}</div>
                        </div>
                    );
                }else{
                    return(
                        <div className={styles.scrmMessage} key={index}>
                            <div className={styles.scrmMessagePoint} style={{backgroundColor:'#5d9cec'}}></div>
                            <div
                                className={styles.scrmMessageContent}
                                onMouseMove={() => ScrmMessageMouseMove(index)}
                                onMouseOut={() => ScrmMessageMouseOut(index)}>
                                <a href={item.link} target='_blank' className={styles.scrmMessageLink} >{item.title}</a>
                            </div>
                            <div className={styles.scrmMessageHot}>New</div>
                            <div className={styles.scrmMessageDate}>{item.modifyTime}</div>
                        </div>
                    );
                }
            }else{
                if( scrmMessageHoverIndex == index ){
                    return(
                        <div className={styles.scrmMessage} key={index}>
                            <div className={styles.scrmMessagePoint} style={{backgroundColor:'rgba(93,156,236,0.7)'}}></div>
                            <div
                                className={styles.scrmMessageContent}
                                onMouseMove={() => ScrmMessageMouseMove(index)}
                                onMouseOut={() => ScrmMessageMouseOut(index)}>
                                <a href={item.link} target='_blank' className={styles.scrmMessageLink} >{item.title}</a>
                            </div>
                            <div className={styles.scrmMessageDate}>{item.modifyTime}</div>
                        </div>
                    );
                }else{
                    return(
                        <div className={styles.scrmMessage} key={index}>
                            <div className={styles.scrmMessagePoint} style={{backgroundColor:'#5d9cec'}}></div>
                            <div
                                className={styles.scrmMessageContent}
                                onMouseMove={() => ScrmMessageMouseMove(index)}
                                onMouseOut={() => ScrmMessageMouseOut(index)}>
                                <a href={item.link} target='_blank' className={styles.scrmMessageLink} >{item.title}</a>
                            </div>
                            <div className={styles.scrmMessageDate}>{item.modifyTime}</div>
                        </div>
                    );
                }
            }
        });
    }

    return (
        <div className={styles.pageFour}>
            <div className={styles.title}>
                营销资讯
            </div>
            <div style={{height:'20px',backgroundColor:'#e9e9ed',width:'100%'}}></div>
            <div className={styles.modalContent}>
                { message || [] }
                { wetherScrmMessageExist == true ?
                    <div className={styles.checkMoreScrmMessage} onClick={CheckMoreScrmMessage}>
                        加载更多&nbsp;<Icon type="double-right" className={styles.doubleDown}/>
                    </div>
                    :
                    <div className={styles.checkMoreScrmMessage}>
                        加载完毕<Icon type="check-circle-o" className={styles.circleO}/>
                    </div>
                }
            </div>
            <div style={{height:'20px',backgroundColor:'#e9e9ed',width:'100%'}}></div>
        </div>
    );
}

export default ScrmOverViewPageFour;
