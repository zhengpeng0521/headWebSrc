import React from 'react';
import moment from 'moment';
import QRCode from 'qrcode.react';
import { Button , Icon , Card } from 'antd';
import styles from './ScrmOverViewPageThree.less';

function ScrmOverViewPageThree ({
    orgSucCase,                 //机构使用案例数组
    CheckMoreCase,              //查看更多案例
    wetherSucCaseExist,         //机构案例是否有剩余未加载(true(有剩余)/false(加载完毕))
}) {

    let SucMethod = [];
    if(orgSucCase && orgSucCase.length > 0){
        SucMethod = orgSucCase.map((item,index) => {
            return(
                <div
                    key={index}
                    className={styles.sucCase}>
                    <div className={styles.sucCase_intro}>
                        {item.content != null && ((item.content)+'').length > 50 ?
                            ((item.content)+'').substr(0,48)+'...'
                            :
                            item.content+''
                        }
                    </div>
                    <a href={item.link} target='_blank'><img alt="example" width="100%" height='100%' src={item.img} style={{borderRadius:'5px'}}/></a>
                </div>
            );
        })
    }

    return (
        <div className={styles.pageThree}>
            <div className={styles.title}>
                <div className={styles.titleLeft}>
                    <span style={{float:'right',fontSize:'36px',lineHeight:'90px',color:'#5d9cec',fontWeight:'700',fontFamily:'PingFang SC'}}>5000+</span>
                </div>
                <div className={styles.titleRight}>
                    <span style={{float:'left',fontSize:'24px',lineHeight:'90px',color:'#666666'}}>机构正在使用</span>
                </div>
            </div>
            <div className={styles.modalContent}>
                { SucMethod || [] }
            </div>
            { wetherSucCaseExist == true ?
                <div className={styles.checkMoreCase} onClick={CheckMoreCase}>
                    查看更多成功案例&nbsp;<Icon type="double-right" className={styles.doubleDown}/>
                </div>
                :
                <div className={styles.checkMoreCase}>
                    加载完毕<Icon type="check-circle-o" className={styles.circleO}/>
                </div>
            }
        </div>
    );
}

export default ScrmOverViewPageThree;
