import React from 'react';
import moment from 'moment';
import { Carousel } from 'antd';
import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import styles from './ScrmOverviewBanner.less';

function ScrmOverviewBanner ({
    bannerImg,          //banner图数组
}) {

    let img = [];
    if(bannerImg && bannerImg.length > 0){
        img = bannerImg.map((item,index) => {
            if(item.link && item.link != '' && item.link != undefined && item.link != null){
                return(
                    <div key={item.id} style={{width:'100%',height:'7.9vw'}}>
                        <a href={item.link} target='_blank'><img className={styles.bannerImg} src={item.image}/></a>
                    </div>
                );
            }else{
                return(
                    <div style={{width:'100%',height:'7.9vw'}}>
                        <img className={styles.bannerImg} src={item.image}/>
                    </div>
                );
            }
        })
    }

    return (
        <div className='zj_scrm_overview_banner'>
            <div style={{width:'100%',height:'7.9vw'}}
                className={ img != null && img != undefined && img != '' && img.length >= 0 ?
                styles.Scrm_OverView_Banner
                :
                null
                }
                >
                { img != null && img != undefined && img != '' && img.length >= 0 ?
                    (<Carousel easing='ease-out' autoplay autoplaySpeed={5000}>
                        { img || null }
                    </Carousel>)
                    :
                    null
                }
            </div>
        </div>
    );
}

export default ScrmOverviewBanner;
