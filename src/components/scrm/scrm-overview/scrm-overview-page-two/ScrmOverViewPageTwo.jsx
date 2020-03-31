import React from 'react';
import moment from 'moment';
import QRCode from 'qrcode.react';
import { Button , Icon , Card } from 'antd';
import styles from './ScrmOverViewPageTwo.less';

function ScrmOverViewPageTwo ({
    hotMethod,              //热门招生方案数组
    windowWidth,            //当前浏览器宽度
    windowWidthLevel,       //浏览器宽度等级(Lv1 1500+ / Lv2 1058+ / Lv3 666+ / Lv4 0+)
    GetFreeTrailMethod,     //免费申请试用招生方案
    WindowOnReSize,         //浏览器宽度改变事件
}) {

    let card = [];
    if(hotMethod && hotMethod.length > 0){
        card = hotMethod.map((item,index) => {
            return(
                <Card
                    className={styles.modalCard}
                    style={
                        windowWidthLevel == 'Lv1' ? { marginLeft : (windowWidth-1200) / 5 } :
                        windowWidthLevel == 'Lv2' ? { marginLeft : (windowWidth-900) / 4 } :
                        windowWidthLevel == 'Lv3' ? { marginLeft : (windowWidth-600) / 3 } :
                        windowWidthLevel == 'Lv4' ? { marginLeft : (windowWidth-300) / 2 } : undefined
                    }
                    bodyStyle={{padding:'0'}}
                    key={index}>
                    <div className={styles.card_img}>
                        <img alt="example" width="100%" height='300px' src={item.img} style = {{ borderRadius : '10px 10px 0 0' }}/>
                    </div>
                    <div className={styles.code}>
                        <div className={styles.card_mask}></div>
                        <div className={styles.code_outside}></div>
                        <div className={styles.code_inside}>
                            { item.previewUrl == '' || item.previewUrl == null || item.previewUrl == undefined ?
                                <p style={{height:'200px',width:'200px',lineHeight:'200px',textAlign:'center',fontSize:'16px'}}>无二维码</p>
                                :
                                <QRCode value={item.previewUrl} size={200}/>
                            }
                            <p style={{fontSize:'12px',textAlign:'center',fontWeight:'700'}}>微信扫码预览</p>
                        </div>
                    </div>
                    <div className={styles.card_intro}>
                        <p className={styles.card_intro_title}>{item.title}</p>
                        <p className={styles.card_intro_detail}>
                            {item.intro != null && ((item.intro)+'').length > 35 ?
                                ((item.intro)+'').substr(0,33)+'...'
                                :
                                item.intro+''
                            }
                        </p>
                    </div>
                </Card>
            );
        })
    }

    /*浏览器宽度实时改变事件*/
    window.onresize = function(){
        if(document.getElementById("zj_scrm_overview_pagetwo_modalcontent") != null){
            WindowOnReSize(document.getElementById("zj_scrm_overview").offsetWidth);
        }
    }

    return (
        <div className={styles.pageTwo}>
            <div className={styles.title}>
                热门招生方案
            </div>
            <div className={styles.modalContent} id='zj_scrm_overview_pagetwo_modalcontent'>
                { card || [] }
            </div>
            <div style={{textAlign:'center'}}>
                <Button type='primary' style={{height:'70px',width:'360px',borderRadius:'10px',fontSize:'24px',color:'#ffffff'}} onClick={GetFreeTrailMethod}>申请试用招生模板</Button>
            </div>
        </div>
    );
}

export default ScrmOverViewPageTwo;
